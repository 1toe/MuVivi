import styles from './Storyboard.module.css';

export function Storyboard() {
  return (
    <div className={styles.storyboard}>
      <div className={styles.timeline}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎬</div>
          <p className={styles.emptyText}>Timeline is empty</p>
          <p className={styles.emptySubtext}>Drag media from library to start editing</p>
        </div>
      </div>
    </div>
  );
}
