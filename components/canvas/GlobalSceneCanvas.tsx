"use client";

import { useSceneState } from "@/context/scene-state-context";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import SceneObjectManager from "./SceneObjectManager";
import SceneRig from "./SceneRig";
import PostFX from "./effects/PostFX";

const foregroundSections = new Set(["hero", "projects"]);

export default function GlobalSceneCanvas() {
  const { activeSection } = useSceneState();
  const isForeground = foregroundSections.has(activeSection);

  return (
    <div
      aria-hidden="true"
      className={`canvas-shell ${isForeground ? "canvas-shell--front" : "canvas-shell--back"}`}
    >
      <Canvas
        shadows
        dpr={[1, 1.7]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
        }}
        camera={{ position: [0, 0, 5.2], fov: 48, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 3, 4]} intensity={1.4} castShadow />
        <pointLight position={[-2, 1, 3]} intensity={0.7} color="#7ba6ff" />
        <SceneRig />
        <SceneObjectManager />
        <Environment preset="city" />
        <PostFX />
      </Canvas>
    </div>
  );
}
