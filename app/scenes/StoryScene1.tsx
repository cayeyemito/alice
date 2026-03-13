"use client";

import { useEffect, useRef, useState } from "react";
import CloudTransition from "@/app/transitions/CloudTransition";
import "@/app/styles/StoryScene1.css";

type Phase = "clouds" | "covered" | "play";

export default function StoryScene1({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>("clouds");

  const videoRef = useRef<HTMLVideoElement>(null);

  const CHAPTER_TEXT = "CHAPTER I";
  const [visibleChars, setVisibleChars] = useState(0);
  const exitedRef = useRef(false);;

  // vídeo actual
  const [videoSrc, setVideoSrc] = useState("/videos/scene1.mp4");
  const [isFinal, setIsFinal] = useState(false);
  const [freezeFrame, setFreezeFrame] = useState<string | null>(null);

  const [waitingForHold, setWaitingForHold] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [hideChapter, setHideChapter] = useState(false);
  const [finalReady, setFinalReady] = useState(false);
  const HOLD_SPEED = 0.01;
  const holdingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [darkness, setDarkness] = useState(0);
  const [finished, setFinished] = useState(false);

  /* 1️⃣ A los 3.5s → pasar a covered (el vídeo ya puede existir) */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("covered");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  /* 2️⃣ Arrancar el vídeo cuando toca */
  useEffect(() => {
    if (phase === "covered" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [phase]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        // 🔒 El navegador va a pausar sí o sí → lo hacemos nosotros primero
        video.pause();
        holdingRef.current = false;
        setIsHolding(false);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  /* 3️⃣ Animación del texto sincronizada con el vídeo */
  useEffect(() => {
    if (phase === "clouds" || isFinal) return; // 👈 CLAVE

    const video = videoRef.current;
    if (!video) return;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const onTimeUpdate = () => {
      if (!video.duration || isNaN(video.duration)) return;

      const progress = easeOutCubic(video.currentTime / video.duration);
      const chars = Math.floor(progress * CHAPTER_TEXT.length);
      setVisibleChars(chars);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [phase, isFinal]);

  const captureLastFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setFreezeFrame(canvas.toDataURL("image/jpeg"));
  };

  const startHold = () => {
    if (finished) return;
    if (!waitingForHold || !finalReady) return;

    const v = videoRef.current;
    if (!v) return;

    // 🔑 1. Play primero (gesto puro)
    const playPromise = v.play();

    if (playPromise !== undefined) {
      playPromise
      .then(() => {
        setHideChapter(true);
        setIsHolding(true);
        setFreezeFrame(null);
      })
      .catch(() => {
        // ❗ NO HACER NADA
        // El navegador lo bloqueó por energía / visibilidad
      });
    }
  };

  const endHold = () => {
    if (finished) return;

    setIsHolding(false);
    videoRef.current?.pause();
  };

  useEffect(() => {
    if (!isFinal || finished) return;

    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      if (!video.duration) return;
      if (exitedRef.current) return;

      const progress = video.currentTime / video.duration;
      const remaining = video.duration - video.currentTime;

      // oscuridad progresiva
      setDarkness(Math.pow(progress, 1.6));

      if (remaining <= 0.15) {
        exitedRef.current = true;

        setDarkness(1);
        setFinished(true);
        setIsHolding(false);

        video.pause();
        video.currentTime = video.duration;

        setTimeout(onExit, 300);
      }
    }, 50); // 👈 MUY IMPORTANTE: independiente del play/pause

    return () => clearInterval(interval);
  }, [isFinal, finished, onExit]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      if (!isHolding) {
        startHold();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      endHold();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isHolding, startHold, endHold]);

  return (
    <div
      className="story-scene"
      style={{ pointerEvents: finished ? "none" : "auto" }}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
    >
      <div
        className="darkness-overlay"
        style={{ opacity: darkness }}
      />
      {(phase === "covered" || phase === "play") && (
        <div className={`chapter-overlay ${hideChapter ? "chapter-hide" : ""}`}>
          <div className="chapter-wrap">
            <h1 className="chapter-title">
              {CHAPTER_TEXT.split("").map((char, i) => (
                <span
                  key={i}
                  className={`char ${i < visibleChars ? "visible" : ""}`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>

            <p className="chapter-subtitle">
              On a Summer’s Day
            </p>
          </div>
        </div>
      )}

      {/* Overlay con el último frame congelado */}
      {freezeFrame && (
        <div
          className="video-freeze"
          style={{ backgroundImage: `url(${freezeFrame})` }}
        />
      )}

      {/* Vídeo */}
      <div className="video-layer">
        {(phase === "covered" || phase === "play") && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            className="story-video"
           onLoadedMetadata={() => {
            if (!isFinal) return;

            const v = videoRef.current;
            if (!v) return;

            v.currentTime = 0;
            v.playbackRate = 1.5;
            // ❌ v.pause();  ← ELIMINAR
            setFinalReady(true);
          }}
            onEnded={() => {
              if (!isFinal) {
                captureLastFrame();
                setIsFinal(true);
                setVideoSrc("/videos/Scene1_Final.mp4");
                setWaitingForHold(true);

                requestAnimationFrame(() => {
                  videoRef.current?.load();
                });
              }
              // 👈 NO onExit aquí
            }}
          />
        )}
      </div>

      {/* Texto de pista */}
      {waitingForHold && !isHolding && (
       <div className={`hold-hint ${isHolding ? "holding" : ""}`}>
          Mantén pulsada la pantalla
        </div>
      )}

      {phase !== "play" && (
        <CloudTransition onComplete={() => setPhase("play")} />
      )}

    </div>
  );
}
