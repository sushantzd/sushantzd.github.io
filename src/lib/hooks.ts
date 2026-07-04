"use client";

import { useEffect, useState } from "react";

/**
 * Device performance tier — used later to gate the 3D neural field
 * (e.g. particle count, postprocessing) so low-end phones stay smooth.
 */
export type DeviceTier = "low" | "mid" | "high";

/**
 * SSR-safe media query hook. Returns `false` during SSR / first paint,
 * then reconciles on mount to avoid hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    // Safari <14 fallback: addListener/removeListener
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [query]);

  return matches;
}

/**
 * True when the user has requested reduced motion.
 * Animations/Lenis/3D should honour this everywhere.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Classify the device into a performance tier from viewport width,
 * devicePixelRatio and logical CPU count. SSR-safe (defaults to "high"
 * on the server so the richest experience is assumed until proven otherwise
 * on the client). Recomputes on resize.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("high");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = (): DeviceTier => {
      const width = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      const cores =
        typeof navigator !== "undefined" && navigator.hardwareConcurrency
          ? navigator.hardwareConcurrency
          : 4;

      // Low: small screens or clearly weak CPUs.
      if (width < 720 || cores <= 4) return "low";
      // High: roomy viewport, capable CPU, retina-class display.
      if (width >= 1100 && cores >= 8 && dpr >= 2) return "high";
      // Everything in between.
      return "mid";
    };

    const update = () => setTier(compute());
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}
