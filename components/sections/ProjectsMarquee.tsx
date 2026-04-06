"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "@/lib/content/sections";
import type { ProjectItem } from "@/lib/content/sections";
import BrandIcon, { resolveTagIconKey } from "./shared/BrandIcon";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  project,
  onSelect,
}: {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}) {
  return (
    <button
      type="button"
      className="project-card"
      aria-label={`View details for ${project.title}`}
      onClick={() => onSelect(project)}
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
        <div className="project-card__hover-overlay">
          <span className="project-card__hover-label">View details</span>
        </div>
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
    </button>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectItem;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(
      panel,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.05 }
    );
  }, []);

  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) { onClose(); return; }

    gsap.to(panel, { opacity: 0, y: 30, scale: 0.96, duration: 0.25, ease: "power2.in" });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.25,
      delay: 0.08,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      className="project-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div ref={panelRef} className="project-modal">
        <button
          type="button"
          className="project-modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        <div className="project-modal__image-wrap">
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={480}
            className="project-modal__image"
          />
        </div>

        <div className="project-modal__body">
          <h2 className="project-modal__title">{project.title}</h2>
          <p className="project-modal__description">{project.description}</p>

          <ul className="project-modal__tags">
            {project.tags.map((tag) => (
              <li key={tag} className="project-modal__tag">
                <BrandIcon iconKey={resolveTagIconKey(tag) ?? ""} name={tag} />
              </li>
            ))}
          </ul>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="creative-btn creative-btn--solid project-modal__cta"
          >
            Visit site
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "0.4rem" }}>
              <path d="M5 2h7v7" />
              <path d="M12 2L2 12" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

const DUPLICATE_COUNT = 3;

export default function ProjectsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<gsap.core.Tween | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

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

      marqueeRef.current = marquee;

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

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    if (activeProject) {
      gsap.to(marquee, { timeScale: 0, duration: 0.6, ease: "power2.out", overwrite: true });
    } else {
      gsap.to(marquee, { timeScale: 1, duration: 0.8, ease: "power2.out", overwrite: true });
    }
  }, [activeProject]);

  const handleSelect = useCallback((project: ProjectItem) => {
    setActiveProject(project);
  }, []);

  const handleClose = useCallback(() => {
    setActiveProject(null);
  }, []);

  const duplicatedProjects = Array.from(
    { length: DUPLICATE_COUNT },
    () => projectsData
  );

  return (
    <>
      <div ref={trackRef} className="project-marquee" style={{ visibility: "hidden" }}>
        {duplicatedProjects.map((set, setIndex) => (
          <div key={setIndex} className="project-marquee__set">
            {set.map((project, i) => (
              <ProjectCard key={`${setIndex}-${i}`} project={project} onSelect={handleSelect} />
            ))}
          </div>
        ))}
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={handleClose} />
      )}
    </>
  );
}
