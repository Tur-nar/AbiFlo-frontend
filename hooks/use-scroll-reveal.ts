"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal using IntersectionObserver.
 * Adds `data-visible` to the section once it enters the viewport,
 * which CSS transitions pick up — zero scroll listeners, zero GSAP overhead.
 */
export function useScrollReveal<T extends HTMLElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-visible", "");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "");
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
