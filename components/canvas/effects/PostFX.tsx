"use client";

import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { POST_FX_CONFIG } from "@/lib/scene/sceneConfig";

export default function PostFX() {
  const isFineMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const isSmallViewport = window.innerWidth < 768;

  const bloomIntensity = isFineMotion
    ? POST_FX_CONFIG.bloomIntensity * (isSmallViewport ? 0.85 : 1)
    : 0.1;
  const noiseOpacity = isFineMotion
    ? POST_FX_CONFIG.noiseOpacity * (isSmallViewport ? 0.85 : 1)
    : 0.0;
  const chromaOffset = isFineMotion
    ? POST_FX_CONFIG.chromaticOffset
    : POST_FX_CONFIG.chromaticOffset * 0.15;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={isNaN(bloomIntensity) ? 0.15 : bloomIntensity}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.35}
      />
      <Noise
        opacity={isNaN(noiseOpacity) ? 0.0 : noiseOpacity}
        blendFunction={BlendFunction.SOFT_LIGHT}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={
          new Vector2(
            chromaOffset * 0.35,
            chromaOffset * 0.35
          )
        }
        radialModulation
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}
