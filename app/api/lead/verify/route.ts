import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Confirms the address on an enquiry, then alerts the owner.
 *
 * Writing needs the service role: the anon policy on trace_leads is insert
 * only, deliberately, so a public key cannot flip somebody's row to verified.
 * Without a service role key configured this route reports that confirmation
 * is unavailable rather than pretending it worked.
 */
export async function GET(request: Request) {
  // Redirects resolve against the host that was actually clicked, not the
  // canonical site URL, so a link opened on a preview deployment stays there
  // instead of bouncing the visitor to production.
  const requestUrl = new URL(request.url);
  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, requestUrl.origin), { status: 303 });

  const token = requestUrl.searchParams.get("token");
  if (!token) return redirectTo("/thank-you?confirm=invalid");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return redirectTo("/thank-you?confirm=unavailable");

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: lead, error } = await supabase
    .from("trace_leads")
    .select("id,name,company,email,phone,city,industry,line_count,machine_types,message,email_verified")
    .eq("verify_token_hash", tokenHash)
    .maybeSingle();

  if (error || !lead) return redirectTo("/thank-you?confirm=invalid");
  if (lead.email_verified) return redirectTo("/thank-you?confirm=already");

  // Clearing the hash makes the link single use.
  const { error: updateError } = await supabase
    .from("trace_leads")
    .update({
      email_verified: true,
      verified_at: new Date().toISOString(),
      verify_token_hash: null,
      owner_alerted_at: new Date().toISOString(),
    })
    .eq("id", lead.id);

  if (updateError) return redirectTo("/thank-you?confirm=invalid");

  const lines = Object.entries(lead)
    .filter(([k, v]) => v && k !== "id" && k !== "email_verified")
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");

  await sendEmail(
    site.email,
    `Trace enquiry (confirmed) — ${lead.company ?? "unknown company"}`,
    `This address has been confirmed by the sender.\n\n${lines}`,
  );

  return redirectTo("/thank-you?confirm=ok");
}
