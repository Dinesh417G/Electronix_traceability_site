import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — ElectronIx",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="section-index mb-3">ElectronIx</p>
        <h1 className="text-2xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-steel-400">
          Enquiries for ElectronIx Trace and ElectronIx DNC. Staff only.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
