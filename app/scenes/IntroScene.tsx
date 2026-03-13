"use client";

import { useEffect, useRef, useState } from "react";
import "@/app/styles/intro.css";

type IntroSceneProps = {
  onExitComplete: () => void;
};

export default function IntroScene({ onExitComplete }: IntroSceneProps) {
  const [count, setCount] = useState(2);
  const [isEnding, setIsEnding] = useState(false);
  const hasExited = useRef(false);

  // ⏱️ Contador
  useEffect(() => {
    if (isEnding) return;

    if (count === 0) {
      setIsEnding(true);
      return;
    }

    const i = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => clearInterval(i);
  }, [count, isEnding]);

  // 🎬 Salida (se ejecuta SOLO UNA VEZ)
  useEffect(() => {
    if (!isEnding || hasExited.current) return;

    hasExited.current = true;

    const t = setTimeout(() => {
      onExitComplete();
    }, 1600);

    return () => clearTimeout(t);
  }, [isEnding, onExitComplete]);

  return (
    <section
      className={`intro-root ${isEnding ? "introExit" : ""}`}
      onClick={() => {
        if (isEnding) return;
        setCount(0);
        setIsEnding(true);
      }}
    >
      <div className="content">
        <div id="contenido">
          <div key={count} className="needle" />
          <div className="cuentaAtras">{count}</div>
          <div className="linea-horizontal" />
          <div className="linea-vertical" />
        </div>

        <div className="mainSection">
          <div className="seccionCuenta">
            <div className="circle">
              <div className="circle2" />
            </div>
          </div>
        </div>

        <div className="film">
          <div className="effect">
            <div className="grain" />
          </div>
        </div>
      </div>
    </section>
  );
}
