"use client";

import RevealText from "./shared/RevealText";
import { missionFeatures } from "@/lib/content/influint-sections";

export default function MissionSection() {
  return (
    <section
      id="mission"
      data-scene-section="mission"
      data-reveal-variant="staggered"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">Our Mission.</p>
      <RevealText as="h2" className="section-title">
        Transform your passion into profit.
      </RevealText>
      <RevealText as="p" className="section-copy">
        Like so many creator partners, we turn potential into momentum with clear systems and practical execution.
      </RevealText>
      <div className="service-grid">
        {missionFeatures.map((feature) => (
          <article key={feature.title} className="service-card" data-reveal>
            <p className="service-card__tag">{feature.variant}</p>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
