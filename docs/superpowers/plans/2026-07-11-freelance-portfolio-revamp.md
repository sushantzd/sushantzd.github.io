# Freelance Portfolio Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the SYNAPSE portfolio from an AI/ML job-seeker site into an "AI + Full-Stack Freelancer" client-facing site — broadened branding, expanded skills, a Services section, 5 anonymized real-world projects, and a gated Testimonials scaffold.

**Architecture:** All content lives in the single source of truth `src/data/resume.ts`; presentational React (client) components in `src/components/sections/` consume it. We extend the typed data model, add two new section components (`Services`, `Testimonials`), update copy in existing components, wire section order in `page.tsx`, and add matching styles in `globals.css`. Deploy is `./deploy.ps1` (force-pushes `out/` to the `gh-pages` branch that GitHub Pages serves).

**Tech Stack:** Next.js 15 (static export), React 19, TypeScript, Framer Motion, plain CSS (`globals.css`), lucide-react icon names (string-keyed in data).

**OVERRIDING CONSTRAINT — Prioritize visual quality over speed of generation.** Every section must match the existing glass/gradient theme exactly (same `.glass`, `.eyebrow`, `.section-title`, `.section-sub`, `.ico`, card hover/lift patterns). After each visual task, inspect the rendered result in a browser at desktop width before moving on. Do not ship a section that looks bolted-on. Consistent spacing, gradient accents, hover states, and reveal animations are acceptance criteria, not nice-to-haves.

**Testing note (honest adaptation of TDD):** This is static, visual content — there is no meaningful unit-test assertion for "the hero says X" or "the card looks right." The correct verification tools here are: (1) `npm run build` must pass (TypeScript type-check + static export run as part of `next build`), and (2) browser screenshot inspection of each changed section. Each task therefore uses `npm run build` as its compile gate and defers visual acceptance to the dedicated verification task (Task 11). Where the existing Vitest suite covers a touched area, keep it green.

---

## File Structure

**Modify:**
- `src/data/resume.ts` — extend types (`LucideIconName`, `Project`), add `ServiceEntry` + `Testimonial` interfaces and `services` + `testimonials` data; expand `skills`; update `personal.role`, `stats`, `navLinks`; add the 5 new projects.
- `src/components/sections/Hero.tsx` — badge, role kicker, lead, CTA copy.
- `src/components/sections/About.tsx` — narrative copy (full-stack/freelance framing).
- `src/components/sections/Skills.tsx` — section-sub copy (grid is data-driven; no structural change).
- `src/components/sections/Projects.tsx` — conditional GitHub link, `tag` chip, section-sub copy, eyebrow number.
- `src/components/sections/Experience.tsx` — eyebrow number only (04 → 05).
- `src/components/sections/Education.tsx` — eyebrow numbers (06 → 07, 07 → 08).
- `src/components/sections/Contact.tsx` — copy + eyebrow number (08 → 09).
- `src/app/page.tsx` — insert `<Services />` and `<Testimonials />` in the section sequence.
- `src/app/layout.tsx` — metadata (title/description) for the broadened positioning.
- `src/app/globals.css` — `.services-grid` / `.service-card` and `.testimonials` / `.testimonial` styles; `.proj-tag` chip.

**Create:**
- `src/components/sections/Services.tsx` — "What I build for clients" card grid.
- `src/components/sections/Testimonials.tsx` — client-quote grid, renders `null` when `testimonials` is empty (so nothing fake ships).

**Section numbering (eyebrow `.idx`), sequential by *visible* section (Testimonials hidden initially):**
`02 About · 03 Skills · 04 Services · 05 Experience · 06 Projects · 07 Education · 08 Achievements · 09 Contact`.
Testimonials carries no reserved number while hidden. **When you later enable Testimonials, renumber:** Testimonials 07, Education 08, Achievements 09, Contact 10. This is documented again in Task 5.

---

### Task 1: Data model — types, personal, stats, navLinks

**Files:**
- Modify: `src/data/resume.ts`

