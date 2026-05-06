import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const data = await req.json();
    const fmt  = n => `£${Number(n).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

    // NOTIFY ADMIN OF NEW LISTING
    await resend.emails.send({
      from:    "SubSeat Marketplace <hello@subseat.co.uk>",
      to:      ["admin@subseat.co.uk"],
      subject: `New listing to approve — ${data.title}`,
      html: `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
          <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:24px 32px">
            <h1 style="color:#fff;font-size:18px;font-weight:800;margin:0">New Marketplace Listing</h1>
            <p style="color:rgba(255,255,255,.7);font-size:13px;margin:4px 0 0">Pending approval</p>
          </div>
          <div style="padding:24px 32px">
            <table style="width:100%;border-collapse:collapse">
              ${[
                ["Title",       data.title],
                ["Price",       fmt(data.price)],
                ["Category",    data.category],
                ["Condition",   data.condition],
                ["Delivery",    data.delivery_option],
                ["Location",    data.postcode],
                ["Seller",      data.seller_business_name||"—"],
                ["Email",       data.seller_email],
                ["Phone",       data.seller_phone],
                ["Photos",      `${data.photos?.length||0} uploaded`],
              ].map(([l,v])=>`
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#888;font-weight:600;width:120px;border-bottom:1px solid #f9f9f9">${l}</td>
                  <td style="padding:8px 0;font-size:14px;color:#171717;font-weight:700;border-bottom:1px solid #f9f9f9">${v}</td>
                </tr>
              `).join("")}
            </table>
            <div style="margin-top:20px;background:#f4f0ff;border-radius:12px;padding:16px;text-align:center">
              <p style="font-size:14px;font-weight:700;color:#563BE7;margin:0 0 8px">Approve this listing in the Super Admin</p>
              <a href="https://subseat.co.uk/admin" style="display:inline-block;background:#563BE7;color:#fff;text-decoration:none;padding:10px 24px;border-radius:10px;font-weight:700;font-size:13px">Open Admin Panel</a>
            </div>
          </div>
        </div>
        </body></html>
      `,
    });

    // CONFIRMATION TO SELLER
    await resend.emails.send({
      from:    "SubSeat Marketplace <hello@subseat.co.uk>",
      to:      [data.seller_email],
      subject: `Your listing is being reviewed — ${data.title}`,
      html: `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
          <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:28px 32px;text-align:center">
            <div style="font-size:40px;margin-bottom:8px">📋</div>
            <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0">Listing Submitted!</h1>
          </div>
          <div style="padding:28px 32px">
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 16px">
              Thanks for submitting your listing to SubSeat Marketplace. Our team will review it and approve it within 24 hours.
            </p>
            <div style="background:#f4f0ff;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <div style="font-weight:800;font-size:16px;color:#171717;margin-bottom:4px">${data.title}</div>
              <div style="font-size:24px;font-weight:900;color:#563BE7">${fmt(data.price)}</div>
              <div style="font-size:13px;color:#888;margin-top:4px">${data.condition} · ${data.category}</div>
            </div>
            <p style="font-size:13px;color:#888;line-height:1.6">
              You'll receive another email once your listing is live. If we need any changes we'll be in touch.
            </p>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat Marketplace · <a href="https://subseat.co.uk/marketplace" style="color:#563BE7">subseat.co.uk/marketplace</a></p>
          </div>
        </div>
        </body></html>
      `,
    });

    return Response.json({ success: true });
  } catch(err) {
    console.error("Marketplace listing error:", err);
    return Response.json({ error:"Failed" },{ status:500 });
  }
}