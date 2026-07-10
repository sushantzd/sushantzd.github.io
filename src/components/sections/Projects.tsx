"use client";

import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { projects } from "@/data/resume";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/hooks";

/**
 * Projects — SYNAPSE "Selected Work".
 *
 * Visual parity target: prototype.html's `#projects` (eyebrow
 * "05 / Selected Work", title "Systems I've built", `.section-sub`, then a
 * `.proj-grid` of `.proj-card.glass` with `.proj-orb` glow, `.proj-num`, `h3`
 * title, description, `.proj-tech`/`.t` chips and `.proj-links`).
 *
 * Motion:
 *  - staggered scroll reveal for the header + cards (Framer Motion
 *    `whileInView`, viewport once)
 *  - mouse-tracking 3D tilt (perspective rotateX/rotateY toward the cursor +
 *    a translateY lift), ported from the prototype's `.tilt` handler.
 *    Disabled under reduced motion / on coarse (touch) pointers.
 *  - under reduced motion everything renders fully visible with no tilt
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

export default function Projects() {
  const reduced = usePrefersReducedMotion();
  // Only tilt on devices with a fine pointer (mouse/trackpad), never on touch.
  const finePointer = useMediaQuery("(pointer: fine)");
  const tiltEnabled = finePointer && !reduced;

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
    <section id="projects">
      <div className="wrap">
        <motion.div className="eyebrow" {...revealProps(0)}>
          <span className="mono idx">05</span>
          <span className="mono">/ Selected Work</span>
          <span className="line" />
        </motion.div>

        <motion.h2 className="section-title" {...revealProps(1)}>
          Systems I&apos;ve built
        </motion.h2>

        <motion.p className="section-sub" {...revealProps(2)}>
          From production AI pipelines to full-stack platforms and native mobile —
          systems shipped end-to-end.
        </motion.p>

        <div className="proj-grid">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.number}
              project={project}
              tiltEnabled={tiltEnabled}
              revealProps={revealProps(i + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: (typeof projects)[number];
  tiltEnabled: boolean;
  revealProps: Record<string, unknown>;
}

function ProjectCard({ project, tiltEnabled, revealProps }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!tiltEnabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${
      -py * 7
    }deg) translateY(-4px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <motion.article
      ref={ref}
      className="proj-card glass"
      data-cursor
      onMouseMove={tiltEnabled ? handleMove : undefined}
      onMouseLeave={tiltEnabled ? handleLeave : undefined}
      {...revealProps}
    >
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
    </motion.article>
  );
}
