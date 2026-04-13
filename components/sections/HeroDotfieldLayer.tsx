"use client";

import { useSceneState } from "@/context/scene-state-context";

/**
 * Dot grid sits below the WebGL bust (z-index 11 vs canvas 12) but is not part of
 * `creative-main`, so typography and UI in main (13+) stay above the 3D layer.
 */
export default function HeroDotfieldLayer() {
  const { activeSection } = useSceneState();
  const isHero = activeSection === "hero";

  return (
    <div
      aria-hidden
      className="creative-hero-dotfield-layer"
      data-visible={isHero ? "true" : "false"}
    >
      <div className="creative-hero-dotfield-layer__inner" />
    </div>
  );
}
