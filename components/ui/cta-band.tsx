import Link from "next/link";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";

export function CtaBand({
  title = "Book a 20-minute line walkthrough",
  body = "We walk one line, list what each operation should capture, and tell you plainly which of your machines can be read. You get that list whether or not you buy anything.",
  context,
}: {
  title?: string;
  body?: string;
  context?: string;
}) {
  return (
    <section className="border-t border-[var(--rule)] bg-graphite-900 py-14 md:py-20">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl md:text-[1.75rem]">{title}</h2>
            <p className="prose-measure mt-4 text-[0.9375rem] leading-relaxed text-steel-400">
              {body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/contact" className="btn btn-primary">
              Book a walkthrough
            </Link>
            {context ? <WhatsAppCta context={context} /> : <WhatsAppCta />}
          </div>
        </div>
      </div>
    </section>
  );
}
