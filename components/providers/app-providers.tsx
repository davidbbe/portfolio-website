"use client";

import { Toaster } from "react-hot-toast";
import { SceneStateProvider } from "@/context/scene-state-context";
import SmoothScrollProvider from "./smooth-scroll-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <SceneStateProvider>
        {children}
        <Toaster position="bottom-center" />
      </SceneStateProvider>
    </SmoothScrollProvider>
  );
}
