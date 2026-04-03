"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { heroSection } from "@/lib/content/sections";

const CREATOR_AVATARS = [
  "/images/creator-1.png",
  "/images/creator-2.png",
  "/images/creator-3.png",
  "/images/creator-4.png",
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const nav = section.querySelector<HTMLElement>("[data-hero-nav]");
    const h1Lines = section.querySelectorAll<HTMLElement>("[data-hero-line]");
    const subLines = section.querySelectorAll<HTMLElement>(
      "[data-hero-sub-line]",
    );
    const avatars = section.querySelector<HTMLElement>("[data-hero-avatars]");
    const trust = section.querySelector<HTMLElement>("[data-hero-trust]");
    const cta = section.querySelector<HTMLElement>("[data-hero-cta]");

    if (prefersReduced) {
      [nav, avatars, trust, cta].forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      h1Lines.forEach((el) => {
        el.style.transform = "translateY(0)";
      });
      subLines.forEach((el) => {
        el.style.transform = "translateY(0)";
      });
      return;
    }

    gsap.set(nav, { opacity: 0, y: -20 });
    gsap.set(h1Lines, { yPercent: 110 });
    gsap.set(subLines, { yPercent: 110 });
    gsap.set(avatars, { opacity: 0, scale: 0.8 });
    gsap.set(trust, { yPercent: 110 });
    gsap.set(cta, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.3,
    });

    tl.to(nav, { opacity: 1, y: 0, duration: 0.8 })
      .to(h1Lines[0], { yPercent: 0, duration: 1.1, ease: "power4.out" }, 0.4)
      .to(h1Lines[1], { yPercent: 0, duration: 1.1, ease: "power4.out" }, 0.55)
      .to(
        subLines,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.75,
      )
      .to(
        avatars,
        { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)" },
        1.0,
      )
      .to(trust, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 1.1)
      .to(cta, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.25);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-scene-section="hero"
      data-reveal-variant="hero"
      className="creative-hero"
    >
      <nav data-hero-nav className="creative-hero__nav">
        <a href="/" className="creative-hero__logo" aria-label="home">
          <Image
            src="/images/site-logo.svg"
            alt="Site logo"
            width={90}
            height={24}
            priority
          />
        </a>
        <a
          href="#testimonials"
          className="creative-hero__nav-icon"
          aria-label="clients"
        >
          <Image
            src="/images/site-icon.svg"
            alt=""
            width={28}
            height={28}
            priority
          />
        </a>
      </nav>

      <div className="creative-hero__content">
        <div className="creative-hero__headings">
          <h1 className="creative-hero__heading">
            <span className="creative-hero__heading-clip">
              <span data-hero-line className="creative-hero__heading-line">
                David Beauchamp
              </span>
            </span>
          </h1>

          <div className="creative-hero__header-row">
            <div className="creative-hero__sub-text">
              {heroSection.subLines.map((line) => (
                <div key={line} className="creative-hero__sub-clip">
                  <span data-hero-sub-line className="creative-hero__sub-line">
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <h1 className="creative-hero__heading creative-hero__heading--right">
              <span className="creative-hero__heading-clip">
                <span data-hero-line className="creative-hero__heading-line">
                  Full-stack Developer
                </span>
              </span>
            </h1>
          </div>
        </div>

        <div className="creative-hero__bottom">
          <div data-hero-avatars className="creative-hero__avatars">
            {CREATOR_AVATARS.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="creator"
                width={44}
                height={44}
                className="creative-hero__avatar"
                style={{ zIndex: CREATOR_AVATARS.length - i }}
                priority
              />
            ))}
          </div>

          <div className="creative-hero__trust-clip">
            <span data-hero-trust className="creative-hero__trust">
              150+ creators trust us
            </span>
          </div>

          <div data-hero-cta className="creative-hero__cta-wrap">
            <a href={heroSection.ctas[0].href} className="creative-hero__cta">
              <span>{heroSection.ctas[0].label}</span>
              <span className="creative-hero__cta-border" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
