"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Probe cursor: a hard dot that tracks the pointer 1:1 plus a trailing
 * ring that lerps behind it. The ring grows when hovering any element
 * marked with `data-cursor`. Rendered only on fine pointers; hidden on
 * touch via CSS (`@media (pointer: coarse)`).
 *
 * Convention for other components: add `data-cursor` to any interactive
 * element that should trigger the ring's hover growth.
 */
export default function CustomCursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(loop);
    };

    // Event delegation so elements added later (dynamic sections) still work.
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-cursor]")) ring.classList.add("hover");
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-cursor]")) ring.classList.remove("hover");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafId);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
