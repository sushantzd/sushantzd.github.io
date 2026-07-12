# About Photo "Flip + Load" Reveal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the About-section portrait a one-time, scroll-triggered "flip + load" reveal (a subtle ~30° 3D flip while the image sharpens from a dim blur), replacing its current generic blur+rise reveal.

**Architecture:** All changes are in two files — `src/components/sections/About.tsx` (Framer Motion variants driving a `motion.figure` frame flip + a `motion.img` develop + a `motion.span` glint) and `src/app/globals.css` (perspective, `preserve-3d`, glint styles). The photo stops sharing the section's generic `revealProps(1)` and gets its own dedicated, coordinated motion. Reduced-motion users see the final state with no animation.

**Tech Stack:** Next.js 15 (static export), React 19, TypeScript, Framer Motion, plain CSS (`globals.css`). No new dependencies.

**Testing note (honest adaptation of TDD):** This is a static visual reveal — there is no meaningful unit assertion for "the flip looks right," and the repo has no test runner configured (`package.json` has no `test` script). The verification tools here are: (1) `npm run build` must pass (TypeScript type-check + static export run by `next build`), and (2) live browser inspection at desktop width, in both normal and forced `prefers-reduced-motion` modes. Each code task uses `npm run build` as its compile gate; visual acceptance is the dedicated Task 3.

**Reference spec:** `docs/superpowers/specs/2026-07-12-about-photo-flip-reveal-design.md`

---

## File Structure

**Modify:**
- `src/app/globals.css` — add `perspective` to `.about-aside`, `transform-style: preserve-3d` to `.about-photo`, and a new `.about-photo .glint` rule. (The existing `.about-photo img` resting `filter` is intentionally the *sharp* state so reduced-motion renders correctly.)
- `src/components/sections/About.tsx` — add three `Variants` (`flipFrame`, `develop`, `glint`) and a `motionProps` helper; convert the photo `motion.figure` to use them; wrap the `<img>` as `motion.img`; add a `motion.span.glint`.

**Delete (cleanup, Task 3):**
- `public/anim-demo.html` — the throwaway comparison demo.

---

### Task 1: CSS — 3D context + glint styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add `perspective` to the photo's column context.** Find the existing `.about-aside` rule (added when the photo was introduced) and add a `perspective` line so child 3D transforms render with depth.

Replace:

```css
.about-aside {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
```

with:

```css
.about-aside {
  display: flex;
  flex-direction: column;
  gap: 20px;
  perspective: 1200px;
}
```

- [ ] **Step 2: Add `transform-style: preserve-3d` to the frame** so the `rotateY` reads as a true flip, not a flat horizontal squish. Replace:

```css
.about-photo {
  position: relative;
  margin: 0;
  padding: 7px;
  border-radius: 18px;
  overflow: hidden;
}
```

with:

```css
.about-photo {
  position: relative;
  margin: 0;
  padding: 7px;
  border-radius: 18px;
  overflow: hidden;
  transform-style: preserve-3d;
}
```

- [ ] **Step 3: Add the glint overlay style.** Insert this rule immediately AFTER the existing `.about-photo::after { ... }` block (the cyan/dark grade):

```css
.about-photo .glint {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    115deg,
    transparent 30%,
    rgba(255, 255, 255, 0.35) 48%,
    transparent 62%
  );
}
```

> **Note:** Do NOT change `.about-photo img`'s existing `filter: saturate(0.92) contrast(1.03) brightness(0.98);`. That sharp value is the resting state, which is exactly what reduced-motion users must see when no animation runs. The blur is applied only by the motion "hidden" variant in Task 2.

- [ ] **Step 4: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully` and `✓ Exporting`. (CSS-only change; this just confirms nothing else broke.)

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add 3D perspective + glint overlay for About photo reveal"
```

---

### Task 2: About.tsx — flip + develop + glint motion

**Files:**
- Modify: `src/components/sections/About.tsx`

- [ ] **Step 1: Add the three reveal variants.** In `src/components/sections/About.tsx`, immediately AFTER the existing `reveal` variant definition (the `const reveal: Variants = { ... };` block near the top), add:

```tsx
/** Frame flip: turned ~30° on the Y axis → flat, as it scrolls in. */
const flipFrame: Variants = {
  hidden: { rotateY: -30, opacity: 0 },
  show: {
    rotateY: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

/** Image "develops": dim + blurred → sharp, trailing the flip slightly. */
const develop: Variants = {
  hidden: {
    filter: "blur(14px) saturate(0.7) contrast(1.03) brightness(0.55)",
    scale: 1.06,
  },
  show: {
    filter: "blur(0px) saturate(0.92) contrast(1.03) brightness(0.98)",
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut", delay: 0.12 },
  },
};

/** Faint diagonal light-sweep across the glass once, as it lands. */
const glint: Variants = {
  hidden: { x: "-120%", opacity: 0 },
  show: {
    x: "120%",
    opacity: [0, 1, 0],
    transition: { duration: 0.9, ease: "easeOut", delay: 0.4 },
  },
};
```

> `EASE` is already defined at the top of this file (`const EASE = [0.16, 1, 0.3, 1] as const;`) — reuse it; do not redefine it.

- [ ] **Step 2: Add a `motionProps` helper** inside the `About` component. Locate the existing `revealProps` helper (defined right after `const reduced = usePrefersReducedMotion();`) and add this directly beneath it:

```tsx
  const motionProps = (variants: Variants) =>
    reduced
      ? {}
      : {
          variants,
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, margin: "0px 0px -8% 0px" },
        };
```

- [ ] **Step 3: Convert the photo figure to the flip reveal.** Replace this existing block:

