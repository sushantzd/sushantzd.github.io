"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, personal } from "@/data/resume";

/**
 * Fixed glass navbar. Gains a `.scrolled` state past 40px of scroll.
 * On >900px the links render inline; below that a hamburger toggles a
 * slide-in glass panel animated with framer-motion.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <nav className={scrolled ? "nav scrolled" : "nav"}>
      <a href="#hero" className="brand" data-cursor onClick={closeMenu}>
        <span className="mark">SC</span> {personal.name}
      </a>

      {/* Desktop links (inline flex ≥901px; hidden ≤900px via CSS) */}
      <div className="nav-links" data-desktop>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} data-cursor>
            {link.label}
          </a>
        ))}
        <a href={personal.resumeUrl} className="btn-nav" data-cursor download>
          Résumé ↓
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          style={
            open
              ? { transform: "translateY(7px) rotate(45deg)" }
              : undefined
          }
        />
        <span style={open ? { opacity: 0 } : undefined} />
        <span
          style={
            open
              ? { transform: "translateY(-7px) rotate(-45deg)" }
              : undefined
          }
        />
      </button>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1001,
                background: "rgba(5,6,11,.55)",
                backdropFilter: "blur(2px)",
              }}
              aria-hidden="true"
            />
            <motion.div
              className="nav-links open"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
              style={{ zIndex: 1002 }}
            >
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} data-cursor onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
              <a
                href={personal.resumeUrl}
                className="btn-nav"
                data-cursor
                download
                onClick={closeMenu}
              >
                Résumé ↓
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
