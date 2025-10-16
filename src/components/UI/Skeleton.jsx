import styles from './Skeleton.module.css';

export function Skeleton({ width, height, variant = 'rect', className }) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className || ''}`}
      style={style}
    />
  );
}

export function MediaGridSkeleton({ count = 6 }) {
  return (
    <div className={styles.mediaGrid}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.mediaItem}>
          <Skeleton width="100%" height={120} />
          <Skeleton width="80%" height={14} className={styles.textSkeleton} />
          <Skeleton width="40%" height={12} className={styles.textSkeleton} />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 5 }) {
  return (
    <div className={styles.timeline}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} width={140} height={120} className={styles.clipSkeleton} />
      ))}
    </div>
  );
}
