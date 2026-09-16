import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import {
  graph,
  organizationSchema,
  localBusinessSchema,
  softwareApplicationSchema,
} from "@/lib/schema";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionRoot } from "@/components/motion/motion-root";
import { Analytics } from "@/components/analytics";
import { themeInitScript } from "@/components/theme-toggle";
import "./globals.css";

// Only the display face is preloaded. Preloading all three families put ~88 KB
// of fonts on the critical path and pushed mobile LCP out by more than a second.
// Measured against the deployed site on 2026-09-16, the LCP element is not the
// h1 but the lede paragraph below it, which is set in `sans`. Preloading `sans`
// as well was tried and measured: mobile FCP improved ~300ms, LCP did not move
// at all (2.95s median either way, four runs each). It is left off because it
// buys nothing on the gate that is failing and costs ~50 KB of critical path.
// Numbers in docs/LOOP-LOG.md.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const sans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ElectronIx Trace — Product Traceability Software",
    template: "%s | ElectronIx Trace",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.company,
  publisher: site.company,
  formatDetection: { telephone: true, address: false, email: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: site.url,
  },
};

export const viewport: Viewport = {
  // Light is the default theme, so that is what the browser chrome matches on
  // first paint. The toggle rewrites this meta tag when the visitor switches.
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is required here, and it is scoped to this one
    // element's own attributes — it does not silence anything in the tree below.
    // The inline theme script in <body> runs before React hydrates and stamps
    // data-theme onto <html>, so the server markup and the live DOM differ by
    // exactly that attribute, deliberately. Without this, React reports a
    // hydration mismatch on every page load for anyone using the dark theme.
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        {/* First thing in the document, before any painted markup: applies a
            remembered dark choice so it never flashes light first. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: graph(
              organizationSchema(),
              localBusinessSchema(),
              softwareApplicationSchema(),
            ),
          }}
        />
        <MotionRoot />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
