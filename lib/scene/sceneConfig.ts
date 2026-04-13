import type { SectionSlug } from "./types";

export const SECTION_ORDER: SectionSlug[] = [
  "hero",
  "about",
  "projects",
  "faq",
  "contact",
];

export const DEFAULT_SECTION: SectionSlug = "hero";

export const SCROLL_TRIGGER_DEFAULTS = {
  start: "top 60%",
  end: "bottom 30%",
};

export const SCENE_DAMPING = {
  camera: 0.08,
  object: 0.1,
};

/** Lower bloom / noise / chroma keeps the photogrammetry albedo sharper (less haze / fringing). */
export const POST_FX_CONFIG = {
  bloomIntensity: 0.26,
  noiseOpacity: 0.022,
  chromaticOffset: 0.00022,
};

/** glTF/glb path under `public/` — hero 3D scan */
export const HERO_SCENE_MODEL_GLB = "/models/hero-bust.glb";
