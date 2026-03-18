"use client";

import { useSceneState } from "@/context/scene-state-context";
import { SECTION_ORDER } from "@/lib/scene/sceneConfig";
import { useEffect, useMemo, useRef } from "react";
import type { SectionSlug } from "@/lib/scene/types";

const sectionTone: Record<SectionSlug, { scale: number; hue: number; blend: string }> = {
  hero: { scale: 1.2, hue: 210, blend: "screen" },
  about: { scale: 0.9, hue: 190, blend: "lighten" },
  projects: { scale: 1.4, hue: 240, blend: "screen" },
  skills: { scale: 1.1, hue: 160, blend: "plus-lighter" },
  experience: { scale: 0.8, hue: 30, blend: "lighten" },
  contact: { scale: 1, hue: 350, blend: "screen" },
};

export default function SectionInteractiveLayer() {
  const { activeSection } = useSceneState();
  const dotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const tone = useMemo(() => sectionTone[activeSection], [activeSection]);

  useEffect(() => {
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
