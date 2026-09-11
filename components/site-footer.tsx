import Link from "next/link";
import { site, addressOneLine, whatsappUrl } from "@/lib/site";
import { features } from "@/content/features";
import { industries } from "@/content/industries";
import { comparisons } from "@/content/comparisons";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--rule)] bg-graphite-900">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="prose-measure mt-4 text-sm leading-relaxed text-steel-400">
              Per-unit traceability for manufacturing plants. Built in Coimbatore by the
              engineer who supports it.
            </p>
            <address className="mt-5 not-italic text-sm leading-relaxed text-steel-500">
              {addressOneLine}
            </address>
            <div className="mt-4 flex flex-col gap-1.5 text-sm">
              <a href={`tel:${site.phoneDial}`} className="text-line-050 hover:text-signal">
                <span className="data">{site.phone}</span>
              </a>
              <a href={`mailto:${site.email}`} className="text-line-050 hover:text-signal">
                {site.email}
              </a>
              <a
                href={whatsappUrl()}
                className="text-line-050 hover:text-signal"
                rel="noopener noreferrer"
                target="_blank"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>

          <FooterCol title="Capabilities">
            {features.slice(0, 6).map((f) => (
              <FooterLink key={f.slug} href={`/features/${f.slug}`}>
                {f.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Industries">
            {industries.map((i) => (
              <FooterLink key={i.slug} href={`/industries/${i.slug}`}>
                {i.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Compare and learn">
            {comparisons.slice(0, 3).map((c) => (
              <FooterLink key={c.slug} href={`/vs/${c.slug}`}>
                Trace vs {c.competitor}
              </FooterLink>
            ))}
            <FooterLink href="/resources">Traceability guides</FooterLink>
            <FooterLink href="/how-it-works">How it works</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/demo">Live demo</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--rule)] pt-6 text-xs text-steel-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.company}, Coimbatore. {new Date().getFullYear()}.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-line-050">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-line-050">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-line-050">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="data text-[0.6875rem] tracking-wide text-steel-600">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-steel-400 hover:text-line-050">
        {children}
      </Link>
    </li>
  );
}
