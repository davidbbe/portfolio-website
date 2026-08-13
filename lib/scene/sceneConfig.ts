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
  /** Side-to-side slide — slower than `along` so it eases to the edge instead of snapping. */
  lateral: 3.15,
};

/**
 * Viewport X for the bust. `side` is a fraction of full half-width travel
 * (1 = near the page edge). `hold` is how much of each section-to-section
 * scroll stays parked at the current side before crossing.
 */
export const SCENE_LATERAL = {
  side: 0.5,
  hold: 0.26,
};

/**
 * Idle yaw is a pendulum, not a turntable. The two extremes are asymmetric
 * because the scan’s facing isn’t centered: one side peeks the back sooner.
 */
export const SCENE_MOTION = {
  /** Slight 3/4 facing on top of the glTF forward offset (~7°). */
  baseYaw: 0.12,
  /** First reverse (radians). ~110° — sliver of the back, then turns around. */
  yawSwingMax: 1.92,
  /**
   * Second reverse (radians). Shallower than the first so the far side never
   * reaches a full reverse three-quarter.
   */
  yawSwingMin: -1,
  /** Full left–right–left cycle in seconds. */
  yawPeriod: 38,
};

/** Lower bloom / noise / chroma keeps the photogrammetry albedo sharper (less haze / fringing). */
export const POST_FX_CONFIG = {
  bloomIntensity: 0.26,
  noiseOpacity: 0.022,
  chromaticOffset: 0.00022,
};

/** glTF/glb path under `public/` — hero 3D scan */
export const HERO_SCENE_MODEL_GLB = "/models/hero-bust.glb";
