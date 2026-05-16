import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const formData   = await req.formData();
    const file       = formData.get("file");
    const businessId = formData.get("businessId");
    const caption    = formData.get("caption") || "";

    if (!file || !businessId) {
      return Response.json({ error: "Missing file or businessId" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "Only JPEG, PNG and WebP images are allowed" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "Image must be under 5MB" }, { status: 400 });
    }

    const ext      = file.name.split(".").pop().toLowerCase();
    const filename = `${businessId}/${Date.now()}.${ext}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase storage
    const { data: upload, error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filename, buffer, {
        contentType:  file.type,
        cacheControl: "3600",
        upsert:       false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return Response.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filename);

    // Save to database
    const { data, error } = await supabase
      .from("business_portfolio")
      .insert({
        business_id: businessId,
        image_url:   publicUrl,
        caption,
        is_active:   true,
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, photo: data });
  } catch(err) {
    console.error("Photo upload error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { photoId, imageUrl } = await req.json();

    // Delete from database
    await supabase
      .from("business_portfolio")
      .delete()
      .eq("id", photoId);

    // Extract path from URL and delete from storage
    const path = imageUrl.split("/portfolio/")[1];
    if (path) {
      await supabase.storage.from("portfolio").remove([path]);
    }

    return Response.json({ success: true });
  } catch(err) {
    console.error("Photo delete error:", err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}