import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { leadSchema } from "@/lib/lead-schema";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * In-memory rate limit. Adequate for a single-region marketing site and it
 * fails closed to "allow" only within one instance's window, never across the
 * database. Swap for a durable store if the site is ever fronted by many
 * instances and abuse becomes real.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = Number(process.env.LEAD_RATE_LIMIT ?? 8);
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions in a short time. Please try again in a minute." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json(
      { error: "Please check the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // Honeypot filled, or submitted faster than a human could type it. Answer 200
  // so a bot learns nothing, and store nothing.
  const elapsed = Date.now() - lead.started_at;
  if (lead.website || elapsed < 2_500) {
    return NextResponse.json({ ok: true });
  }

  const row = {
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    email: lead.email,
    city: lead.city || null,
    industry: lead.industry || null,
    line_count: lead.line_count || null,
    machine_types: lead.machine_types || null,
    message: lead.message || null,
    source_page: lead.source_page,
    utm_source: lead.utm_source || null,
    utm_medium: lead.utm_medium || null,
    utm_campaign: lead.utm_campaign || null,
    referrer: lead.referrer || null,
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    try {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const { error } = await supabase.from("trace_leads").insert(row);
      if (error) {
        console.error("lead insert failed", error.message);
        return NextResponse.json(
          { error: "Could not store that. Please call or WhatsApp us instead." },
          { status: 502 },
        );
      }
    } catch (err) {
      console.error("supabase unreachable", err);
      return NextResponse.json(
        { error: "Could not store that. Please call or WhatsApp us instead." },
        { status: 502 },
      );
    }
  } else {
    // No Supabase configured. Log rather than fail, so a missing env var can
    // never silently lose a lead in a preview deployment.
    console.info("lead received (no store configured)", JSON.stringify(row));
  }

  await notify(row);

  return NextResponse.json({ ok: true });
}

/** Email notification via Resend. Never fails the request — see DECISIONS D-006. */
async function notify(row: Record<string, string | null>): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!apiKey || !from) return;

  const lines = Object.entries(row)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [site.email],
        subject: `Trace lead — ${row.company ?? "unknown company"}`,
        text: lines,
      }),
    });
  } catch (err) {
    console.error("lead notification failed", err);
  }
}
