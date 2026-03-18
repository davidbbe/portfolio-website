"use client";

import { DEFAULT_SECTION } from "@/lib/scene/sceneConfig";
import type { SectionSlug } from "@/lib/scene/types";
import React, { createContext, useContext, useMemo, useState } from "react";

type SceneStateContextType = {
  activeSection: SectionSlug;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionSlug>>;
};

const SceneStateContext = createContext<SceneStateContextType | null>(null);

export function SceneStateProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionSlug>(DEFAULT_SECTION);
  const value = useMemo(
    () => ({ activeSection, setActiveSection }),
    [activeSection]
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
