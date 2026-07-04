import { personal } from "@/data/resume";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";

/**
 * FOUNDATION home page.
 *
 * Real sections (canvas neural field + hero, about, skills, experience,
 * projects, education, contact) are built in later tasks. For now each
 * section id is present as a titled placeholder so the page compiles,
 * scrolls, and the Navbar anchors resolve. The section wrappers and ids
 * MUST stay stable — later tasks swap the inner contents in place.
 *
 * Section ids are kept in sync with `navLinks` in `@/data/resume`.
 */

interface PlaceholderSection {
  id: string;
  /** two-digit index mirroring the prototype's eyebrow numbering */
  idx: string;
  /** eyebrow label, e.g. "/ About" */
  eyebrow: string;
  title: string;
  sub: string;
}

const sections: PlaceholderSection[] = [
  {
    id: "projects",
    idx: "05",
    eyebrow: "/ Selected Work",
    title: "Systems I've built",
    sub: "Projects section — built in a later task.",
  },
  {
    id: "education",
    idx: "06",
    eyebrow: "/ Education",
    title: "Academic foundation",
    sub: "Education & achievements — built in a later task.",
  },
  {
    id: "contact",
    idx: "08",
    eyebrow: "/ Contact",
    title: "Let's build intelligent systems together.",
    sub: "Contact section — built in a later task.",
  },
];

function Placeholder({ id, idx, eyebrow, title, sub }: PlaceholderSection) {
  return (
    <section id={id}>
      <div className="wrap">
        <div className="eyebrow">
          <span className="mono idx">{idx}</span>
          <span className="mono">{eyebrow}</span>
          <span className="line" />
        </div>
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">{sub}</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero — canvas neural field + animated intro. Keeps id="hero"
          so the Navbar brand anchor and scroll targets resolve. */}
      <Hero />

      {/* Real content sections (replacing their former placeholders). */}
      <About />
      <Skills />
      <Experience />

      {/* Remaining sections are still titled placeholders (owned by later
          tasks); their ids stay stable so Navbar anchors keep resolving. */}
      {sections.map((s) => (
        <Placeholder key={s.id} {...s} />
      ))}

      <footer>
        <div className="row">
          <p className="mono">© 2026 {personal.name.toUpperCase()} · BUILT WITH INTELLIGENCE</p>
          <p className="mono">SYNAPSE · AI ENGINEER PORTFOLIO</p>
        </div>
      </footer>
    </main>
  );
}
