"use client";

import { useMemo } from "react";
import { useSceneState } from "@/context/scene-state-context";
import { sectionAnchors } from "@/lib/scene/sectionAnchors";

export function useSectionMouseProfile() {
  const { activeSection } = useSceneState();

  return useMemo(() => {
    return sectionAnchors[activeSection].mouseProfile;
  }, [activeSection]);
}
