import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { graph, organizationSchema, localBusinessSchema, softwareApplicationSchema } from "@/lib/schema";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionRoot } from "@/components/motion/motion-root";
import { Analytics } from "@/components/analytics";
import "./globals.css";

// Only the display face is preloaded: it renders the h1, which is the largest
// contentful paint on every page. Preloading all three families put ~88 KB of
// fonts on the critical path and pushed mobile LCP out by more than a second,
// for two faces that style text the visitor reads second.
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
  themeColor: "#0e1013",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
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
