// ═══════════════════════════════════════════════════════════════
// SUBSEAT EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

const P        = "#563BE7";
const DARK     = "#0f0f1a";
const DARKCARD = "#1a1040";

/* ── SHARED WRAPPER ─────────────────────────────────────────── */
const wrap = (content, preheader = "") => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>SubSeat</title>
  <!--[if mso]><style>td,th,div,p,a{font-family:Arial,sans-serif!important}</style><![endif]-->
  <style>
    body,html{margin:0;padding:0;background:#f0eeff;-webkit-font-smoothing:antialiased}
    img{border:0;display:block;max-width:100%}
    a{color:#563BE7}
    .wrapper{max-width:600px;margin:0 auto;padding:28px 16px 40px}
    @media(max-width:600px){
      .wrapper{padding:12px 8px 32px!important}
      .body-pad{padding:28px 20px!important}
      .hero-pad{padding:44px 24px 36px!important}
      .grid-2{display:block!important}
      .grid-cell{display:block!important;width:100%!important;margin-bottom:12px!important}
      .hide-mob{display:none!important}
      h1{font-size:28px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f0eeff;">

  <!-- PREHEADER (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f0eeff;">${preheader}</div>

  <div class="wrapper">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr><td>

        <!-- LOGO BAR -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
          <tr>
            <td style="text-align:center;padding:16px 0;">
              <a href="https://subseat.co.uk" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;">
                <span style="display:inline-block;width:36px;height:36px;background:#563BE7;border-radius:9px;text-align:center;line-height:36px;font-size:18px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">S</span>
                <span style="font-size:20px;font-weight:900;color:#563BE7;font-family:Arial,sans-serif;vertical-align:middle;">SubSeat</span>
              </a>
            </td>
          </tr>
        </table>

        <!-- MAIN CARD -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 48px rgba(86,59,231,.18);">
          <tr><td>
            ${content}
          </td></tr>
        </table>

        <!-- FOOTER -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0;">
          <tr>
            <td style="background:#0f0f1a;border-radius:0 0 20px 20px;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 10px;font-family:Arial,sans-serif;">
                <a href="https://subseat.co.uk" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">subseat.co.uk</a>
                <a href="https://subseat.co.uk/privacy" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Privacy</a>
                <a href="https://subseat.co.uk/terms" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Terms</a>
                <a href="https://subseat.co.uk/contact" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Contact</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,.2);font-family:Arial,sans-serif;line-height:1.6;">
                SubSeat Ltd · United Kingdom · SubSeat® is a registered trademark.<br/>
                You received this email because you created a SubSeat account.
              </p>
            </td>
          </tr>
        </table>

      </td></tr>
    </table>
  </div>

</body>
</html>`;

/* ── BUTTON ─────────────────────────────────────────────────── */
const btn = (text, url) => `
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#563BE7,#7c3aed);border-radius:12px;box-shadow:0 6px 20px rgba(86,59,231,.45);">
        <a href="${url}" style="display:inline-block;padding:15px 36px;font-family:Arial,sans-serif;font-weight:700;font-size:15px;color:#ffffff;text-decoration:none;white-space:nowrap;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;

/* ── STEP ROW ────────────────────────────────────────────────── */
const step = (num, title, body) => `
  <tr>
    <td style="padding:0 0 18px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td style="width:44px;vertical-align:top;padding-right:14px;">
            <div style="width:44px;height:44px;border-radius:50%;background:#563BE7;text-align:center;line-height:44px;font-family:Arial,sans-serif;font-weight:900;font-size:16px;color:#ffffff;">${num}</div>
          </td>
          <td style="vertical-align:top;padding-top:4px;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-weight:700;font-size:15px;color:#171717;">${title}</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#777;line-height:1.6;">${body}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

/* ── FEATURE CELL ───────────────────────────────────────────── */
const feat = (icon, title, body) => `
  <td class="grid-cell" style="width:50%;padding:6px;" valign="top">
    <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td style="background:#f8f6ff;border-radius:14px;padding:20px;text-align:center;border:1.5px solid #ede9ff;">
          <p style="margin:0 0 10px;font-size:34px;">${icon}</p>
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-weight:700;font-size:13px;color:#171717;">${title}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#888;line-height:1.55;">${body}</p>
        </td>
      </tr>
    </table>
  </td>`;

/* ══════════════════════════════════════════════════════════════
   BUSINESS WELCOME EMAIL
══════════════════════════════════════════════════════════════ */
export function businessWelcomeEmail({ name, dashboardUrl = "https://subseat.co.uk/dashboard" }) {
  const preheader = `Welcome to SubSeat, ${name}! Set up your business profile and start earning monthly.`;

  const content = `
    <!-- HERO -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="hero-pad" style="background:linear-gradient(135deg,#563BE7 0%,#6d28d9 60%,#4c1d95 100%);padding:52px 40px 44px;text-align:center;position:relative;">

          <!-- BIG EMOJI -->
          <p style="margin:0 0 16px;font-size:56px;line-height:1;">✂️</p>

          <!-- BADGE -->
          <p style="margin:0 0 18px;">
            <span style="display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:100px;padding:5px 18px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,.9);letter-spacing:2px;text-transform:uppercase;">
              SubSeat for Business
            </span>
          </p>

          <!-- HEADLINE -->
          <h1 style="margin:0 0 14px;font-family:Arial,sans-serif;font-weight:900;font-size:34px;color:#ffffff;line-height:1.15;letter-spacing:-1px;">
            Welcome, ${name}! 🎉
          </h1>

          <p style="margin:0;font-family:Arial,sans-serif;font-size:16px;color:rgba(255,255,255,.75);line-height:1.7;max-width:400px;margin:0 auto;">
            You've taken the first step towards predictable monthly income for your business. Let's get you set up.
          </p>

        </td>
      </tr>
    </table>

    <!-- BODY -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="body-pad" style="padding:40px;">

          <!-- GREETING -->
          <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.8;">
            Hi <strong style="color:#171717;">${name}</strong>,<br/><br/>
            Welcome to SubSeat — the UK's subscription booking platform built for barbers, salons and beauty professionals. We're genuinely excited to have you here.
          </p>

          <!-- STEPS -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="background:#f8f6ff;border-radius:16px;padding:24px 28px;margin-bottom:28px;border:1.5px solid #ede9ff;">
            <tr><td style="padding:0 0 18px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-weight:800;font-size:17px;color:#171717;">🚀 Get set up in 3 steps</p>
            </td></tr>
            ${step("1", "Complete your business profile", "Add your shop name, photos, location and a short description. Takes under 5 minutes.")}
            ${step("2", "Create your subscription plans", "Set your monthly price and what's included. We handle billing automatically.")}
            ${step("3", "Share your profile link", "Send your unique SubSeat link to your regulars. They subscribe — you earn monthly.")}
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:32px;">
            <tr>
              <td style="text-align:center;padding:8px 0;">
                ${btn("Set Up My Business →", dashboardUrl)}
                <p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#aaa;">Under 10 minutes to complete</p>
              </td>
            </tr>
          </table>

          <!-- FEATURES GRID -->
          <table class="grid-2" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom:28px;">
            <tr>
              ${feat("💰", "Predictable Income", "Subscribers pay monthly — whether they show up or not.")}
              ${feat("📵", "Fewer No-Shows", "Subscribers have already paid. Last-minute cancellations hurt less.")}
            </tr>
            <tr>
              ${feat("🔔", "Auto Reminders", "WhatsApp and email reminders sent automatically to your subscribers.")}
              ${feat("📊", "Simple Dashboard", "Manage bookings, subscribers and revenue all in one place.")}
            </tr>
          </table>

          <!-- GREEN BADGE -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
            <tr>
              <td style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:18px 20px;">
                <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tr>
                    <td style="width:36px;vertical-align:middle;padding-right:12px;font-size:24px;">✅</td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-weight:700;font-size:14px;color:#166534;">Free to join. Simple 6% platform fee.</p>
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#166534;opacity:.85;line-height:1.5;">We only earn when you earn. No monthly charges, no hidden fees. Ever.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- SIGN OFF -->
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Any questions? Just reply to this email — we're always happy to help.
          </p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Here's to your first subscriber. 🥂<br/>
            <strong style="color:#171717;">The SubSeat Team</strong>
          </p>

        </td>
      </tr>
    </table>`;

  return {
    subject: `Welcome to SubSeat, ${name}! 🎉 Your business profile is waiting`,
    html: wrap(content, preheader),
  };
}

/* ══════════════════════════════════════════════════════════════
   CUSTOMER WELCOME EMAIL
══════════════════════════════════════════════════════════════ */
export function customerWelcomeEmail({ name, discoverUrl = "https://subseat.co.uk/discover" }) {
  const preheader = `Welcome to SubSeat, ${name}! Discover and book the best barbers and beauty professionals near you.`;

  const cats = [
    ["💈", "Barbers"],
    ["💅", "Nail Techs"],
    ["👁️", "Lash Artists"],
    ["✂️", "Hair Salons"],
    ["💆", "Massage"],
    ["🧖", "Skincare"],
  ];

  const content = `
    <!-- HERO -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="hero-pad" style="background:linear-gradient(135deg,#0f0f1a 0%,#1e1040 50%,#0f0f1a 100%);padding:52px 40px 44px;text-align:center;">

          <p style="margin:0 0 16px;font-size:56px;line-height:1;">💈</p>

          <p style="margin:0 0 18px;">
            <span style="display:inline-block;background:rgba(86,59,231,.3);border:1px solid rgba(86,59,231,.5);border-radius:100px;padding:5px 18px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#a78bfa;letter-spacing:2px;text-transform:uppercase;">
              SubSeat
            </span>
          </p>

          <h1 style="margin:0 0 14px;font-family:Arial,sans-serif;font-weight:900;font-size:34px;color:#ffffff;line-height:1.15;letter-spacing:-1px;">
            Your seat is waiting,<br/>${name}! 🙌
          </h1>

          <p style="margin:0 auto;font-family:Arial,sans-serif;font-size:16px;color:rgba(255,255,255,.65);line-height:1.7;max-width:400px;">
            Discover and subscribe to the best barbers, salons and beauty professionals near you — and never lose your spot again.
          </p>

        </td>
      </tr>
    </table>

    <!-- BODY -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="body-pad" style="padding:40px;">

          <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.8;">
            Hi <strong style="color:#171717;">${name}</strong>,<br/><br/>
            Welcome to SubSeat! You can now discover and book trusted beauty and wellness professionals near you — and subscribe to your favourites so your slot is always guaranteed.
          </p>

          <!-- HOW IT WORKS -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="background:#f8f6ff;border-radius:16px;padding:24px 28px;margin-bottom:28px;border:1.5px solid #ede9ff;">
            <tr><td style="padding:0 0 20px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-weight:800;font-size:17px;color:#171717;">✨ How SubSeat works</p>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
                <tr>
                  <td style="width:36px;vertical-align:top;font-size:26px;padding-right:14px;padding-bottom:18px;">🔍</td>
                  <td style="vertical-align:top;padding-bottom:18px;">
                    <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-weight:700;font-size:15px;color:#171717;">Find your professional</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#777;line-height:1.6;">Search barbers, nail techs, lash artists and more by location.</p>
                  </td>
                </tr>
                <tr>
                  <td style="width:36px;vertical-align:top;font-size:26px;padding-right:14px;padding-bottom:18px;">📅</td>
                  <td style="vertical-align:top;padding-bottom:18px;">
                    <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-weight:700;font-size:15px;color:#171717;">Book or subscribe</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#777;line-height:1.6;">One-off booking or a monthly subscription to lock in your favourite slot.</p>
                  </td>
                </tr>
                <tr>
                  <td style="width:36px;vertical-align:top;font-size:26px;padding-right:14px;">🔒</td>
                  <td style="vertical-align:top;">
                    <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-weight:700;font-size:15px;color:#171717;">Never lose your slot</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#777;line-height:1.6;">Priority booking every month. Your seat is always yours as a subscriber.</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:32px;">
            <tr>
              <td style="text-align:center;padding:8px 0;">
                ${btn("Find a Professional →", discoverUrl)}
              </td>
            </tr>
          </table>

          <!-- CATEGORIES -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
            <tr>
              <td>
                <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-weight:700;font-size:15px;color:#171717;">Browse by category</p>
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    ${cats.map(([icon, label]) => `
                      <td style="padding:0 6px 6px 0;">
                        <a href="${discoverUrl}" style="display:inline-block;background:#f4f4f4;border:1.5px solid #eee;border-radius:100px;padding:8px 14px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#171717;text-decoration:none;white-space:nowrap;">
                          ${icon} ${label}
                        </a>
                      </td>
                    `).join("")}
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- TRUST ROW -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
            <tr>
              <td style="background:#f9f9f9;border-radius:14px;padding:20px;border:1.5px solid #eee;text-align:center;">
                <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
                  <tr>
                    ${[["🛡️","Secure payments"],["⭐","Verified reviews"],["🔔","Auto reminders"],["❌","No hidden fees"]].map(([icon, label]) => `
                      <td style="text-align:center;padding:0 16px;">
                        <p style="margin:0 0 6px;font-size:26px;">${icon}</p>
                        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#171717;white-space:nowrap;">${label}</p>
                      </td>
                    `).join("")}
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- SIGN OFF -->
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Any questions? Just reply to this email — we'd love to hear from you.
          </p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Enjoy SubSeat! 💜<br/>
            <strong style="color:#171717;">The SubSeat Team</strong>
          </p>

        </td>
      </tr>
    </table>`;

  return {
    subject: `Welcome to SubSeat, ${name}! 👋 Your seat is waiting`,
    html: wrap(content, preheader),
  };
}