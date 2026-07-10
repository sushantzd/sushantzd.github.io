"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { experience } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Experience — the SYNAPSE timeline.
 *
 * Visual parity target: prototype.html's `#experience` (eyebrow
 * "04 / Experience", title "A track record of shipping", `.section-sub`, then
 * a `.timeline` with glowing spine + node dots and a `.tl-item` per role:
 * role + `.tl-co` company, `.tl-date` period, mono location line, optional
 * group pills (`.tl-group`>`.g`) and the `.tl-list` bullets).
 *
 * Motion:
 *  - staggered scroll reveal for the header + items (Framer Motion
 *    `whileInView`, viewport once)
 *  - each item's node dot lights (`.tl-item.in`) when it scrolls into view,
 *    mirroring the prototype's IntersectionObserver
 *  - under reduced motion everything renders fully visible and every node is
 *    lit immediately
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

export default function Experience() {
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
    <section id="experience">
      <div className="wrap">
        <motion.div className="eyebrow" {...revealProps(0)}>
          <span className="mono idx">05</span>
          <span className="mono">/ Experience</span>
          <span className="line" />
        </motion.div>

        <motion.h2 className="section-title" {...revealProps(1)}>
          A track record of shipping
        </motion.h2>

        <motion.p className="section-sub" {...revealProps(2)}>
          From SQL foundations to production LLM automation across enterprise operations.
        </motion.p>

        <div className="timeline">
          {experience.map((entry, i) => (
            <TimelineItem
              key={`${entry.company}-${entry.role}`}
              entry={entry}
              reduced={reduced}
              revealProps={revealProps((i % 3) + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TimelineItemProps {
  entry: (typeof experience)[number];
  reduced: boolean;
  revealProps: Record<string, unknown>;
}

function TimelineItem({ entry, reduced, revealProps }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  // Under reduced motion the IntersectionObserver never fires a transition,
  // so light the node immediately for a correct static state.
  const lit = reduced || inView;

  return (
    <motion.div ref={ref} className={`tl-item${lit ? " in" : ""}`} {...revealProps}>
      <div className="tl-top">
        <span className="tl-role">
          {entry.role} <span className="tl-co">· {entry.company}</span>
        </span>
        <span className="tl-date">{entry.period}</span>
      </div>

      <div className="mono tl-loc">{entry.location}</div>

      {entry.group && entry.group.length > 0 && (
        <div className="tl-group">
          {entry.group.map((g) => (
            <span className="g" key={g}>
              {g}
            </span>
          ))}
        </div>
      )}

      <ul className="tl-list" style={entry.group ? undefined : { marginTop: "12px" }}>
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </motion.div>
  );
}
