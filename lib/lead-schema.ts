import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Tell us who you are").max(120),
  company: z.string().trim().min(2, "Company name helps us prepare").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "A phone number we can reach you on")
    .max(24)
    .regex(/^[+0-9][0-9\s\-()]{6,23}$/, "Digits, spaces and + only"),
  email: z.email("That does not look like an email address").max(160),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  line_count: z.string().trim().max(40).optional().or(z.literal("")),
  machine_types: z.string().trim().max(400).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source_page: z.string().trim().max(200).default("/"),
  utm_source: z.string().trim().max(120).optional().or(z.literal("")),
  utm_medium: z.string().trim().max(120).optional().or(z.literal("")),
  utm_campaign: z.string().trim().max(120).optional().or(z.literal("")),
  referrer: z.string().trim().max(400).optional().or(z.literal("")),
  // Honeypot: named to look attractive to a bot. Deliberately permissive here —
  // a filled honeypot must parse cleanly and be dropped silently by the route,
  // because a 422 naming this field tells a bot exactly what gave it away.
  website: z.string().max(200).optional(),
  // Round-trip timestamp: a submission faster than a human can type is a bot.
  started_at: z.coerce.number().int().nonnegative(),
});

export type LeadInput = z.infer<typeof leadSchema>;
