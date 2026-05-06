import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      full_name, business_name, email, phone,
      business_type, monthly_revenue, time_trading,
      amount, term, apr, monthly, total,
      adminEmail, partnerEmail,
    } = data;

    const fmt  = n => `£${Math.round(n).toLocaleString("en-GB")}`;
    const fmtD = n => `£${Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`;

    const applicationHTML = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
          <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:28px 32px;text-align:center">
            <div style="font-size:28px;margin-bottom:8px">💰</div>
            <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0">New Finance Application</h1>
            <p style="color:rgba(255,255,255,.75);font-size:13px;margin:6px 0 0">SubSeat Finance</p>
          </div>
          <div style="padding:28px 32px">
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <tr><td colspan="2" style="padding:8px 0;font-size:12px;font-weight:700;color:#aaa;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #f0f0f0">APPLICANT</td></tr>
              ${[
                ["Full Name",        full_name],
                ["Business Name",    business_name],
                ["Email",            email],
                ["Phone",            phone],
                ["Business Type",    business_type || "—"],
                ["Monthly Revenue",  monthly_revenue || "—"],
                ["Time Trading",     time_trading || "—"],
              ].map(([label, val]) => `
                <tr>
                  <td style="padding:10px 0;font-size:13px;color:#888;font-weight:600;width:140px;border-bottom:1px solid #f9f9f9">${label}</td>
                  <td style="padding:10px 0;font-size:14px;color:#171717;font-weight:700;border-bottom:1px solid #f9f9f9">${val}</td>
                </tr>
              `).join("")}
            </table>
            <table style="width:100%;border-collapse:collapse;background:#f4f0ff;border-radius:12px;overflow:hidden">
              <tr><td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:700;color:#563BE7;letter-spacing:1px;text-transform:uppercase">LOAN DETAILS</td></tr>
              ${[
                ["Amount Requested",   fmt(amount)],
                ["Term",              `${term} months`],
                ["APR",              `${apr}%`],
                ["Est. Monthly",      fmtD(monthly)],
                ["Est. Total",        fmtD(total)],
              ].map(([label, val]) => `
                <tr>
                  <td style="padding:8px 16px;font-size:13px;color:#666;font-weight:600">${label}</td>
                  <td style="padding:8px 16px;font-size:14px;color:#171717;font-weight:800">${val}</td>
                </tr>
              `).join("")}
            </table>
            <div style="margin-top:20px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 16px;font-size:12px;color:#92400e">
              ⚠️ This is an estimate only. Final rates are determined after full review.
            </div>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat Finance · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const confirmHTML = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
          <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:28px 32px;text-align:center">
            <div style="font-size:40px;margin-bottom:10px">✅</div>
            <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0">Application Received!</h1>
          </div>
          <div style="padding:28px 32px">
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Hi <strong>${full_name}</strong>,
            </p>
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Thank you for your finance application through SubSeat. Your request has been received and our finance partner will review your application and contact you with next steps within 48 working hours.
            </p>
            <div style="background:#f4f0ff;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <div style="font-size:12px;color:#888;font-weight:600;margin-bottom:8px">Your application summary</div>
              <div style="font-size:22px;font-weight:900;color:#563BE7">${fmt(amount)} over ${term} months</div>
              <div style="font-size:14px;color:#555;margin-top:4px">Estimated ${fmtD(monthly)} per month · ${fmtD(total)} total</div>
            </div>
            <p style="font-size:13px;color:#888;line-height:1.6;margin:0">
              This is an estimate only. Final rates and approval are subject to review by our finance partner.
            </p>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat Ltd · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin
    await resend.emails.send({
      from:    "SubSeat Finance <hello@subseat.co.uk>",
      to:      [adminEmail],
      subject: `New Finance Application — ${business_name} (${fmt(amount)})`,
      html:    applicationHTML,
    });

    // Send to finance partner (when configured)
    if (partnerEmail && partnerEmail !== "finance@partner.com") {
      await resend.emails.send({
        from:    "SubSeat Finance <hello@subseat.co.uk>",
        to:      [partnerEmail],
        subject: `New Finance Application via SubSeat — ${business_name}`,
        html:    applicationHTML,
      });
    }

    // Send confirmation to applicant
    await resend.emails.send({
      from:    "SubSeat Finance <hello@subseat.co.uk>",
      to:      [email],
      subject: "Your SubSeat finance application has been received",
      html:    confirmHTML,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Finance API error:", err);
    return Response.json({ error: "Failed to send" }, { status: 500 });
  }
}