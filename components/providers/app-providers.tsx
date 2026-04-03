"use client";

import { SceneStateProvider } from "@/context/scene-state-context";
import SmoothScrollProvider from "./smooth-scroll-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <SceneStateProvider>{children}</SceneStateProvider>
    </SmoothScrollProvider>
  );
}
