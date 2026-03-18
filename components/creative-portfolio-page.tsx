"use client";

import { useRef } from "react";
import { useSectionScrollTriggers } from "@/hooks/useSectionScrollTriggers";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ContactSection from "./sections/ContactSection";
import SectionInteractiveLayer from "./sections/SectionInteractiveLayer";

export default function CreativePortfolioPage() {
  const mainRef = useRef<HTMLElement>(null);
  useSectionScrollTriggers({ scopeRef: mainRef });

  return (
    <>
      <SectionInteractiveLayer />
      <main ref={mainRef} className="creative-main">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </>
  );
}
