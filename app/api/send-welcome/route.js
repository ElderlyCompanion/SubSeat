import { Resend } from "resend";
import { businessWelcomeEmail, customerWelcomeEmail } from "../../components/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, role, businessName } = await req.json();

    if (!email || !name || !role) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const template = role === "business"
      ? businessWelcomeEmail({ name, businessName: businessName || name })
      : customerWelcomeEmail({ name });

    const { error } = await resend.emails.send({
      from:    "SubSeat <hello@subseat.co.uk>",
      to:      [email],
      subject: template.subject,
      html:    template.html,
    });

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    console.error("Welcome email error:", err);
    return Response.json({ error: "Failed to send" }, { status: 500 });
  }
}