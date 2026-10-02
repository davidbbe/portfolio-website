"use client";

/* R3F useFrame is supposed to mutate the three.js camera each tick. */
/* eslint-disable react-hooks/immutability */

import { useSceneState } from "@/context/scene-state-context";
import { cinematicEase } from "@/lib/scene/motion";
import { SCENE_DAMPING, SECTION_ORDER } from "@/lib/scene/sceneConfig";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";
import { sectionBlend } from "@/lib/scene/scrollAlong";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";

export default function SceneRig() {
  const { scrollAlongRef, pointerRef } = useSceneState();
  const { camera } = useThree();
  const alongSmoothRef = useRef(0);
  const alongReadyRef = useRef(false);
  const targetPosition = useRef(new Vector3(0, 0.02, 5.22));
  const lookTarget = useRef(new Vector3(0, 0.04, 0));
  const lookSmoothed = useRef(new Vector3(0, 0.04, 0));

  useEffect(() => {
    const onMouseMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current = { x, y };
    };

    const resetPointer = () => { pointerRef.current = { x: 0, y: 0 }; };
    window.addEventListener("pointermove", onMouseMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    return () => {
      window.removeEventListener("pointermove", onMouseMove);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
    };
  }, [pointerRef]);

  useFrame((_state, delta) => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    const dt = Math.min(delta, 0.05);
    if (!alongReadyRef.current) {
      alongSmoothRef.current = scrollAlongRef.current;
      alongReadyRef.current = true;
    } else {
      alongSmoothRef.current = MathUtils.damp(
        alongSmoothRef.current,
        scrollAlongRef.current,
        SCENE_DAMPING.along,
        dt,
      );
    }

    const along = alongSmoothRef.current;
    const { i, j, t: linearT } = sectionBlend(along, SECTION_ORDER.length);
    const t = cinematicEase(linearT);
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
    const lookY = MathUtils.lerp(lookA[1], lookB[1], t);
    const lookZ = MathUtils.lerp(lookA[2], lookB[2], t);

    const mouse = pointerRef.current;
    const profileA = anchorA.mouseProfile;
    const profileB = anchorB.mouseProfile;
    const mouseProfile = {
      xStrength: MathUtils.lerp(profileA.xStrength, profileB.xStrength, t),
      yStrength: MathUtils.lerp(profileA.yStrength, profileB.yStrength, t),
      rotationStrength: MathUtils.lerp(profileA.rotationStrength, profileB.rotationStrength, t),
    };
    const camAlpha = 1 - Math.exp(-SCENE_DAMPING.camera * dt);

    targetPosition.current.set(
      hintX + mouse.x * mouseProfile.xStrength * 0.7,
      hintY - mouse.y * mouseProfile.yStrength * 0.7,
      hintZ,
    );
    camera.position.lerp(targetPosition.current, camAlpha);

    const nextFov = MathUtils.damp(camera.fov, fovTarget, SCENE_DAMPING.camera, dt);
    if (Math.abs(camera.fov - nextFov) > 0.001) {
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }

    lookTarget.current.set(
      // Keep look-at X on the scene center so lateral pose actually reads as
      // left/right on the page. Tracking the bust recenters it when scroll stops.
      mouse.x * mouseProfile.rotationStrength * 0.15,
      lookY - mouse.y * mouseProfile.rotationStrength * 0.15,
      lookZ,
    );
    lookSmoothed.current.lerp(lookTarget.current, camAlpha);
    camera.lookAt(lookSmoothed.current);
  });

  return null;
}
