import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = {
  title: "Set a new password — ElectronIx",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  // Reaching this page means the recovery link was already exchanged for a
  // session by /admin/auth-callback. No session means the link was never
  // followed, or it has expired.
  const supabase = await createSupabaseServerClient();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!data.user) redirect("/admin/login?reset=expired");

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="section-index mb-3">ElectronIx</p>
        <h1 className="text-2xl">Set a new password</h1>
        <p className="mt-3 text-sm leading-relaxed text-steel-400">
          For <span className="data">{data.user.email}</span>. At least 10 characters.
        </p>
        <ResetForm />
      </div>
    </div>
  );
}
