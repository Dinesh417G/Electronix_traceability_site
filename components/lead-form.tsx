"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

type FieldErrors = Partial<Record<string, string>>;

type Utm = { source: string; medium: string; campaign: string; referrer: string };

const EMPTY_UTM: Utm = { source: "", medium: "", campaign: "", referrer: "" };

/**
 * Campaign parameters, read at submit rather than held in state.
 *
 * The first page of a visit carries the parameters; later pages do not, so the
 * first set seen is persisted for the session and reused. Reading on demand
 * keeps this out of an effect, which is both simpler and avoids a render pass
 * that exists only to store something the form does not display.
 */
function readUtm(): Utm {
  if (typeof window === "undefined") return EMPTY_UTM;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {
    source: params.get("utm_source") ?? "",
    medium: params.get("utm_medium") ?? "",
    campaign: params.get("utm_campaign") ?? "",
    referrer: document.referrer,
  };

  try {
    if (fromUrl.source || fromUrl.medium || fromUrl.campaign) {
      sessionStorage.setItem("trace_utm", JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem("trace_utm");
    if (stored) return { ...fromUrl, ...(JSON.parse(stored) as Partial<Utm>) };
  } catch {
    // Private mode, or storage disabled. The referrer alone is still useful.
  }
  return fromUrl;
}

export function LeadForm({ sourcePage }: { sourcePage: string }) {
  const router = useRouter();
  const startedAt = useRef<number>(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Mount time, used to reject submissions faster than a human could type.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setFormError(null);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const utm = readUtm();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          source_page: sourcePage,
          utm_source: utm.source,
          utm_medium: utm.medium,
          utm_campaign: utm.campaign,
          referrer: utm.referrer,
          started_at: startedAt.current,
        }),
      });

      if (res.ok) {
        track("quote_submit", { source_page: sourcePage });
        router.push("/thank-you");
        return;
      }

      const body = (await res.json()) as { errors?: FieldErrors; error?: string };
      if (body.errors) setErrors(body.errors);
      setFormError(
        body.error ??
          "Something went wrong sending that. Please call or WhatsApp us instead — we would rather hear from you than lose the message.",
      );
    } catch {
      setFormError(
        "Could not reach the server. Please call or WhatsApp us on 94882 33115 instead.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="panel p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" required error={errors.name} autoComplete="name" />
        <Field
          name="company"
          label="Company"
          required
          error={errors.company}
          autoComplete="organization"
        />
        <Field
          name="phone"
          label="Phone or WhatsApp"
          required
          type="tel"
          error={errors.phone}
          autoComplete="tel"
        />
        <Field
          name="email"
          label="Email"
          required
          type="email"
          error={errors.email}
          autoComplete="email"
        />
        <Field name="city" label="City" error={errors.city} autoComplete="address-level2" />
        <Field
          name="industry"
          label="What do you make"
          error={errors.industry}
          placeholder="Pumps, panels, auto components"
        />
        <Field
          name="line_count"
          label="How many lines"
          error={errors.line_count}
          placeholder="1"
        />
        <Field
          name="machine_types"
          label="Machines or instruments to read"
          error={errors.machine_types}
          placeholder="Torque gun, leak tester, PLC"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-2 block text-sm text-steel-400">
          What is prompting this <span className="text-steel-600">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full border border-[var(--rule-strong)] bg-graphite-950 px-3.5 py-3 text-sm text-line-050 placeholder:text-steel-600"
          placeholder="Customer audit, a warranty claim, a new OEM programme…"
        />
      </div>

      {/* Honeypot. Hidden from users and from assistive technology. */}
      <div hidden aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {formError && (
        <p role="alert" className="mt-5 border border-reject/40 bg-reject/10 p-3 text-sm verdict-fail">
          {formError}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {pending ? "Sending…" : "Request a line walkthrough"}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-steel-600">
        We reply from Coimbatore, usually the same day. Your details are used to answer you and
        nothing else — see our{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-steel-400">
          privacy note
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  error,
  placeholder,
  autoComplete,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const errId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-steel-400">
        {label}
        {!required && <span className="text-steel-600"> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        {...(required ? { required: true } : {})}
        {...(placeholder ? { placeholder } : {})}
        {...(autoComplete ? { autoComplete } : {})}
        {...(error ? { "aria-invalid": true as const, "aria-describedby": errId } : {})}
        className={`w-full border bg-graphite-950 px-3.5 py-3 text-sm text-line-050 placeholder:text-steel-600 ${
          error ? "border-reject" : "border-[var(--rule-strong)]"
        }`}
      />
      {error && (
        <p id={errId} className="mt-1.5 text-xs verdict-fail">
          {error}
        </p>
      )}
    </div>
  );
}
