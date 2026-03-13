"use client";

import { useEffect, useRef } from "react";
import "@/app/styles/clouds.css";

type Props = {
  onCovered?: () => void;
  onComplete: () => void;
};

export default function CloudTransition({ onCovered, onComplete }: Props) {
  const coveredCalled = useRef(false);

  useEffect(() => {
    // 🔹 Momento en el que ya está todo tapado (ajustado a tu animación)
    const coverTimer = setTimeout(() => {
      if (!coveredCalled.current) {
        coveredCalled.current = true;
        onCovered?.();
      }
    }, 5000); // ~cuando se cierra completamente

    return () => clearTimeout(coverTimer);
  }, [onCovered]);

  useEffect(() => {
    // 🔹 Esperar al final REAL de todas las animaciones
    const clouds = document.querySelectorAll(".cloud");
    let finished = 0;

    const handleEnd = () => {
      finished++;
      if (finished === clouds.length) {
        onComplete();
      }
    };

    clouds.forEach(cloud =>
      cloud.addEventListener("animationend", handleEnd, { once: true })
    );

    return () => {
      clouds.forEach(cloud =>
        cloud.removeEventListener("animationend", handleEnd)
      );
    };
  }, [onComplete]);

  return (
    <div className="clouds-root">
      <div className="cloud-layer left">
        <div className="cloud puff1"><img src="/images/nube.png" alt="" /></div>
        <div className="cloud puff2"><img src="/images/nube.png" alt="" /></div>
        <div className="cloud puff3"><img src="/images/nube.png" alt="" /></div>
        <div className="cloud puff4"><img src="/images/nube.png" alt="" /></div>
      </div>

      <div className="cloud-layer right">
        <div className="cloud puff1"><img src="/images/nube.png" alt="" /></div>
        <div className="cloud puff2"><img src="/images/nube.png" alt="" /></div>
        <div className="cloud puff3"><img src="/images/nube.png" alt="" /></div>
        <div className="cloud puff4"><img src="/images/nube.png" alt="" /></div>
      </div>
    </div>
  );
}
