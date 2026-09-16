import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Session =
  | { state: "anonymous" }
  | { state: "denied"; email: string }
  | { state: "admin"; userId: string; email: string };

/**
 * The Data Access Layer check.
 *
 * Next's own guidance is that Proxy is for optimistic redirects only — it runs
 * on prefetches and must not be the thing standing between a visitor and the
 * data. So every protected read calls this instead, as close to the data as it
 * can be. `cache` memoises it for the render pass, so a page and its children
 * verify once rather than once each.
 *
 * getUser() is used rather than getSession(): getSession only decodes the
 * cookie, which the browser owns and can forge. getUser revalidates it against
 * Supabase.
 */
export const verifySession = cache(async (): Promise<Session> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { state: "anonymous" };

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return { state: "anonymous" };

  // Authenticated is not authorised. The admins table is the allow-list, and
  // its own policy means this returns a row only for the caller themselves.
  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  // "denied" rather than "anonymous" on purpose. Collapsing the two sent a
  // signed-in non-admin into a redirect loop: the page bounced them to the
  // login form, and the proxy bounced them straight back for having a session.
  if (!admin) return { state: "denied", email: data.user.email };

  return { state: "admin", userId: data.user.id, email: data.user.email };
});
