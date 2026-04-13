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
    setActiveSection("hero");
    const scope = scopeRef.current;
    if (!scope) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
    gsap.set(scope.querySelectorAll("[data-reveal]"), { autoAlpha: 1, y: 0, skewY: 0 });

    if (prefersReducedMotion) {
      scope.querySelectorAll<HTMLElement>("[data-scene-section]").forEach((section) => {
        const slug = section.dataset.sceneSection;
        if (slug) {
          setActiveSection(slug as SectionSlug);
        }
      });

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
        const variant = section.dataset.revealVariant ?? "hero";
        const revealConfig =
          variant === "staggered"
            ? {
              yPercent: 28,
              skewY: 5,
              duration: 1,
              ease: "power3.out",
              stagger: 0.08,
            }
            : variant === "softReveal"
              ? {
                yPercent: 16,
                skewY: 2,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.055,
              }
              : {
                yPercent: 22,
                skewY: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0,
              };

        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: SCROLL_TRIGGER_DEFAULTS.start,
            end: SCROLL_TRIGGER_DEFAULTS.end,
            scrub: variant === "hero" || isMobileViewport ? false : 0.35,
          },
        });

        if (revealItems.length > 0) {
          revealTl.fromTo(
            revealItems,
            {
              autoAlpha: 0,
              yPercent: revealConfig.yPercent,
              skewY: revealConfig.skewY,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              skewY: 0,
              duration: revealConfig.duration,
              stagger: revealConfig.stagger,
              ease: revealConfig.ease,
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
