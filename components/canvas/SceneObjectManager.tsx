"use client";

import { useSceneState } from "@/context/scene-state-context";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Group, Mesh, MeshPhysicalMaterial } from "three";

const materialPresets = {
  glass: {
    color: "#8cc7ff",
    roughness: 0.32,
    metalness: 0.2,
    envMapIntensity: 0.75,
    transmission: 0.08,
    thickness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    spinSpeed: 0.24,
  },
  chrome: {
    color: "#bdd1ff",
    roughness: 0.2,
    metalness: 0.58,
    envMapIntensity: 0.95,
    transmission: 0,
    thickness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    spinSpeed: 0.3,
  },
  matte: {
    color: "#8f95aa",
    roughness: 0.72,
    metalness: 0.06,
    envMapIntensity: 0.4,
    transmission: 0,
    thickness: 0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.55,
    spinSpeed: 0.14,
  },
  neon: {
    color: "#87ffe1",
    roughness: 0.3,
    metalness: 0.3,
    envMapIntensity: 0.8,
    transmission: 0.02,
    thickness: 0.05,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
    spinSpeed: 0.34,
  },
};

export default function SceneObjectManager() {
  const { activeSection } = useSceneState();
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const wireRef = useRef<Mesh>(null);
  const enteredRef = useRef(false);
  const spinSpeedRef = useRef(0.2);
  const initializedRef = useRef(false);
  const anchorRef = useRef(sectionAnchors[activeSection]);
  const frameClockRef = useRef(0);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  useEffect(() => {
    const group = groupRef.current;
    const material = materialRef.current;
    const wire = wireRef.current;
    if (!group || !material || !wire) {
      return;
    }

    const anchor = sectionAnchors[activeSection];
    anchorRef.current = anchor;
    const preset = materialPresets[anchor.materialPreset];
    const safePosition = {
      x: clamp(anchor.objectTransform.position[0], -1.05, 1.05),
      y: clamp(anchor.objectTransform.position[1], -0.4, 0.4),
      z: clamp(anchor.objectTransform.position[2], -0.65, 0.1),
    };
    const safeScale = {
      x: clamp(anchor.objectTransform.scale[0], 1, 1.35),
      y: clamp(anchor.objectTransform.scale[1], 1, 1.35),
      z: clamp(anchor.objectTransform.scale[2], 1, 1.35),
    };
    spinSpeedRef.current = preset.spinSpeed;

    if (!enteredRef.current) {
      enteredRef.current = true;
      group.visible = false;
      material.setValues({
        color: preset.color,
        roughness: preset.roughness,
        metalness: preset.metalness,
        envMapIntensity: preset.envMapIntensity,
        transmission: preset.transmission,
        thickness: preset.thickness,
        clearcoat: preset.clearcoat,
        clearcoatRoughness: preset.clearcoatRoughness,
        emissive: preset.color,
        emissiveIntensity: 0.22,
      });
      group.position.set(
        safePosition.x,
        safePosition.y,
        safePosition.z
      );
      group.scale.set(safeScale.x, safeScale.y, safeScale.z);
      group.visible = true;
      initializedRef.current = true;
      gsap.fromTo(
        group.scale,
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
        group.rotation,
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

    gsap.killTweensOf(group.rotation);
    gsap.killTweensOf(group.position);
    gsap.killTweensOf(group.scale);
    gsap.killTweensOf(wire.scale);
    gsap.killTweensOf(material);

    gsap.to(group.position, {
      x: safePosition.x,
      y: safePosition.y,
      z: safePosition.z,
      duration: 1.2,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    gsap.to(group.rotation, {
      x: anchor.objectTransform.rotation[0],
      y: anchor.objectTransform.rotation[1],
      z: anchor.objectTransform.rotation[2],
      duration: 1.6,
      ease: "power3.inOut",
      overwrite: "auto",
    });
    gsap.to(group.scale, {
      x: safeScale.x,
      y: safeScale.y,
      z: safeScale.z,
      duration: 1.2,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(wire.scale, {
      x: 1.15 + safeScale.x * 0.22,
      y: 1.15 + safeScale.y * 0.22,
      z: 1.15 + safeScale.z * 0.22,
      duration: 1.1,
      ease: "sine.out",
      overwrite: "auto",
    });

    gsap.to(material, {
      duration: 1.1,
      color: preset.color,
      roughness: preset.roughness,
      metalness: preset.metalness,
      envMapIntensity: preset.envMapIntensity,
      transmission: preset.transmission,
      thickness: preset.thickness,
      clearcoat: preset.clearcoat,
      clearcoatRoughness: preset.clearcoatRoughness,
      emissive: preset.color,
      emissiveIntensity: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [activeSection]);

  useFrame((state, delta) => {
    frameClockRef.current += delta;
    const group = groupRef.current;
    const wire = wireRef.current;
    if (!group || !initializedRef.current) {
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

    group.rotation.x += Math.sin(frameClockRef.current * 0.08) * 0.0025;
    group.rotation.z += Math.cos(frameClockRef.current * 0.09) * 0.002;
    group.rotation.y += delta * spinSpeedRef.current * microMotion.orbitBoost;
    group.rotation.x += delta * 0.06;
    group.position.x += (targetX - group.position.x) * 0.06;
    group.position.y += (targetY - group.position.y) * 0.06;
    group.position.z += (targetZ - group.position.z) * 0.06;

    if (wire) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * microMotion.wirePulse;
      wire.scale.setScalar(wire.scale.x * 0.97 + pulse * 0.03);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.85, 0.26, 220, 32]} />
        <meshPhysicalMaterial ref={materialRef} transparent={false} opacity={1} />
      </mesh>
      <mesh ref={wireRef} scale={1.25}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshStandardMaterial color="#ffffff" wireframe opacity={0.2} transparent />
      </mesh>
      <mesh scale={0.23}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#a8d3ff" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}
