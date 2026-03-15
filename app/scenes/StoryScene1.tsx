"use client";

import { useEffect, useRef, useState } from "react";
import CloudTransition from "@/app/transitions/CloudTransition";
import "@/app/styles/StoryScene1.css";

type Phase = "clouds" | "covered" | "play";

export default function StoryScene1({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>("clouds");

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const CHAPTER_TEXT = "AQUI COMIENZA";
  const [visibleChars, setVisibleChars] = useState(0);
  const exitedRef = useRef(false);

  const [videoSrc, setVideoSrc] = useState("/videos/scene1.mp4");
  const [isFinal, setIsFinal] = useState(false);
  const [freezeFrame, setFreezeFrame] = useState<string | null>(null);

  const [waitingForHold, setWaitingForHold] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [hideChapter, setHideChapter] = useState(false);
  const [finalReady, setFinalReady] = useState(false);
  const [darkness, setDarkness] = useState(0);
  const [finished, setFinished] = useState(false);
  const holdingRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPhase("covered");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "covered") return;

    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    video.currentTime = 0;
    void video.play().catch(() => {});

    audio.volume = 0.45;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }, [phase]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      const video = videoRef.current;
      const audio = audioRef.current;
      if (!video || !audio) return;

      if (document.hidden) {
        video.pause();
        audio.pause();
        holdingRef.current = false;
        setIsHolding(false);
      } else if (phase !== "clouds" && !finished) {
        void audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [finished, phase]);

  useEffect(() => {
    if (phase === "clouds" || isFinal) return;

    const video = videoRef.current;
    if (!video) return;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const onTimeUpdate = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;

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

    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setHideChapter(true);
          setIsHolding(true);
          setFreezeFrame(null);
        })
        .catch(() => {});
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
    const audio = audioRef.current;
    if (!video || !audio) return;

    const interval = window.setInterval(() => {
      if (!video.duration) return;
      if (exitedRef.current) return;

      const progress = video.currentTime / video.duration;
      const remaining = video.duration - video.currentTime;

      setDarkness(Math.pow(progress, 1.6));

      if (remaining <= 0.15) {
        exitedRef.current = true;

        setDarkness(1);
        setFinished(true);
        setIsHolding(false);

        video.pause();
        audio.pause();
        audio.currentTime = 0;
        video.currentTime = video.duration;

        window.setTimeout(onExit, 300);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [finished, isFinal, onExit]);

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
  }, [isHolding]);

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
      <audio ref={audioRef} src="/audio/Sunnyday.mp3" preload="auto" loop />

      <div className="darkness-overlay" style={{ opacity: darkness }} />

      {(phase === "covered" || phase === "play") && (
        <div className={`chapter-overlay ${hideChapter ? "chapter-hide" : ""}`}>
          <div className="chapter-wrap">
            <h1 className="chapter-title">
              {CHAPTER_TEXT.split("").map((char, i) => (
                <span key={i} className={`char ${i < visibleChars ? "visible" : ""}`}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>

            <p className="chapter-subtitle">En un dia de verano</p>
          </div>
        </div>
      )}

      {freezeFrame && (
        <div className="video-freeze" style={{ backgroundImage: `url(${freezeFrame})` }} />
      )}

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

              const video = videoRef.current;
              if (!video) return;

              video.currentTime = 0;
              video.playbackRate = 1.5;
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
            }}
          />
        )}
      </div>

      {waitingForHold && !isHolding && (
        <div className={`hold-hint ${isHolding ? "holding" : ""}`}>Mantén pulsada la pantalla</div>
      )}

      {phase !== "play" && <CloudTransition onComplete={() => setPhase("play")} />}
    </div>
  );
}
