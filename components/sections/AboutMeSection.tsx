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
        Full-stack developer with over 10 years of experience.
      </RevealText>
      <RevealText as="p" className="section-copy">
        I help brands & businesses develop, test, deploy, and monitor web-based
        applications. My specialties include building interactive user
        interfaces and working hand in hand with designers to bring mockups and
        concept designs to life. Over the years I have done this in frameworks
        like Next.js, Gatsby.js, WordPress, and Shopify.
      </RevealText>
      <RevealText as="p" className="section-copy">
        My favorite part of programming is the problem-solving aspect. I really
        enjoy the feeling of finally figuring out a solution to a problem. My
        core stack is React, Next.js, TypeScript, Node.js, Prisma, and
        PostgreSQL. I am also familiar with Gatsby.js, WordPress theme
        development, Shopify theme & app development. I am always looking to
        learn new technologies.
      </RevealText>
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
