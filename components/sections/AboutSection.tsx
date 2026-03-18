"use client";

import RevealText from "./shared/RevealText";

export default function AboutSection() {
  return (
    <section id="about" data-scene-section="about" className="creative-section">
      <p data-reveal className="eyebrow">
        About
      </p>
      <RevealText as="h2" className="section-title">
        Strategy-led UI engineering with a design-first mindset.
      </RevealText>
      <RevealText as="p" className="section-copy">
        Over ten years, I have partnered with startups and established brands to
        build polished web products that balance performance, scalability, and
        expressive motion.
      </RevealText>
      <div data-reveal className="interactive-card interactive-card--parallax">
        <span>Section interaction: subtle card parallax</span>
      </div>
    </section>
  );
}
