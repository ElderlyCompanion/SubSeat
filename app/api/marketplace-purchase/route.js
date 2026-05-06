import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { listing, buyer, fee, sellerGets } = await req.json();
    const fmt = n => `£${Number(n).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

    // EMAIL TO BUYER
    await resend.emails.send({
      from:    "SubSeat Marketplace <hello@subseat.co.uk>",
      to:      [buyer.email],
      subject: `Purchase confirmed — ${listing.title}`,
      html: `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
          <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:28px 32px;text-align:center">
            <div style="font-size:40px;margin-bottom:8px">✅</div>
            <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0">Purchase Confirmed!</h1>
          </div>
          <div style="padding:28px 32px">
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">Hi <strong>${buyer.name}</strong>,</p>
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Thanks for your purchase. The seller has been notified and will contact you to arrange collection or delivery.
            </p>
            <div style="background:#f4f0ff;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <div style="font-weight:800;font-size:17px;color:#171717;margin-bottom:8px">${listing.title}</div>
              <div style="font-size:22px;font-weight:900;color:#563BE7;margin-bottom:8px">${fmt(listing.price)}</div>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Seller</td><td style="font-size:13px;font-weight:700;color:#171717">${listing.seller_business_name||"SubSeat Seller"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Seller phone</td><td style="font-size:13px;font-weight:700;color:#171717">${listing.seller_phone}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Seller email</td><td style="font-size:13px;font-weight:700;color:#171717">${listing.seller_email}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Delivery</td><td style="font-size:13px;font-weight:700;color:#171717">${listing.delivery_option}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Location</td><td style="font-size:13px;font-weight:700;color:#171717">${listing.postcode}</td></tr>
              </table>
            </div>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 16px;font-size:12px;color:#92400e;line-height:1.6">
              SubSeat connects buyers and sellers. Delivery, collection, condition and handover are agreed directly between buyer and seller.
            </div>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat Marketplace · <a href="https://subseat.co.uk/marketplace" style="color:#563BE7">subseat.co.uk/marketplace</a></p>
          </div>
        </div>
        </body></html>
      `,
    });

    // EMAIL TO SELLER
    await resend.emails.send({
      from:    "SubSeat Marketplace <hello@subseat.co.uk>",
      to:      [listing.seller_email],
      subject: `Your item has sold — ${listing.title}`,
      html: `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
          <div style="background:linear-gradient(135deg,#22c55e,#16a34a);padding:28px 32px;text-align:center">
            <div style="font-size:40px;margin-bottom:8px">💰</div>
            <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0">Your item sold!</h1>
          </div>
          <div style="padding:28px 32px">
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Congratulations! Your listing <strong>${listing.title}</strong> has sold on SubSeat Marketplace.
            </p>
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Please contact the buyer to arrange collection or delivery.
            </p>
            <div style="background:#f0fdf4;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <div style="font-weight:800;font-size:16px;color:#171717;margin-bottom:12px">Buyer Details</div>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Name</td><td style="font-size:13px;font-weight:700;color:#171717">${buyer.name}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Email</td><td style="font-size:13px;font-weight:700;color:#171717">${buyer.email}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:4px 0">Phone</td><td style="font-size:13px;font-weight:700;color:#171717">${buyer.phone}</td></tr>
              </table>
            </div>
            <div style="background:#f4f0ff;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <div style="font-size:13px;color:#888;margin-bottom:4px">Sale amount</div>
              <div style="font-size:28px;font-weight:900;color:#563BE7">${fmt(listing.price)}</div>
              <div style="font-size:13px;color:#888;margin-top:6px">SubSeat fee (1%): ${fmt(fee)}</div>
              <div style="font-size:16px;font-weight:800;color:#171717;margin-top:4px">You receive: ${fmt(sellerGets)}</div>
            </div>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 16px;font-size:12px;color:#92400e;line-height:1.6">
              SubSeat connects buyers and sellers. Delivery, collection, condition and handover are agreed directly between buyer and seller.
            </div>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat Marketplace · <a href="https://subseat.co.uk/marketplace" style="color:#563BE7">subseat.co.uk/marketplace</a></p>
          </div>
        </div>
        </body></html>
      `,
    });

    // NOTIFY ADMIN
    await resend.emails.send({
      from:    "SubSeat Marketplace <hello@subseat.co.uk>",
      to:      ["admin@subseat.co.uk"],
      subject: `Marketplace sale — ${listing.title} · ${fmt(listing.price)}`,
      html: `<p>New marketplace sale: <strong>${listing.title}</strong> sold for <strong>${fmt(listing.price)}</strong>. SubSeat fee: ${fmt(fee)}. Seller: ${listing.seller_email}. Buyer: ${buyer.email}.</p>`,
    });

    return Response.json({ success: true });
  } catch(err) {
    console.error("Marketplace purchase error:", err);
    return Response.json({ error:"Failed" },{ status:500 });
  }
}