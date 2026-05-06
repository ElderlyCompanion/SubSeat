import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const {
      full_name, business_name, email, phone,
      business_type, staff_count, postcode,
      covers, renewal_date, estimate,
      adminEmail, partnerEmail,
    } = await req.json();

    const applicationHTML = `
      <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
      <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:28px 32px;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">🛡️</div>
          <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0">New Insurance Quote Request</h1>
          <p style="color:rgba(255,255,255,.7);font-size:13px;margin:6px 0 0">SubSeat Insurance</p>
        </div>
        <div style="padding:28px 32px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            ${[
              ["Full Name",        full_name],
              ["Business Name",    business_name],
              ["Email",            email],
              ["Phone",            phone],
              ["Business Type",    business_type || "—"],
              ["Number of Staff",  staff_count   || "—"],
              ["Postcode",         postcode      || "—"],
              ["Cover Needed",     covers        || "—"],
              ["Renewal Date",     renewal_date  || "Not provided"],
              ["Est. Premium",     estimate ? `From £${estimate.monthly}/month` : "—"],
            ].map(([l,v])=>`
              <tr>
                <td style="padding:9px 0;font-size:13px;color:#888;font-weight:600;width:140px;border-bottom:1px solid #f9f9f9">${l}</td>
                <td style="padding:9px 0;font-size:14px;color:#171717;font-weight:700;border-bottom:1px solid #f9f9f9">${v}</td>
              </tr>
            `).join("")}
          </table>
          <div style="background:#f4f0ff;border-radius:12px;padding:16px;text-align:center">
            <p style="font-size:14px;font-weight:700;color:#563BE7;margin:0 0 8px">Review in Super Admin</p>
            <a href="https://subseat.co.uk/admin" style="display:inline-block;background:#563BE7;color:#fff;text-decoration:none;padding:10px 24px;border-radius:10px;font-weight:700;font-size:13px">Open Admin Panel</a>
          </div>
        </div>
      </div>
      </body></html>
    `;

    const confirmHTML = `
      <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
      <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:28px 32px;text-align:center">
          <div style="font-size:40px;margin-bottom:10px">🛡️</div>
          <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0">Quote Request Received!</h1>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 16px">Hi <strong>${full_name}</strong>,</p>
          <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
            Thanks for your insurance quote request through SubSeat. Our insurance partner will review your details and contact you at <strong>${email}</strong> with a personalised quote within 48 hours.
          </p>
          <div style="background:#f4f0ff;border-radius:14px;padding:20px 24px;margin-bottom:20px">
            <div style="font-size:13px;color:#888;margin-bottom:8px;font-weight:600">Your quote summary</div>
            <div style="font-size:15px;font-weight:700;color:#171717;margin-bottom:4px">${covers}</div>
            ${estimate ? `<div style="font-size:22px;font-weight:900;color:#563BE7;margin-top:6px">From £${estimate.monthly}/month</div><div style="font-size:13px;color:#888;margin-top:4px">Estimate only — final premium confirmed by our partner</div>` : ""}
          </div>
          <p style="font-size:13px;color:#888;line-height:1.6">
            This is an introduction service. SubSeat Ltd is not an insurer. All insurance products are provided by our FCA regulated insurance partner.
          </p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat Insurance · <a href="https://subseat.co.uk/insurance" style="color:#563BE7">subseat.co.uk/insurance</a></p>
        </div>
      </div>
      </body></html>
    `;

    // Send to admin
    await resend.emails.send({
      from:    "SubSeat Insurance <hello@subseat.co.uk>",
      to:      [adminEmail],
      subject: `New Insurance Quote — ${business_name}`,
      html:    applicationHTML,
    });

    // Send to insurance partner when configured
    if (partnerEmail && partnerEmail !== "insurance@partner.com") {
      await resend.emails.send({
        from:    "SubSeat Insurance <hello@subseat.co.uk>",
        to:      [partnerEmail],
        subject: `New Insurance Referral via SubSeat — ${business_name}`,
        html:    applicationHTML,
      });
    }

    // Confirmation to applicant
    await resend.emails.send({
      from:    "SubSeat Insurance <hello@subseat.co.uk>",
      to:      [email],
      subject: "Your SubSeat insurance quote request has been received",
      html:    confirmHTML,
    });

    return Response.json({ success: true });
  } catch(err) {
    console.error("Insurance API error:", err);
    return Response.json({ error:"Failed" },{ status:500 });
  }
}