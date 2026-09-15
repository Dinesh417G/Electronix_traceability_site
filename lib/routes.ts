/**
 * The route manifest. `sitemap.ts`, `robots.ts` and the internal-link audit all
 * read from here, so a page cannot exist without being discoverable.
 */

import { featureSlugs } from "@/content/features";
import { industrySlugs } from "@/content/industries";
import { comparisonSlugs } from "@/content/comparisons";
import { resourceSlugs } from "@/content/resources";

export type RouteEntry = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  indexable: boolean;
};

const staticRoutes: RouteEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0, indexable: true },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.9, indexable: true },
  { path: "/demo", changeFrequency: "monthly", priority: 0.9, indexable: true },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9, indexable: true },
  { path: "/resources", changeFrequency: "weekly", priority: 0.7, indexable: true },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8, indexable: true },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2, indexable: true },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2, indexable: true },
  { path: "/thank-you", changeFrequency: "yearly", priority: 0.1, indexable: false },
  // Staff only. Listed so the manifest stays the whole truth about what the
  // site serves, and marked non-indexable so robots.txt disallows both.
  { path: "/admin", changeFrequency: "daily", priority: 0.0, indexable: false },
  { path: "/admin/login", changeFrequency: "yearly", priority: 0.0, indexable: false },
  { path: "/admin/forgot-password", changeFrequency: "yearly", priority: 0.0, indexable: false },
  { path: "/admin/reset-password", changeFrequency: "yearly", priority: 0.0, indexable: false },
];

export function allRoutes(): RouteEntry[] {
  return [
    ...staticRoutes,
    ...featureSlugs.map((s) => entry(`/features/${s}`, 0.8)),
    ...industrySlugs.map((s) => entry(`/industries/${s}`, 0.8)),
    ...comparisonSlugs.map((s) => entry(`/vs/${s}`, 0.75)),
    ...resourceSlugs.map((s) => entry(`/resources/${s}`, 0.6)),
  ];
}

function entry(path: string, priority: number): RouteEntry {
  return { path, changeFrequency: "monthly", priority, indexable: true };
}

export function absoluteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://trace.electronix.co.in").replace(
    /\/$/,
    "",
  );
  return path === "/" ? base : `${base}${path}`;
}
