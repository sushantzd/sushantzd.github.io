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
              <blockquote>"{t.quote}"</blockquote>
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
