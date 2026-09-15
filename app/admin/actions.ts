"use server";

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
