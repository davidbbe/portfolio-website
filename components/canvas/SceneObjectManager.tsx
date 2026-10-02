"use client";

import { useSceneState } from "@/context/scene-state-context";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import {
  HERO_SCENE_MODEL_GLB,
  SCENE_MOTION,
  SCENE_TRAVEL,
  SECTION_ORDER,
} from "@/lib/scene/sceneConfig";
import { advanceMotion, cinematicEase } from "@/lib/scene/motion";
import { sectionBlend } from "@/lib/scene/scrollAlong";
import type { MaterialPreset, SectionSlug } from "@/lib/scene/types";
import { worldXFromLateral } from "@/lib/scene/viewportX";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Texture,
  Vector3,
} from "three";
import PortraitOrbit from "./PortraitOrbit";

/** How strongly section presets tint textured albedo (multiply with baseColor map). */
const TEXTURE_TINT_STRENGTH = 0.14;

/** Yaw on the turntable group so a typical -Z-forward glTF bust faces the camera at +Z. */
const MODEL_FORWARD_YAW_OFFSET = Math.PI;

/** Extra uniform scale on tablet/desktop (multiplies section `safeScale`; mobile stays 1). */
const VIEWPORT_SCALE_MOBILE = 1;
const VIEWPORT_SCALE_TABLET = 1.2;
const VIEWPORT_SCALE_DESKTOP = 1.4;

const INTRO_SCALE_FROM = 0.88;
const INTRO_DURATION = 1.35;

/** Hero → About: bust fades out on narrow viewports by `scrollAlong` index 1. */
const MOBILE_HERO_FADE_POWER = 1.65;
const MOBILE_HERO_FADE_SCALE_DROP = 0.18;
const MOBILE_HERO_FADE_LIFT = 0.1;

/** Photogrammetry / textured scan: diffuse look, no metallic sheen or clearcoat. */
const SCAN_METALNESS = 0;
const SCAN_ROUGHNESS_FLOOR = 0.68;
const SCAN_ENV_MAP_INTENSITY = 0.36;

type MaterialPresetConfig = {
  color: string;
  roughness: number;
  metalness: number;
  envMapIntensity: number;
  transmission: number;
  thickness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  spinSpeed: number;
  emissiveIntensity: number;
  accentLight: string;
  rimIntensity: number;
};

const materialPresets: Record<MaterialPreset, MaterialPresetConfig> = {
  glass: {
    color: "#8cc7ff",
    roughness: 0.72,
    metalness: 0,
    envMapIntensity: 0.28,
    transmission: 0,
    thickness: 0.2,
    clearcoat: 0,
    clearcoatRoughness: 0.35,
    spinSpeed: 0.24,
    emissiveIntensity: 0.12,
    accentLight: "#b4d4ff",
    rimIntensity: 0.52,
  },
  chrome: {
    color: "#c8d8ff",
    roughness: 0.76,
    metalness: 0,
    envMapIntensity: 0.28,
    transmission: 0,
    thickness: 0.2,
    clearcoat: 0,
    clearcoatRoughness: 0.4,
    spinSpeed: 0.3,
    emissiveIntensity: 0.08,
    accentLight: "#d8e4ff",
    rimIntensity: 0.62,
  },
  matte: {
    color: "#9aa0b0",
    roughness: 0.82,
    metalness: 0,
    envMapIntensity: 0.24,
    transmission: 0,
    thickness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.55,
    spinSpeed: 0.18,
    emissiveIntensity: 0.04,
    accentLight: "#8a92a8",
    rimIntensity: 0.38,
  },
  neon: {
    color: "#9ee8ff",
    roughness: 0.7,
    metalness: 0,
    envMapIntensity: 0.3,
    transmission: 0,
    thickness: 0.05,
    clearcoat: 0,
    clearcoatRoughness: 0.4,
    spinSpeed: 0.34,
    emissiveIntensity: 0.38,
    accentLight: "#8ab8ff",
    rimIntensity: 0.48,
  },
};

