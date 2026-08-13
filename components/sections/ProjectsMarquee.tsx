"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "@/lib/content/sections";
import type { ProjectItem } from "@/lib/content/sections";
import BrandIcon, { resolveTagIconKey } from "./shared/BrandIcon";
import { getLenis } from "@/hooks/useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const DUPLICATE_COUNT = 3;
const LOOP_DURATION = 40;
const DRAG_THRESHOLD = 10;
const FRICTION = 0.95;
const HOVER_SCALE = 0.4;

function ProjectCard({
  project,
  onSelect,
  disabled,
}: {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="project-card"
      aria-label={`View details for ${project.title}`}
      tabIndex={disabled ? -1 : 0}
      onClick={() => onSelect(project)}
    >
      <div className="project-card__image-wrap">
        <Image
          src={project.image}
          alt={project.title}
          width={560}
          height={340}
          sizes="(max-width: 768px) 280px, 340px"
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
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(
      panel,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.05 }
    );

    const closeBtn = panel.querySelector<HTMLElement>(".project-modal__close");
    closeBtn?.focus();
  }, []);

  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) {
      onClose();
      return;
    }

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
    const panel = panelRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose]);

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousOverflow;
      lenis?.start();
      openerRef.current?.focus();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="project-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div ref={panelRef} className="project-modal">
        <button
          type="button"
          className="project-modal__close"
          onClick={handleClose}
          aria-label="Close project details"
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
            sizes="(max-width: 768px) 100vw, 42rem"
            className="project-modal__image"
            draggable={false}
          />
        </div>

        <div className="project-modal__body">
          <h2 id="project-modal-title" className="project-modal__title">
            {project.title}
          </h2>
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

export default function ProjectsMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const modalOpenRef = useRef(false);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  modalOpenRef.current = activeProject !== null;

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canHover = window.matchMedia("(hover: hover)").matches;

    const sets = track.querySelectorAll<HTMLDivElement>(".project-marquee__set");
    if (sets.length === 0) return;

    let setWidth = 0;
    const measure = () => {
      setWidth = sets[0].getBoundingClientRect().width;
    };
    measure();

    const wrapX = (value: number) => {
      if (setWidth <= 0) return 0;
      const wrapped = value % setWidth;
      if (wrapped > 0) return wrapped - setWidth;
      if (wrapped < -setWidth) return wrapped + setWidth;
      return wrapped;
    };

    const pxPerSecond = () => (setWidth > 0 ? setWidth / LOOP_DURATION : 0);

    let x = 0;
    let velocity = 0;
    let dragging = false;
    let hoverSlow = false;
    let inView = true;
    let introDone = reduceMotion;
    let focusPause = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastTime = 0;
    let axis: "x" | "y" | null = null;
    let moved = 0;

    const applyX = () => {
      x = wrapX(x);
      gsap.set(track, { x });
    };

    const tick = () => {
      const dt = gsap.ticker.deltaRatio(60);
      const dtSeconds = dt / 60;

      if (!dragging) {
        velocity *= Math.pow(FRICTION, dt);

        const autoplayBlocked =
          modalOpenRef.current ||
          !inView ||
          reduceMotion ||
          focusPause ||
          !introDone;

        if (!autoplayBlocked && Math.abs(velocity) < 0.02) {
          velocity = 0;
          const speed = hoverSlow ? HOVER_SCALE : 1;
          x -= pxPerSecond() * dtSeconds * speed;
        } else {
          x += velocity * (dtSeconds * 1000);
        }
      }

      applyX();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button > 0 || modalOpenRef.current) return;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startY = e.clientY;
      lastTime = performance.now();
      axis = null;
      moved = 0;
      velocity = 0;
      suppressClickRef.current = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!axis) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
          return;
        }
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "x") {
          dragging = true;
          viewport.classList.add("is-dragging");
          try {
            viewport.setPointerCapture(e.pointerId);
          } catch {
            // Some browsers reject capture for synthetic or untrusted pointers.
          }
          getLenis()?.stop();
        }
      }

      if (axis !== "x") return;

      e.preventDefault();
      const now = performance.now();
      const delta = e.clientX - lastX;
      const elapsed = Math.max(now - lastTime, 8);
      x += delta;
      velocity = Math.max(-1.6, Math.min(1.6, delta / elapsed));
      lastX = e.clientX;
      lastTime = now;
      moved = Math.abs(dx);
      applyX();
    };

    const endPointer = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;

      if (dragging) {
        if (moved >= DRAG_THRESHOLD) {
          suppressClickRef.current = true;
        }
        dragging = false;
        viewport.classList.remove("is-dragging");
        getLenis()?.start();
      }

      pointerId = null;
      axis = null;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClickRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (modalOpenRef.current) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x -= e.deltaX;
      velocity = 0;
      applyX();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const card = track.querySelector<HTMLElement>(".project-card");
      const step = (card?.offsetWidth ?? 340) + 20;
      x += e.key === "ArrowRight" ? -step : step;
      velocity = 0;
      applyX();
    };

    const onFocusIn = () => {
      focusPause = true;
    };
    const onFocusOut = () => {
      focusPause = false;
    };
    const onMouseEnter = () => {
      hoverSlow = true;
    };
    const onMouseLeave = () => {
      hoverSlow = false;
    };
    const onResize = () => measure();

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(viewport, { autoAlpha: 1 });
      } else {
        ScrollTrigger.create({
          trigger: viewport,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              viewport,
              { autoAlpha: 0, y: 48 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                onComplete: () => {
                  introDone = true;
                },
              }
            );
          },
        });
      }
    }, viewport);

    gsap.ticker.add(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(viewport);

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", endPointer);
    viewport.addEventListener("lostpointercapture", endPointer);
    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("keydown", onKeyDown);
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("focusout", onFocusOut);

    if (canHover) {
      viewport.addEventListener("mouseenter", onMouseEnter);
      viewport.addEventListener("mouseleave", onMouseLeave);
    }

    window.addEventListener("resize", onResize);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(sets[0]);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endPointer);
      viewport.removeEventListener("pointercancel", endPointer);
      viewport.removeEventListener("lostpointercapture", endPointer);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("keydown", onKeyDown);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("focusout", onFocusOut);
      viewport.removeEventListener("mouseenter", onMouseEnter);
      viewport.removeEventListener("mouseleave", onMouseLeave);
      if (dragging) {
        getLenis()?.start();
      }
    };
  }, []);

  const handleSelect = useCallback((project: ProjectItem) => {
    if (suppressClickRef.current) return;
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
      <div
        ref={viewportRef}
        className="project-marquee"
        style={{ visibility: "hidden" }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project gallery. Drag, swipe, or use arrow keys to browse."
      >
        <div ref={trackRef} className="project-marquee__track">
          {duplicatedProjects.map((set, setIndex) => (
            <div
              key={setIndex}
              className="project-marquee__set"
              aria-hidden={setIndex > 0}
            >
              {set.map((project, i) => (
                <ProjectCard
                  key={`${setIndex}-${i}`}
                  project={project}
                  onSelect={handleSelect}
                  disabled={setIndex > 0}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {activeProject ? (
        <ProjectModal project={activeProject} onClose={handleClose} />
      ) : null}
    </>
  );
}
