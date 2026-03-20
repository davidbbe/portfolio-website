"use client";

import { Canvas } from "@react-three/fiber";
import SceneObjectManager from "./SceneObjectManager";
import SceneRig from "./SceneRig";
import PostFX from "./effects/PostFX";

export default function GlobalSceneCanvas() {
  return (
    <div
      aria-hidden="true"
      className="canvas-shell canvas-shell--front"
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
        <hemisphereLight
          args={["#a5c8ff", "#21304e", 0.7]}
          position={[0, 2.5, 0]}
        />
        <SceneRig />
        <SceneObjectManager />
        <PostFX />
      </Canvas>
    </div>
  );
}
