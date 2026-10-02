"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh } from "three";

/** Fine orbital arcs sit behind the portrait, with three small travelling lights. */
export default function PortraitOrbit() {
  const orbit = useRef<Group>(null);
  const satellite = useRef<Mesh>(null);
  const clock = useRef(0);

  useFrame((_state, delta) => {
    clock.current += Math.min(delta, 0.05);
    const time = clock.current;
    if (orbit.current) {
      orbit.current.rotation.set(
        0.28 + Math.sin(time * 0.16) * 0.14, time * 0.035, -0.28,
      );
    }
    if (satellite.current) {
      satellite.current.position.set(
        Math.cos(time * 0.24) * 0.86, Math.sin(time * 0.24) * 0.86, 0,
      );
    }
  });

  return (
    <group ref={orbit} position={[0, 0.08, -0.48]}>
      <mesh rotation={[0, 0, 0.45]}>
        <torusGeometry args={[0.86, 0.0028, 4, 120, Math.PI * 1.55]} />
        <meshBasicMaterial color="#82e7ee" transparent opacity={0.25} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.65, -0.4, 2.6]} scale={1.14}>
        <torusGeometry args={[0.86, 0.002, 4, 100, Math.PI * 1.2]} />
        <meshBasicMaterial color="#92aaff" transparent opacity={0.17} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={satellite}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#a4f5f1" toneMapped={false} />
      </mesh>
      <mesh position={[-0.6, -0.6, 0.05]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshBasicMaterial color="#92aaff" toneMapped={false} />
      </mesh>
      <mesh position={[0.82, 0.2, -0.1]}>
        <sphereGeometry args={[0.007, 8, 8]} />
        <meshBasicMaterial color="#a4f5f1" toneMapped={false} />
      </mesh>
    </group>
  );
}
