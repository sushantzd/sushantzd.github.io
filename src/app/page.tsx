import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

/**
 * SYNAPSE home page.
 *
 * Renders the full section sequence — canvas neural field + hero, about,
 * skills, experience, projects, education (with achievements), contact — then
 * the footer. Section ids (`projects`, `education`, `contact`, …) are kept in
 * sync with `navLinks` in `@/data/resume` so the Navbar anchors resolve.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}
