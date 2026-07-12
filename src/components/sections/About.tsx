"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { stats } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * About — the SYNAPSE narrative section.
 *
 * Visual parity target: prototype.html's `#about` (two-column `.about-grid`,
 * eyebrow "02 / About", two-line title, two narrative paragraphs and the
 * 4-card `.stats` grid with animated count-up numbers).
 *
 * Motion:
 *  - staggered scroll reveal replacing the prototype's `.reveal`/`.d1..d3`
 *    (Framer Motion `whileInView`, viewport once)
 *  - `.stat .num` counts up from 0 → `stat.target` when scrolled into view,
 *    honouring `decimals` and `suffix`
 *  - under reduced motion the reveals render fully visible and the counters
 *    show their final value immediately
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

export default function About() {
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

  const motionProps = (variants: Variants) =>
    reduced
      ? {}
      : {
          variants,
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, margin: "0px 0px -8% 0px" },
        };

  return (
    <section id="about">
      <div className="wrap about-grid">
        <div className="about-body">
          <motion.div className="eyebrow" {...revealProps(0)}>
            <span className="mono idx">02</span>
            <span className="mono">/ About</span>
            <span className="line" />
          </motion.div>

          <motion.h2 className="section-title" {...revealProps(1)}>
            Engineering intelligence into
            <br />
            real-world systems.
          </motion.h2>

          <motion.p {...revealProps(2)}>
            I&apos;m an <span className="hl">AI Automation Engineer</span> with a foundation in
            Electronics &amp; Communication Engineering and honors in{" "}
            <span className="hl">Artificial Intelligence &amp; Machine Learning</span>. I design and
            deploy LLM-powered pipelines that turn raw operational data into decisions.
          </motion.p>

          <motion.p {...revealProps(3)}>
            I build production AI in enterprise operations — automating log intelligence, customer
            feedback processing and real-time alerting — and I ship the full product around it:{" "}
            <span className="hl">React / Next.js front-ends, FastAPI and Node back-ends</span>,{" "}
            <span className="hl">SQL data platforms</span> and{" "}
            <span className="hl">reporting dashboards</span>. Available for{" "}
            <span className="hl">freelance</span> projects end-to-end.
          </motion.p>
        </div>

        <div className="about-aside">
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

          <motion.div className="stats" {...revealProps(2)}>
            {stats.map((stat) => (
              <div className="stat glass" key={stat.label}>
                <StatNumber
                  target={stat.target}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  reduced={reduced}
                />
                <div className="lbl">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface StatNumberProps {
  target: number;
  decimals: number;
  suffix: string;
  reduced: boolean;
}

/**
 * Animated count-up mirroring the prototype's stat counter: eases from 0 to
 * `target` over 1.4s (cubic ease-out) when scrolled into view, then appends
 * the suffix. Under reduced motion it renders the final value immediately.
 */
function StatNumber({ target, decimals, suffix, reduced }: StatNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const finalText = target.toFixed(decimals) + suffix;
  const [text, setText] = useState(() => (reduced ? finalText : (0).toFixed(decimals)));

  useEffect(() => {
    if (reduced) {
      setText(finalText);
      return;
    }
    if (!inView) return;

    let raf = 0;
    let t0: number | null = null;
    const dur = 1400;

    const step = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setText((target * e).toFixed(decimals) + (p === 1 ? suffix : ""));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, decimals, suffix, finalText]);

  return (
    <div className="num grad-text" ref={ref}>
      {text}
    </div>
  );
}
