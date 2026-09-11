import type { MetadataRoute } from "next";
import { allRoutes, absoluteUrl } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return allRoutes()
    .filter((r) => r.indexable)
    .map((r) => ({
      url: absoluteUrl(r.path),
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }));
}
