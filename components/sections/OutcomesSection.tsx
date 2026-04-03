"use client";

import RevealText from "./shared/RevealText";
import { outcomeMetrics, outcomeWords } from "@/lib/content/sections";

export default function OutcomesSection() {
  return (
    <section
      id="outcomes"
      data-scene-section="outcomes"
      data-reveal-variant="staggered"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">
        What you unlock with support
      </p>
      <RevealText as="h2" className="section-title">
        The roadmap + support you need to grow.
      </RevealText>
      <div className="outcome-panels" data-reveal>
        <p className="outcome-copy">A focused operating model can unlock:</p>
        <div className="outcome-word-cloud">
          {outcomeWords.map((word) => (
            <span key={word} className="outcome-word">
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className="metric-grid">
        {outcomeMetrics.map((metric) => (
          <article key={metric.label} className="metric-card" data-reveal>
            <p className="metric-card__value">{metric.value}</p>
            <p className="metric-card__label">{metric.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
