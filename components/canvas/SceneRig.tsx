"use client";

import { useSceneState } from "@/context/scene-state-context";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import { useSectionMouseProfile } from "@/hooks/useSectionMouseProfile";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Vector3 } from "three";

export default function SceneRig() {
  const { activeSection } = useSceneState();
  const mouseProfile = useSectionMouseProfile();
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new Vector3(0, 0, 5));

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    const anchor = sectionAnchors[activeSection];
    const hint = anchor.cameraHint?.position ?? [0, 0, 5.4];
    const fovTarget = anchor.cameraHint?.fov ?? 47;
    const mouse = mouseRef.current;

    targetPosition.current.set(
      hint[0] + mouse.x * mouseProfile.xStrength * 0.7,
      hint[1] - mouse.y * mouseProfile.yStrength * 0.7,
      hint[2]
    );

    camera.position.lerp(targetPosition.current, mouseProfile.smoothing);

    if (Math.abs(camera.fov - fovTarget) > 0.05) {
      camera.fov += (fovTarget - camera.fov) * 0.06;
      camera.updateProjectionMatrix();
    }

    const target = anchor.objectTransform.position;
    camera.lookAt(
      target[0] + mouse.x * mouseProfile.rotationStrength * 0.15,
      target[1] - mouse.y * mouseProfile.rotationStrength * 0.15,
      target[2]
    );
  });

  return null;
}
