"use client";

import { useRef } from "react";
import { useSceneScrollDriver } from "@/hooks/useSceneScrollDriver";
import { useSectionScrollTriggers } from "@/hooks/useSectionScrollTriggers";
import HeroSection from "./sections/HeroSection";
import AboutMeSection from "./sections/AboutMeSection";
import ProjectsSection from "./sections/ProjectsSection";
import FaqSection from "./sections/FaqSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";
import SectionInteractiveLayer from "./sections/SectionInteractiveLayer";
import HeroDotfieldLayer from "./sections/HeroDotfieldLayer";

export default function CreativePortfolioPage() {
  const mainRef = useRef<HTMLElement>(null);
  useSceneScrollDriver({ scopeRef: mainRef });
  useSectionScrollTriggers({ scopeRef: mainRef });

  return (
    <>
      <HeroDotfieldLayer />
      <SectionInteractiveLayer />
      <main ref={mainRef} className="creative-main">
        <HeroSection />
        <AboutMeSection />
        <ProjectsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <FooterSection />
    </>
  );
}
