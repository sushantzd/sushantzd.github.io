# About Photo — "Flip + Load" Reveal — Design Spec

**Date:** 2026-07-12
**Status:** Approved (feel + character confirmed against a live demo)
**Scope:** Animate the single About-section portrait (`.about-photo`) on scroll-in. Nothing else.

## Goal

The About portrait currently uses the same gentle blur+rise reveal as every other
section, so it reads as "already loaded" — static and unremarkable on an otherwise
3D/animated site. Give it a distinctive, one-time **flip + load** reveal that matches
the site's glass/cyan aesthetic and the Majd-style 3D image reveal the user liked.

## Chosen behavior (validated in a throwaway demo)

**Reveal feel:** Flip + load. **Flip character:** Subtle & premium.

On first scroll into view, the framed photo plays once:

1. **Start (load) state** — the image sits dim and blurred (`blur(14px) brightness(.55)
   saturate(.7)`, `scale(1.06)`); the frame is turned ~30° on its vertical (Y) axis.
2. **Flip** — the frame rotates to flat (`rotateY: -30deg → 0`) over ~0.7s with
   `cubic-bezier(.16,1,.3,1)` (the site's existing easing).
3. **Develop** — the image sharpens to full (`blur(0) brightness(1) saturate(.92)`,
   `scale(1)`) over ~0.9s, starting ~0.12s after the flip so it "resolves" as it lands.
4. **Glint** — a faint diagonal light-sweep crosses the glass once (~0.55s in), then stops.

Fires **once** (never replays). The stats block below the photo is untouched.

## Technical approach

Implement in `src/components/sections/About.tsx` with **Framer Motion** (already a
dependency) — no new packages, no WAAPI. The demo used raw WAAPI only to sidestep a
CSS-class timing race; inside React, Framer Motion's `whileInView` + `variants` drive
the keyframes cleanly and avoid that race by design.

- **Perspective:** add `perspective: 1200px` to the photo's column context and
  `transform-style: preserve-3d` on the frame (in `globals.css`, beside the existing
  `.about-photo` rules) so `rotateY` renders as a true 3D flip, not a horizontal squish.
- **Two coordinated motion elements inside `.about-photo`:**
  - the **frame** (`motion.figure.about-photo`) animates `rotateY` + `opacity`;
  - the **image** (`motion.img`) animates `filter` (blur/brightness/saturate) +
    `scale`, with a small delay relative to the frame.
- **Glint:** a `.glint` span (already present in the static markup pattern) animated via
  Framer Motion `x`/`opacity`, once, on view.
- Use `viewport={{ once: true, margin: "0px 0px -8% 0px" }}` to match the trigger point
  of the other sections.

The photo stops using the shared `revealProps(1)`; it gets its own dedicated variants so
its motion is independent of the surrounding blur+rise reveals.

## Accessibility / degradation

Under `prefers-reduced-motion: reduce` the whole sequence is skipped — the photo renders
final (flat, sharp, full brightness), no flip, no glint — consistent with how `About.tsx`
already branches on `usePrefersReducedMotion()` and how `globals.css` zeroes motion.

## Out of scope (YAGNI)

- No scroll-linked parallax / continuous tilt (the "living tilt" option was rejected).
- No changes to the hero, other sections, or the photo choice/crop.
- No `next/image` migration; the existing `<img src="/about-portrait.jpg">` stays.

## Verification

No meaningful unit test exists for a visual reveal. Gates:
1. `npm run build` passes (TypeScript + static export).
2. Confirm the motion live in the dev server at desktop width — normal and with
   `prefers-reduced-motion` forced (photo appears instantly, no flip).

## Cleanup

Delete the throwaway demo file `public/anim-demo.html` once the real implementation is
verified.
