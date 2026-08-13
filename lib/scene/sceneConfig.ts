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

/** Exponential damp lambdas (higher = snappier). Used as `1 - exp(-lambda * dt)`. */
export const SCENE_DAMPING = {
  along: 5.4,
  camera: 4.8,
};

/**
 * Scroll choreography for the bust.
 * Yaw only ever increases as you scroll down (and decreases on the way back) —
 * never ping-pongs between section keyframes.
 */
export const SCENE_MOTION = {
  /** Extra yaw (radians) per section index. Same sign all the way down the page. */
  scrollYawPerSection: 0.22,
  /** Slight 3/4 facing on top of the glTF forward offset (~12°). */
  baseYaw: 0.2,
  /** Slow idle turntable (rad/s). Same sign as scroll yaw so they never fight. */
  idleSpin: 0.045,
};

/** Lower bloom / noise / chroma keeps the photogrammetry albedo sharper (less haze / fringing). */
export const POST_FX_CONFIG = {
  bloomIntensity: 0.26,
  noiseOpacity: 0.022,
  chromaticOffset: 0.00022,
};

/** glTF/glb path under `public/` — hero 3D scan */
export const HERO_SCENE_MODEL_GLB = "/models/hero-bust.glb";
