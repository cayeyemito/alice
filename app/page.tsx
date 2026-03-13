"use client";

import { useEffect, useState } from "react";
import TitleScene from "@/app/scenes/TitleScene";
import StoryScene1 from "@/app/scenes/StoryScene1";
import StoryScene2 from "@/app/scenes/StoryScene2";
import BlackFade from "@/app/components/BlackFade";
import { useSceneProgress } from "@/app/context/SceneProgressContext";

type Scene =
  | "title"
  | "black-to-story1"
  | "story1"
  | "black-to-story2"
  | "story2";

export default function HomePage() {
  const [scene, setScene] = useState<Scene>("title");
  const STORY_FLOW = ["title", "story1", "story2"] as const;
  const { setProgress } = useSceneProgress();

  useEffect(() => {
    const index = STORY_FLOW.indexOf(scene as any);
    if (index !== -1) {
      setProgress((index + 1) / STORY_FLOW.length);
    }
  }, [scene]);

  useEffect(() => {
    if (scene === "black-to-story1") {
      const t = setTimeout(() => setScene("story1"), 800);
      return () => clearTimeout(t);
    }

    if (scene === "black-to-story2") {
      const t = setTimeout(() => setScene("story2"), 800);
      return () => clearTimeout(t);
    }
  }, [scene]);

  return (
    <>
      {scene === "title" && (
        <TitleScene onContinue={() => setScene("black-to-story1")} />
      )}

      {(scene === "black-to-story1" || scene === "black-to-story2") && (
        <BlackFade />
      )}

      {scene === "story1" && (
        <StoryScene1 onExit={() => setScene("black-to-story2")} />
      )}

      {scene === "story2" && <StoryScene2 />}
    </>
  );
}
