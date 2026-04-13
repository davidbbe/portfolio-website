"use client";

import { useSceneState } from "@/context/scene-state-context";
import { useSectionMouseProfile } from "@/hooks/useSectionMouseProfile";
import { SECTION_ORDER } from "@/lib/scene/sceneConfig";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";

export default function SceneRig() {
  const { scrollAlongRef } = useSceneState();
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

    const along = scrollAlongRef.current;
    const last = SECTION_ORDER.length - 1;
    const i = Math.floor(MathUtils.clamp(along, 0, last));
    const j = Math.min(i + 1, last);
    const t = along - i;
    const slugA = SECTION_ORDER[i];
    const slugB = SECTION_ORDER[j];
    const anchorA = sectionAnchors[slugA];
    const anchorB = sectionAnchors[slugB];

    const hintA = anchorA.cameraHint?.position ?? [0, 0, 5.4];
    const hintB = anchorB.cameraHint?.position ?? [0, 0, 5.4];
    const fovA = anchorA.cameraHint?.fov ?? 47;
    const fovB = anchorB.cameraHint?.fov ?? 47;

    const hintX = MathUtils.lerp(hintA[0], hintB[0], t);
    const hintY = MathUtils.lerp(hintA[1], hintB[1], t);
    const hintZ = MathUtils.lerp(hintA[2], hintB[2], t);
    const fovTarget = MathUtils.lerp(fovA, fovB, t);

    const lookA = anchorA.objectTransform.position;
    const lookB = anchorB.objectTransform.position;
    const lookX = MathUtils.lerp(lookA[0], lookB[0], t);
    const lookY = MathUtils.lerp(lookA[1], lookB[1], t);
    const lookZ = MathUtils.lerp(lookA[2], lookB[2], t);

    const mouse = mouseRef.current;

    targetPosition.current.set(
      hintX + mouse.x * mouseProfile.xStrength * 0.7,
      hintY - mouse.y * mouseProfile.yStrength * 0.7,
      hintZ,
    );

    camera.position.lerp(targetPosition.current, mouseProfile.smoothing);

    if (Math.abs(camera.fov - fovTarget) > 0.05) {
      camera.fov += (fovTarget - camera.fov) * 0.06;
      camera.updateProjectionMatrix();
    }

    camera.lookAt(
      lookX + mouse.x * mouseProfile.rotationStrength * 0.15,
      lookY - mouse.y * mouseProfile.rotationStrength * 0.15,
      lookZ,
    );
  });

  return null;
}
