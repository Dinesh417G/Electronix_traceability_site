import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Thank You — ElectronIx Trace",
  description: "Your enquiry reached us. We reply from Coimbatore, usually the same day.",
  path: "/thank-you",
  noIndex: true,
});

/* The confirmation link lands back here. Each state is written so it is
   truthful on its own -- "already confirmed" is not an error, and an expired
   or reused link must not imply the enquiry was lost. */
const CONFIRM_STATES: Record<string, { heading: string; body: string }> = {
  ok: {
    heading: "Email confirmed. We have your enquiry.",
    body: "Your address is confirmed and your enquiry is now in front of us.",
  },
  already: {
    heading: "That was already confirmed.",
    body: "Nothing more to do — this address was confirmed earlier and your enquiry is with us.",
  },
  invalid: {
    heading: "That confirmation link did not work.",
    body: "It may have expired or already been used. Your enquiry still reached us, so there is nothing you need to resend.",
  },
  unavailable: {
    heading: "We could not confirm that just now.",
    body: "Your enquiry still reached us and we will reply either way.",
  },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ confirm?: string }>;
}) {
  const { confirm } = await searchParams;
  const state = confirm ? CONFIRM_STATES[confirm] : undefined;

  return (
    <div className="shell py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="section-index mb-5">
          {state ? "Email confirmation" : "Enquiry received"}
        </p>
        <h1 className="text-[2rem] leading-tight md:text-[2.75rem]">
          {state ? state.heading : "That reached us. We will reply today."}
        </h1>
        {state && (
          <p className="prose-measure mt-6 text-base leading-relaxed text-line-050">
            {state.body}
          </p>
        )}
        <p className="prose-measure mt-6 text-base leading-relaxed text-steel-400">
          Replies come from Coimbatore, usually within a few hours on a working day. If it is
          urgent, calling is faster than waiting for an email —{" "}
          <a href={`tel:${site.phoneDial}`} className="data text-line-050 hover:text-signal">
            {site.phone}
          </a>
          .
        </p>

        <div className="panel mt-10 p-6">
          <h2 className="data text-[0.6875rem] tracking-wide text-steel-600">
            While you wait
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="/demo"
                className="text-[0.9375rem] text-line-050 underline underline-offset-4 hover:text-signal"
              >
                Run the recall query on the sample dataset
              </Link>
              <p className="mt-1 text-sm text-steel-500">
                It is the query the whole system exists to answer.
              </p>
            </li>
            <li className="border-t border-[var(--rule)] pt-3">
              <Link
                href="/resources/planning-a-recall-scope-calculation"
                className="text-[0.9375rem] text-line-050 underline underline-offset-4 hover:text-signal"
              >
                Planning a recall scope calculation
              </Link>
              <p className="mt-1 text-sm text-steel-500">
                A drill you can run on your own records this week, before we speak.
              </p>
            </li>
            <li className="border-t border-[var(--rule)] pt-3">
              <Link
                href="/how-it-works"
                className="text-[0.9375rem] text-line-050 underline underline-offset-4 hover:text-signal"
              >
                How ElectronIx Trace works
              </Link>
              <p className="mt-1 text-sm text-steel-500">
                So the walkthrough starts from the same page.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