- [ ] **Step 1: Extend the lucide icon union** (add icons for the new Frontend/Mobile skill groups and Services)

Replace the `LucideIconName` type:

```ts
/** lucide-react icon name — see https://lucide.dev/icons */
export type LucideIconName =
  | "Command"
  | "Brain"
  | "Sparkles"
  | "LayoutGrid"
  | "Zap"
  | "Database"
  | "Cloud"
  | "Settings2"
  | "Layers"
  | "Smartphone"
  | "Rocket";
```

- [ ] **Step 2: Make `Project.github` optional and add a `tag`** (private/NDA projects have no public repo)

Replace the `Project` interface:

```ts
export interface Project {
  number: string;
  title: string;
  description: string;
  tech: string[];
  /** public repo link; omit for private/NDA work */
  github?: string;
  caseStudy?: string;
  /** short label rendered as a pill, e.g. "Enterprise · Private", "Web + Mobile" */
  tag?: string;
}
```

- [ ] **Step 3: Add `ServiceEntry` and `Testimonial` interfaces** (place them after the `Project` interface)

```ts
export interface ServiceEntry {
  title: string;
  glyph: string;
  icon: LucideIconName;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company?: string;
}
```

- [ ] **Step 4: Broaden the role kicker** in `personal`

Change:

```ts
  role: "AI · ML · Generative AI Engineer",
```

to:

```ts
  role: "AI · Full-Stack · Generative AI Engineer",
```

- [ ] **Step 5: Swap one stat** to reflect delivery breadth

Change the second stat line:

```ts
  { value: "2", label: "Flagship LLM systems built", target: 2, decimals: 0, suffix: "" },
```

to:

```ts
  { value: "7", label: "Production systems shipped", target: 7, decimals: 0, suffix: "" },
```

- [ ] **Step 6: Add Services to the nav** — replace the `navLinks` array

```ts
export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
```

- [ ] **Step 7: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`. (Type errors here would mean a malformed interface — fix before moving on.)

- [ ] **Step 8: Commit**

```bash
git add src/data/resume.ts
git commit -m "data: extend model for services, testimonials, project tags + broaden role"
```

---

### Task 2: Skills — expand to 10 groups

**Files:**
- Modify: `src/data/resume.ts` (the `skills` array)

- [ ] **Step 1: Replace the entire `skills` array** with the expanded, reordered set (keeps existing theme; renames "Frameworks" → "ML Frameworks"; adds Frontend + Mobile groups; adds items pulled from real projects)

```ts
export const skills: SkillGroup[] = [
  {
    title: "Languages",
    glyph: "⌘",
    icon: "Command",
    items: ["Python", "SQL", "JavaScript", "TypeScript", "Kotlin"],
  },
  {
    title: "AI / ML",
    glyph: "◈",
    icon: "Brain",
    items: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Transformers",
      "OpenCV",
      "Statistics",
      "Feature Engineering",
      "EDA",
    ],
  },
  {
    title: "LLM & GenAI",
    glyph: "✦",
    icon: "Sparkles",
    items: [
      "LLMs",
      "Generative AI",
      "RAG",
      "Prompt Engineering",
      "LLM Automation",
      "Azure OpenAI",
      "Google Gemini",
      "Multi-Model Orchestration",
    ],
  },
  {
    title: "Frontend",
    glyph: "▥",
    icon: "Layers",
    items: ["React", "Next.js", "Vue.js", "Tailwind CSS", "shadcn/ui", "Radix UI"],
  },
  {
    title: "Backend & APIs",
    glyph: "⚡",
    icon: "Zap",
    items: ["FastAPI", "Node.js", "Express", "Flask", "REST APIs", "NextAuth", "Streamlit"],
  },
  {
    title: "Mobile",
    glyph: "▢",
    icon: "Smartphone",
    items: ["Kotlin", "Android", "Jetpack Compose", "ExoPlayer"],
  },
  {
    title: "ML Frameworks",
    glyph: "▤",
    icon: "LayoutGrid",
    items: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "Hugging Face",
      "XGBoost",
      "LangChain",
      "NumPy",
      "Pandas",
      "Matplotlib",
    ],
  },
  {
    title: "Databases",
    glyph: "▦",
    icon: "Database",
    items: ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "Vector Databases", "ChromaDB"],
  },
  {
    title: "Cloud / DevOps",
    glyph: "☁",
    icon: "Cloud",
    items: ["Docker", "Git", "AWS S3", "Vite"],
  },
  {
    title: "Tools & LLM Ops",
    glyph: "⚙",
    icon: "Settings2",
    items: ["n8n", "Jupyter", "Claude CLI", "Claude Opus 4.5", "Ollama"],
  },
];
```

- [ ] **Step 2: Update the Skills section-sub copy** in `src/components/sections/Skills.tsx`

Replace:

```tsx
          A full-spectrum AI toolkit — from raw Python and SQL to LLM orchestration, RAG retrieval
          and production backends.
