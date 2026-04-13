"use client";

import { useSceneState } from "@/context/scene-state-context";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import { HERO_SCENE_MODEL_GLB, SECTION_ORDER } from "@/lib/scene/sceneConfig";
import type { MaterialPreset, SectionSlug } from "@/lib/scene/types";
import { Center, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  Euler,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PointLight,
  Quaternion,
  Texture,
} from "three";

/** How strongly section presets tint textured albedo (multiply with baseColor map). */
const TEXTURE_TINT_STRENGTH = 0.14;

/** Yaw on the turntable group so a typical -Z-forward glTF bust faces the camera at +Z. */
const MODEL_FORWARD_YAW_OFFSET = Math.PI;

/** Scales turntable speed (rad/s) after preset `spinSpeed` × `microMotion.orbitBoost`. */
const TURNTABLE_SPEED_MULTIPLIER = 5.5;

/** Extra uniform scale on tablet/desktop (multiplies section `safeScale`; mobile stays 1). */
const VIEWPORT_SCALE_MOBILE = 1;
const VIEWPORT_SCALE_TABLET = 1.2;
const VIEWPORT_SCALE_DESKTOP = 1.4;

/** Hero → About: bust fades out on narrow viewports by `scrollAlong` index 1. */
const MOBILE_HERO_FADE_POWER = 2.05;
const MOBILE_HERO_FADE_SCALE_DROP = 0.22;
const MOBILE_HERO_FADE_LIFT = 0.2;
const MOBILE_HERO_FADE_WOBBLE = 0.14;
const MOBILE_HERO_FADE_SPIN_BOOST = 4.2;

