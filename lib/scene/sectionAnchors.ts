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
  mission: {
    objectTransform: {
      position: [-0.9, 0.1, -0.45],
      rotation: [0.5, 0.15, 0.2],
      scale: [1.15, 1.15, 1.15],
    },
    materialPreset: "matte",
    cameraHint: {
      position: [0.15, 0.15, 5.5],
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
  process: {
    objectTransform: {
      position: [1.2, -0.05, -0.75],
      rotation: [0.35, 1.25, -0.35],
      scale: [1.22, 1.22, 1.22],
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0, -0.05, 5.1],
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
  outcomes: {
    objectTransform: {
      position: [-0.6, 0.1, -0.6],
      rotation: [0.4, -1.1, 0.22],
      scale: [1.15, 1.15, 1.15],
    },
    materialPreset: "neon",
    cameraHint: {
      position: [0.2, 0.05, 5.4],
      fov: 45,
    },
    mouseProfile: {
      xStrength: 0.24,
      yStrength: 0.2,
      rotationStrength: 0.16,
      smoothing: 0.1,
    },
    timelinePreset: "staggered",
    microMotion: {
      orbitBoost: 0.34,
      wirePulse: 0.024,
      driftStrength: 0.018,
    },
  },
  testimonials: {
    objectTransform: {
      position: [0.8, 0.05, -0.7],
      rotation: [0.2, 0.35, 0.4],
      scale: [1.18, 1.18, 1.18],
    },
    materialPreset: "matte",
    cameraHint: {
      position: [0.2, 0.02, 5.3],
      fov: 46,
    },
    mouseProfile: {
      xStrength: 0.18,
      yStrength: 0.16,
      rotationStrength: 0.1,
      smoothing: 0.12,
    },
    timelinePreset: "softReveal",
    microMotion: {
      orbitBoost: 0.14,
      wirePulse: 0.015,
      driftStrength: 0.012,
    },
  },
  team: {
    objectTransform: {
      position: [-0.4, -0.2, -0.55],
      rotation: [0.05, -0.85, -0.08],
      scale: [1.1, 1.1, 1.1],
    },
    materialPreset: "glass",
    cameraHint: {
      position: [0.1, -0.18, 5.2],
      fov: 50,
    },
    mouseProfile: {
      xStrength: 0.2,
      yStrength: 0.15,
      rotationStrength: 0.1,
      smoothing: 0.11,
    },
    timelinePreset: "hero",
    microMotion: {
      orbitBoost: 0.26,
      wirePulse: 0.02,
      driftStrength: 0.018,
    },
  },
  faq: {
    objectTransform: {
      position: [1.0, 0.0, -0.48],
      rotation: [0.45, 0.22, 0.15],
      scale: [1.2, 1.2, 1.2],
    },
    materialPreset: "chrome",
    cameraHint: {
      position: [0.1, -0.05, 5.1],
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
      position: [0, -0.28, -0.4],
      rotation: [-0.05, -0.45, 0.03],
      scale: [1.16, 1.16, 1.16],
    },
    materialPreset: "neon",
    cameraHint: {
      position: [0, -0.16, 5.0],
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
