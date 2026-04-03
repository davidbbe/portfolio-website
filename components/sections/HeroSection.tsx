"use client";

import RevealText from "./shared/RevealText";
import { heroSection } from "@/lib/content/influint-sections";

export default function HeroSection() {
  return (
    <section
      id="hero"
      data-scene-section="hero"
      data-reveal-variant="hero"
      className="creative-section creative-section--hero"
    >
      <p data-reveal className="eyebrow eyebrow--caps">
        {heroSection.eyebrow}
      </p>
      <RevealText as="h1" className="hero-title">
        {heroSection.title}
      </RevealText>
      <RevealText as="p" className="section-copy">
        {heroSection.supportingCopy}
      </RevealText>
      <div data-reveal className="hero-cta-row">
        <a href="#contact" className="creative-btn creative-btn--solid">
          {heroSection.ctas[0].label}
        </a>
        <a href={heroSection.ctas[1].href} className="creative-btn creative-btn--ghost">
          {heroSection.ctas[1].label}
        </a>
      </div>
    </section>
  );
}
