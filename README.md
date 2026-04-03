# Creative portfolio (Next.js)

Single-page portfolio with scroll-driven 2D reveals, a global React Three Fiber scene tied to section state, and Lenis-smoothed scrolling.

## Setup

1. `npm install`
2. `npm run dev`

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run clean` (removes `.next`).

## What’s on the page

The home route composes these sections in order:

- **Hero** — primary headline and CTAs  
- **About me** — stack-focused content blocks  
- **Projects** — step-style narrative cards  
- **FAQ** — questions and answers  
- **Contact** — closing / footer-style messaging  

Copy and structured section data live in `lib/content/sections.ts`. Section order and scroll/scene defaults are centralized in `lib/scene/sceneConfig.ts` (aligned with `SectionSlug` in `lib/scene/types.ts`).

## Stack

| Area | Tech |
|------|------|
| Framework | Next.js (App Router), React 18, TypeScript |
| Styling | Tailwind CSS + project styles in `styles/creative.css` (imported from `app/globals.css`) |
| Typography | `next/font/google` — Sora and Manrope as CSS variables |
| 3D | Three.js, React Three Fiber, Drei, `@react-three/postprocessing` (bloom, film-style noise, chromatic aberration via `postprocessing`) |
| Scroll & motion | Lenis (`useSmoothScroll`), GSAP + ScrollTrigger (`useSectionScrollTriggers`) for section-scoped reveals and active-section updates |
| State | `SceneStateProvider` — active section drives the 3D rig and interactions |

## Behavior notes

- **Global canvas** — `GlobalSceneCanvas` renders the WebGL layer; it is **disabled** when `prefers-reduced-motion: reduce` is set or on viewports **≤768px** wide, so small screens and motion-sensitive users get a lighter experience.
- **Reveal animations** — `[data-reveal]` elements are normalized for reduced-motion users (visible, no skew/offset tweens).
- **Analytics** — `@next/third-parties/google` loads Google Analytics in the root layout (replace or remove the measurement ID for your own property).

## Project layout (high level)

- `app/` — App Router entry (`layout.tsx`, `page.tsx`, `globals.css`)
- `components/canvas/` — scene shell, rig, objects, post-processing
- `components/sections/` — page sections and shared pieces (e.g. `RevealText`, `SectionInteractiveLayer`)
- `components/providers/` — smooth scroll + scene context wiring
- `hooks/` — Lenis integration and GSAP scroll triggers
- `context/` — active section for the 3D layer
- `lib/scene/` — anchors, types, and scene configuration
