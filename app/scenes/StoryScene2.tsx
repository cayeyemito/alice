"use client";

import { useEffect, useState } from "react";
import "@/app/styles/StoryScene2.css";

type Frame =
  | "closed"
  | "opening1"
  | "opening2"
  | "firstpage"
  | "opening3"
  | "open";

export default function StoryScene2() {
  const [frame, setFrame] = useState<Frame>("closed");
  const [animating, setAnimating] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLightOn(true), 300);
    const t2 = setTimeout(() => setReady(true), 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const startOpening = () => {
    if (animating) return;

    if (frame === "closed") {
      setAnimating(true);
      setFrame("opening1");
      setTimeout(() => setFrame("opening2"), 700);
      setTimeout(() => setFrame("firstpage"), 1500);
      setTimeout(() => setAnimating(false), 1800);
      return;
    }

    if (frame === "firstpage") {
      setAnimating(true);
      setFrame("opening3");
      setTimeout(() => setFrame("open"), 700);
      setTimeout(() => setAnimating(false), 950);
    }
  };

  const showStoryText = frame === "firstpage" || frame === "opening3" || frame === "open";
  const canTurnPage = (frame === "closed" || frame === "firstpage") && !animating;

  const hintText =
    frame === "closed"
      ? "Haz clic para abrir el libro"
      : frame === "firstpage"
      ? "Haz clic para pasar la pagina"
      : "";

  const storyText =
    frame === "open"
      ? "Cuando por fin alzo la vista, un Conejo Blanco paso corriendo junto a ella. Alicia lo siguio sin pensarlo y, al acercarse al seto, lo vio desaparecer por un agujero."
      : "Alicia descansaba junto a su hermana en una tarde tibia, aburrida de un libro sin dibujos ni dialogos. Entre el canto de los pajaros y el susurro del rio, algo inesperado estaba a punto de comenzar.";

  return (
    <div className="story2-scene">
      {lightOn && <div className="candle-light" />}
      <div className="dark-veil" />

      {ready && (
        <div className="book-container">
          <div className="book-visual">
            <img
              src={`/images/book/${frame}.jpeg`}
              alt="Libro de Alicia"
              className={`book-frame ${frame} ${canTurnPage ? "clickable" : ""}`}
              onClick={startOpening}
              draggable={false}
            />

            {showStoryText && (
              <div className="book-text-panel" aria-label="Texto introductorio del cuento">
                <h2 className="book-text-title">
                  {frame === "open" ? "El principio del viaje" : "El comienzo de la historia"}
                </h2>
                <p className="book-text-body">{storyText}</p>
              </div>
            )}
          </div>

          {hintText && <div className="book-hint">{hintText}</div>}
        </div>
      )}
    </div>
  );
}
