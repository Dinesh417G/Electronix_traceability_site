/** Single source of truth for NAP, contact channels and brand strings. */

export const site = {
  name: "ElectronIx Trace",
  company: "ElectronIx",
  tagline: "Product traceability for manufacturing plants",
  description:
    "Per-unit traceability for manufacturing plants. Capture what went into every unit, what was done to it and what it measured, then scan the code to get all of it back.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://trace.electronix.co.in",
  locale: "en-IN",
  founder: "Dinesh Kumar G",
  phone: "+91 94882 33115",
  phoneDial: "+919488233115",
  phoneDisplay: "94882 33115",
  email: "electronix.ies@gmail.com",
  address: {
    street: "Krishna Lay Out, D/No. 15, Idigarai Village, Idigarai PO",
    locality: "Coimbatore",
    region: "Tamil Nadu",
    postalCode: "641022",
    country: "IN",
    countryName: "India",
  },
  geo: { latitude: 11.0654, longitude: 76.9153 },
} as const;

/** WhatsApp deep link with a page-aware prefilled message. */
export function whatsappUrl(context?: string): string {
  const message = context
    ? `Hello ElectronIx, I read about ${context} on the Trace site and would like to talk about traceability for our plant.`
    : "Hello ElectronIx, I would like to talk about traceability for our plant.";
  return `https://wa.me/${site.phoneDial.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

export const addressOneLine = `${site.address.street}, ${site.address.locality}-22, ${site.address.region}, ${site.address.countryName}`;
