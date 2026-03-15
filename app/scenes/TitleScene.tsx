"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/TitleScene.module.css";

const alice = "Alice";
const rest = "in wonderland";

type TitleSceneProps = {
  onContinue: () => void;
};

export default function TitleScene({ onContinue }: TitleSceneProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const continueTriggeredRef = useRef(false);
  const audioStartedRef = useRef(false);
  const [showSoundCue, setShowSoundCue] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;

    const tryStartAudio = () => {
      if (audioStartedRef.current) return;

      void audio.play()
        .then(() => {
          audioStartedRef.current = true;
          setShowSoundCue(false);
        })
        .catch(() => {});
    };

    tryStartAudio();

    const handleFirstInteraction = () => {
      tryStartAudio();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const fadeOutAndContinue = () => {
    if (continueTriggeredRef.current) return;
    continueTriggeredRef.current = true;

    const audio = audioRef.current;
    if (!audio) {
      onContinue();
      return;
    }

    const fadeDurationMs = 1200;
    const stepMs = 60;
    const steps = fadeDurationMs / stepMs;
    const volumeStep = audio.volume / steps;

    const intervalId = window.setInterval(() => {
      const nextVolume = Math.max(0, audio.volume - volumeStep);
      audio.volume = nextVolume;

      if (nextVolume <= 0.01) {
        window.clearInterval(intervalId);
        audio.pause();
        audio.currentTime = 0;
        onContinue();
      }
    }, stepMs);
  };

  return (
    <section className={styles.scene}>
      <audio ref={audioRef} src="/audio/Music_Intro.mp3" preload="auto" loop />

      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1 className={styles.line}>
            {alice.split("").map((char, i) => (
              <span
                key={`a-${i}`}
                className={styles.char}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {char}
              </span>
            ))}
          </h1>

          <h2 className={styles.lineSecondary}>
            {rest.split("").map((char, i) => (
              <span
                key={`r-${i}`}
                className={styles.char}
                style={{ animationDelay: `${2 + i * 0.12}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        <button className={styles.button} onClick={fadeOutAndContinue}>
          A tale begins...
        </button>

        {showSoundCue && (
          <div className={styles.soundCue} aria-hidden="true">
            <span className={styles.soundCueCore} />
            <span className={styles.soundCueRing} />
            <span className={styles.soundCueRingDelay} />
          </div>
        )}
      </div>
    </section>
  );
}
