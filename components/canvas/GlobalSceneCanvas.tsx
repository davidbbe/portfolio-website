"use client";

import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three";
import SceneObjectManager from "./SceneObjectManager";
import SceneRig from "./SceneRig";
import PostFX from "./effects/PostFX";

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight
        args={["#d7e4ff", "#1c2438", 0.52]}
        position={[0, 2.5, 0]}
      />
      <directionalLight
        position={[2.8, 3.4, 3.6]}
        intensity={1.55}
        color="#fff6ee"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00015}
      />
      <directionalLight
        position={[-2.4, 1.2, 2.2]}
        intensity={0.36}
        color="#8fb0ff"
      />
      <pointLight position={[-1.6, 0.6, 3.2]} intensity={0.4} color="#7ba6ff" />
    </>
  );
}

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
        shadows="soft"
        dpr={isNarrowViewport ? [1, 1.35] : [1, 2]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
        camera={{ position: [0, 0.02, 5.22], fov: 48, near: 0.1, far: 100 }}
      >
        <SceneLights />
        <SceneRig />
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.42} />
          <SceneObjectManager />
        </Suspense>
        <PostFX />
      </Canvas>
    </div>
  );
}
