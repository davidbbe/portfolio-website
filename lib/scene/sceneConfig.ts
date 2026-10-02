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

/** Pose springs follow the latest destination, without queuing skipped sections. */
export const SCENE_TRAVEL = {
  settleTime: 0.62,
  maxSpeed: 1.65,
  arcLift: 0.16,
  arcDepth: 0.2,
  bank: 0.075,
};

/**
 * Viewport X for the bust. `side` is a fraction of full half-width travel
 * (1 = near the page edge).
 */
export const SCENE_LATERAL = {
  side: 0.58,
};

/**
 * A restrained idle orbit keeps the face visible while section turns provide
 * the larger changes of perspective.
 */
export const SCENE_MOTION = {
  /** Slight 3/4 facing on top of the glTF forward offset (~7°). */
  baseYaw: 0.12,
  /** Idle yaw limits, in radians. */
  yawSwingMax: 0.72,
  yawSwingMin: -0.65,
  /** Full left–right–left cycle in seconds. */
  yawPeriod: 30,
};

/** Lower bloom / noise / chroma keeps the photogrammetry albedo sharper (less haze / fringing). */
export const POST_FX_CONFIG = {
  bloomIntensity: 0.26,
  noiseOpacity: 0.022,
  chromaticOffset: 0.00022,
};

/** glTF/glb path under `public/` — hero 3D scan */
export const HERO_SCENE_MODEL_GLB = "/models/hero-bust.glb";
