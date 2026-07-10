"use client";

import { motion, type Variants } from "framer-motion";
import { skills } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Skills — the SYNAPSE capability grid.
 *
 * Visual parity target: prototype.html's `#skills` (eyebrow "03 / Capabilities",
 * title "The stack behind the systems", `.section-sub`, then a `.skills-grid`
 * of 8 `.skill-card.glass`, each with an `.ico` tile, `h3` group title and
 * `.chips`/`.chip` per item). The hover lift/glow lives in globals.css.
 *
 * Motion:
 *  - staggered scroll reveal replacing the prototype's `.reveal`/`.d1..d3`
 *    across the header + cards (Framer Motion `whileInView`, viewport once)
 *  - under reduced motion everything renders fully visible
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

export default function Skills() {
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
    <section id="skills">
      <div className="wrap">
        <motion.div className="eyebrow" {...revealProps(0)}>
          <span className="mono idx">03</span>
          <span className="mono">/ Capabilities</span>
          <span className="line" />
        </motion.div>

        <motion.h2 className="section-title" {...revealProps(1)}>
          The stack behind the systems
        </motion.h2>

        <motion.p className="section-sub" {...revealProps(2)}>
          A full-spectrum toolkit — from LLM orchestration, RAG and computer vision to full-stack
          web, data platforms and production backends.
        </motion.p>

        <div className="skills-grid">
          {skills.map((group, i) => (
            <motion.div
              className="skill-card glass"
              key={group.title}
              {...revealProps((i % 4) + 1)}
            >
              <div className="ico" aria-hidden="true">
                {group.glyph}
              </div>
              <h3>{group.title}</h3>
              <div className="chips">
                {group.items.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
