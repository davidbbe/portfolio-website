"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { heroSection } from "@/lib/content/sections";

const TECH_LOGOS = [
  {
    name: "React",
    icon: (
      <svg viewBox="-14 -14 284 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="128" cy="128" r="20.3" fill="#61DAFB" />
        <ellipse cx="128" cy="128" rx="123" ry="43.4" stroke="#61DAFB" strokeWidth="9" />
        <ellipse cx="128" cy="128" rx="123" ry="43.4" stroke="#61DAFB" strokeWidth="9" transform="rotate(60 128 128)" />
        <ellipse cx="128" cy="128" rx="123" ry="43.4" stroke="#61DAFB" strokeWidth="9" transform="rotate(120 128 128)" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" rx="20" fill="#3178C6" />
        <path d="M150.5 200.5v27.2c4.4 2.3 9.7 4 15.7 5.2 6 1.2 12.4 1.8 19.2 1.8 6.6 0 12.8-.7 18.7-2.1 5.9-1.4 11-3.7 15.4-6.8 4.4-3.1 7.8-7.1 10.4-12 2.5-4.9 3.8-10.8 3.8-17.7 0-5-.8-9.4-2.3-13.2-1.5-3.8-3.7-7.2-6.5-10.2-2.8-3-6.1-5.7-10-8.1-3.8-2.4-8.1-4.6-12.7-6.7-3.4-1.5-6.4-3-9.1-4.4-2.7-1.4-5-2.9-6.9-4.4-1.9-1.5-3.4-3.2-4.4-5-1-1.8-1.5-3.9-1.5-6.3 0-2.2.5-4.2 1.4-5.9.9-1.7 2.2-3.2 3.9-4.4 1.7-1.2 3.7-2.1 6-2.8 2.4-.6 5-.9 7.9-.9 2 0 4.2.2 6.5.5 2.3.4 4.6.9 7 1.7 2.4.7 4.6 1.7 6.8 2.8 2.2 1.2 4.1 2.5 5.9 4.1v-25.1c-3.8-1.5-8-2.6-12.5-3.3-4.5-.7-9.7-1.1-15.4-1.1-6.6 0-12.8.7-18.6 2.2-5.8 1.5-10.9 3.8-15.2 6.9-4.3 3.2-7.7 7.1-10.2 11.9-2.5 4.8-3.7 10.4-3.7 16.9 0 8.6 2.5 15.8 7.4 21.8 4.9 5.9 12.3 10.8 22 14.6 3.5 1.4 6.8 2.8 9.8 4.2 3 1.4 5.6 2.9 7.8 4.5 2.2 1.6 3.9 3.3 5.1 5.3 1.2 1.9 1.9 4.2 1.9 6.7 0 2.1-.4 4-1.3 5.7-.9 1.7-2.1 3.1-3.8 4.3-1.7 1.1-3.7 2-6.1 2.6-2.4.6-5.1.9-8.2.9-5.4 0-10.7-1-16-3.1-5.3-2-10.2-5.1-14.7-9.2zM107 122.5h31.5v-22.8H56v22.8h31.5v89.2H107v-89.2z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="62" fill="#000" stroke="#fff" strokeWidth="3" />
        <path d="M48 38v52h6V50.7l38.8 51.7c3-2.2 5.6-4.8 7.8-7.8L55.5 38H48z" fill="url(#nextjs-g1)" />
        <rect x="78" y="38" width="6" height="34" fill="url(#nextjs-g2)" />
        <defs>
          <linearGradient id="nextjs-g1" x1="72" y1="62" x2="100" y2="108" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nextjs-g2" x1="81" y1="38" x2="81" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Node.js",
    icon: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <path d="M64 8.3a8 8 0 00-4 1.1L20.6 33.6a8 8 0 00-4 6.9v48.4a8 8 0 004 6.9L60 120.1a8 8 0 008 0l39.4-24.3a8 8 0 004-6.9V40.5a8 8 0 00-4-6.9L68 9.4a8 8 0 00-4-1.1z" fill="#539E43" />
        <path d="M84 68.7c0 8.7-7.1 13-18.8 13-7.4 0-14.7-1.9-14.7-8.8h7.2c.4 3.2 3.2 4.5 8 4.5 5.4 0 8.3-1.5 8.3-4.5 0-3.1-3.4-4-9.3-5-8.2-1.4-15.3-3.2-15.3-11.4 0-7.5 6.6-11.9 16.5-11.9 9.1 0 15.8 3.7 16.1 11.6h-7.2c-.5-3.5-3.5-5.3-9.4-5.3-5 0-7.8 1.6-7.8 4.3 0 3.1 3.4 3.9 9.5 4.9 8.4 1.5 16.9 3 16.9 11.6z" fill="#fff" />
      </svg>
    ),
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const btnWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const startBorderOrbit = useCallback(() => {
    const wrap = btnWrapRef.current;
    const glow = glowRef.current;
    if (!wrap || !glow) return;

    const proxy = { angle: 0 };
    const rect = wrap.getBoundingClientRect();
    const rx = rect.width / 2;
    const ry = rect.height / 2;

    gsap.to(proxy, {
      angle: 360,
      duration: 4,
      repeat: -1,
      ease: "none",
      onUpdate() {
        const rad = (proxy.angle * Math.PI) / 180;
        const gradAngle = proxy.angle + 245;
        wrap.style.backgroundImage = `linear-gradient(${gradAngle}deg, rgb(56, 219, 255), rgb(0, 0, 0))`;
        const x = Math.cos(rad) * rx;
        const y = Math.sin(rad) * ry;
        glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      },
    });
  }, []);

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
    const logos = section.querySelectorAll<HTMLElement>("[data-hero-logo]");
    const trust = section.querySelector<HTMLElement>("[data-hero-trust]");
    const cta = section.querySelector<HTMLElement>("[data-hero-cta]");

    if (prefersReduced) {
      [nav, trust, cta].forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      logos.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      h1Lines.forEach((el) => {
        el.style.transform = "translateY(0)";
      });
      subLines.forEach((el) => {
        el.style.transform = "translateY(0)";
      });
      startBorderOrbit();
      return;
    }

    gsap.set(nav, { opacity: 0, y: -20 });
    gsap.set(h1Lines, { yPercent: 110 });
    gsap.set(subLines, { yPercent: 110 });
    gsap.set(logos, { opacity: 0, scale: 0.4, y: 12 });
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
        logos,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "back.out(1.7)",
          onComplete() {
            logos.forEach((el) => {
              gsap.set(el, { clearProps: "transform" });
            });
          },
        },
        1.0,
      )
      .to(trust, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 1.1)
      .to(cta, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.25)
      .call(startBorderOrbit, undefined, 1.6);

    return () => {
      tl.kill();
    };
  }, [startBorderOrbit]);

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
          <span className="creative-hero__logo-text">David Beauchamp</span>
        </a>
        <a
          href="#testimonials"
          className="creative-hero__nav-icon"
          aria-label="clients"
        >
          <Image
            src="/android-chrome-192x192.png"
            alt="Site logo"
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
                Full-stack Developer
              </span>
            </span>
          </h1>

          <div className="creative-hero__header-row md:pr-20 xl:pr-0">
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
                  Javascript
                </span>
              </span>
            </h1>
          </div>
        </div>

        <div className="creative-hero__bottom">
          <div data-hero-avatars className="creative-hero__tech-logos">
            {TECH_LOGOS.map((tech, i) => (
              <div
                key={tech.name}
                data-hero-logo
                className="creative-hero__tech-logo"
                style={{ zIndex: TECH_LOGOS.length - i }}
              >
                {tech.icon}
                <span className="creative-hero__tech-tooltip">{tech.name}</span>
              </div>
            ))}
          </div>

          <div className="creative-hero__trust-clip">
            <span data-hero-trust className="creative-hero__trust">
              Production-ready applications
            </span>
          </div>

          <div data-hero-cta className="creative-hero__cta-wrap">
            <div ref={btnWrapRef} className="creative-hero__cta-orbit">
              <a href={heroSection.ctas[0].href} className="creative-hero__cta">
                {heroSection.ctas[0].label}
              </a>
              <div className="creative-hero__cta-bg">
                <div ref={glowRef} className="creative-hero__cta-glow-group">
                  <div className="creative-hero__cta-g creative-hero__cta-g--1" />
                  <div className="creative-hero__cta-g creative-hero__cta-g--2" />
                  <div className="creative-hero__cta-g creative-hero__cta-g--3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
