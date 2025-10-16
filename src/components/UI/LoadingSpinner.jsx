import styles from './LoadingSpinner.module.css';

export function LoadingSpinner({ size = 'md', message }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
