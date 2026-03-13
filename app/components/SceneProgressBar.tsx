"use client";
import "@/app/styles/SceneProgressBar.css";
import { useEffect, useState } from "react";
import { useSceneProgress } from "@/app/context/SceneProgressContext";

export default function SceneProgressBar() {
  const { progress } = useSceneProgress();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 900);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <div className="scene-bar">
      <div
        className={`scene-bar-fill ${pulse ? "pulse" : ""}`}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
