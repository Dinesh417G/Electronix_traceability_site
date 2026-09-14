"use client";

import { useEffect, useSyncExternalStore } from "react";

export const THEME_KEY = "trace-theme";

/**
 * Runs before the browser paints anything, so a visitor who chose dark never
 * sees a white flash first. It is inline and synchronous on purpose: any
 * deferred or bundled version of this is a frame too late.
 *
 * Light is the default, deliberately and unconditionally — the system
 * preference is not consulted. A plant office is a bright room and the site is
 * a document there, not an IDE.
 */
export const themeInitScript = `
(function(){try{
  var t = localStorage.getItem(${JSON.stringify(THEME_KEY)});
  if (t === "dark") document.documentElement.setAttribute("data-theme","dark");
}catch(e){}})();
`;

type Theme = "light" | "dark";

/**
 * The attribute on <html> is the single source of truth for the theme, not a
 * React state value. It has to be: the inline script above sets it before React
 * exists, so any component state would start out as a guess that then needs
 * correcting in an effect — which is a cascading render and a hydration smell.
 *
 * Subscribing to the attribute instead means the button always renders what is
 * actually applied, and the server snapshot is simply the default.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

const serverTheme = (): Theme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);

  useEffect(() => {
    // Colour transitions are enabled only after the first paint, so the initial
    // render is not animated into existence.
    document.documentElement.classList.add("theme-ready");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    if (next === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode, or storage disabled. The theme still applies for this
      // page view; it just will not be remembered. Nothing to tell the user.
    }

    // Keep the mobile browser chrome in step with the page.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#0e1013" : "#ffffff");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--rule-strong)] text-steel-400 transition-colors hover:text-line-050"
    >
      {/* A stable accessible name with aria-pressed carrying the state, the same
          pattern the menu button uses. Renaming the control as it flips would
          have a screen reader announce the state twice. */}
      <span className="sr-only">Dark theme</span>

      {/* Both icons are always in the DOM and CSS decides which shows, keyed off
          the `data-theme` attribute on <html>. Choosing in React instead would
          mean the server renders one icon and the client swaps it, which is a
          hydration mismatch and a visible flicker. */}
      <svg
        className="theme-icon-moon"
        width="17"
        height="17"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15.2 11.1A6.6 6.6 0 0 1 6.9 2.8a6.6 6.6 0 1 0 8.3 8.3Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        className="theme-icon-sun"
        width="17"
        height="17"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M9 1.4v1.8M9 14.8v1.8M1.4 9h1.8M14.8 9h1.8M3.6 3.6l1.3 1.3M13.1 13.1l1.3 1.3M14.4 3.6l-1.3 1.3M4.9 13.1l-1.3 1.3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
