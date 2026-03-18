"use client";

import RevealText from "./shared/RevealText";

const placeholders = [
  "Immersive product launch site",
  "Realtime data dashboard concept",
  "Narrative brand microsite",
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      data-scene-section="projects"
      className="creative-section"
    >
      <p data-reveal className="eyebrow">
        Selected Work
      </p>
      <RevealText as="h2" className="section-title">
        Placeholder case studies ready for your real assets.
      </RevealText>
      <div className="project-grid">
        {placeholders.map((item) => (
          <article key={item} data-reveal className="project-card">
            <div className="project-thumb" />
            <h3>{item}</h3>
            <p>Swap image, icon, and copy from your content source.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
