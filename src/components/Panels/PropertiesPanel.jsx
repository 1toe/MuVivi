import styles from './PropertiesPanel.module.css';

export function PropertiesPanel() {
  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Properties</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚙️</div>
          <p className={styles.emptyText}>No clip selected</p>
          <p className={styles.emptySubtext}>Select a clip to edit properties</p>
        </div>
      </div>
    </div>
  );
}
