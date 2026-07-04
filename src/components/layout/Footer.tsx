import { personal } from "@/data/resume";

/**
 * Footer — SYNAPSE site footer.
 *
 * Visual parity target: prototype.html's `<footer>` — a top-bordered band with
 * a mono copyright line ("© 2026 …· BUILT WITH INTELLIGENCE") on the left and
 * "SYNAPSE · AI ENGINEER PORTFOLIO" on the right. Purely presentational, so it
 * stays a server component.
 */
export default function Footer() {
  return (
    <footer>
      <div className="row">
        <p className="mono">
          © 2026 {personal.name.toUpperCase()} · BUILT WITH INTELLIGENCE
        </p>
        <p className="mono">SYNAPSE · AI ENGINEER PORTFOLIO</p>
      </div>
    </footer>
  );
}
