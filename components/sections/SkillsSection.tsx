"use client";

import RevealText from "./shared/RevealText";

const skillPills = [
  "React / Next.js",
  "Three.js / R3F",
  "GSAP / ScrollTrigger",
  "Design systems",
  "Performance budgets",
  "Headless CMS",
];

export default function SkillsSection() {
  return (
    <section id="skills" data-scene-section="skills" className="creative-section">
      <p data-reveal className="eyebrow">
        Capabilities
      </p>
      <RevealText as="h2" className="section-title">
        End-to-end frontend craft for bold digital products.
      </RevealText>
      <div className="pill-grid">
        {skillPills.map((skill) => (
          <span key={skill} data-reveal className="skill-pill">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
