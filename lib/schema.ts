/** Typed JSON-LD builders. Never hand-write a schema string. */

import { site, addressOneLine } from "@/lib/site";
import { absoluteUrl } from "@/lib/routes";

type Json = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.company,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    founder: { "@type": "Person", name: site.founder },
    address: postalAddress(),
    areaServed: ["IN", "Worldwide"],
    description:
      "ElectronIx builds industrial automation, IIoT and manufacturing software from Coimbatore, Tamil Nadu.",
  };
}

export function localBusinessSchema(): Json {
  return {
    "@type": "LocalBusiness",
    "@id": `${site.url}/#localbusiness`,
    name: site.company,
    image: absoluteUrl("/opengraph-image"),
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    priceRange: "Quote based",
    description: addressOneLine,
  };
}

export function softwareApplicationSchema(): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    name: site.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Manufacturing traceability",
    operatingSystem: "Windows 10/11, Debian 12, Ubuntu 22.04+",
    url: site.url,
    publisher: { "@id": ORG_ID },
    description: site.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "INR",
        description: "Quoted per plant. Contact for a quote.",
      },
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqSchema(items: readonly { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.path),
    })),
  };
}

export function articleSchema(a: {
  headline: string;
  description: string;
  path: string;
  published: string;
}): Json {
  return {
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    datePublished: a.published,
    dateModified: a.published,
    author: { "@type": "Person", name: site.founder },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: absoluteUrl(a.path),
    image: absoluteUrl(`${a.path}/opengraph-image`),
  };
}

export function howToSchema(steps: readonly { name: string; text: string }[]): Json {
  return {
    "@type": "HowTo",
    name: "How product traceability works, from job card to scan",
    description:
      "The six stages a unit passes through in ElectronIx Trace and what is captured at each.",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function serviceSchema(s: { name: string; description: string; path: string }): Json {
  return {
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: { "@id": ORG_ID },
    areaServed: "IN",
    url: absoluteUrl(s.path),
  };
}

export function collectionPageSchema(c: { name: string; description: string; path: string }): Json {
  return {
    "@type": "CollectionPage",
    name: c.name,
    description: c.description,
    url: absoluteUrl(c.path),
  };
}

function postalAddress(): Json {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
}

/** Wraps one or more schema objects in a single @graph document. */
export function graph(...nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
