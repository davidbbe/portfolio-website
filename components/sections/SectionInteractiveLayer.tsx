"use client";

import { useSceneState } from "@/context/scene-state-context";
import { SECTION_ORDER } from "@/lib/scene/sceneConfig";
import { useEffect, useMemo, useRef } from "react";
import type { SectionSlug } from "@/lib/scene/types";

const sectionTone: Record<SectionSlug, { scale: number; hue: number; blend: string }> = {
  hero: { scale: 1.2, hue: 210, blend: "screen" },
  mission: { scale: 1.08, hue: 190, blend: "lighten" },
  process: { scale: 1.25, hue: 255, blend: "screen" },
  outcomes: { scale: 1.03, hue: 152, blend: "plus-lighter" },
  testimonials: { scale: 0.95, hue: 25, blend: "lighten" },
  team: { scale: 1.06, hue: 300, blend: "screen" },
  faq: { scale: 0.98, hue: 220, blend: "lighten" },
  contact: { scale: 1.11, hue: 350, blend: "screen" },
};

export default function SectionInteractiveLayer() {
  const { activeSection } = useSceneState();
  const dotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const tone = useMemo(() => sectionTone[activeSection], [activeSection]);

  useEffect(() => {
    const finePointer =
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || prefersReducedMotion) {
      if (dotRef.current) {
        dotRef.current.style.opacity = "0";
      }
      return;
    }

    const onMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const loop = () => {
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${mouseRef.current.x - 60}px, ${mouseRef.current.y - 60}px, 0) scale(${tone.scale})`;
        dot.style.filter = `hue-rotate(${tone.hue}deg)`;
        dot.style.mixBlendMode = tone.blend as CSSStyleDeclaration["mixBlendMode"];
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [tone]);

  return (
    <div className="section-interactive-layer" aria-hidden="true">
      <div ref={dotRef} className="mouse-dot" />
      <ol className="section-index">
        {SECTION_ORDER.map((slug) => (
          <li key={slug} className={slug === activeSection ? "is-active" : ""}>
            {slug}
          </li>
        ))}
      </ol>
    </div>
  );
}
