"use client";

import { DEFAULT_SECTION } from "@/lib/scene/sceneConfig";
import type { SectionSlug } from "@/lib/scene/types";
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type SceneStateContextType = {
  activeSection: SectionSlug;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionSlug>>;
  /** Continuous scroll index for blending 3D poses (0 = hero … see SECTION_ORDER). */
  scrollAlongRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
};

const SceneStateContext = createContext<SceneStateContextType | null>(null);

export function SceneStateProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionSlug>(DEFAULT_SECTION);
  const scrollAlongRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const value = useMemo(
    () => ({ activeSection, setActiveSection, scrollAlongRef, pointerRef }),
    [activeSection],
  );

  return (
    <SceneStateContext.Provider value={value}>
      {children}
    </SceneStateContext.Provider>
  );
}

export function useSceneState() {
  const context = useContext(SceneStateContext);

  if (!context) {
    throw new Error("useSceneState must be used inside SceneStateProvider");
  }

  return context;
}