type PreservedPbr = {
  color: Color;
  emissive: Color;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
  envMapIntensity: number;
  hasAlbedoTexture: boolean;
  hasVertexColors: boolean;
  physicalTransmission: number;
  physicalClearcoat: number;
  physicalClearcoatRoughness: number;
};

const STANDARD_TEXTURE_SLOTS = [
  "map",
  "lightMap",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "aoMap",
  "emissiveMap",
] as const;

function setTextureAnisotropy(mat: MeshStandardMaterial, maxAniso: number) {
  for (const slot of STANDARD_TEXTURE_SLOTS) {
    const tex = mat[slot];
    if (tex instanceof Texture) {
      tex.anisotropy = maxAniso;
      tex.needsUpdate = true;
    }
  }
  if (mat instanceof MeshPhysicalMaterial) {
    const coatN = mat.clearcoatNormalMap;
    if (coatN instanceof Texture) {
      coatN.anisotropy = maxAniso;
      coatN.needsUpdate = true;
    }
  }
}

function applyMaxAnisotropy(root: Object3D, maxAniso: number) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) {
      return;
    }
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (mat instanceof MeshStandardMaterial) {
        setTextureAnisotropy(mat, maxAniso);
      }
    }
  });
}

function collectMeshMaterials(
  root: Mesh,
): (MeshStandardMaterial | MeshPhysicalMaterial)[] {
  const out: (MeshStandardMaterial | MeshPhysicalMaterial)[] = [];
  const m = root.material;
  const list = Array.isArray(m) ? m : [m];
  for (const mat of list) {
    if (
      mat instanceof MeshStandardMaterial ||
      mat instanceof MeshPhysicalMaterial
    ) {
      out.push(mat);
    }
  }
  return out;
}

function preservePbrOnMaterial(
  mat: MeshStandardMaterial | MeshPhysicalMaterial,
) {
  const hasAlbedoTexture = Boolean(mat.map);
  const hasVertexColors = Boolean(mat.vertexColors);
  const envMapIntensity =
    "envMapIntensity" in mat && typeof mat.envMapIntensity === "number"
      ? mat.envMapIntensity
      : 1;
  mat.userData.__pbr = {
    color: mat.color.clone(),
    emissive: mat.emissive.clone(),
    emissiveIntensity: mat.emissiveIntensity,
    roughness: mat.roughness,
    metalness: mat.metalness,
    envMapIntensity,
    hasAlbedoTexture,
    hasVertexColors,
    physicalTransmission:
      mat instanceof MeshPhysicalMaterial ? mat.transmission : 0,
    physicalClearcoat: mat instanceof MeshPhysicalMaterial ? mat.clearcoat : 0,
    physicalClearcoatRoughness:
      mat instanceof MeshPhysicalMaterial ? mat.clearcoatRoughness : 0,
  } satisfies PreservedPbr;
}

function shouldPreserveBaseColor(p: PreservedPbr) {
  return p.hasAlbedoTexture || p.hasVertexColors;
}

function tintedBaseColor(preset: MaterialPresetConfig) {
  const c = new Color(0xffffff);
  c.lerp(new Color(preset.color), TEXTURE_TINT_STRENGTH);
  return c;
}

