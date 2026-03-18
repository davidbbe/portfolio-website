"use client";

import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { POST_FX_CONFIG } from "@/lib/scene/sceneConfig";

export default function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={POST_FX_CONFIG.bloomIntensity}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.7}
      />
      <Noise opacity={POST_FX_CONFIG.noiseOpacity} blendFunction={BlendFunction.SOFT_LIGHT} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(POST_FX_CONFIG.chromaticOffset, POST_FX_CONFIG.chromaticOffset)}
        radialModulation
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}
