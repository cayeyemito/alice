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

  const triggerEnding = () => {
    setCount(0);
    setIsEnding(true);
  };

  useEffect(() => {
    if (isEnding) return;

    const intervalId = window.setInterval(() => {
      setCount((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          window.setTimeout(() => setIsEnding(true), 0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isEnding]);

  useEffect(() => {
    if (!isEnding || hasExited.current) return;

    hasExited.current = true;

    const timeoutId = window.setTimeout(() => {
      onExitComplete();
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [isEnding, onExitComplete]);

  return (
    <section
      className={`intro-root ${isEnding ? "introExit" : ""}`}
      onClick={() => {
        if (isEnding) return;
        triggerEnding();
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
