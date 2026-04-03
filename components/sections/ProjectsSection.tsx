"use client";

import RevealText from "./shared/RevealText";
import { projects } from "@/lib/content/sections";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      data-scene-section="projects"
      data-reveal-variant="softReveal"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">
        Projects
      </p>
      <RevealText as="h2" className="section-title">
        A collection of my work.
      </RevealText>
      <div className="projects-list">
        {projects.map((item) => (
          <article key={item.step} className="projects-item" data-reveal>
            <span className="projects-item__step">{item.step}</span>
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
