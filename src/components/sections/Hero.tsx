"use client";

import { useRef, type MouseEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { personal } from "@/data/resume";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/hooks";
import NeuralField from "@/components/three/NeuralField";

/**
 * Hero — the SYNAPSE landing section.
 *
 * Visual parity target: prototype.html's `#hero` (badge, mono role kicker,
 * two-line name with "Choudhary" in the tri-gradient, lead with bolded key
 * phrases, three CTAs, scroll cue). The neural field lives behind it.
 *
 * Motion:
 *  - staggered load-in reveal replacing the prototype's `[data-load]` 1→5
 *    sequence (Framer Motion, container stagger + child fade/blur/rise)
 *  - "magnetic" CTA hover: the button translates toward the cursor within a
 *    radius, springing back on leave
 *  - both are disabled under reduced motion (children render fully visible,
 *    magnetic handlers no-op)
 */

// Prototype timings: load delays .15 / .30 / .45 / .60 / .75s, 1s ease.
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const magnetic = fine && !reduced;

  return (
    <section id="hero" className="hero">
      <NeuralField />
      <div className="hero-glow" aria-hidden="true" />

      <motion.div
        className="hero-content"
        variants={container}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "show"}
      >
        <motion.span className="hero-badge" variants={reduced ? undefined : item}>
          <span className="dot-live" aria-hidden="true" /> Available for freelance &amp; AI engineering work
        </motion.span>

        <motion.span className="role" variants={reduced ? undefined : item}>
          AI&nbsp;·&nbsp;Full-Stack&nbsp;·&nbsp;Generative AI Engineer
        </motion.span>

        <motion.h1 variants={reduced ? undefined : item}>
          Sushant
          <br />
          <span className="grad-tri-text">Choudhary</span>
        </motion.h1>

        <motion.p className="lead" variants={reduced ? undefined : item}>
          I design and ship <b>complete products</b> — <b>AI systems</b>, <b>full-stack web apps</b>{" "}
          and <b>native mobile</b> — from LLM automation and RAG pipelines to enterprise dashboards
          and digital-signage platforms.
        </motion.p>

        <motion.div className="cta-row" variants={reduced ? undefined : item}>
          <MagneticButton href="#projects" className="btn btn-primary" enabled={magnetic}>
            View Projects →
          </MagneticButton>
          <MagneticButton
            href={personal.resumeUrl}
            className="btn btn-ghost"
            enabled={magnetic}
            download
          >
            Download Résumé ↓
          </MagneticButton>
          <MagneticButton href="#contact" className="btn btn-ghost" enabled={magnetic}>
            Hire Me
          </MagneticButton>
        </motion.div>
      </motion.div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <div className="rail" />
      </div>
    </section>
  );
}

interface MagneticButtonProps {
  href: string;
  className: string;
  children: React.ReactNode;
  enabled: boolean;
  download?: boolean;
}

/**
 * Anchor CTA with the prototype's magnetic pull (translate .3x/.4y of the
 * cursor offset from centre) via a spring, springing home on leave. When
 * `enabled` is false (touch / reduced motion) it renders a plain, static link.
 */
function MagneticButton({ href, className, children, enabled, download }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
  };

  const onLeave = () => {
    if (!enabled) return;
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      data-cursor
      download={download}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </a>
  );
}
