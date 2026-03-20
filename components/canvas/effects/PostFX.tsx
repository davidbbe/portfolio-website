"use client";

import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { POST_FX_CONFIG } from "@/lib/scene/sceneConfig";

export default function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={Math.min(POST_FX_CONFIG.bloomIntensity, 0.42)}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.8}
      />
      <Noise
        opacity={Math.min(POST_FX_CONFIG.noiseOpacity, 0.035)}
        blendFunction={BlendFunction.SOFT_LIGHT}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={
          new Vector2(
            POST_FX_CONFIG.chromaticOffset * 0.35,
            POST_FX_CONFIG.chromaticOffset * 0.35
          )
        }
        radialModulation
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}