/** Photogrammetry / textured scan: diffuse look, no metallic sheen or clearcoat. */
const SCAN_METALNESS = 0;
const SCAN_ROUGHNESS_FLOOR = 0.72;
const SCAN_ENV_MAP_INTENSITY = 0.22;

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
  presetKey: MaterialPreset,
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
  presetKey: MaterialPreset,
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
  const { scrollAlongRef } = useSceneState();
  const { scene } = useGLTF(HERO_SCENE_MODEL_GLB);
  const { gl } = useThree();
  const [viewportScaleBoost, setViewportScaleBoost] = useState(
    VIEWPORT_SCALE_MOBILE,
  );

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

  /** Section pose: position, scale, rotation from GSAP only (no per-frame position fight). */
  const poseGroupRef = useRef<Group>(null);
  /** Narrow-viewport hero scroll fade: opacity + playful motion (does not fight GSAP pose). */
  const mobileHeroFadeRef = useRef<Group>(null);
  /** Subtle scroll-section drift; kept separate so GSAP can own `poseGroupRef` transforms. */
  const driftGroupRef = useRef<Group>(null);
  /** Turntable: only `rotation.y` is updated each frame — avoids Euler “tumbling”. */
  const spinGroupRef = useRef<Group>(null);
  const rimLightRef = useRef<PointLight>(null);
  const materialsRef = useRef<(MeshStandardMaterial | MeshPhysicalMaterial)[]>(
    [],
  );
  const enteredRef = useRef(false);
  const introCompleteRef = useRef(false);
  const lastMaterialSlugRef = useRef<SectionSlug | null>(null);
  const initializedRef = useRef(false);
  const frameClockRef = useRef(0);
  const rotScratchRef = useRef({
    e1: new Euler(),
    e2: new Euler(),
    q1: new Quaternion(),
    q2: new Quaternion(),
    qm: new Quaternion(),
  });

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

  useLayoutEffect(() => {
    const maxAniso = Math.min(16, gl.capabilities.getMaxAnisotropy());
    applyMaxAnisotropy(model, maxAniso);
  }, [model, gl]);

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

    const accent = new Color(preset.accentLight);

    pose.visible = false;
    materials.forEach((mat) => applyPresetToMaterial(mat, preset, presetKey));
    rim.color.copy(accent);
    rim.intensity = preset.rimIntensity;
    pose.position.set(safePosition.x, safePosition.y, safePosition.z);
    pose.scale.set(safeScale.x, safeScale.y, safeScale.z);
    pose.visible = true;
    initializedRef.current = true;
    lastMaterialSlugRef.current = "hero";

    gsap
      .timeline({
        onComplete: () => {
          introCompleteRef.current = true;
        },
      })
      .fromTo(
        pose.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        {
          x: safeScale.x,
          y: safeScale.y,
          z: safeScale.z,
          duration: 1.6,
          ease: "expo.out",
        },
        0,
      )
      .fromTo(
        pose.rotation,
        { x: -1.2, y: -1.8, z: 0.7 },
        {
          x: anchor.objectTransform.rotation[0],
          y: anchor.objectTransform.rotation[1],
          z: anchor.objectTransform.rotation[2],
          duration: 1.8,
          ease: "power3.out",
        },
        0,
      );
  }, [model, viewportScaleBoost]);

  useFrame((_state, delta) => {
    frameClockRef.current += delta;
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

    const along = scrollAlongRef.current;
    const lastIdx = SECTION_ORDER.length - 1;
    const i = Math.floor(MathUtils.clamp(along, 0, lastIdx));
    const j = Math.min(i + 1, lastIdx);
    const t = along - i;
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
      const wobbleT = alongClamped * Math.PI * 2.5;
      const wobble =
        Math.sin(wobbleT) * MOBILE_HERO_FADE_WOBBLE * alongClamped;
      const lift = MOBILE_HERO_FADE_LIFT * Math.pow(alongClamped, 1.65);
      const scaleUniform = clamp(
        1 - MOBILE_HERO_FADE_SCALE_DROP * Math.pow(alongClamped, 1.35),
        0.2,
        1,
      );

      mobileFadeWrap.visible = opacity > 0.008;
      mobileFadeWrap.position.set(0, lift, 0);
      mobileFadeWrap.scale.set(scaleUniform, scaleUniform, scaleUniform);
      mobileFadeWrap.rotation.set(0, 0, wobble);

      const transparent = opacity < 0.995;
      for (const mat of materials) {
        mat.opacity = opacity;
        mat.transparent = transparent;
        mat.depthWrite = !transparent;
      }

      if (rim) {
        const rimBase = MathUtils.lerp(presetA.rimIntensity, presetB.rimIntensity, t);
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
    const orbitBoost = MathUtils.lerp(microA.orbitBoost, microB.orbitBoost, t);
    const spinSpeed = MathUtils.lerp(presetA.spinSpeed, presetB.spinSpeed, t);

    const driftX =
      Math.sin(frameClockRef.current * 0.35) * driftStrength;
    const driftY =
      Math.cos(frameClockRef.current * 0.45) * driftStrength;

    driftWrap.position.set(driftX, driftY, 0);

    spin.rotation.y +=
      delta *
      spinSpeed *
      orbitBoost *
      TURNTABLE_SPEED_MULTIPLIER *
      (isNarrowViewport
        ? 1 + clamp(along, 0, 1) * MOBILE_HERO_FADE_SPIN_BOOST
        : 1);

    if (!introCompleteRef.current) {
      applyMobileHeroScrollFade();
      return;
    }

    const posA = anchorA.objectTransform.position;
    const posB = anchorB.objectTransform.position;
    const rotA = anchorA.objectTransform.rotation;
    const rotB = anchorB.objectTransform.rotation;
    const scA = anchorA.objectTransform.scale;
    const scB = anchorB.objectTransform.scale;

    pose.position.set(
      clamp(MathUtils.lerp(posA[0], posB[0], t), -1.05, 1.05),
      clamp(MathUtils.lerp(posA[1], posB[1], t), -0.4, 0.4),
      clamp(MathUtils.lerp(posA[2], posB[2], t), -0.65, 0.1),
    );

    const { e1, e2, q1, q2, qm } = rotScratchRef.current;
    e1.set(rotA[0], rotA[1], rotA[2], "XYZ");
    e2.set(rotB[0], rotB[1], rotB[2], "XYZ");
    q1.setFromEuler(e1);
    q2.setFromEuler(e2);
    qm.copy(q1).slerp(q2, t);
    pose.rotation.setFromQuaternion(qm, "XYZ");

    const sx =
      clamp(MathUtils.lerp(scA[0], scB[0], t), 1, 1.35) * viewportScaleBoost;
    const sy =
      clamp(MathUtils.lerp(scA[1], scB[1], t), 1, 1.35) * viewportScaleBoost;
    const sz =
      clamp(MathUtils.lerp(scA[2], scB[2], t), 1, 1.35) * viewportScaleBoost;
    pose.scale.set(sx, sy, sz);

    if (materials.length === 0) {
      applyMobileHeroScrollFade();
      return;
    }

    const materialSlug =
      SECTION_ORDER[Math.round(MathUtils.clamp(along, 0, lastIdx))];
    if (materialSlug !== lastMaterialSlugRef.current) {
      lastMaterialSlugRef.current = materialSlug;
      const anchorM = sectionAnchors[materialSlug];
      const presetM = materialPresets[anchorM.materialPreset];
      const presetKeyM = anchorM.materialPreset;
      const accentM = new Color(presetM.accentLight);

      materials.forEach((mat) => killMaterialTweens(mat));

      materials.forEach((mat) =>
        tweenMaterialToPreset(mat, presetM, presetKeyM),
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
          <group ref={spinGroupRef} rotation={[0, MODEL_FORWARD_YAW_OFFSET, 0]}>
            <Center>
              <primitive object={model} />
            </Center>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(HERO_SCENE_MODEL_GLB);
