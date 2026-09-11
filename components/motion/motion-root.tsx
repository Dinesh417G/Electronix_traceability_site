"use client";

import { useEffect } from "react";

/**
 * Adds the motion class and wires reveal-on-scroll.
 *
 * The class is added by script, so with JavaScript off the reveal styles never
 * apply and every element is simply visible. Reduced motion is honoured by the
 * stylesheet as well as here, so there are two independent guards.
 */
export function MotionRoot() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const root = document.documentElement;
    root.classList.add("js-motion");

    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const t of targets) observer.observe(t);
    return () => observer.disconnect();
  }, []);

  return null;
}
