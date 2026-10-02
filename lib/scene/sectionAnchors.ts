import type { SceneAnchor, SectionSlug } from "./types";
import { SCENE_LATERAL } from "./sceneConfig";

/**
 * Cinematic path for the bust as you scroll.
 *
 * Distinct section framing and three-quarter facing, joined by lifted depth
 * arcs. Velocity adds a restrained bank; idle orbit and pointer response
 * layer over the section rotation. Lateral is screen-space X, independent
 * of the camera's look-at target so the portrait stays at its intended side.
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
      position: [0, 0.16, -0.22],
      rotation: [0.025, -0.3, -0.025],
      scale: [1.16, 1.16, 1.16],
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
      position: [0, -0.12, -0.48],
      rotation: [-0.035, 0.35, 0.025],
      scale: [0.98, 0.98, 0.98],
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
      position: [0, 0.12, -0.34],
      rotation: [0.04, -0.16, -0.02],
      scale: [1.08, 1.08, 1.08],
      lateral: SCENE_LATERAL.side * 0.55,
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
      position: [0, -0.08, -0.12],
      rotation: [0.015, 0.22, 0.015],
      scale: [1.18, 1.18, 1.18],
      lateral: -SCENE_LATERAL.side * 0.8,
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
