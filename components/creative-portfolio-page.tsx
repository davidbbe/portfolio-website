"use client";

import { useRef } from "react";
import { useSectionScrollTriggers } from "@/hooks/useSectionScrollTriggers";
import HeroSection from "./sections/HeroSection";
import MissionSection from "./sections/MissionSection";
import ProcessSection from "./sections/ProcessSection";
import OutcomesSection from "./sections/OutcomesSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import TeamSection from "./sections/TeamSection";
import FaqSection from "./sections/FaqSection";
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
        <MissionSection />
        <ProcessSection />
        <OutcomesSection />
        <TestimonialsSection />
        <TeamSection />
        <FaqSection />
        <ContactSection />
      </main>
    </>
  );
}