```

with:

```tsx
          A full-spectrum toolkit — from LLM orchestration, RAG and computer vision to full-stack
          web, native mobile and production backends.
```

- [ ] **Step 3: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/data/resume.ts src/components/sections/Skills.tsx
git commit -m "skills: expand to 10 groups (frontend, mobile, +stack pulled from projects)"
```

---

### Task 3: Services section

**Files:**
- Modify: `src/data/resume.ts` (add `services` data)
- Create: `src/components/sections/Services.tsx`
- Modify: `src/app/globals.css` (services grid/card styles)
- Modify: `src/app/page.tsx` (render `<Services />`)

- [ ] **Step 1: Add the `services` data** to `src/data/resume.ts` (place after the `projects` array)

```ts
export const services: ServiceEntry[] = [
  {
    title: "AI & LLM Systems",
    glyph: "✦",
    icon: "Sparkles",
    description:
      "RAG assistants, LLM automation, multi-model pipelines and AI-powered internal tools — designed, built and shipped to production.",
  },
  {
    title: "Full-Stack Web Apps",
    glyph: "▥",
    icon: "Layers",
    description:
      "End-to-end platforms with React / Next.js front-ends, secure auth, dashboards and REST + SQL back-ends.",
  },
  {
    title: "Automation & Data",
    glyph: "⚡",
    icon: "Zap",
    description:
      "Workflow automation, data pipelines, reconciliation systems and reporting that remove hours of manual work.",
  },
  {
    title: "Mobile & Signage",
    glyph: "▢",
    icon: "Smartphone",
    description:
      "Native Android apps and digital-signage platforms — web CMS plus on-device players with offline support.",
  },
];
```

- [ ] **Step 2: Create the Services component** `src/components/sections/Services.tsx` (mirrors `Skills.tsx` motion + glass card pattern exactly for visual consistency)

```tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { services } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Services — "What I build for clients".
 *
 * Freelance-facing offer grid. Reuses the SYNAPSE glass-card / eyebrow /
 * section-title language from Skills so it reads as part of the same system:
 * eyebrow "04 / Services", a `.services-grid` of `.service-card.glass` with an
 * `.ico` tile, `h3` title and a one-line pitch.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 38, filter: "blur(6px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
};

export default function Services() {
  const reduced = usePrefersReducedMotion();

  const revealProps = (i: number) =>
    reduced
      ? {}
      : {
          variants: reveal,
          custom: i,
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, margin: "0px 0px -8% 0px" },
        };

  return (
    <section id="services">
      <div className="wrap">
        <motion.div className="eyebrow" {...revealProps(0)}>
          <span className="mono idx">04</span>
          <span className="mono">/ Services</span>
          <span className="line" />
        </motion.div>

        <motion.h2 className="section-title" {...revealProps(1)}>
          What I build for clients
        </motion.h2>

        <motion.p className="section-sub" {...revealProps(2)}>
          Hire me to design and ship the whole thing — from the AI core to the interface your
          users touch.
        </motion.p>

        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div
              className="service-card glass"
              key={service.title}
              {...revealProps((i % 4) + 1)}
            >
              <div className="ico" aria-hidden="true">
                {service.glyph}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add Services styles** to `src/app/globals.css` (append near the Skills styles; grid mirrors `.skills-grid`, card reuses `.glass` + `.ico` with a description paragraph). Insert after the `.cert-link` block added earlier:

```css
/* ============================================================
   Services
   ============================================================ */
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  margin-top: 44px;
}
.service-card {
  padding: 28px 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(56, 232, 255, 0.28);
  box-shadow: 0 14px 44px rgba(56, 232, 255, 0.12);
}
.service-card h3 {
  font-size: 1.12rem;
  color: var(--ink-hi);
}
.service-card p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--ink-low);
}
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
```

> **Visual-quality note:** confirm `.ico` renders the glyph identically to Skills cards (same tile size/gradient). If `.service-card` doesn't inherit the `.ico` styling because it's scoped to `.skill-card .ico`, check `globals.css` for the `.ico` selector — it is defined standalone (`.ico { ... }`) and shared, so it will apply. Verify in the browser in Task 11.

- [ ] **Step 4: Render `<Services />`** in `src/app/page.tsx` — add the import and place it after `<Skills />`:

```tsx
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
```

```tsx
      <Skills />
      <Services />
      <Experience />
