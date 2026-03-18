import type { SectionSlug } from "./types";

export const SECTION_ORDER: SectionSlug[] = [
  "hero",
  "about",
  "projects",
  "skills",
  "experience",
  "contact",
];

export const DEFAULT_SECTION: SectionSlug = "hero";

export const SCROLL_TRIGGER_DEFAULTS = {
  start: "top 65%",
  end: "bottom 35%",
};

export const SCENE_DAMPING = {
  camera: 0.08,
  object: 0.1,
};

export const POST_FX_CONFIG = {
  bloomIntensity: 0.7,
  noiseOpacity: 0.07,
  chromaticOffset: 0.0007,
};
