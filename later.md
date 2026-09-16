# Later — what needs the owner

Everything here is blocked on a credential or a dashboard that only you can
reach. **None of it stops the site working.** Each item silently downgrades one
feature until it is done, which is exactly why they are easy to lose.

Last updated 2026-09-16.

---

## 1. Check you can sign in

<https://electronix-trace-site.vercel.app/admin/login>

`dinug417@gmail.com` with your **existing Supabase password** — the account
already existed in the DNC project, so nothing new was created for you. You
should land on the enquiries list.

If the password does not work, use **Forgot password** on the sign-in page.
That flow needs item 3 below to be set first; until then, reset it directly at
<https://supabase.com/dashboard/project/kowotmvjnbapegdxytxl/auth/users>.

---

## 2. Two keys on Vercel

<https://vercel.com/dinesh417gs-projects/electronix-trace-site/settings/environment-variables>

Add both for **Production** and **Preview**, marked **Sensitive**.

| Name | Where to get it |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | <https://supabase.com/dashboard/project/kowotmvjnbapegdxytxl/settings/api-keys> → reveal `service_role` |
| `RESEND_API_KEY` | <https://resend.com/api-keys> → Create API Key, sending permission |

**Mint a fresh Resend key.** Do not try to copy the one on the DNC project:
Vercel stores Sensitive variables so that nobody can read them back, the
dashboard included. Attempting that copy is what took the live lead form down
with 502s during the build.

Also check <https://resend.com/domains> and confirm which domain is verified.
The sender currently defaults to `ElectronIx <no-reply@electronix.co.in>`; if
your verified domain differs, say so and it gets changed.

### What each one turns on

- **`RESEND_API_KEY`** — double opt-in. The enquirer gets a confirmation email
  from ElectronIx; you are alerted once they click. Without it nobody is asked
  to confirm and you are alerted immediately. Nothing is ever lost either way.
- **`SUPABASE_SERVICE_ROLE_KEY`** — used by one route, `/api/lead/verify`.
  Flipping a lead row to confirmed must not be possible with the public key.
  Without it, confirmation links answer "we could not confirm that just now."

---

## 3. One Supabase setting — needed for password reset

<https://supabase.com/dashboard/project/kowotmvjnbapegdxytxl/auth/url-configuration>

Under **Redirect URLs**, add:

```
https://electronix-trace-site.vercel.app/**
```

Password reset links are sent by Supabase's own mail, so this needs no Resend
key — but a `redirectTo` that is not on this allowlist is silently ignored and
falls back to the project's **Site URL**, which belongs to the ElectronIx DNC
site. Without this entry a reset link lands a user on the wrong site.

This is the one item no tool available in the session can set, which is why it
is yours rather than done already.

> Note: Supabase's built-in mail is rate limited to a few messages an hour and
> is intended for exactly this kind of internal use. It is not the channel for
> customer email — that is Resend, item 2.

---

## 4. Custom domain, when you are ready

Point `trace.electronix.co.in` at the Vercel project, then say so. The change
needed afterwards is `NEXT_PUBLIC_SITE_URL` plus a redeploy — canonicals, the
sitemap, OG images and JSON-LD all derive from it and are currently pointing at
the vercel.app address.

**Related:** the site is **indexable right now** on the vercel.app domain.
If you would rather Google did not find it under that name before launch, ask
for a noindex and it can go in until DNS is ready.

---

## Smaller, whenever

- ~~**`main` branch and a PR.**~~ Done 2026-09-16. `main` was created at the
  initial commit and [PR #1](https://github.com/Dinesh417G/Electronix_traceability_site/pull/1)
  is open against it. The **default branch is still
  `claude/traceability-report-review-sqs75r`** and so is Vercel's production
  branch — deliberately, so nothing about the live site moved. If you would
  rather `main` were the trunk, say so: it means fast-forwarding `main` to the
  branch head, switching the default on GitHub and the production branch on
  Vercel, and closing the PR as merged-by-fast-forward.
- **More admins.** Anyone reading enquiries needs a Supabase account and a row
  in `public.admins`. Only the service role can grant that, deliberately — give
  the email to whoever is working on the repo.
- **Supabase migration ordering.** `supabase/migrations/` is the record of what
  was applied to the shared project. Applied through 0003 as of this date.
- **`/admin` still renders the marketing header and footer**, so there is a
  "Book a line walkthrough" CTA on your staff inbox. Cosmetic; removing it means
  a route group refactor.

---

## Things only you can answer

- Whether the copy is true for your line. The site can be checked against
  `docs/PRODUCT-FACTS.md`, not against reality.
- Pricing. `DECISIONS.md` Q2/Q3/Q4 in the product repo are still open, and
  `CLAUDE.md` rule 6 means no price may appear until they are closed.
