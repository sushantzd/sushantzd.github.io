"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion, useDeviceTier, type DeviceTier } from "@/lib/hooks";

/**
 * NeuralField — the hero's animated neural network.
 *
 * A faithful 2D <canvas> port of the prototype's neural-network IIFE
 * (prototype.html, ~lines 573–663). Deliberately NOT three.js: a plain
 * canvas keeps the static export lightweight and holds 60fps everywhere.
 *
 * Behaviour ported 1:1 from the prototype:
 *  - drifting nodes that bounce off the hero bounds
 *  - links drawn between nodes within LINK distance, opacity ∝ closeness
 *  - glowing node dots (cyan bloom via shadowBlur)
 *  - ~6 pulses that hop between nearby nodes, colour-cycling per segment
 *  - mouse repulsion within 140px + a bright cyan cursor node
 *  - dpr capped at 2, canvas sized to the hero element
 *
 * Production hardening added on top of the prototype:
 *  - node/link counts scale by device tier (fewer on mobile / weak CPUs)
 *  - reduced-motion → one static frame, no rAF loop
 *  - IntersectionObserver pauses the loop when the hero scrolls offscreen
 *  - full cleanup (cancel rAF, disconnect observers, remove listeners)
 *  - no per-frame allocation in the hot loop
 *
 * The canvas is purely decorative → aria-hidden, pointer-events:none.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Pulse {
  a: Node;
  b: Node | null;
  t: number;
  speed: number;
}

/** Per-tier node count + link radius. Mirrors the prototype's width buckets
 *  (42 / 70 / 100 nodes, 120 / 150 link) but keyed off the device tier so
 *  weak CPUs also get the lighter graph, not just narrow viewports. */
function tuning(tier: DeviceTier): { count: number; link: number } {
  switch (tier) {
    case "low":
      return { count: 42, link: 120 };
    case "mid":
      return { count: 70, link: 150 };
    default:
      return { count: 100, link: 150 };
  }
}

const COLORS = ["46,107,255", "56,232,255", "138,107,255"] as const;

export default function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const tier = useDeviceTier();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // SSR / non-DOM guard (component is client-only, but be defensive).
    if (typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The canvas is absolutely positioned to fill the hero; size to the hero.
    const host = canvas.parentElement as HTMLElement | null;
    const sizeTarget = host ?? canvas;

    const { count: COUNT, link: LINK } = tuning(tier);

    let W = 0;
    let H = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    const mouse = { x: -999, y: -999 };
    let rafId = 0;
    let running = false;

    function spawnPulse(): Pulse {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      return { a, b: null, t: Math.random(), speed: Math.random() * 0.006 + 0.003 };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = sizeTarget.clientWidth;
      H = sizeTarget.clientHeight;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      nodes = [];
      for (let i = 0; i < COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.7 + 1,
        });
      }
      pulses = [];
      for (let i = 0; i < 6; i++) pulses.push(spawnPulse());
    }

    /** One full frame of the graph. `animate` toggles the moving parts so the
     *  same routine renders the reduced-motion static frame (links + nodes). */
    function render(animate: boolean) {
      const c = ctx!;
      c.clearRect(0, 0, W, H);

      // Nodes: integrate motion, bounce, mouse repulsion — then draw links.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (animate) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          const md = Math.hypot(mdx, mdy);
          if (md < 140 && md > 0) {
            n.x += (mdx / md) * 0.6;
            n.y += (mdy / md) * 0.6;
          }
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const o = (1 - d / LINK) * 0.5;
            c.strokeStyle = `rgba(120,160,255,${o})`;
            c.lineWidth = 0.6;
            c.beginPath();
            c.moveTo(n.x, n.y);
            c.lineTo(m.x, m.y);
            c.stroke();
          }
        }
      }

      // Node dots with cyan bloom.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        c.beginPath();
        c.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        c.fillStyle = "rgba(200,220,255,.85)";
        c.shadowBlur = 10;
        c.shadowColor = "rgba(56,232,255,.7)";
        c.fill();
        c.shadowBlur = 0;
      }

      if (!animate) return;

      // Bright cursor node.
      if (mouse.x > 0) {
        c.beginPath();
        c.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        c.fillStyle = "rgba(56,232,255,1)";
        c.shadowBlur = 18;
        c.shadowColor = "rgba(56,232,255,1)";
        c.fill();
        c.shadowBlur = 0;
      }

      // Pulses hopping between near nodes, colour-cycling along each segment.
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        if (!p.b || p.t >= 1) {
          let best: Node | null = null;
          let bd = 1e9;
          for (let k = 0; k < nodes.length; k++) {
            const m = nodes[k];
            if (m === p.a) continue;
            const d = Math.hypot(m.x - p.a.x, m.y - p.a.y);
            if (d < LINK && d < bd) {
              bd = d;
              best = m;
            }
          }
          if (best) {
            p.b = best;
            p.t = 0;
          } else {
            // No neighbour in range → respawn on a fresh node.
            const fresh = spawnPulse();
            p.a = fresh.a;
            p.b = fresh.b;
            p.t = fresh.t;
            p.speed = fresh.speed;
            continue;
          }
        }
        p.t += p.speed;
        const b = p.b!;
        const x = p.a.x + (b.x - p.a.x) * p.t;
        const y = p.a.y + (b.y - p.a.y) * p.t;
        const col = COLORS[Math.floor(p.t * 3) % 3];
        c.beginPath();
        c.arc(x, y, 2.4, 0, Math.PI * 2);
        c.fillStyle = `rgba(${col},1)`;
        c.shadowBlur = 14;
        c.shadowColor = `rgba(${col},1)`;
        c.fill();
        c.shadowBlur = 0;
        if (p.t >= 1) {
          p.a = b;
          p.b = null;
        }
      }
    }

    function loop() {
      render(true);
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    // Mouse tracking relative to the hero.
    const onMove = (e: MouseEvent) => {
      const rect = sizeTarget.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    // Resize: re-measure + re-seed (matches prototype's resize→init).
    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        init();
        if (reduced) render(false);
      });
    };

    resize();
    init();

    if (reduced) {
      // Single static frame — no rAF, no interaction.
      render(false);
      return () => {
        window.removeEventListener("resize", onResize);
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
      };
    }

    sizeTarget.addEventListener("mousemove", onMove);
    sizeTarget.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize, { passive: true });

    // Pause when the hero is offscreen to save battery.
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting ?? true;
          if (visible) start();
          else stop();
        },
        { threshold: 0 }
      );
      io.observe(sizeTarget);
    } else {
      start();
    }

    // Pause when the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      sizeTarget.removeEventListener("mousemove", onMove);
      sizeTarget.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, [reduced, tier]);

  return <canvas ref={canvasRef} id="neural-canvas" aria-hidden="true" />;
}
