"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "../actions";

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {
    sent: false,
    error: null,
  });

  if (state.sent) {
    return (
      <div className="panel mt-8 p-6">
        <p className="text-sm leading-relaxed text-line-050">
          If that address has an account, a reset link is on its way. Check the inbox it was
          sent to, and the spam folder.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-steel-500">
          Nothing arriving? The link is sent by Supabase, which is rate limited to a few
          messages an hour on this project.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="panel mt-8 p-6">
      <label htmlFor="email" className="mb-2 block text-sm text-steel-400">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="field"
      />

      {state.error && (
        <p role="alert" className="mt-5 border border-reject/40 bg-reject/10 p-3 text-sm verdict-fail">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {pending ? "Sending…" : "Email me a reset link"}
      </button>
    </form>
  );
}
