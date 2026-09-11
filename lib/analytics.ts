/** Thin event wrapper. No-op when GA4 is not configured. */

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Params) => void;
  }
}

export type TraceEvent =
  | "quote_submit"
  | "demo_interaction"
  | "calculator_use"
  | "whatsapp_click"
  | "sample_unit_open";

export function track(event: TraceEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}