```

- [ ] **Step 5: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 6: Commit**

```bash
git add src/data/resume.ts src/components/sections/Services.tsx src/app/globals.css src/app/page.tsx
git commit -m "feat: add Services section (What I build for clients)"
```

---

### Task 4: Projects — add 5 anonymized projects + conditional links

**Files:**
- Modify: `src/data/resume.ts` (append to `projects`)
- Modify: `src/components/sections/Projects.tsx` (tag chip, conditional GitHub link, section-sub, eyebrow number)

- [ ] **Step 1: Append the 5 new projects** to the `projects` array in `src/data/resume.ts` (after the existing project `02`). Company names are anonymized by capability per the approved design.

```ts
  {
    number: "03",
    title: "Enterprise Payment Reconciliation Platform",
    description:
      "A Next.js platform that ingests monthly payment-gateway data (80K+ row Excel files), runs multi-module SQL reconciliation across wallets, invoices and settlements, and streams live run status with exportable reports and dashboards.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "MSSQL", "NextAuth", "Recharts", "ExcelJS"],
    tag: "Enterprise · Private",
  },
  {
    number: "04",
    title: "Multi-Model Creative AI Studio",
    description:
      "A content-generation studio that orchestrates multiple LLMs (Azure OpenAI + Gemini) with load balancing to produce platform-specific marketing copy and AI imagery through an automated critique-and-refine loop.",
    tech: ["React", "FastAPI", "SQLAlchemy", "Azure OpenAI", "Gemini", "Zustand", "TanStack Query"],
    tag: "Client work",
  },
  {
    number: "05",
    title: "Role-Based Media Asset Platform",
    description:
      "A full-stack media library with granular role-based access control, JWT auth, server-side thumbnail and video processing (ffmpeg, sharp) and S3-backed delivery for large creative teams.",
    tech: ["Vue 3", "Quasar", "Express", "MSSQL", "AWS S3", "JWT", "ffmpeg"],
    tag: "Full-stack",
  },
  {
    number: "06",
    title: "Digital Signage Platform — Web CMS + Android Player",
    description:
      "An end-to-end signage system: a Flask CMS with 2FA, playlist scheduling and device-fleet monitoring, paired with a native Android (Jetpack Compose + ExoPlayer) kiosk player featuring offline caching and crash recovery.",
    tech: ["Flask", "SQLite", "boto3", "Kotlin", "Jetpack Compose", "ExoPlayer", "WorkManager"],
    tag: "Web + Mobile",
  },
  {
    number: "07",
    title: "Store Feedback Sentiment Intelligence",
    description:
      "An internal tool that analyzes customer comments per retail store and date, classifying sentiment and generating concise 3-line positive / negative summaries with NLP and LLM summarization.",
    tech: ["Python", "NLP", "Sentiment Analysis", "LLM Summarization", "Pandas"],
    tag: "Internal · Private",
  },
