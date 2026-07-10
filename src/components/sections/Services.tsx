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
