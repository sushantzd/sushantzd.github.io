import { personal } from "@/data/resume";

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
    id: "about",
    idx: "02",
    eyebrow: "/ About",
    title: "Engineering intelligence into real-world systems.",
    sub: "About section — built in a later task.",
  },
  {
    id: "skills",
    idx: "03",
    eyebrow: "/ Capabilities",
    title: "The stack behind the systems",
    sub: "Skills section — built in a later task.",
  },
  {
    id: "experience",
    idx: "04",
    eyebrow: "/ Experience",
    title: "A track record of shipping",
    sub: "Experience timeline — built in a later task.",
  },
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
      {/* Hero — replaced by the canvas neural field + Hero component next task.
          Kept full-height and dark so the foundation already looks intentional. */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "120px",
        }}
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="mono idx">01</span>
            <span className="mono">/ Intro</span>
            <span className="line" />
          </div>
          <span className="mono" style={{ display: "block", color: "var(--cyan)", marginBottom: "18px" }}>
            {personal.role}
          </span>
          <h1 style={{ fontSize: "clamp(3.2rem,10vw,8.4rem)", letterSpacing: "-.035em" }}>
            Sushant
            <br />
            <span className="grad-tri-text">Choudhary</span>
          </h1>
          <p className="section-sub" style={{ marginTop: "26px" }}>
            {personal.tagline}
          </p>
        </div>
      </section>

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
