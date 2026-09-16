"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Sign-in is not configured on this deployment." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // One message for a wrong password and for an address that has no account.
  // Telling them apart turns this form into a way to discover who has one.
  if (error) return { error: "That email and password do not match an account." };

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function requestPasswordReset(
  _prev: { sent: boolean; error: string | null },
  formData: FormData,
): Promise<{ sent: boolean; error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { sent: false, error: "Enter your email." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { sent: false, error: "Password reset is not configured on this deployment." };

  // Built from the request's own host, so a reset started on a preview
  // deployment comes back to that deployment rather than to production.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const redirectTo = host ? `${proto}://${host}/admin/auth-callback` : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    redirectTo ? { redirectTo } : {},
  );

  // Supabase rate limits this, and that is worth surfacing because the user
  // would otherwise sit waiting for an email that was never sent.
  if (error && /rate limit|too many/i.test(error.message)) {
    return { sent: false, error: "Too many reset emails just now. Try again in a few minutes." };
  }

  // Every other outcome reports success. Saying "no account with that address"
  // would turn this form into a way to discover who has one.
  return { sent: true, error: null };
}

export async function setNewPassword(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 10) return { error: "Use at least 10 characters." };
  if (password !== confirm) return { error: "Those two passwords do not match." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Password reset is not configured on this deployment." };

  // Works because the recovery link was already exchanged for a session by
  // /admin/auth-callback; updateUser acts on whoever that session belongs to.
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "That reset link has expired. Request a new one." };
  }

  redirect("/admin/login?reset=done");
}
