"use client";

import { useSceneState } from "@/context/scene-state-context";
import { DEFAULT_SECTION } from "@/lib/scene/sceneConfig";
import {
  dominantSectionIndex,
  orderedSceneSections,
  scrollAlongForLerp,
} from "@/lib/scene/scrollAlong";
import type { SectionSlug } from "@/lib/scene/types";
import { useEffect, useRef } from "react";

type Params = {
  scopeRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
};

/**
 * Drives `scrollAlongRef` from scroll position (viewport center vs section centers)
 * and keeps `activeSection` aligned to the nearest section (nav / mouse profile).
 */
export function useSceneScrollDriver({
  scopeRef,
  enabled = true,
}: Params) {
  const { setActiveSection, scrollAlongRef } = useSceneState();
  const lastSlugRef = useRef<SectionSlug>(DEFAULT_SECTION);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const tick = () => {
      const scope = scopeRef.current;
      if (!scope) {
        return;
      }

      const elems = orderedSceneSections(scope);
      if (elems.length === 0) {
        return;
      }

      const scrollY = window.scrollY;
      const viewportCenterY = scrollY + window.innerHeight * 0.5;
      const centers = elems.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + scrollY + r.height / 2;
      });

      const along = scrollAlongForLerp(viewportCenterY, centers);
      scrollAlongRef.current = along;

      const domIdx = dominantSectionIndex(viewportCenterY, centers);
      const slug = elems[domIdx]?.dataset.sceneSection as SectionSlug | undefined;
      if (slug && slug !== lastSlugRef.current) {
        lastSlugRef.current = slug;
        setActiveSection(slug);
      }
    };

    const schedule = () => {
      if (rafRef.current) {
        return;
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        tick();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    tick();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [enabled, scopeRef, setActiveSection, scrollAlongRef]);
}
