"use client";

import { whatsappUrl } from "@/lib/site";
import { track } from "@/lib/analytics";

export function WhatsAppCta({
  context,
  className = "",
  children = "Message on WhatsApp",
}: {
  context?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={whatsappUrl(context)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { context: context ?? "general" })}
      className={className || "btn btn-secondary"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 00-8.7 14.9L2 22l5.3-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A3 3 0 006 9.8c0 1.7 1.3 3.4 1.4 3.6s2.4 3.7 5.8 5a6 6 0 002.6.4 2.4 2.4 0 001.6-1.1 2 2 0 00.1-1.1c0-.2-.2-.3-.5-.4z" />
      </svg>
      {children}
    </a>
  );
}
