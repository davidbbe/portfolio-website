"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "./shared/RevealText";
import BrandIcon from "./shared/BrandIcon";
import { aboutMe } from "@/lib/content/sections";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMeSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const cards = grid.querySelectorAll<HTMLElement>(".service-card");

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        const brandItems =
          card.querySelectorAll<HTMLElement>(".brand-list__item");

        if (brandItems.length === 0) return;

        gsap.set(brandItems, { autoAlpha: 0, y: 18, scale: 0.92 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(brandItems, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.07,
              ease: "power2.out",
            });
          },
        });
      });
    }, grid);

    return () => ctx.revert();
  }, []);

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
      <div className="service-grid" ref={gridRef}>
        {aboutMe.map((category) => (
          <article key={category.title} className="service-card" data-reveal>
            <h3>{category.title}</h3>
            <ul className="brand-list">
              {category.brands.map((brand) => (
                <li key={brand.name} className="brand-list__item">
                  <BrandIcon iconKey={brand.icon} name={brand.name} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