```tsx
          <motion.figure className="about-photo glass" {...revealProps(1)}>
            <img
              src="/about-portrait.jpg"
              alt="Sushant Choudhary"
              width={1600}
              height={1200}
              loading="lazy"
            />
          </motion.figure>
```

with:

```tsx
          <motion.figure className="about-photo glass" {...motionProps(flipFrame)}>
            <motion.img
              src="/about-portrait.jpg"
              alt="Sushant Choudhary"
              width={1600}
              height={1200}
              loading="lazy"
              {...motionProps(develop)}
            />
            <span className="grade" aria-hidden="true" />
            <motion.span className="glint" aria-hidden="true" {...motionProps(glint)} />
          </motion.figure>
```

> **Two things to note:**
> - The grade was previously drawn by the `.about-photo::after` pseudo-element and still is — the added `<span className="grade">` is harmless but NOT required. If you prefer zero redundancy, omit the `<span className="grade" />` line entirely; the `::after` grade already renders. **Decision for this plan: omit it** — delete that line so only the `::after` grade exists. Keep the `glint` span.
> - So the final figure body is: `motion.img` + `motion.span.glint` only.

Final intended block (use exactly this):

```tsx
          <motion.figure className="about-photo glass" {...motionProps(flipFrame)}>
            <motion.img
              src="/about-portrait.jpg"
              alt="Sushant Choudhary"
              width={1600}
              height={1200}
              loading="lazy"
              {...motionProps(develop)}
            />
            <motion.span className="glint" aria-hidden="true" {...motionProps(glint)} />
          </motion.figure>
```

- [ ] **Step 4: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully` and `✓ Exporting`. If TypeScript complains about `motion.img` props, confirm `motion` is imported (it already is: `import { motion, useInView, type Variants } from "framer-motion";`) and that `Variants` is imported (it is).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/About.tsx
git commit -m "feat: flip + load reveal for About photo (frame flip, image develop, glint)"
```

---

### Task 3: Visual verification + cleanup

**Files:** none modified (verification); delete `public/anim-demo.html`.

- [ ] **Step 1: Build the static export**

Run: `npm run build`
Expected: `✓ Compiled successfully`, `✓ Exporting`.

- [ ] **Step 2: Serve and open the site.** If the dev server is running use `http://localhost:3000`; otherwise serve the export:

Run (PowerShell, from `portfolio/`): `Set-Location out; python -m http.server 4599`
Verify: `Invoke-WebRequest http://localhost:4599 -UseBasicParsing | Select-Object -ExpandProperty StatusCode` returns `200`.

- [ ] **Step 3: Verify the reveal (normal motion).** Open the site, scroll the About section (second section, "Engineering intelligence into real-world systems") into view. Confirm:
  - The framed photo starts turned/dim and **flips flat over ~0.7s** while the image **sharpens from blur**.
  - A **faint diagonal glint** sweeps across once as it settles, then stops.
  - It fires **once** — scrolling away and back does not replay it.
  - The stats grid below is unchanged and still counts up.

- [ ] **Step 4: Verify reduced-motion.** In Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce" (or OS setting), reload and scroll to About. Confirm the photo appears **immediately, flat and sharp, with no flip and no glint**, and the rest of the page still behaves as before.

- [ ] **Step 5: Fix any defect**, rebuild, re-verify the About section until Steps 3–4 pass. Record what was checked.

- [ ] **Step 6: Delete the throwaway demo.**

```bash
git rm --ignore-unmatch public/anim-demo.html
# if it was never tracked by git, just remove the file:
#   Remove-Item public/anim-demo.html
```

- [ ] **Step 7: Stop the local server** (if you started one in Step 2).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: verify About flip reveal + remove animation demo"
```

---

## Self-Review

**Spec coverage:**
- Flip + load, subtle & premium character (~30° Y, ~0.7s, glint) → Task 2 `flipFrame` + `develop` + `glint` variants. ✅
- 3D renders as a real flip (perspective / preserve-3d) → Task 1 Steps 1–2. ✅
- One-time on scroll-in → `viewport={{ once: true }}` in `motionProps` (Task 2 Step 2). ✅
- Image "develops" trailing the flip → `develop` variant `delay: 0.12` (Task 2 Step 1). ✅
- Glint once as it lands → `glint` variant `delay: 0.4`, `opacity: [0,1,0]` (Task 2 Step 1). ✅
- Reduced-motion shows final state, no motion → `motionProps` returns `{}` when `reduced`, and resting CSS `filter` is the sharp state (Task 1 Step 3 note). Verified in Task 3 Step 4. ✅
- Stats untouched, photo no longer shares `revealProps(1)` → Task 2 Step 3 only replaces the figure. ✅
- Cleanup demo file → Task 3 Step 6. ✅
- No new dependencies, uses existing `motion`/`Variants`/`EASE`/`usePrefersReducedMotion` → confirmed in Task 2 notes. ✅

**Placeholder scan:** No "TBD"/"handle edge cases"/vague steps — every code step shows exact code and exact before/after. ✅

**Type consistency:** `motionProps(variants: Variants)` takes a `Variants` and is applied to `flipFrame`/`develop`/`glint`, all typed `Variants`. `EASE` reused (not redefined). `motion.img`/`motion.span` are valid Framer Motion components from the already-imported `motion`. The `filter` keyframes use the same four functions (`blur`, `saturate`, `contrast`, `brightness`) in the same order in both `hidden` and `show`, which Framer Motion requires to interpolate multi-function filters. ✅

**Reduced-motion correctness:** Base `.about-photo img` filter is the sharp resting value and base `.about-photo` has no rotate/opacity override, so when `motionProps` returns `{}` the element renders in its final visible state with no start-state flash. ✅
