import { createClient } from "@supabase/supabase-js";

// Uses service role to bypass RLS — admin only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_EMAIL = "mrnicholson@hotmail.com";

export async function POST(req) {
  try {
    const { action, businessId, data, adminEmail } = await req.json();

    // Verify admin
    if (adminEmail !== ADMIN_EMAIL) {
      return Response.json({ error: "Unauthorised" }, { status: 403 });
    }

    let result;

    switch(action) {

      case "soft_remove":
        result = await supabase
          .from("businesses")
          .update({ is_active: false, slug: `removed-${businessId.slice(0,8)}` })
          .eq("id", businessId);
        break;

      case "restore":
        result = await supabase
          .from("businesses")
          .update({ is_active: true, slug: data.slug })
          .eq("id", businessId);
        break;

      case "toggle_active":
        result = await supabase
          .from("businesses")
          .update({ is_active: data.is_active })
          .eq("id", businessId);
        break;

      case "toggle_verified":
        result = await supabase
          .from("businesses")
          .update({ is_verified: data.is_verified })
          .eq("id", businessId);
        break;

      case "set_tier":
        result = await supabase
          .from("businesses")
          .update({ tier: data.tier })
          .eq("id", businessId);
        break;

      default:
        return Response.json({ error: "Unknown action" }, { status: 400 });
    }

    if (result.error) throw result.error;
    return Response.json({ success: true });

  } catch(err) {
    console.error("Admin action error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}