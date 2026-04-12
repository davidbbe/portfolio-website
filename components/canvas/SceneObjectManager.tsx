"use client";

import { useSceneState } from "@/context/scene-state-context";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import { HERO_SCENE_MODEL_GLB } from "@/lib/scene/sceneConfig";
import type { MaterialPreset } from "@/lib/scene/types";
import { Center, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PointLight,
} from "three";

/** How strongly section presets tint textured albedo (multiply with baseColor map). */
const TEXTURE_TINT_STRENGTH = 0.14;

/** Yaw on the turntable group so a typical -Z-forward glTF bust faces the camera at +Z. */
const MODEL_FORWARD_YAW_OFFSET = Math.PI;

/** Scales turntable speed (rad/s) after preset `spinSpeed` × `microMotion.orbitBoost`. */
const TURNTABLE_SPEED_MULTIPLIER = 2.2;

/** Extra uniform scale on tablet/desktop (multiplies section `safeScale`; mobile stays 1). */
const VIEWPORT_SCALE_MOBILE = 1;
const VIEWPORT_SCALE_TABLET = 1.16;
const VIEWPORT_SCALE_DESKTOP = 1.32;

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
    roughness: 0.38,
    metalness: 0.14,
    envMapIntensity: 0.72,
    transmission: 0,
    thickness: 0.2,
    clearcoat: 0.42,
    clearcoatRoughness: 0.22,
    spinSpeed: 0.24,
    emissiveIntensity: 0.12,
    accentLight: "#b4d4ff",
    rimIntensity: 0.52,
  },
  chrome: {
    color: "#c8d8ff",
    roughness: 0.22,
    metalness: 0.52,
    envMapIntensity: 0.92,
    transmission: 0,
    thickness: 0.2,
    clearcoat: 0.75,
    clearcoatRoughness: 0.12,
    spinSpeed: 0.3,
    emissiveIntensity: 0.08,
    accentLight: "#d8e4ff",
    rimIntensity: 0.62,
  },
  matte: {
    color: "#9aa0b0",
    roughness: 0.78,
    metalness: 0.05,
    envMapIntensity: 0.38,
    transmission: 0,
    thickness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.55,
    spinSpeed: 0.18,
    emissiveIntensity: 0.04,
    accentLight: "#8a92a8",
    rimIntensity: 0.38,
  },
  neon: {
    color: "#7dffe8",
    roughness: 0.28,
    metalness: 0.28,
    envMapIntensity: 0.78,
    transmission: 0,
    thickness: 0.05,
    clearcoat: 0.55,
    clearcoatRoughness: 0.28,
    spinSpeed: 0.34,
    emissiveIntensity: 0.38,
    accentLight: "#5cffd8",
    rimIntensity: 0.85,
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

function collectMeshMaterials(root: Mesh): (MeshStandardMaterial | MeshPhysicalMaterial)[] {
  const out: (MeshStandardMaterial | MeshPhysicalMaterial)[] = [];
  const m = root.material;
  const list = Array.isArray(m) ? m : [m];
  for (const mat of list) {
    if (mat instanceof MeshStandardMaterial || mat instanceof MeshPhysicalMaterial) {
      out.push(mat);
    }
  }
  return out;
}

function preservePbrOnMaterial(mat: MeshStandardMaterial | MeshPhysicalMaterial) {
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
    physicalTransmission: mat instanceof MeshPhysicalMaterial ? mat.transmission : 0,
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
  presetKey: MaterialPreset
) {
  const p = mat.userData.__pbr as PreservedPbr | undefined;
  if (!p) {
    return;
  }

  if (shouldPreserveBaseColor(p)) {
    mat.color.copy(tintedBaseColor(preset));
    if (presetKey === "neon") {
      mat.emissive.set(preset.accentLight);
      mat.emissiveIntensity = Math.min(0.14, preset.emissiveIntensity * 0.35);
    } else {
      mat.emissive.setRGB(0, 0, 0);
      mat.emissiveIntensity = 0;
    }
    mat.roughness = MathUtils.lerp(p.roughness, preset.roughness, 0.22);
    mat.metalness = MathUtils.lerp(p.metalness, preset.metalness, 0.22);
    if ("envMapIntensity" in mat && typeof mat.envMapIntensity === "number") {
      mat.envMapIntensity = MathUtils.lerp(
        p.envMapIntensity,
        preset.envMapIntensity,
        0.35
      );
    }
    if (mat instanceof MeshPhysicalMaterial) {
      mat.transmission = MathUtils.lerp(p.physicalTransmission, preset.transmission, 0.35);
      mat.thickness = preset.thickness;
      mat.clearcoat = MathUtils.lerp(p.physicalClearcoat, preset.clearcoat, 0.25);
      mat.clearcoatRoughness = MathUtils.lerp(
        p.physicalClearcoatRoughness,
        preset.clearcoatRoughness,
        0.25
      );
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
  presetKey: MaterialPreset
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
    let targetEmissiveIntensity = 0;
    if (presetKey === "neon") {
      targetEmissive.set(preset.accentLight);
      targetEmissiveIntensity = Math.min(0.14, preset.emissiveIntensity * 0.35);
    }

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
    gsap.to(mat, {
      emissiveIntensity: targetEmissiveIntensity,
      roughness: MathUtils.lerp(p.roughness, preset.roughness, 0.22),
      metalness: MathUtils.lerp(p.metalness, preset.metalness, 0.22),
      duration,
      ease,
      overwrite: "auto",
    });
    if ("envMapIntensity" in mat && typeof mat.envMapIntensity === "number") {
      gsap.to(mat, {
        envMapIntensity: MathUtils.lerp(
          p.envMapIntensity,
          preset.envMapIntensity,
          0.35
        ),
        duration,
        ease,
        overwrite: "auto",
      });
    }
    if (mat instanceof MeshPhysicalMaterial) {
      gsap.to(mat, {
        transmission: MathUtils.lerp(p.physicalTransmission, preset.transmission, 0.35),
        thickness: preset.thickness,
        clearcoat: MathUtils.lerp(p.physicalClearcoat, preset.clearcoat, 0.25),
        clearcoatRoughness: MathUtils.lerp(
          p.physicalClearcoatRoughness,
          preset.clearcoatRoughness,
          0.25
        ),
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
  const { activeSection } = useSceneState();
  const { scene } = useGLTF(HERO_SCENE_MODEL_GLB);
  const [viewportScaleBoost, setViewportScaleBoost] = useState(VIEWPORT_SCALE_MOBILE);

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 767px)");
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

  /** Section pose: position, scale, rotation from GSAP (no continuous spin). */
  const poseGroupRef = useRef<Group>(null);
  /** Turntable: only `rotation.y` is updated each frame — avoids Euler “tumbling”. */
  const spinGroupRef = useRef<Group>(null);
  const rimLightRef = useRef<PointLight>(null);
  const materialsRef = useRef<(MeshStandardMaterial | MeshPhysicalMaterial)[]>([]);
  const enteredRef = useRef(false);
  const spinSpeedRef = useRef(0.2);
  const initializedRef = useRef(false);
  const anchorRef = useRef(sectionAnchors[activeSection]);
  const frameClockRef = useRef(0);

  const model = useMemo(() => {
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
    materialsRef.current = materials;
    return clone;
  }, [scene]);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  useEffect(() => {
    const pose = poseGroupRef.current;
    const rim = rimLightRef.current;
    const materials = materialsRef.current;
    if (!pose || !rim || materials.length === 0) {
      return;
    }

    const anchor = sectionAnchors[activeSection];
    anchorRef.current = anchor;
    const preset = materialPresets[anchor.materialPreset];
    const presetKey = anchor.materialPreset;
    const safePosition = {
      x: clamp(anchor.objectTransform.position[0], -1.05, 1.05),
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
    spinSpeedRef.current = preset.spinSpeed;

    const accent = new Color(preset.accentLight);

    if (!enteredRef.current) {
      enteredRef.current = true;
      pose.visible = false;
      materials.forEach((mat) => applyPresetToMaterial(mat, preset, presetKey));
      rim.color.copy(accent);
      rim.intensity = preset.rimIntensity;
      pose.position.set(safePosition.x, safePosition.y, safePosition.z);
      pose.scale.set(safeScale.x, safeScale.y, safeScale.z);
      pose.visible = true;
      initializedRef.current = true;
      gsap.fromTo(
        pose.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        {
          x: safeScale.x,
          y: safeScale.y,
          z: safeScale.z,
          duration: 1.6,
          ease: "expo.out",
        }
      );
      gsap.fromTo(
        pose.rotation,
        { x: -1.2, y: -1.8, z: 0.7 },
        {
          x: anchor.objectTransform.rotation[0],
          y: anchor.objectTransform.rotation[1],
          z: anchor.objectTransform.rotation[2],
          duration: 1.8,
          ease: "power3.out",
        }
      );
    }

    gsap.killTweensOf(pose.rotation);
    gsap.killTweensOf(pose.position);
    gsap.killTweensOf(pose.scale);
    materials.forEach((mat) => killMaterialTweens(mat));
    gsap.killTweensOf(rim);
    gsap.killTweensOf(rim.color);

    gsap.to(pose.position, {
      x: safePosition.x,
      y: safePosition.y,
      z: safePosition.z,
      duration: 1.2,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    gsap.to(pose.rotation, {
      x: anchor.objectTransform.rotation[0],
      y: anchor.objectTransform.rotation[1],
      z: anchor.objectTransform.rotation[2],
      duration: 1.6,
      ease: "power3.inOut",
      overwrite: "auto",
    });
    gsap.to(pose.scale, {
      x: safeScale.x,
      y: safeScale.y,
      z: safeScale.z,
      duration: 1.2,
      ease: "power3.out",
      overwrite: "auto",
    });

    materials.forEach((mat) => tweenMaterialToPreset(mat, preset, presetKey));

    gsap.to(rim.color, {
      r: accent.r,
      g: accent.g,
      b: accent.b,
      duration: 1.1,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(rim, {
      intensity: preset.rimIntensity,
      duration: 1.05,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [activeSection, model, viewportScaleBoost]);

  useFrame((_state, delta) => {
    frameClockRef.current += delta;
    const pose = poseGroupRef.current;
    const spin = spinGroupRef.current;
    if (!pose || !spin || !initializedRef.current) {
      return;
    }

    const anchor = anchorRef.current;
    const microMotion = anchor.microMotion ?? {
      orbitBoost: 0.2,
      wirePulse: 0.016,
      driftStrength: 0.012,
    };

    const driftX = Math.sin(frameClockRef.current * 0.35) * microMotion.driftStrength;
    const driftY = Math.cos(frameClockRef.current * 0.45) * microMotion.driftStrength;

    const targetX = anchor.objectTransform.position[0] + driftX;
    const targetY = anchor.objectTransform.position[1] + driftY;
    const targetZ = anchor.objectTransform.position[2];

    // Turntable: local Y only on the inner group (no X/Z — avoids head-over-feet tumbling).
    spin.rotation.y +=
      delta *
      spinSpeedRef.current *
      microMotion.orbitBoost *
      TURNTABLE_SPEED_MULTIPLIER;

    pose.position.x += (targetX - pose.position.x) * 0.06;
    pose.position.y += (targetY - pose.position.y) * 0.06;
    pose.position.z += (targetZ - pose.position.z) * 0.06;
  });

  return (
    <group ref={poseGroupRef}>
      <pointLight
        ref={rimLightRef}
        position={[0.55, 0.4, 1.85]}
        intensity={0.52}
        distance={9}
        decay={2}
      />
      <group ref={spinGroupRef} rotation={[0, MODEL_FORWARD_YAW_OFFSET, 0]}>
        <Center>
          <primitive object={model} />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload(HERO_SCENE_MODEL_GLB);
