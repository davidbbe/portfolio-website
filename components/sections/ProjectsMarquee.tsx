"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "@/lib/content/sections";
import type { ProjectItem } from "@/lib/content/sections";
import BrandIcon, { resolveTagIconKey } from "./shared/BrandIcon";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      aria-label={`View ${project.title}`}
    >
      <div className="project-card__image-wrap">
        <Image
          src={project.image}
          alt={project.title}
          width={560}
          height={340}
          className="project-card__image"
          draggable={false}
        />
        <div className="project-card__image-overlay" />
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <ul className="project-card__tags">
          {project.featuredTags.map((tag) => (
            <li key={tag} className="project-card__tag">
              <BrandIcon
                iconKey={resolveTagIconKey(tag) ?? ""}
                name={tag}
              />
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}

const DUPLICATE_COUNT = 3;

export default function ProjectsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      gsap.set(track, { autoAlpha: 1 });
      return;
    }

    const sets = track.querySelectorAll<HTMLDivElement>(
      ".project-marquee__set"
    );
    if (sets.length === 0) return;

    const singleSetWidth = sets[0].offsetWidth;

    const ctx = gsap.context(() => {
      const wrap = gsap.utils.wrap(-singleSetWidth, 0);

      const marquee = gsap.to(sets, {
        x: `-=${singleSetWidth}`,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x: string) => wrap(parseFloat(x)) + "px",
        },
      });

      const hoverScale = 0.4;
      track.addEventListener("mouseenter", () => {
        gsap.to(marquee, { timeScale: hoverScale, duration: 0.8, ease: "power2.out", overwrite: true });
      });
      track.addEventListener("mouseleave", () => {
        gsap.to(marquee, { timeScale: 1, duration: 0.8, ease: "power2.out", overwrite: true });
      });

      ScrollTrigger.create({
        trigger: track,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            track,
            { autoAlpha: 0, y: 48 },
            { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" }
          );
        },
      });
    }, track);

    return () => ctx.revert();
  }, []);

  const duplicatedProjects = Array.from(
    { length: DUPLICATE_COUNT },
    () => projectsData
  );

  return (
    <div ref={trackRef} className="project-marquee" style={{ visibility: "hidden" }}>
      {duplicatedProjects.map((set, setIndex) => (
        <div key={setIndex} className="project-marquee__set">
          {set.map((project, i) => (
            <ProjectCard key={`${setIndex}-${i}`} project={project} />
          ))}
        </div>
      ))}
    </div>
  );
}
