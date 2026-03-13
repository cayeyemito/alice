"use client";

import { createContext, useContext, useState } from "react";

type SceneProgressContextType = {
  progress: number;
  setProgress: (value: number) => void;
};

const SceneProgressContext =
  createContext<SceneProgressContextType | null>(null);

export function SceneProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);

  return (
    <SceneProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </SceneProgressContext.Provider>
  );
}

export function useSceneProgress() {
  const ctx = useContext(SceneProgressContext);
  if (!ctx) {
    throw new Error(
      "useSceneProgress must be used inside SceneProgressProvider"
    );
  }
  return ctx;
}