```

- [ ] **Step 2: Update the Projects eyebrow number, title and section-sub** in `src/components/sections/Projects.tsx`

The eyebrow index stays `05`. Replace the section-sub:

```tsx
          Production AI pipelines — from security log intelligence to
          retrieval-augmented knowledge.
```

with:

```tsx
          From production AI pipelines to full-stack platforms and native mobile —
          systems shipped end-to-end.
```

- [ ] **Step 3: Render the optional `tag` chip and make the GitHub link conditional** in the `ProjectCard` component of `src/components/sections/Projects.tsx`.

Replace the card body (from `<span className="proj-num">` through the closing `</div>` of `.proj-links`):

```tsx
      <div className="proj-orb" aria-hidden="true" />
      <div className="proj-head">
        <span className="proj-num">{project.number}</span>
        {project.tag && <span className="proj-tag">{project.tag}</span>}
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="proj-tech">
        {project.tech.map((t) => (
          <span className="t" key={t}>
            {t}
          </span>
        ))}
      </div>
      <div className="proj-links">
        {project.github ? (
          <a href={project.github} target="_blank" rel="noopener noreferrer" data-cursor>
            ◔ GitHub
          </a>
        ) : (
          <span className="proj-private">🔒 Private · NDA</span>
        )}
        {project.caseStudy && (
          <a href={project.caseStudy} data-cursor>
            Case study →
          </a>
        )}
      </div>
