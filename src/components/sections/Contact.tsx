"use client";

import { useState, type FormEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { personal } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Contact — SYNAPSE closing section with a working Web3Forms contact form.
 *
 * Visual parity target: prototype.html's `#contact` (centered eyebrow
 * "08 / Contact", big `.contact-inner h2` with the `.grad-tri-text` span, the
 * `.sub`, and the `.socials`/`.social` pills + `.contact-glow`). On top of the
 * prototype we add a premium glass contact form that POSTs to Web3Forms.
 *
 * Form:
 *  - fields: name, email, message + hidden access_key / subject / from_name +
 *    the Web3Forms honeypot field `botcheck`
 *  - POSTs JSON to https://api.web3forms.com/submit
 *  - states: idle | submitting | success | error, surfaced via an
 *    `aria-live="polite"` status region
 *  - client validation (required + email format), inline `aria-invalid`
 *  - access key from `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (inlined at build for
 *    static export); falls back to a placeholder literal when unset
 *
 * Motion:
 *  - staggered scroll reveal (Framer Motion `whileInView`, viewport once);
 *    under reduced motion everything renders fully visible.
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

const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

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

  const validate = (name: string, email: string, message: string) => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email.";
    if (!message.trim()) next.message = "Please enter a message.";
    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — a value here means a bot filled the hidden field; drop it
    // silently (pretend success so the bot gets no signal).
    if (data.get("botcheck")) {
      setStatus("success");
      form.reset();
      return;
    }

    const name = (data.get("name") as string) ?? "";
    const email = (data.get("email") as string) ?? "";
    const message = (data.get("message") as string) ?? "";

    const fieldErrors = validate(name, email, message);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const payload = {
      access_key: ACCESS_KEY,
      subject: "New message from SYNAPSE portfolio",
      from_name: "SYNAPSE Portfolio",
      name,
      email,
      message,
      botcheck: "",
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus("success");
        setErrors({});
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  return (
    <section id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-inner wrap">
        <motion.div
          className="eyebrow"
          style={{ justifyContent: "center" }}
          {...revealProps(0)}
        >
          <span className="mono idx">09</span>
          <span className="mono">/ Contact</span>
        </motion.div>

        <motion.h2 {...revealProps(1)}>
          Let&apos;s build{" "}
          <span className="grad-tri-text">intelligent systems</span> together.
        </motion.h2>

        <motion.p className="sub" {...revealProps(2)}>
          Open to freelance projects and AI / full-stack engineering work. Tell me what you want to
          build — I usually reply within a day.
        </motion.p>

        <motion.form
          className="contact-form glass"
          onSubmit={handleSubmit}
          noValidate
          {...revealProps(3)}
        >
          {/* Honeypot — hidden from users, catches bots */}
          <input
            type="checkbox"
            name="botcheck"
            className="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "err-name" : undefined}
            />
            {errors.name && (
              <span className="err" id="err-name">
                {errors.name}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "err-email" : undefined}
            />
            {errors.email && (
              <span className="err" id="err-email">
                {errors.email}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Tell me about the role or project…"
              required
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "err-message" : undefined}
            />
            {errors.message && (
              <span className="err" id="err-message">
                {errors.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary form-submit"
            data-cursor
            disabled={submitting}
          >
            {submitting ? "Sending…" : "✦ Send message"}
          </button>

          <p
            className={`form-status${
              status === "success" ? " success" : status === "error" ? " error" : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {status === "success" && "Thanks — I'll reply within a day."}
            {status === "error" &&
              (Object.keys(errors).length > 0
                ? "Please fix the highlighted fields."
                : "Something went wrong. Please try again or email me directly.")}
          </p>
        </motion.form>

        <motion.div className="socials" {...revealProps(3)}>
          <a
            href={personal.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social"
            data-cursor
          >
            in · LinkedIn ↗
          </a>
          <a
            href={personal.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="social"
            data-cursor
          >
            ◔ GitHub ↗
          </a>
          <a
            href={personal.socials.hackerrank}
            target="_blank"
            rel="noopener noreferrer"
            className="social"
            data-cursor
          >
            ⌁ HackerRank ↗
          </a>
          <a href={`mailto:${personal.email}`} className="social" data-cursor>
            ✉ Email ↗
          </a>
          <a href={personal.resumeUrl} className="social" data-cursor download>
            ↓ Résumé
          </a>
        </motion.div>
      </div>
    </section>
  );
}
