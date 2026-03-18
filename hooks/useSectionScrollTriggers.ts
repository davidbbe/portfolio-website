"use client";

import { useEffect } from "react";
import { useSceneState } from "@/context/scene-state-context";
import { SCROLL_TRIGGER_DEFAULTS } from "@/lib/scene/sceneConfig";
import type { SectionSlug } from "@/lib/scene/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type UseSectionScrollTriggersParams = {
  scopeRef: React.RefObject<HTMLElement>;
};

export function useSectionScrollTriggers({
  scopeRef,
}: UseSectionScrollTriggersParams) {
  const { setActiveSection } = useSceneState();

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) {
      return;
    }

    const sections = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-scene-section]")
    );

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const sectionSlug = section.dataset.sceneSection as SectionSlug | undefined;

        if (!sectionSlug) {
          return;
        }

        const revealItems = section.querySelectorAll<HTMLElement>("[data-reveal]");

        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: SCROLL_TRIGGER_DEFAULTS.start,
            end: SCROLL_TRIGGER_DEFAULTS.end,
            onEnter: () => setActiveSection(sectionSlug),
            onEnterBack: () => setActiveSection(sectionSlug),
          },
        });

        if (revealItems.length > 0) {
          revealTl.fromTo(
            revealItems,
            {
              autoAlpha: 0,
              yPercent: 20,
              skewY: 5,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              skewY: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
            }
          );
        }
      });
    }, scopeRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [scopeRef, setActiveSection]);
}
