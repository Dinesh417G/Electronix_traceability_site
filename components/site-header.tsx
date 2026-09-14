"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/demo", label: "Live demo" },
  { href: "/industries/auto-components", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rule)] bg-graphite-950/92 backdrop-blur-sm">
      <div className="shell flex h-16 items-center justify-between gap-4">
        {/* No aria-label: the visible wordmark is the accessible name, so a
            voice-control user saying what they can see always matches. */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  active ? "text-line-050" : "text-steel-400 hover:text-line-050"
                }`}
                {...(active ? { "aria-current": "page" as const } : {})}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          {/* The responsive hiding lives on a wrapper, not on the Link itself.
              `.btn` sets `display: inline-flex` and is declared after
              Tailwind's utilities, so on the same element it beats `hidden`
              and the CTA never hides — it squeezed the mobile header. */}
          <div className="hidden lg:block">
            <Link href="/contact" className="btn btn-primary !py-2.5 !text-sm">
              Book a line walkthrough
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center border border-[var(--rule-strong)] text-line-050 lg:hidden"
          >
            {/* A stable accessible name, with aria-expanded carrying the
                state. Changing the name as well would have a screen reader
                announce "close menu, expanded", which says the same thing
                twice. */}
            <span className="sr-only">Menu</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path
                  d="M2 5h14M2 9h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-[var(--rule)] bg-graphite-900 lg:hidden"
      >
        <nav aria-label="Main, mobile" className="shell flex flex-col py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--rule)] py-3.5 text-[0.9375rem] text-line-050 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-4 mb-2"
          >
            Book a line walkthrough
          </Link>
        </nav>
      </div>
    </header>
  );
}
