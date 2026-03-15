"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "@/app/styles/StoryScene2.css";

type Frame =
  | "closed"
  | "opening1"
  | "opening2"
  | "firstpage"
  | "opening3"
  | "open";

type Stage = "book" | "transition" | "fall" | "journey";

type JourneySlide = {
  id: string;
  chapter: string;
  title: string;
  body: string;
  image: string;
  audio: string;
  accent: string;
  textSide?: "left" | "right";
};

export default function StoryScene2() {
  const [frame, setFrame] = useState<Frame>("closed");
  const [animating, setAnimating] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<Stage>("book");
  const [showAtmosphere, setShowAtmosphere] = useState(false);
  const [fallProgress, setFallProgress] = useState(0);

  const bookVisualRef = useRef<HTMLDivElement | null>(null);
  const transitionOverlayRef = useRef<HTMLDivElement | null>(null);
  const transitionSheetRef = useRef<HTMLDivElement | null>(null);
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const activeSectionRef = useRef(0);
  const snappingRef = useRef(false);
  const fallWrapperRef = useRef<HTMLDivElement | null>(null);
  const fallAliceRef = useRef<HTMLImageElement | null>(null);
  const fallCardsRef = useRef<HTMLImageElement | null>(null);
  const fallWatchRef = useRef<HTMLImageElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallProgressRef = useRef(0);
  const pendingJourneyRef = useRef(false);
  const pendingReturnToBookRef = useRef(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const slides = useMemo<JourneySlide[]>(
    () => [
      {
        id: "fall-doors",
        chapter: "Capítulo I",
        title: "Caída y puertas cerradas",
        body:
          "Alicia cae por la madriguera del Conejo Blanco y llega a un salón extraño lleno de puertas cerradas. Encuentra una llavecita y descubre una pequeña puerta que da a un jardín precioso, pero no puede pasar. Entonces prueba alimentos y bebidas mágicas que la hacen crecer y encoger varias veces, lo que la confunde y la angustia.",
        image: "/images/image_1.png",
        audio: "/audio/image_1_audio.mp3",
        accent: "#f0c886",
        textSide: "left",
      },
      {
        id: "sea-of-tears",
        chapter: "Capítulo II",
        title: "Mar de lágrimas",
        body:
          "Después de crecer tanto que llena la sala, Alicia llora y forma un gran mar de lágrimas. Más tarde, ya encogida, cae en ese mar y se encuentra con varios animales. Todos llegan a la orilla y participan en una carrera sin sentido organizada por el Dodo, donde no hay reglas claras y todos resultan ganadores.",
        image: "/images/iamge_2.png",
        audio: "/audio/image_2_audio.mp3",
        accent: "#98c7ff",
        textSide: "left",
      },
      {
        id: "white-rabbit-house",
        chapter: "Capítulo III",
        title: "La casa del Conejo",
        body:
          "El Conejo Blanco confunde a Alicia con su criada y la envía a su casa. Allí, Alicia vuelve a cambiar de tamaño al beber otra sustancia y crece tanto que queda atrapada dentro de la casa. Finalmente consigue salir, vuelve a hacerse pequeña y continúa su camino por el bosque, cada vez más sorprendida por lo extraño de ese mundo.",
        image: "/images/image_3.png",
        audio: "/audio/image_3_audio.mp3",
        accent: "#b9da8b",
      },
      {
        id: "caterpillar",
        chapter: "Capítulo IV",
        title: "La Oruga Azul",
        body:
          "En el bosque, Alicia conoce a una Oruga Azul sentada sobre una seta, fumando tranquilamente. La Oruga le hace preguntas difíciles, sobre todo sobre quién es ella realmente. Alicia se da cuenta de que ya no se siente segura ni de su propia identidad, porque ha cambiado demasiadas veces. La Oruga le explica que la seta puede hacerla crecer o encoger, y eso le da a Alicia un poco más de control.",
        image: "/images/image_4.png",
        audio: "/audio/image_4_audio.mp3",
        accent: "#c6a2ff",
      },
      {
        id: "cheshire-cat",
        chapter: "Capítulo V",
        title: "Cheshire y la merienda",
        body:
          "Alicia llega a la casa de la Duquesa, donde todo es caótico: hay humo, gritos, una cocinera violenta y un bebé extraño. Después aparece el gato de Cheshire, que puede desaparecer y dejar solo su sonrisa. Él le indica posibles caminos y le habla de la locura de ese lugar. Más adelante Alicia llega a la famosa merienda con el Sombrerero, la Liebre de Marzo y el Lirón, una escena llena de adivinanzas sin respuesta, cambios de sitio y conversaciones absurdas.",
        image: "/images/image_5.png",
        audio: "/audio/image_5_audio.mp3",
        accent: "#ffb0c8",
      },
      {
        id: "mad-tea",
        chapter: "Capítulo VI",
        title: "El jardín de la Reina",
        body:
          "Alicia consigue entrar por fin en el jardín que había visto al principio. Allí conoce a los jardineros-carta, que están pintando rosas blancas de rojo para evitar el castigo de la Reina de Corazones. Poco después aparecen la Reina y el Rey, junto con toda su corte. La Reina se muestra autoritaria, caprichosa y obsesionada con ordenar ejecuciones por cualquier cosa.",
        image: "/images/image_6.jpeg",
        audio: "/audio/image_6_audio.mp3",
        accent: "#ffd37a",
      },
      {
        id: "queen-croquet",
        chapter: "Capítulo VII",
        title: "Croquet y Falsa Tortuga",
        body:
          "Alicia participa en un partido de croquet muy extraño organizado por la Reina, donde los flamencos hacen de mazos y los erizos de bolas. El juego es un desastre porque nada obedece reglas normales. Más tarde, Alicia conoce a la Falsa Tortuga y al Grifo, que le cuentan historias absurdas y melancólicas sobre su educación y sus experiencias. Esta parte mezcla humor, rareza y una sensación cada vez más onírica.",
        image: "/images/image_7.png",
        audio: "/audio/image_7_audio.mp3",
        accent: "#ff8f8f",
      },
      {
        id: "trial",
        chapter: "Capítulo VIII",
        title: "Juicio final y despertar",
        body:
          "Al final de la historia, tiene lugar el juicio del Sota de Corazones, acusado de robar unas tartas. Todo resulta ridículo e injusto, con testigos absurdos y normas sin sentido. Alicia, que ya ha ganado confianza, empieza a cuestionar abiertamente a la Reina y al resto de personajes. Cuando la Reina ordena su ejecución, Alicia se rebela y comprende que no son más que una simple baraja de cartas. En ese momento, todo se desvanece y ella despierta, descubriendo que en realidad había estado soñando.",
        image: "/images/image_8.jpeg",
        audio: "/audio/iamge_8_audio.mp3",
        accent: "#9ec5ff",
      },
    ],
    []
  );

  useEffect(() => {
    const t1 = window.setTimeout(() => setLightOn(true), 300);
    const t2 = window.setTimeout(() => setReady(true), 1300);
    const lowMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setShowAtmosphere(!lowMotion && window.innerWidth > 1024);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setPlayingAudio(null);
    const handlePause = () => {
      if (audio.ended) return;
      setPlayingAudio((current) => (current === audio.currentSrc ? null : current));
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    if (stage !== "transition") return;

    const bookVisual = bookVisualRef.current;
    const overlay = transitionOverlayRef.current;
    const sheet = transitionSheetRef.current;
    if (!bookVisual || !overlay || !sheet) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(bookVisual, { clearProps: "transform,opacity" });
        setStage("fall");
      },
    });

    tl.set(overlay, { autoAlpha: 1 })
      .to(bookVisual, {
        scale: 2.45,
        xPercent: -19,
        yPercent: 7,
        transformOrigin: "50% 50%",
        duration: 1.1,
      })
      .to(
        overlay,
        {
          background: "rgba(0, 0, 0, 1)",
          duration: 0.55,
        },
        "-=0.35"
      )
      .to(bookVisual, { autoAlpha: 0, duration: 0.25 }, "-=0.2")
      .to(sheet, { autoAlpha: 0, duration: 0.2 }, "<");

    return () => {
      tl.kill();
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "fall") return;

    const wrapper = fallWrapperRef.current;
    const alice = fallAliceRef.current;
    const cards = fallCardsRef.current;
    const watch = fallWatchRef.current;
    if (!wrapper || !alice || !cards || !watch) return;

    fallProgressRef.current = 0;
    pendingJourneyRef.current = false;
    pendingReturnToBookRef.current = false;
    setFallProgress(0);

    gsap.set(wrapper, { opacity: 1, clearProps: "backgroundPosition" });
    gsap.set(alice, { yPercent: 0, scale: 0.9, autoAlpha: 1 });
    gsap.set(cards, { yPercent: 0, xPercent: 0, rotate: -8, autoAlpha: 0.92 });
    gsap.set(watch, { yPercent: 0, xPercent: 0, rotate: 9, autoAlpha: 0.9 });

    const applyProgress = (nextProgress: number) => {
      const clamped = Math.max(0, Math.min(1, nextProgress));
      fallProgressRef.current = clamped;
      setFallProgress(clamped);

      gsap.to(alice, {
        yPercent: clamped * 520,
        xPercent: Math.sin(clamped * Math.PI * 3) * 10,
        rotate: Math.sin(clamped * Math.PI * 4) * 6,
        duration: 0.18,
        ease: "power1.out",
        overwrite: true,
      });

      gsap.to(wrapper, {
        backgroundPosition: `center ${clamped * 100}%`,
        duration: 0.2,
        ease: "power1.out",
        overwrite: true,
      });

      gsap.to(cards, {
        yPercent: -clamped * 115,
        xPercent: Math.sin(clamped * Math.PI * 2.1) * 8,
        rotate: -8 + clamped * 18,
        duration: 0.22,
        ease: "power1.out",
        overwrite: true,
      });

      gsap.to(watch, {
        yPercent: -clamped * 155,
        xPercent: Math.cos(clamped * Math.PI * 2.4) * -10,
        rotate: 9 - clamped * 24,
        duration: 0.22,
        ease: "power1.out",
        overwrite: true,
      });

      if (clamped >= 0.82) {
        transitionToJourney();
      }
    };

    const transitionToJourney = () => {
      if (pendingJourneyRef.current) return;
      pendingJourneyRef.current = true;
      stopCurrentAudio();
      pendingJourneyRef.current = false;
      setStage("journey");
    };

    const returnToBook = () => {
      if (pendingReturnToBookRef.current) return;
      pendingReturnToBookRef.current = true;
      stopCurrentAudio();
      pendingReturnToBookRef.current = false;
      setStage("book");
      setFrame("open");
      gsap.set(wrapper, { clearProps: "opacity,backgroundPosition" });
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      const direction = Math.sign(event.deltaY);
      const delta = event.deltaY * 0.0018;
      const current = fallProgressRef.current;
      const next = current + delta;

      if (current >= 0.72 && direction > 0) {
        transitionToJourney();
        return;
      }

      if (current <= 0.015 && direction < 0) {
        returnToBook();
        return;
      }

      applyProgress(next);
    };

    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0;
      const delta = touchStartY - currentY;
      touchStartY = currentY;

      if (fallProgressRef.current >= 0.72 && delta > 0) {
        transitionToJourney();
        event.preventDefault();
        return;
      }

      const next = fallProgressRef.current + delta * 0.0032;
      applyProgress(next);
      event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "journey") return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = scrollWrapperRef.current;
    const content = scrollContentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      autoRaf: false,
      smoothWheel: true,
      syncTouch: true,
      duration: 1,
      touchMultiplier: 1,
    });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const media = section.querySelector(".journey-media");
        const panel = section.querySelector(".journey-panel");

        gsap.fromTo(
          media,
          { yPercent: -6, scale: 1.06 },
          {
            yPercent: 6,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scroller: wrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );

        gsap.fromTo(
          panel,
          { autoAlpha: 0, x: 60 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              scroller: wrapper,
              start: "top 72%",
            },
          }
        );

        ScrollTrigger.create({
          trigger: section,
          scroller: wrapper,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            stopCurrentAudio();
            activeSectionRef.current = index;
          },
          onEnterBack: () => {
            stopCurrentAudio();
            activeSectionRef.current = index;
          },
        });
      });
    }, wrapper);

    const snapToSection = (nextIndex: number) => {
      const target = sectionRefs.current[nextIndex];
      if (!target || snappingRef.current) return;

      snappingRef.current = true;
      activeSectionRef.current = nextIndex;

      lenis.scrollTo(target, {
        duration: 0.9,
        lock: true,
      });

      window.setTimeout(() => {
        snappingRef.current = false;
      }, 950);
    };

    const onWheel = (event: WheelEvent) => {
      if (snappingRef.current) {
        event.preventDefault();
        return;
      }

      const direction = Math.sign(event.deltaY);
      if (direction === 0) return;

      const nextIndex = Math.max(
        0,
        Math.min(sectionRefs.current.length - 1, activeSectionRef.current + direction)
      );

      if (nextIndex === activeSectionRef.current) return;

      event.preventDefault();
      snapToSection(nextIndex);
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      wrapper.scrollTo({ top: 0, behavior: "auto" });
    });

    return () => {
      wrapper.removeEventListener("wheel", onWheel);
      window.cancelAnimationFrame(rafId);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [stage]);

  const beginTransition = () => {
    if (stage !== "book") return;
    setStage("transition");
  };

  const stopCurrentAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setPlayingAudio(null);
  };

  const handlePlayAudio = async (audioSrc: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.src.endsWith(audioSrc) && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        setPlayingAudio(null);
        return;
      }

      audio.pause();
      audio.src = audioSrc;
      audio.currentTime = 0;
      await audio.play();
      setPlayingAudio(audioSrc);
    } catch {
      setPlayingAudio(null);
    }
  };

  const startOpening = () => {
    if (animating || stage !== "book") return;

    if (frame === "closed") {
      setAnimating(true);
      setFrame("opening1");
      window.setTimeout(() => setFrame("opening2"), 700);
      window.setTimeout(() => setFrame("firstpage"), 1500);
      window.setTimeout(() => setAnimating(false), 1800);
      return;
    }

    if (frame === "firstpage") {
      setAnimating(true);
      setFrame("opening3");
      window.setTimeout(() => setFrame("open"), 700);
      window.setTimeout(() => setAnimating(false), 950);
    }
  };

  const showStoryText = false;
  const canTurnPage = (frame === "closed" || frame === "firstpage") && !animating;

  const hintText =
    frame === "closed"
      ? "Haz clic para abrir el libro"
      : frame === "firstpage"
        ? "Haz clic para pasar la página"
        : frame === "open"
          ? "Haz clic en el agujero para caer"
          : "";

  const storyTitle = frame === "open" ? "El agujero secreto" : "El comienzo de la historia";

  const storyText =
    frame === "open"
      ? "La persecución la llevó hasta un claro silencioso, donde la tierra parecía haberse abierto en secreto. Entre raíces retorcidas y pétalos de colores apareció un agujero profundo y misterioso. La niña se inclinó para mirar en su interior, fascinada por la tenue luz que brotaba desde abajo. Sin imaginar lo que estaba a punto de ocurrir, se acercó un poco más."
      : "Había algo extraño y hermoso en aquel sendero dorado, como si el aire mismo estuviera encantado. La niña avanzó despacio, observando cómo la luz danzaba entre los árboles y las flores. Fue entonces cuando distinguió una pequeña figura blanca alejándose con prisa. Movida por la curiosidad, echó a andar tras ella.";

  const bookImageSrc =
    frame === "firstpage"
      ? "/images/book/firstpage.png"
      : frame === "open"
        ? "/images/book/secondpage.png"
        : `/images/book/${frame}.jpeg`;

  if (stage === "fall") {
    return (
      <div
        className="fall-scene"
        ref={fallWrapperRef}
        style={{ backgroundImage: "url(/images/fall.png)" }}
      >
        <div className="fall-scene-overlay" />
        <img
          ref={fallAliceRef}
          src="/images/fall1.png"
          alt="Alicia cayendo"
          className="fall-alice"
          draggable={false}
        />
        <img
          ref={fallCardsRef}
          src="/images/cards_fall.png"
          alt=""
          className="fall-prop fall-prop-cards"
          draggable={false}
          aria-hidden="true"
        />
        <img
          ref={fallWatchRef}
          src="/images/watch_fall.png"
          alt=""
          className="fall-prop fall-prop-watch"
          draggable={false}
          aria-hidden="true"
        />
        <div className="fall-hint">
          Desliza hacia abajo para caer. Si subes al inicio, volverás al libro.
        </div>
        <div className="fall-progress">
          <span style={{ transform: `scaleY(${Math.max(0.04, fallProgress)})` }} />
        </div>
      </div>
    );
  }

  if (stage === "journey") {
    return (
      <div className="journey-scene">
        <audio ref={audioRef} preload="none" />
        <div className="journey-scroll-shell" ref={scrollWrapperRef}>
          <div className="journey-scroll-track" ref={scrollContentRef}>
            {slides.map((slide, index) => (
              <section
                key={slide.id}
                className={`journey-section section-${slide.id}`}
                ref={(node) => {
                  sectionRefs.current[index] = node;
                }}
                style={{ ["--accent" as string]: slide.accent }}
              >
                <div className="journey-media">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="journey-media-image"
                    draggable={false}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <button
                    type="button"
                    className={`journey-audio-button ${slide.textSide === "left" ? "journey-audio-button-right" : ""} ${playingAudio === slide.audio ? "is-playing" : ""}`}
                    onClick={() => handlePlayAudio(slide.audio)}
                    aria-label={`Reproducir audio de ${slide.chapter}`}
                  >
                    <span className="journey-audio-icon" aria-hidden="true">
                      {playingAudio === slide.audio ? "||" : "▶"}
                    </span>
                    <span className="journey-audio-label">Audio</span>
                  </button>
                </div>

                {showAtmosphere && (
                  <div className="journey-atmosphere" aria-hidden="true">
                    <div className="fog-layer" />
                  </div>
                )}

                <article
                  className={`journey-panel ${slide.textSide === "left" ? "journey-panel-left" : ""}`}
                >
                  <p className="journey-chapter">{slide.chapter}</p>
                  <h2 className="journey-title">{slide.title}</h2>
                  <p className="journey-description">{slide.body}</p>
                </article>
              </section>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story2-scene">
      {lightOn && <div className="candle-light" />}
      <div className="dark-veil" />

      {ready && (
        <div className="book-container">
          <div className="book-visual" ref={bookVisualRef}>
            <img
              src={bookImageSrc}
              alt="Libro de Alicia"
              className={`book-frame ${frame} ${canTurnPage ? "clickable" : ""}`}
              onClick={startOpening}
              draggable={false}
            />

            {frame === "open" && !animating && (
              <button
                type="button"
                className="book-image-hotspot"
                onClick={beginTransition}
                aria-label="Continuar hacia la caída"
              />
            )}

            {showStoryText && (
              <div className="book-text-panel" aria-label="Texto introductorio del cuento">
                <h2 className="book-text-title">{storyTitle}</h2>
                <p className="book-text-body">{storyText}</p>
              </div>
            )}
          </div>

          {hintText && <div className="book-hint">{hintText}</div>}
        </div>
      )}

      {stage === "transition" && (
        <div className="page-turn-transition" ref={transitionOverlayRef}>
          <div className="page-turn-sheet" ref={transitionSheetRef} />
        </div>
      )}
    </div>
  );
}
