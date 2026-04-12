"use client";

import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import SceneObjectManager from "./SceneObjectManager";
import SceneRig from "./SceneRig";
import PostFX from "./effects/PostFX";

export default function GlobalSceneCanvas() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  useEffect(() => {
    const motionMatch = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowMatch = window.matchMedia("(max-width: 768px)");

    const update = () => {
      setIsEnabled(!motionMatch.matches);
      setIsNarrowViewport(narrowMatch.matches);
    };

    update();
    motionMatch.addEventListener("change", update);
    narrowMatch.addEventListener("change", update);

    return () => {
      motionMatch.removeEventListener("change", update);
      narrowMatch.removeEventListener("change", update);
    };
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="canvas-shell canvas-shell--front"
    >
      <Canvas
        shadows
        dpr={isNarrowViewport ? [1, 1.25] : [1, 1.7]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
        }}
        camera={{ position: [0, 0, 5.2], fov: 48, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 3, 4]} intensity={1.4} castShadow />
        <pointLight position={[-2, 1, 3]} intensity={0.7} color="#7ba6ff" />
        <hemisphereLight
          args={["#a5c8ff", "#21304e", 0.7]}
          position={[0, 2.5, 0]}
        />
        <SceneRig />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <SceneObjectManager />
        </Suspense>
        <PostFX />
      </Canvas>
    </div>
  );
}
