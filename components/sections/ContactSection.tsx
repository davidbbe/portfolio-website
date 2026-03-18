"use client";

import RevealText from "./shared/RevealText";

export default function ContactSection() {
  return (
    <section
      id="contact"
      data-scene-section="contact"
      className="creative-section creative-section--contact"
    >
      <p data-reveal className="eyebrow">
        Contact
      </p>
      <RevealText as="h2" className="section-title">
        Let us turn your product story into a premium web experience.
      </RevealText>
      <RevealText as="p" className="section-copy">
        Send over your goals, timeline, and references. I can scope the right
        interaction model and technical architecture for launch.
      </RevealText>
      <a data-reveal className="creative-btn" href="mailto:hello@example.com">
        hello@example.com
      </a>
    </section>
  );
}
