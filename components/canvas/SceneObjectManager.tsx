"use client";

import { useSceneState } from "@/context/scene-state-context";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Group, MeshStandardMaterial } from "three";

const materialPresets = {
  glass: {
    color: "#8cc7ff",
    roughness: 0.1,
    metalness: 0.2,
    envMapIntensity: 1.2,
  },
  chrome: {
    color: "#d4ddff",
    roughness: 0.04,
    metalness: 1,
    envMapIntensity: 1.5,
  },
  matte: {
    color: "#8f95aa",
    roughness: 0.65,
    metalness: 0.1,
    envMapIntensity: 0.7,
  },
  neon: {
    color: "#87ffe1",
    roughness: 0.22,
    metalness: 0.45,
    envMapIntensity: 1.1,
  },
};

export default function SceneObjectManager() {
  const { activeSection } = useSceneState();
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) {
      return;
    }

    const anchor = sectionAnchors[activeSection];
    const preset = materialPresets[anchor.materialPreset];

    if (!enteredRef.current) {
      enteredRef.current = true;
      gsap.fromTo(
        group.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        {
          x: anchor.objectTransform.scale[0],
          y: anchor.objectTransform.scale[1],
          z: anchor.objectTransform.scale[2],
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

    gsap.to(group.position, {
      x: anchor.objectTransform.position[0],
      y: anchor.objectTransform.position[1],
      z: anchor.objectTransform.position[2],
      duration: 1.4,
      ease: "power3.inOut",
    });
    gsap.to(group.rotation, {
      x: anchor.objectTransform.rotation[0],
      y: anchor.objectTransform.rotation[1],
      z: anchor.objectTransform.rotation[2],
      duration: 1.6,
      ease: "power3.inOut",
    });
    gsap.to(group.scale, {
      x: anchor.objectTransform.scale[0],
      y: anchor.objectTransform.scale[1],
      z: anchor.objectTransform.scale[2],
      duration: 1.2,
      ease: "power3.out",
    });

    gsap.to(material, {
      duration: 1.1,
      color: preset.color,
      roughness: preset.roughness,
      metalness: preset.metalness,
      envMapIntensity: preset.envMapIntensity,
      emissive: preset.color,
      emissiveIntensity: 0.08,
      ease: "power2.out",
    });
  }, [activeSection]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    group.rotation.y += delta * 0.18;
    group.rotation.x += delta * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.85, 0.26, 220, 32]} />
        <meshStandardMaterial ref={materialRef} transparent opacity={0.95} />
      </mesh>
      <mesh scale={1.25}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshStandardMaterial color="#ffffff" wireframe opacity={0.2} transparent />
      </mesh>
    </group>
  );
}
