export type SectionSlug =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export type MaterialPreset = "glass" | "chrome" | "matte" | "neon";

export type MouseProfile = {
  xStrength: number;
  yStrength: number;
  rotationStrength: number;
  smoothing: number;
};

export type SceneAnchor = {
  objectTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  materialPreset: MaterialPreset;
  cameraHint?: {
    position: [number, number, number];
    fov?: number;
  };
  mouseProfile: MouseProfile;
  timelinePreset: "hero" | "softReveal" | "staggered";
};
