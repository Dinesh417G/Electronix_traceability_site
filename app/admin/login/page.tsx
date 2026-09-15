import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — ElectronIx",
  robots: { index: false, follow: false },
};

const RESET_STATES: Record<string, { tone: "ok" | "warn"; text: string }> = {
  done: { tone: "ok", text: "Password changed. Sign in with the new one." },
  expired: {
    tone: "warn",
    text: "That reset link has expired or was already used. Request a new one.",
  },
  unavailable: {
    tone: "warn",
    text: "Password reset is not configured on this deployment.",
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;
  const notice = reset ? RESET_STATES[reset] : undefined;

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="section-index mb-3">ElectronIx</p>
        <h1 className="text-2xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-steel-400">
          Enquiries for ElectronIx Trace and ElectronIx DNC. Staff only.
        </p>
        {notice && (
          <p
            role="status"
            className={`mt-6 border p-3 text-sm ${
              notice.tone === "ok"
                ? "border-verify/40 bg-verify/10 verdict-pass"
                : "border-[var(--rule-strong)] text-steel-400"
            }`}
          >
            {notice.text}
          </p>
        )}
        <LoginForm />
        <p className="mt-6 text-sm text-steel-500">
          <Link
            href="/admin/forgot-password"
            className="underline underline-offset-4 hover:text-line-050"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