function applyPresetToMaterial(
  mat: MeshStandardMaterial | MeshPhysicalMaterial,
  preset: MaterialPresetConfig,
) {
  const p = mat.userData.__pbr as PreservedPbr | undefined;
  if (!p) {
    return;
  }

  if (shouldPreserveBaseColor(p)) {
    mat.color.copy(tintedBaseColor(preset));
    // Photogrammetry: never add emissive tint — it reads as plastic/neon on skin; rim light is enough.
    mat.emissive.setRGB(0, 0, 0);
    mat.emissiveIntensity = 0;
    mat.metalness = SCAN_METALNESS;
    mat.roughness = MathUtils.clamp(
      Math.max(p.roughness, SCAN_ROUGHNESS_FLOOR),
      0,
      1,
    );
    if ("envMapIntensity" in mat && typeof mat.envMapIntensity === "number") {
      mat.envMapIntensity = SCAN_ENV_MAP_INTENSITY;
    }
    if (mat instanceof MeshPhysicalMaterial) {
      mat.transmission = 0;
      mat.thickness = preset.thickness;
      mat.clearcoat = 0;
      mat.clearcoatRoughness = preset.clearcoatRoughness;
    }
    return;
  }

  const emissive = new Color(preset.color);
  mat.color.set(preset.color);
  mat.roughness = preset.roughness;
  mat.metalness = preset.metalness;
  mat.emissive.copy(emissive);
  mat.emissiveIntensity = preset.emissiveIntensity;
  if ("envMapIntensity" in mat && typeof mat.envMapIntensity === "number") {
    mat.envMapIntensity = preset.envMapIntensity;
  }
  if (mat instanceof MeshPhysicalMaterial) {
    mat.transmission = preset.transmission;
    mat.thickness = preset.thickness;
    mat.clearcoat = preset.clearcoat;
    mat.clearcoatRoughness = preset.clearcoatRoughness;
  }
}

function killMaterialTweens(mat: MeshStandardMaterial | MeshPhysicalMaterial) {
  gsap.killTweensOf(mat);
  gsap.killTweensOf(mat.color);
  gsap.killTweensOf(mat.emissive);
}

function tweenMaterialToPreset(
  mat: MeshStandardMaterial | MeshPhysicalMaterial,
  preset: MaterialPresetConfig,
) {
  const p = mat.userData.__pbr as PreservedPbr | undefined;
  if (!p) {
    return;
  }

  const duration = 1.12;
  const ease = "power2.out" as const;

  if (shouldPreserveBaseColor(p)) {
    const targetColor = tintedBaseColor(preset);
    const targetEmissive = new Color(0, 0, 0);
    const targetEmissiveIntensity = 0;

    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease,
      overwrite: "auto",
    });
    gsap.to(mat.emissive, {
      r: targetEmissive.r,
      g: targetEmissive.g,
      b: targetEmissive.b,
      duration,
      ease,
      overwrite: "auto",
    });
    const scanRoughness = MathUtils.clamp(
      Math.max(p.roughness, SCAN_ROUGHNESS_FLOOR),
      0,
      1,
    );
    gsap.to(mat, {
      emissiveIntensity: targetEmissiveIntensity,
      roughness: scanRoughness,
      metalness: SCAN_METALNESS,
      duration,
      ease,
      overwrite: "auto",
    });
    if ("envMapIntensity" in mat && typeof mat.envMapIntensity === "number") {
      gsap.to(mat, {
        envMapIntensity: SCAN_ENV_MAP_INTENSITY,
        duration,
        ease,
        overwrite: "auto",
      });
    }
    if (mat instanceof MeshPhysicalMaterial) {
      gsap.to(mat, {
        transmission: 0,
        thickness: preset.thickness,
        clearcoat: 0,
        clearcoatRoughness: preset.clearcoatRoughness,
        duration,
        ease,
        overwrite: "auto",
      });
    }
    return;
  }

  const base = new Color(preset.color);
  const emissive = base.clone();
  gsap.to(mat.color, {
    r: base.r,
    g: base.g,
    b: base.b,
    duration,
    ease,
    overwrite: "auto",
  });
  gsap.to(mat.emissive, {
    r: emissive.r,
    g: emissive.g,
    b: emissive.b,
    duration,
    ease,
    overwrite: "auto",
  });
  const props: gsap.TweenVars = {
    duration,
    roughness: preset.roughness,
    metalness: preset.metalness,
    emissiveIntensity: preset.emissiveIntensity,
    ease,
    overwrite: "auto",
  };
  if ("envMapIntensity" in mat && typeof mat.envMapIntensity === "number") {
    props.envMapIntensity = preset.envMapIntensity;
  }
  if (mat instanceof MeshPhysicalMaterial) {
    props.transmission = preset.transmission;
    props.thickness = preset.thickness;
    props.clearcoat = preset.clearcoat;
    props.clearcoatRoughness = preset.clearcoatRoughness;
  }
  gsap.to(mat, props);
}

