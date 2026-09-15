"use client";

import { useActionState } from "react";
import { setNewPassword } from "../actions";

export function ResetForm() {
  const [state, action, pending] = useActionState(setNewPassword, { error: null });

  return (
    <form action={action} className="panel mt-8 p-6">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-steel-400">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="field"
        />
      </div>
      <div className="mt-5">
        <label htmlFor="confirm" className="mb-2 block text-sm text-steel-400">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="field"
        />
      </div>

      {state.error && (
        <p role="alert" className="mt-5 border border-reject/40 bg-reject/10 p-3 text-sm verdict-fail">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
