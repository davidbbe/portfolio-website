import type { SceneAnchor, SectionSlug } from "./types";

/**
 * Cinematic path for the bust as you scroll.
 *
 * Yaw is NOT keyed here — SceneObjectManager drives a single monotonically
 * increasing yaw from scroll so the head never reverses mid-page.
 * Pitch stays a small nod; roll stays 0 to avoid tumbling.
 * After hero, the bust lives on the right and recedes; it does not jump back to center.
 */
export const sectionAnchors: Record<SectionSlug, SceneAnchor> = {
  hero: {
    objectTransform: {
      position: [0.16, 0.04, 0],
      rotation: [0.06, 0, 0],
      scale: [1.35, 1.35, 1.35],
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
      position: [0.82, 0.06, -0.2],
      rotation: [0.055, 0, 0],
      scale: [1.24, 1.24, 1.24],
    },
    materialPreset: "matte",
    cameraHint: {
      position: [0.04, 0.06, 5.32],
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
      position: [0.7, -0.02, -0.46],
      rotation: [0.05, 0, 0],
      scale: [1.16, 1.16, 1.16],
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0.02, 0, 5.38],
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
      position: [0.88, 0.03, -0.3],
      rotation: [0.05, 0, 0],
      scale: [1.18, 1.18, 1.18],
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0.04, 0.03, 5.28],
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
      position: [0.8, -0.14, -0.24],
      rotation: [0.05, 0, 0],
      scale: [1.2, 1.2, 1.2],
    },
    /** Neutral cool tint; avoid "neon" here — emissive + rim read as harsh green on the scan. */
    materialPreset: "glass",
    cameraHint: {
      position: [0.03, -0.04, 5.18],
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
