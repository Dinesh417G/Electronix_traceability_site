import type { Metadata } from "next";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/routes";

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  ogTitle?: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.ogTitle ?? opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.ogTitle ?? opts.title,
      description: opts.description,
    },
    ...(opts.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
