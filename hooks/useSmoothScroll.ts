"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      return;
    }

    const isTouch = window.matchMedia("(max-width: 768px)").matches;
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: isTouch ? 1.15 : 1.5,
    });

    lenisInstance = lenis;

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onRaf);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance = null;
      lenis.destroy();
      gsap.ticker.remove(onRaf);
    };
  }, []);
}
