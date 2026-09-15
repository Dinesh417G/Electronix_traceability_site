import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Where the emailed reset link lands.
 *
 * Supabase sends one of two shapes depending on the project's flow, so both
 * are handled rather than guessing: a PKCE `code` to exchange, or a
 * `token_hash` plus `type` to verify. Either way the result is a session in a
 * cookie, which is what lets /admin/reset-password call updateUser.
 *
 * Redirects resolve against the host that was actually clicked, so a link
 * opened on a preview deployment stays there.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/admin/login?reset=unavailable", origin));
  }

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL("/admin/login?reset=expired", origin));
    return NextResponse.redirect(new URL("/admin/reset-password", origin));
  }

  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    if (error) return NextResponse.redirect(new URL("/admin/login?reset=expired", origin));
    return NextResponse.redirect(new URL("/admin/reset-password", origin));
  }

  return NextResponse.redirect(new URL("/admin/login?reset=expired", origin));
}
