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
  },
  about: {
    objectTransform: {
      position: [-1.3, 0.2, -0.5],
      rotation: [0.5, -0.4, 0.1],
      scale: [1.05, 1.05, 1.05],
    },
    materialPreset: "matte",
    cameraHint: {
      position: [0.4, 0.1, 5.5],
      fov: 46,
    },
    mouseProfile: {
      xStrength: 0.22,
      yStrength: 0.18,
      rotationStrength: 0.12,
      smoothing: 0.1,
    },
    timelinePreset: "softReveal",
  },
  projects: {
    objectTransform: {
      position: [1.2, -0.2, -0.9],
      rotation: [0.1, 1.4, -0.3],
      scale: [1.2, 1.2, 1.2],
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
  },
  skills: {
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
  },
  experience: {
    objectTransform: {
      position: [1.3, 0.25, -0.8],
      rotation: [0.2, 0.35, 0.4],
      scale: [1.25, 1.25, 1.25],
    },
    materialPreset: "matte",
    cameraHint: {
      position: [0.15, 0.08, 5.6],
      fov: 46,
    },
    mouseProfile: {
      xStrength: 0.16,
      yStrength: 0.12,
      rotationStrength: 0.1,
      smoothing: 0.12,
    },
    timelinePreset: "softReveal",
  },
  contact: {
    objectTransform: {
      position: [0, -0.25, -0.4],
      rotation: [-0.1, -0.6, 0],
      scale: [1.2, 1.2, 1.2],
    },
    materialPreset: "glass",
    cameraHint: {
      position: [0, -0.1, 5.0],
      fov: 50,
    },
    mouseProfile: {
      xStrength: 0.2,
      yStrength: 0.15,
      rotationStrength: 0.1,
      smoothing: 0.11,
    },
    timelinePreset: "hero",
  },
};
