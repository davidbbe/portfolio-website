"use client";

import RevealText from "./shared/RevealText";

export default function HeroSection() {
  return (
    <section
      id="hero"
      data-scene-section="hero"
      className="creative-section creative-section--hero"
    >
      <p data-reveal className="eyebrow">
        Creative Developer / Frontend Engineer
      </p>
      <RevealText as="h1" className="hero-title">
        Building premium web experiences with motion, depth, and clarity.
      </RevealText>
      <RevealText as="p" className="section-copy">
        I design and ship conversion-focused interfaces that blend robust
        engineering with high-end visual direction.
      </RevealText>
      <div data-reveal className="hero-cta-row">
        <a href="#projects" className="creative-btn">
          View selected work
        </a>
        <a href="#contact" className="creative-btn creative-btn--ghost">
          Start a project
        </a>
      </div>
    </section>
  );
}
