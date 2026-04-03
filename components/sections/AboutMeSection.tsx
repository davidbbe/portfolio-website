"use client";

import RevealText from "./shared/RevealText";
import { aboutMe } from "@/lib/content/sections";

export default function AboutMeSection() {
  return (
    <section
      id="about"
      data-scene-section="about"
      data-reveal-variant="staggered"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">
        About Me
      </p>
      <RevealText as="h2" className="section-title">
        Strategy-led UI engineering with a design-first mindset.
      </RevealText>
      <p data-reveal className="section-copy">
        I have partnered with startups and established brands to build polished
        web products that balance performance, scalability, and expressive
        motion. The majority of my work has been working with startups and
        early-stage companies. This has given me a deep understanding of the
        challenges and opportunities that come with building products for
        early-stage companies. These challenges typically include a need for
        quick iteration, a focus on user experience, and sometimes a need to to
        wear many hats that a developer typically doesn't have to wear.
      </p>
      <p data-reveal className="section-copy">
        I enjoy the problem-solving aspect of building products. My core stack
        is React, Next.js, TypeScript, Node.js, Prisma, and PostgreSQL. I am
        also familiar with Gatsby.js, WordPress theme development, Shopify theme
        & app development. I am always looking to learn new technologies and
        stay up to date with the latest trends in the industry.
      </p>
      <div className="service-grid">
        {aboutMe.map((feature) => (
          <article key={feature.title} className="service-card" data-reveal>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
