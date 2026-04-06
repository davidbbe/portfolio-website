"use client";

import RevealText from "./shared/RevealText";
import ProjectsMarquee from "./ProjectsMarquee";

export default function ProjectsSection() {
  return (
    <div className="projects-wrapper">
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
      </section>
      <ProjectsMarquee />
    </div>
  );
}