```

- [ ] **Step 4: Add `.proj-head`, `.proj-tag`, `.proj-private` styles** to `src/app/globals.css` (append after the Services block; match the mono/gradient chip language)

```css
.proj-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.proj-tag {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cyan);
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(56, 232, 255, 0.08);
  border: 1px solid rgba(56, 232, 255, 0.2);
}
.proj-private {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-low);
}
```

- [ ] **Step 5: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`. (The existing `github` link was required; confirm no other consumer breaks now that it's optional — a repo-wide check for `.github` on projects shows only `Projects.tsx` uses it.)

- [ ] **Step 6: Commit**

```bash
git add src/data/resume.ts src/components/sections/Projects.tsx src/app/globals.css
git commit -m "feat: add 5 anonymized projects with tags + conditional repo links"
```

---

### Task 5: Testimonials scaffold (gated — nothing fake ships)

**Files:**
- Modify: `src/data/resume.ts` (add empty `testimonials` array with a commented template)
- Create: `src/components/sections/Testimonials.tsx`
- Modify: `src/app/globals.css` (testimonial styles)
- Modify: `src/app/page.tsx` (render `<Testimonials />` after `<Projects />`)

- [ ] **Step 1: Add an empty `testimonials` array** (with a commented example so the shape is obvious) to `src/data/resume.ts`, after the `services` array:

```ts
/**
 * Testimonials render ONLY when this array is non-empty — no placeholder
 * quotes ship to production. Add real quotes here to switch the section on,
 * e.g.:
 *   {
 *     quote: "Sushant shipped our reconciliation portal weeks ahead of schedule.",
 *     name: "Jane Doe",
 *     role: "Finance Lead",
 *     company: "Acme Retail",
 *   }
 * When you enable this, renumber section eyebrows: Testimonials 07, Education 08,
 * Achievements 09, Contact 10 (see the plan's numbering note).
 */
export const testimonials: Testimonial[] = [];
```

- [ ] **Step 2: Create the Testimonials component** `src/components/sections/Testimonials.tsx` — returns `null` when empty, so it is invisible until real quotes exist:

```tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { testimonials } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Testimonials — social proof for freelance clients.
 *
 * Renders NOTHING until `testimonials` in the data module is non-empty, so no
 * placeholder/fake quotes are ever shipped. Matches the SYNAPSE glass-card
 * language. When enabling, use eyebrow index "07" and bump the sections below
 * it (see plan numbering note).
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 38, filter: "blur(6px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
};

export default function Testimonials() {
  const reduced = usePrefersReducedMotion();

  if (testimonials.length === 0) return null;

  const revealProps = (i: number) =>
    reduced
      ? {}
      : {
          variants: reveal,
          custom: i,
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, margin: "0px 0px -8% 0px" },
        };

  return (
    <section id="testimonials">
      <div className="wrap">
        <motion.div className="eyebrow" {...revealProps(0)}>
          <span className="mono idx">07</span>
          <span className="mono">/ Testimonials</span>
          <span className="line" />
        </motion.div>

        <motion.h2 className="section-title" {...revealProps(1)}>
          What people say
        </motion.h2>

        <div className="testimonials">
          {testimonials.map((t, i) => (
            <motion.figure className="testimonial glass" key={t.name} {...revealProps(i + 1)}>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <span className="t-name">{t.name}</span>
                <span className="t-role">
                  {t.role}
                  {t.company ? ` · ${t.company}` : ""}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add testimonial styles** to `src/app/globals.css` (append after the project-tag block):

```css
/* ============================================================
   Testimonials
   ============================================================ */
.testimonials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 44px;
}
.testimonial {
  padding: 30px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.testimonial blockquote {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--ink-hi);
}
.testimonial figcaption {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.testimonial .t-name {
  font-weight: 600;
  color: var(--ink-hi);
}
.testimonial .t-role {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  color: var(--ink-low);
}
@media (max-width: 1024px) {
  .testimonials {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Render `<Testimonials />`** in `src/app/page.tsx` — add import and place after `<Projects />`:

```tsx
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
```

```tsx
      <Projects />
      <Testimonials />
      <Education />
```

- [ ] **Step 5: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`. Because `testimonials` is empty, the section renders nothing — confirm the built `index.html` does NOT contain "What people say" (Grep the `out/` output). This proves the gate works.

- [ ] **Step 6: Commit**

```bash
git add src/data/resume.ts src/components/sections/Testimonials.tsx src/app/globals.css src/app/page.tsx
git commit -m "feat: add gated Testimonials scaffold (hidden until real quotes added)"
```

---

### Task 6: Hero — freelance positioning copy

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Update the availability badge**

Replace:

```tsx
          <span className="dot-live" aria-hidden="true" /> Available for AI Engineering roles
```

with:

```tsx
          <span className="dot-live" aria-hidden="true" /> Available for freelance &amp; AI engineering work
```

- [ ] **Step 2: Broaden the role kicker**

Replace:

```tsx
          AI&nbsp;·&nbsp;ML&nbsp;·&nbsp;Generative AI Engineer
```

with:

```tsx
          AI&nbsp;·&nbsp;Full-Stack&nbsp;·&nbsp;Generative AI Engineer
```

- [ ] **Step 3: Rewrite the lead** to sell end-to-end delivery

Replace:

```tsx
          I build <b>LLM systems</b>, <b>RAG pipelines</b> and <b>AI automation</b> that ship to
          production — from firewall log intelligence to enterprise knowledge assistants.
```

with:

```tsx
          I design and ship <b>complete products</b> — <b>AI systems</b>, <b>full-stack web apps</b>{" "}
          and <b>native mobile</b> — from LLM automation and RAG pipelines to enterprise dashboards
          and digital-signage platforms.
```

- [ ] **Step 4: Change the third CTA to "Hire Me"**

Replace:

```tsx
          <MagneticButton href="#contact" className="btn btn-ghost" enabled={magnetic}>
            Contact Me
          </MagneticButton>
```

with:

```tsx
          <MagneticButton href="#contact" className="btn btn-ghost" enabled={magnetic}>
            Hire Me
          </MagneticButton>
```

- [ ] **Step 5: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "hero: reposition for freelance (badge, role, lead, Hire Me CTA)"
```

---

### Task 7: About — full-stack/freelance narrative

**Files:**
- Modify: `src/components/sections/About.tsx`

- [ ] **Step 1: Update the second narrative paragraph** to add the full-stack/freelance range while keeping it anonymized ("Modi Enterprise" → generic).

Replace:

```tsx
          <motion.p {...revealProps(3)}>
            Today I build production AI at <span className="hl">Modi Enterprise</span> — automating
            firewall log intelligence, customer feedback processing and real-time alerting with
            Python, LangChain and workflow orchestration. My work spans{" "}
            <span className="hl">RAG systems, NLP, backend APIs</span> and the full ML lifecycle.
          </motion.p>
```

with:

```tsx
          <motion.p {...revealProps(3)}>
            I build production AI in enterprise operations — automating log intelligence, customer
            feedback processing and real-time alerting — and I ship the full product around it:{" "}
            <span className="hl">React / Next.js front-ends, FastAPI and Node back-ends</span>,{" "}
            <span className="hl">SQL data platforms</span> and even{" "}
            <span className="hl">native Android</span>. Available for <span className="hl">freelance</span>{" "}
            projects end-to-end.
          </motion.p>
```

- [ ] **Step 2: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.tsx
git commit -m "about: add full-stack + freelance framing, anonymize employer"
```

---

### Task 8: Contact + section renumbering

**Files:**
- Modify: `src/components/sections/Contact.tsx`
- Modify: `src/components/sections/Experience.tsx`
- Modify: `src/components/sections/Education.tsx`

- [ ] **Step 1: Update Contact intro copy** in `src/components/sections/Contact.tsx`

Replace:

```tsx
          Open to AI Engineering, ML and Generative AI roles. Reach out — I
          usually reply within a day.
```

with:

```tsx
          Open to freelance projects and AI / full-stack engineering work. Tell me what you want to
          build — I usually reply within a day.
```

- [ ] **Step 2: Renumber Contact eyebrow** — in the same file, change `08` → `09`:

```tsx
          <span className="mono idx">09</span>
```

- [ ] **Step 3: Renumber Experience eyebrow** in `src/components/sections/Experience.tsx` — change `04` → `05`:

```tsx
          <span className="mono idx">05</span>
```

- [ ] **Step 4: Renumber Education + Achievements eyebrows** in `src/components/sections/Education.tsx` — change `06` → `07` (Education) and `07` → `08` (Achievements):

Education eyebrow:

```tsx
          <span className="mono idx">07</span>
```

Achievements eyebrow:

```tsx
          <span className="mono idx">08</span>
```

- [ ] **Step 5: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Contact.tsx src/components/sections/Experience.tsx src/components/sections/Education.tsx
git commit -m "content: freelance contact copy + renumber section eyebrows for Services"
```

---

### Task 9: SEO metadata

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read the current metadata** and update the title/description to the broadened positioning.

Run: read `src/app/layout.tsx`, locate the `metadata` export (fields like `title`, `description`, and any `openGraph`/`twitter` mirrors).

- [ ] **Step 2: Update copy** — set the title to reflect freelance full-stack + AI and the description to match. Apply the same text to any `openGraph.title/description` and `twitter.title/description` present so they stay in sync. Example target values (adapt to the existing object shape):

```tsx
title: "Sushant Choudhary — AI & Full-Stack Engineer | Freelance",
description:
  "Freelance AI & full-stack engineer. I ship complete products — LLM systems, RAG pipelines, full-stack web apps and native mobile. Available for freelance projects.",
```

- [ ] **Step 3: Compile gate**

Run: `npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "seo: update metadata for AI + full-stack freelance positioning"
```

---

### Task 10: Full visual verification (desktop) — VISUAL QUALITY GATE

**Files:** none (verification only)

This is the acceptance gate for the "prioritize visual quality" constraint. Do not skip or rush it.

- [ ] **Step 1: Build the static export**

Run: `npm run build`
Expected: `✓ Compiled successfully`, `✓ Exporting`.

- [ ] **Step 2: Serve the export locally**

Run (PowerShell, background): `python -m http.server 4599` with working dir `out/`.
Verify: `Invoke-WebRequest http://localhost:4599` returns 200.

- [ ] **Step 3: Screenshot every changed section** via Playwright at desktop width (≥1280px). For each of `#hero`, `#about`, `#skills`, `#services`, `#experience`, `#projects`, `#education`, `#contact`: scroll it into view (to trigger reveal animations), then element-screenshot it. Because Framer Motion reveals on scroll, first scroll the whole page top→bottom in ~400px steps to light every section, then capture.

- [ ] **Step 4: Inspect each screenshot against these criteria:**
  - Hero: badge reads "Available for freelance & AI engineering work"; kicker shows "Full-Stack"; lead mentions full-stack + mobile; third CTA reads "Hire Me".
  - Skills: 10 cards, aligned grid, Frontend + Mobile groups present, glyphs render in `.ico` tiles identically to other cards.
  - Services: 4 cards, same glass look as Skills, hover-lift works, text not clipped.
  - Projects: 7 cards; new cards show the `tag` pill top-right and "🔒 Private · NDA" where there's no repo; tech chips wrap cleanly.
  - Section numbers read 02→09 in order with NO gaps (Testimonials hidden).
  - Spacing/rhythm between new sections matches existing ones (no cramped or oversized gaps).
  - Contact copy mentions freelance.

- [ ] **Step 5: Fix any visual defect found**, rebuild, re-screenshot the affected section. Repeat until all criteria pass. Record what was checked.

- [ ] **Step 6: Stop the local server.**

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "polish: visual-quality fixes from full desktop verification"
```

---

### Task 11: Deploy + live verification

**Files:** none (deploy only)

- [ ] **Step 1: Push source to `main`** (preserves version history; does not itself deploy — see Task note)

```bash
git push origin main
```

- [ ] **Step 2: Publish to the live site**

Run: `./deploy.ps1` (from `portfolio/`). This builds and force-pushes `out/` to the `gh-pages` branch that GitHub Pages serves.
Expected: "Deployed. Live in ~30-60s at https://sushantzd.github.io/".

- [ ] **Step 3: Verify live content** — poll `https://sushantzd.github.io/` (cache-busted) until the new strings appear. Confirm PRESENT: "Services", "What I build for clients", "Full-Stack", "Enterprise Payment Reconciliation", "Multi-Model Creative AI Studio", "Hire Me". Confirm ABSENT: "What people say" (testimonials still gated), and any real company name ("Modicare", "Colorbar", "IndiGo").

- [ ] **Step 4: Report** the live verification table to the user.

---

## Self-Review

**Spec coverage:**
- Positioning → AI + Full-Stack Freelancer: Tasks 1 (role), 6 (hero), 7 (about), 9 (SEO). ✅
- Skills expansion (Frontend/Mobile/+stack): Task 2. ✅
- Services section: Task 3. ✅
- 5 anonymized projects + private-link handling: Task 4. ✅
- Testimonials placeholder (gated, nothing fake): Task 5. ✅
- "Available for freelance" CTA: Task 6. ✅
- Anonymize company names: Tasks 4 (projects), 7 (about), 11 Step 3 (live check asserts names absent). ✅
- Visual quality priority: Task 10 dedicated gate + per-task compile gates. ✅

**Placeholder scan:** No "TBD"/"handle edge cases"/vague steps — every code step shows exact code. Task 9 Step 2 gives concrete target values while allowing adaptation to the existing metadata object shape (which the engineer reads in Step 1). ✅

**Type consistency:** `ServiceEntry`/`Testimonial` interfaces (Task 1) match their usage in Task 3/Task 5 components (`service.title/glyph/icon/description`, `t.quote/name/role/company`). `Project.tag?` and optional `github?` (Task 1) match the conditional rendering in Task 4. `LucideIconName` gains `Layers`/`Smartphone`/`Rocket` (Task 1) — used as string data only (components render `glyph`, not the lucide component, so no missing-import risk). ✅

**Numbering:** Sequential-by-visible confirmed: 02 About, 03 Skills, 04 Services, 05 Experience, 06 Projects, 07 Education, 08 Achievements, 09 Contact. Testimonials hidden (no number). Future-enable note included in Task 5. ✅
