import styles from './Player.module.css';

export function Player() {
  return (
    <div className={styles.player}>
      <div className={styles.videoContainer}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>▶</div>
          <p className={styles.placeholderText}>No video loaded</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.controlButton} disabled>
          ▶
        </button>
        <div className={styles.seekBar}>
          <div className={styles.seekBarProgress} style={{ width: '0%' }} />
        </div>
        <span className={styles.timecode}>00:00 / 00:00</span>
      </div>
    </div>
  );
}
