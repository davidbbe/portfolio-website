import type { SceneAnchor, SectionSlug } from "./types";

export const sectionAnchors: Record<SectionSlug, SceneAnchor> = {
  hero: {
    objectTransform: {
      position: [0, 0.05, 0],
      rotation: [0.2, 0.8, -0.2],
      scale: [1.35, 1.35, 1.35],
    },
    materialPreset: "glass",
    cameraHint: {
      position: [0, 0, 5.2],
      fov: 48,
    },
    mouseProfile: {
      xStrength: 0.35,
      yStrength: 0.28,
      rotationStrength: 0.18,
      smoothing: 0.08,
    },
    timelinePreset: "hero",
    microMotion: {
      orbitBoost: 0.28,
      wirePulse: 0.022,
      driftStrength: 0.02,
    },
  },
  about: {
    objectTransform: {
      position: [0.92, 0.08, -0.48],
      rotation: [0.48, -0.35, 0.12],
      scale: [1.15, 1.15, 1.15],
    },
    materialPreset: "matte",
    cameraHint: {
      position: [0.22, 0.14, 5.45],
      fov: 46,
    },
    mouseProfile: {
      xStrength: 0.24,
      yStrength: 0.2,
      rotationStrength: 0.12,
      smoothing: 0.1,
    },
    timelinePreset: "softReveal",
    microMotion: {
      orbitBoost: 0.2,
      wirePulse: 0.018,
      driftStrength: 0.012,
    },
  },
  projects: {
    objectTransform: {
      position: [0, -0.05, -0.58],
      rotation: [0.32, 0.85, -0.28],
      scale: [1.15, 1.15, 1.15],
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0, -0.05, 5.15],
      fov: 47,
    },
    mouseProfile: {
      xStrength: 0.3,
      yStrength: 0.22,
      rotationStrength: 0.2,
      smoothing: 0.09,
    },
    timelinePreset: "staggered",
    microMotion: {
      orbitBoost: 0.42,
      wirePulse: 0.026,
      driftStrength: 0.022,
    },
  },
  faq: {
    objectTransform: {
      position: [0.95, 0.02, -0.5],
      rotation: [0.42, -0.28, 0.12],
      scale: [1.15, 1.15, 1.15],
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0.18, -0.05, 5.12],
      fov: 47,
    },
    mouseProfile: {
      xStrength: 0.16,
      yStrength: 0.12,
      rotationStrength: 0.12,
      smoothing: 0.11,
    },
    timelinePreset: "softReveal",
    microMotion: {
      orbitBoost: 0.16,
      wirePulse: 0.018,
      driftStrength: 0.014,
    },
  },
  contact: {
    objectTransform: {
      position: [0.95, -0.26, -0.48],
      rotation: [-0.02, -0.38, 0.04],
      scale: [1.15, 1.15, 1.15],
    },
    /** Neutral cool tint; avoid "neon" here — emissive + rim read as harsh green on the scan. */
    materialPreset: "glass",
    cameraHint: {
      position: [0.18, -0.14, 5.05],
      fov: 50,
    },
    mouseProfile: {
      xStrength: 0.18,
      yStrength: 0.12,
      rotationStrength: 0.1,
      smoothing: 0.12,
    },
    timelinePreset: "hero",
    microMotion: {
      orbitBoost: 0.1,
      wirePulse: 0.012,
      driftStrength: 0.01,
    },
  },
};
