import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Reset your password — ElectronIx",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="section-index mb-3">ElectronIx</p>
        <h1 className="text-2xl">Reset your password</h1>
        <p className="mt-3 text-sm leading-relaxed text-steel-400">
          We will email you a link to set a new one. The link works once and expires in an hour.
        </p>
        <ForgotForm />
        <p className="mt-6 text-sm text-steel-500">
          <Link href="/admin/login" className="underline underline-offset-4 hover:text-line-050">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
