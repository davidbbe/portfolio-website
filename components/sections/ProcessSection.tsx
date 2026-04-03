"use client";

import RevealText from "./shared/RevealText";
import { processSteps } from "@/lib/content/sections";

export default function ProcessSection() {
  return (
    <section
      id="process"
      data-scene-section="process"
      data-reveal-variant="softReveal"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">
        ourPROCESS
      </p>
      <RevealText as="h2" className="section-title">
        A clearer path from strategy to scale.
      </RevealText>
      <div className="process-list">
        {processSteps.map((item) => (
          <article key={item.step} className="process-item" data-reveal>
            <span className="process-item__step">{item.step}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
