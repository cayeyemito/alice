"use client";
import "@/app/styles/SceneProgressBar.css";
import { useSceneProgress } from "@/app/context/SceneProgressContext";

export default function SceneProgressBar() {
  const { progress } = useSceneProgress();

  return (
    <div className="scene-bar">
      <div
        key={progress}
        className="scene-bar-fill pulse"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
