import type { MetadataRoute } from "next";
import { allRoutes, absoluteUrl } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  const disallow = allRoutes()
    .filter((r) => !r.indexable)
    .map((r) => r.path);

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [...disallow, "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
