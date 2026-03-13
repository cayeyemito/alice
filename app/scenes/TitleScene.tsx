"use client";

import { useEffect } from "react";
import styles from "../styles/TitleScene.module.css";

const alice = "Alice";
const rest = "in wonderland";

type TitleSceneProps = {
  onContinue: () => void;
};

export default function TitleScene({ onContinue }: TitleSceneProps) {
  useEffect(() => {
    const timer = setTimeout(onContinue, 12000); // ⏱️ 9 segundos
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <section className={styles.scene}>
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

        <button className={styles.button} onClick={onContinue}>
          A tale begins…
        </button>

      </div>
    </section>
  );
}
