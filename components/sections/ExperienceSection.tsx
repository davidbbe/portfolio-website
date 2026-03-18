"use client";

import RevealText from "./shared/RevealText";

const timeline = [
  {
    range: "2023 - Present",
    role: "Independent Product Engineer",
    detail: "Building full-stack experiments and animation-forward marketing sites.",
  },
  {
    range: "2018 - Present",
    role: "Frontend Engineer",
    detail: "Delivering high-impact interfaces under long-term client partnerships.",
  },
  {
    range: "2013 - 2018",
    role: "Frontend Developer",
    detail: "Crafting Shopify and WordPress themes for high-traffic media brands.",
  },
];

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      data-scene-section="experience"
      className="creative-section"
    >
      <p data-reveal className="eyebrow">
        Experience
      </p>
      <RevealText as="h2" className="section-title">
        A decade of shipping digital products across teams and industries.
      </RevealText>
      <div className="timeline-list">
        {timeline.map((item) => (
          <article key={item.range} data-reveal className="timeline-item">
            <p>{item.range}</p>
            <h3>{item.role}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
