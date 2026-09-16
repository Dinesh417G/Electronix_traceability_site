"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, { error: null });

  return (
    <form action={action} className="panel mt-8 p-6">
      <div>
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
      </div>
      <div className="mt-5">
        <label htmlFor="password" className="mb-2 block text-sm text-steel-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
        />
      </div>

      {state.error && (
        <p role="alert" className="mt-5 border border-reject/40 bg-reject/10 p-3 text-sm verdict-fail">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
