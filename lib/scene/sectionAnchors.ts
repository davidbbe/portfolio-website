import type { SceneAnchor, SectionSlug } from "./types";
import { SCENE_LATERAL } from "./sceneConfig";

/**
 * Cinematic path for the bust as you scroll.
 *
 * Yaw is NOT keyed here — SceneObjectManager drives an idle pendulum so the
 * head never completes a full turn. Pitch stays a small nod; roll stays 0.
 * `lateral` is screen-space X (-1 left … 1 right). Path: hero center → about
 * right → projects left → faq center → contact right. Side rest is half of
 * full edge travel; a scroll hold keeps it parked before it crosses back.
 * The camera does not track this X, or the bust would appear to snap back
 * to mid-frame. Full scale is hero-only; later sections recede until hero.
 */
export const sectionAnchors: Record<SectionSlug, SceneAnchor> = {
  hero: {
    objectTransform: {
      position: [0, 0.04, 0],
      rotation: [0.06, 0, 0],
      scale: [1.35, 1.35, 1.35],
      lateral: 0,
    },
    materialPreset: "glass",
    cameraHint: {
      position: [0, 0.02, 5.22],
      fov: 48,
    },
    mouseProfile: {
      xStrength: 0.26,
      yStrength: 0.2,
      rotationStrength: 0.12,
      smoothing: 0.08,
    },
    timelinePreset: "hero",
    microMotion: {
      orbitBoost: 0.22,
      wirePulse: 0.018,
      driftStrength: 0.012,
    },
  },
  about: {
    objectTransform: {
      position: [0, 0.06, -0.2],
      rotation: [0.055, 0, 0],
      scale: [1.1, 1.1, 1.1],
      lateral: SCENE_LATERAL.side,
    },
    materialPreset: "matte",
    cameraHint: {
      position: [0, 0.06, 5.32],
      fov: 47,
    },
    mouseProfile: {
      xStrength: 0.22,
      yStrength: 0.18,
      rotationStrength: 0.1,
      smoothing: 0.09,
    },
    timelinePreset: "softReveal",
    microMotion: {
      orbitBoost: 0.22,
      wirePulse: 0.016,
      driftStrength: 0.01,
    },
  },
  projects: {
    objectTransform: {
      position: [0, -0.02, -0.36],
      rotation: [0.05, 0, 0],
      scale: [1.02, 1.02, 1.02],
      lateral: -SCENE_LATERAL.side,
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0, 0, 5.38],
      fov: 46.5,
    },
    mouseProfile: {
      xStrength: 0.2,
      yStrength: 0.16,
      rotationStrength: 0.1,
      smoothing: 0.09,
    },
    timelinePreset: "staggered",
    microMotion: {
      orbitBoost: 0.22,
      wirePulse: 0.016,
      driftStrength: 0.01,
    },
  },
  faq: {
    objectTransform: {
      position: [0, 0.03, -0.3],
      rotation: [0.05, 0, 0],
      scale: [1.0, 1.0, 1.0],
      lateral: 0,
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0, 0.03, 5.28],
      fov: 47,
    },
    mouseProfile: {
      xStrength: 0.18,
      yStrength: 0.14,
      rotationStrength: 0.1,
      smoothing: 0.1,
    },
    timelinePreset: "softReveal",
    microMotion: {
      orbitBoost: 0.2,
      wirePulse: 0.016,
      driftStrength: 0.01,
    },
  },
  contact: {
    objectTransform: {
      position: [0, -0.06, 0],
      rotation: [0.05, 0, 0],
      scale: [0.98, 0.98, 0.98],
      lateral: SCENE_LATERAL.side,
    },
    /** Neutral cool tint; avoid "neon" here — emissive + rim read as harsh green on the scan. */
    materialPreset: "glass",
    cameraHint: {
      position: [0, -0.02, 5.18],
      fov: 48,
    },
    mouseProfile: {
      xStrength: 0.18,
      yStrength: 0.14,
      rotationStrength: 0.1,
      smoothing: 0.1,
    },
    timelinePreset: "hero",
    microMotion: {
      orbitBoost: 0.18,
      wirePulse: 0.014,
      driftStrength: 0.008,
    },
  },
};
