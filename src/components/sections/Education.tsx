"use client";

import { motion, type Variants } from "framer-motion";
import { education, achievements } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Education + Achievements — SYNAPSE "Academic foundation".
 *
 * Visual parity target: prototype.html's `#education` (eyebrow "06 / Education",
 * title "Academic foundation", `.edu-grid` of `.edu-card.glass` — `.yr` pill,
 * `h3` title, `.deg` institution, `.meta`). Then, INSIDE the same section, the
 * Achievements block: eyebrow "07 / Achievements" + a `.certs` grid of
 * `.cert.glass` (each a `.badge` glyph, `h4` title, `p` org). This mirrors the
 * prototype exactly, where Achievements live at the bottom of Education.
 *
 * Motion:
 *  - staggered scroll reveal for headers + cards (Framer Motion `whileInView`,
 *    viewport once); under reduced motion everything renders fully visible.
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

export default function Education() {
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
    <section id="education">
      <div className="wrap">
        <motion.div className="eyebrow" {...revealProps(0)}>
          <span className="mono idx">06</span>
          <span className="mono">/ Education</span>
          <span className="line" />
        </motion.div>

        <motion.h2 className="section-title" {...revealProps(1)}>
          Academic foundation
        </motion.h2>

        <div className="edu-grid" style={{ marginTop: 40 }}>
          {education.map((entry, i) => (
            <motion.div
              key={entry.title}
              className="edu-card glass"
              {...revealProps(i + 1)}
            >
              <span className="yr">{entry.years}</span>
              <h3>{entry.title}</h3>
              <div className="deg">{entry.institution}</div>
              <div className="meta">{entry.meta}</div>
            </motion.div>
          ))}
        </div>

        {/* Achievements — rendered inside Education, matching the prototype. */}
        <motion.div
          className="eyebrow"
          style={{ marginTop: 70 }}
          {...revealProps(0)}
        >
          <span className="mono idx">07</span>
          <span className="mono">/ Achievements</span>
          <span className="line" />
        </motion.div>

        <div className="certs">
          {achievements.map((cert, i) => (
            <motion.div
              key={cert.title}
              className="cert glass"
              {...revealProps(i + 1)}
            >
              <div className="badge" aria-hidden="true">
                {cert.glyph}
              </div>
              <div>
                <h4>{cert.title}</h4>
                <p>{cert.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
