"use client";

import { teamMembers } from "@/lib/content/influint-sections";

export default function TeamSection() {
  return (
    <section
      id="team"
      data-scene-section="team"
      data-reveal-variant="staggered"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">people</p>
      <h2 data-reveal className="section-title">
        The team supporting your growth.
      </h2>
      <div className="team-list">
        {teamMembers.map((member) => (
          <span key={member} data-reveal className="team-chip">
            {member}
          </span>
        ))}
      </div>
    </section>
  );
}
