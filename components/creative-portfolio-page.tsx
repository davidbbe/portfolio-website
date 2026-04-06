"use client";

import { useRef } from "react";
import { useSectionScrollTriggers } from "@/hooks/useSectionScrollTriggers";
import HeroSection from "./sections/HeroSection";
import AboutMeSection from "./sections/AboutMeSection";
import ProjectsSection from "./sections/ProjectsSection";
import FaqSection from "./sections/FaqSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";
import SectionInteractiveLayer from "./sections/SectionInteractiveLayer";

export default function CreativePortfolioPage() {
  const mainRef = useRef<HTMLElement>(null);
  useSectionScrollTriggers({ scopeRef: mainRef });

  return (
    <>
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
