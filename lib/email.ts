import { site } from "@/lib/site";

const FROM = process.env.LEAD_NOTIFY_FROM ?? "ElectronIx <no-reply@electronix.co.in>";

/**
 * Sends through Resend, the same provider the ElectronIx DNC site uses.
 *
 * Returns false rather than throwing when the key is absent, so a deployment
 * without it degrades to "stored but not emailed" instead of losing the
 * enquiry outright.
 */
export async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, text }),
    });
    if (!res.ok) {
      console.error("email send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("email send failed", err);
    return false;
  }
}

export function verificationEmail(name: string, link: string): { subject: string; text: string } {
  return {
    subject: "Confirm your email — ElectronIx Trace",
    text: `Hello ${name},

Thank you for asking about ElectronIx Trace. Please confirm this is your address:

${link}

Once you confirm, we will read your enquiry and reply from Coimbatore, usually the same day.

If you did not fill in a form on ${site.url}, you can ignore this message — nothing further will be sent.

ElectronIx, Coimbatore
${site.email} · ${site.phone}`,
  };
}
