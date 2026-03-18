"use client";

import ThemeContextProvider from "@/context/theme-context";
import { SceneStateProvider } from "@/context/scene-state-context";
import SmoothScrollProvider from "./smooth-scroll-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeContextProvider>
      <SmoothScrollProvider>
        <SceneStateProvider>{children}</SceneStateProvider>
      </SmoothScrollProvider>
    </ThemeContextProvider>
  );
}
