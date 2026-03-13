import styles from "../styles/FilmGrainOverlay.module.css";

export default function FilmGrainOverlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.film} />
      <div className={styles.effect} />
      <div className={styles.grain} />
    </div>
  );
}