export default function SceneObjectManager() {
  const { scrollAlongRef, pointerRef } = useSceneState();
  const { scene } = useGLTF(HERO_SCENE_MODEL_GLB);
  const { gl, camera, size } = useThree();
  const [viewportScaleBoost, setViewportScaleBoost] = useState(
    VIEWPORT_SCALE_MOBILE,
  );

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const resolve = () => {
      if (mqNarrow.matches) {
        setViewportScaleBoost(VIEWPORT_SCALE_MOBILE);
      } else if (mqDesktop.matches) {
        setViewportScaleBoost(VIEWPORT_SCALE_DESKTOP);
      } else {
        setViewportScaleBoost(VIEWPORT_SCALE_TABLET);
      }
    };
    resolve();
    mqNarrow.addEventListener("change", resolve);
    mqDesktop.addEventListener("change", resolve);
    return () => {
      mqNarrow.removeEventListener("change", resolve);
      mqDesktop.removeEventListener("change", resolve);
    };
  }, []);

  /** Section pose: damped position / pitch / scale from scroll anchors. */
  const poseGroupRef = useRef<Group>(null);
  /** Narrow-viewport hero scroll fade: opacity + lift (does not fight pose). */
  const mobileHeroFadeRef = useRef<Group>(null);
  /** Subtle idle drift; kept separate so pose damping can own `poseGroupRef`. */
  const driftGroupRef = useRef<Group>(null);
  /** Section facing, slow idle orbit and pointer response. */
  const spinGroupRef = useRef<Group>(null);
  const rimLightRef = useRef<PointLight>(null);
  const materialsRef = useRef<(MeshStandardMaterial | MeshPhysicalMaterial)[]>(
    [],
  );
  const enteredRef = useRef(false);
  const lastMaterialSlugRef = useRef<SectionSlug | null>(null);
  const initializedRef = useRef(false);
  const frameClockRef = useRef(0);
  const motionRef = useRef({
    x: { value: 0, velocity: 0 },
    y: { value: 0.04, velocity: 0 },
    z: { value: 0, velocity: 0 },
    scale: { value: 1.35, velocity: 0 },
    pitch: { value: 0.06, velocity: 0 },
    yaw: { value: 0, velocity: 0 },
    roll: { value: 0, velocity: 0 },
    pointerX: { value: 0, velocity: 0 },
    pointerY: { value: 0, velocity: 0 },
  });
  const modelHalfWidthRef = useRef(0.55);
  const idlePhaseRef = useRef(0);
  const introProgressRef = useRef(0);

  const preparedModel = useMemo(() => {
    const clone = scene.clone(true);
    const materials: (MeshStandardMaterial | MeshPhysicalMaterial)[] = [];
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mats = collectMeshMaterials(child);
        mats.forEach((mat) => {
          preservePbrOnMaterial(mat);
          materials.push(mat);
        });
      }
    });
    clone.updateMatrixWorld(true);
    const box = new Box3().setFromObject(clone);
    let halfWidth = 0.55;
    if (!box.isEmpty()) {
      const size = box.getSize(new Vector3());
      halfWidth = Math.max(size.x, size.z) * 0.5;
      clone.position.sub(box.getCenter(new Vector3()));
    }
    return { clone, materials, halfWidth };
  }, [scene]);

  const model = preparedModel.clone;

  useLayoutEffect(() => {
    materialsRef.current = preparedModel.materials;
    modelHalfWidthRef.current = preparedModel.halfWidth;
    const maxAniso = Math.min(16, gl.capabilities.getMaxAnisotropy());
    applyMaxAnisotropy(model, maxAniso);
  }, [preparedModel, model, gl]);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  useEffect(() => {
    if (enteredRef.current) {
      return;
    }
    const pose = poseGroupRef.current;
    const rim = rimLightRef.current;
    const materials = materialsRef.current;
    if (!pose || !rim || materials.length === 0) {
      return;
    }

    enteredRef.current = true;
    const anchor = sectionAnchors.hero;
    const preset = materialPresets[anchor.materialPreset];
    const safePosition = {
      x: 0,
      y: clamp(anchor.objectTransform.position[1], -0.4, 0.4),
      z: clamp(anchor.objectTransform.position[2], -0.65, 0.1),
    };
    const baseScale = {
      x: clamp(anchor.objectTransform.scale[0], 1, 1.35),
      y: clamp(anchor.objectTransform.scale[1], 1, 1.35),
      z: clamp(anchor.objectTransform.scale[2], 1, 1.35),
    };
    const safeScale = {
      x: baseScale.x * viewportScaleBoost,
      y: baseScale.y * viewportScaleBoost,
      z: baseScale.z * viewportScaleBoost,
    };

    const accent = new Color(preset.accentLight);

    pose.visible = false;
    materials.forEach((mat) => applyPresetToMaterial(mat, preset));
    rim.color.copy(accent);
    rim.intensity = preset.rimIntensity;
    pose.position.set(safePosition.x, safePosition.y, safePosition.z);
    pose.rotation.set(anchor.objectTransform.rotation[0], 0, 0);
    pose.scale.set(
      safeScale.x * INTRO_SCALE_FROM,
      safeScale.y * INTRO_SCALE_FROM,
      safeScale.z * INTRO_SCALE_FROM,
    );
    const spin = spinGroupRef.current;
    if (spin) {
      spin.rotation.set(0, MODEL_FORWARD_YAW_OFFSET + SCENE_MOTION.baseYaw, 0);
    }
    gsap.killTweensOf(pose.rotation);
    gsap.killTweensOf(pose.scale);
    pose.visible = true;
    initializedRef.current = true;
    lastMaterialSlugRef.current = "hero";
  }, [model, viewportScaleBoost]);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05);
    frameClockRef.current += dt;
    const pose = poseGroupRef.current;
    const mobileFadeWrap = mobileHeroFadeRef.current;
    const driftWrap = driftGroupRef.current;
    const spin = spinGroupRef.current;
    const rim = rimLightRef.current;
    const materials = materialsRef.current;
    if (
      !pose ||
      !mobileFadeWrap ||
      !driftWrap ||
      !spin ||
      !initializedRef.current
    ) {
      return;
    }

    const isNarrowViewport = viewportScaleBoost === VIEWPORT_SCALE_MOBILE;
    // Spring the actual pose toward the latest destination. Skipped sections
    // don't queue a series of side-to-side journeys during a fast scroll.
    const along = scrollAlongRef.current;
    const { i, j, t: linearT } = sectionBlend(along, SECTION_ORDER.length);
    const t = cinematicEase(linearT);
    const motion = motionRef.current;
    const slugA = SECTION_ORDER[i];
    const slugB = SECTION_ORDER[j];
    const anchorA = sectionAnchors[slugA];
    const anchorB = sectionAnchors[slugB];
    const presetA = materialPresets[anchorA.materialPreset];
    const presetB = materialPresets[anchorB.materialPreset];

    const applyMobileHeroScrollFade = () => {
      if (!isNarrowViewport) {
        mobileFadeWrap.visible = true;
        mobileFadeWrap.position.set(0, 0, 0);
        mobileFadeWrap.scale.set(1, 1, 1);
        mobileFadeWrap.rotation.set(0, 0, 0);
        for (const mat of materials) {
          mat.opacity = 1;
          mat.transparent = false;
          mat.depthWrite = true;
        }
        return;
      }

      const alongClamped = clamp(along, 0, 1);
      const fadeProgress = Math.pow(alongClamped, MOBILE_HERO_FADE_POWER);
      const opacity = clamp(1 - fadeProgress, 0, 1);
      const lift = MOBILE_HERO_FADE_LIFT * Math.pow(alongClamped, 1.65);
      const scaleUniform = clamp(
        1 - MOBILE_HERO_FADE_SCALE_DROP * Math.pow(alongClamped, 1.35),
        0.2,
        1,
      );

      mobileFadeWrap.visible = materials.some((mat) => mat.opacity > 0.008);
      mobileFadeWrap.position.y = MathUtils.damp(
        mobileFadeWrap.position.y, lift, 7, dt,
      );
      mobileFadeWrap.scale.setScalar(
        MathUtils.damp(mobileFadeWrap.scale.x, scaleUniform, 7, dt),
      );
      mobileFadeWrap.rotation.set(0, 0, 0);

      for (const mat of materials) {
        mat.opacity = MathUtils.damp(mat.opacity, opacity, 7, dt);
        const transparent = mat.opacity < 0.995;
        mat.transparent = transparent;
        mat.depthWrite = !transparent;
      }

      if (rim) {
        const rimBase = MathUtils.lerp(
          presetA.rimIntensity,
          presetB.rimIntensity,
          t,
        );
        rim.intensity = rimBase * opacity;
      }
    };

    const defaultMicro = {
      orbitBoost: 0.2,
      wirePulse: 0.016,
      driftStrength: 0.012,
    };

    const microA = anchorA.microMotion ?? defaultMicro;
    const microB = anchorB.microMotion ?? defaultMicro;
    const driftStrength = MathUtils.lerp(
      microA.driftStrength,
      microB.driftStrength,
      t,
    );

    driftWrap.position.set(
      Math.sin(frameClockRef.current * 0.32) * driftStrength * 1.8,
      Math.cos(frameClockRef.current * 0.48) * driftStrength * 2.8,
      Math.sin(frameClockRef.current * 0.24) * driftStrength,
    );

    idlePhaseRef.current += (dt * Math.PI * 2) / SCENE_MOTION.yawPeriod;
    const yawMin = SCENE_MOTION.yawSwingMin;
    const yawMax = SCENE_MOTION.yawSwingMax;
    const yawCenter = (yawMin + yawMax) * 0.5;
    const yawAmplitude = (yawMax - yawMin) * 0.5;
    const pendulumYaw =
      yawCenter + Math.sin(idlePhaseRef.current) * yawAmplitude;
    const posA = anchorA.objectTransform.position;
    const posB = anchorB.objectTransform.position;
    const rotA = anchorA.objectTransform.rotation;
    const rotB = anchorB.objectTransform.rotation;
    const scA = anchorA.objectTransform.scale;
    const scB = anchorB.objectTransform.scale;

    introProgressRef.current = Math.min(
      1,
      introProgressRef.current + dt / INTRO_DURATION,
    );
    const introMul = MathUtils.lerp(
      INTRO_SCALE_FROM,
      1,
      1 - Math.pow(1 - introProgressRef.current, 4),
    );
    const scaleUniform =
      advanceMotion(
        motion.scale,
        clamp(MathUtils.lerp(scA[0], scB[0], t), 0.9, 1.35),
        dt, 0.65, 0.5,
      ) *
      viewportScaleBoost *
      introMul;
    pose.scale.set(scaleUniform, scaleUniform, scaleUniform);

    const arc = Math.sin(Math.PI * linearT) ** 2;
    const poseY = clamp(
      MathUtils.lerp(posA[1], posB[1], t) + arc * SCENE_TRAVEL.arcLift, -0.4, 0.4,
    );
    const poseZ = clamp(
      MathUtils.lerp(posA[2], posB[2], t) - arc * SCENE_TRAVEL.arcDepth, -0.65, 0.1,
    );
    const lateral = MathUtils.lerp(
      anchorA.objectTransform.lateral,
      anchorB.objectTransform.lateral,
      t,
    );
    let targetX = 0;
    if (camera instanceof PerspectiveCamera) {
      const meshHalf = modelHalfWidthRef.current * scaleUniform;
      targetX = worldXFromLateral(
        lateral,
        camera,
        poseZ,
        meshHalf,
        size.width / Math.max(1, size.height),
      );
    }
    pose.position.set(
      advanceMotion(motion.x, targetX, dt, SCENE_TRAVEL.settleTime, SCENE_TRAVEL.maxSpeed),
      advanceMotion(motion.y, poseY, dt, SCENE_TRAVEL.settleTime, 0.7),
      advanceMotion(motion.z, poseZ, dt, SCENE_TRAVEL.settleTime, 0.9),
    );
    const pointerX = advanceMotion(
      motion.pointerX, isNarrowViewport ? 0 : pointerRef.current.x, dt, 0.7, 2,
    );
    const pointerY = advanceMotion(
      motion.pointerY, isNarrowViewport ? 0 : -pointerRef.current.y, dt, 0.7, 2,
    );
    pose.rotation.set(
      advanceMotion(
        motion.pitch, MathUtils.lerp(rotA[0], rotB[0], t) + pointerY * 0.045,
        dt, 0.7, 0.35,
      ),
      0,
      advanceMotion(
        motion.roll,
        MathUtils.lerp(rotA[2], rotB[2], t) - motion.x.velocity * SCENE_TRAVEL.bank,
        dt, 0.65, 0.25,
      ),
    );
    spin.rotation.set(
      0,
      MODEL_FORWARD_YAW_OFFSET + SCENE_MOTION.baseYaw +
        pendulumYaw * (isNarrowViewport ? 0.65 : 1) +
        advanceMotion(
          motion.yaw,
          MathUtils.lerp(rotA[1], rotB[1], t) + pointerX * 0.16 + motion.x.velocity * 0.1,
          dt, 0.8, 0.8,
        ),
      0,
    );

    if (materials.length === 0) {
      applyMobileHeroScrollFade();
      return;
    }

    const materialSlug =
      SECTION_ORDER[Math.round(MathUtils.clamp(along, 0, SECTION_ORDER.length - 1))];
    if (materialSlug !== lastMaterialSlugRef.current) {
      lastMaterialSlugRef.current = materialSlug;
      const anchorM = sectionAnchors[materialSlug];
      const presetM = materialPresets[anchorM.materialPreset];
      const accentM = new Color(presetM.accentLight);

      materials.forEach((mat) => killMaterialTweens(mat));

      materials.forEach((mat) =>
        tweenMaterialToPreset(mat, presetM),
      );
      if (rim) {
        gsap.killTweensOf(rim);
        gsap.killTweensOf(rim.color);
        gsap.to(rim.color, {
          r: accentM.r,
          g: accentM.g,
          b: accentM.b,
          duration: 1.1,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(rim, {
          intensity: presetM.rimIntensity,
          duration: 1.05,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }

    applyMobileHeroScrollFade();
  });

  return (
    <group ref={poseGroupRef}>
      <group ref={mobileHeroFadeRef}>
        <group ref={driftGroupRef}>
          <pointLight
            ref={rimLightRef}
            position={[0.55, 0.4, 1.85]}
            intensity={0.52}
            distance={9}
            decay={2}
          />
          <group
            ref={spinGroupRef}
            rotation={[0, MODEL_FORWARD_YAW_OFFSET + SCENE_MOTION.baseYaw, 0]}
          >
            <primitive object={model} />
          </group>
          {viewportScaleBoost !== VIEWPORT_SCALE_MOBILE && <PortraitOrbit />}
          <ContactShadows
            position={[0, -1.08, 0]}
            opacity={0.28}
            scale={5.5}
            blur={2.8}
            far={1.8}
            color="#071018"
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(HERO_SCENE_MODEL_GLB);
