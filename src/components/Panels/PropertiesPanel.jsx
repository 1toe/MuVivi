import { useState } from 'react';
import { TransitionsPanel } from './TransitionsPanel';
import { EffectsPanel } from './EffectsPanel';
import { TextPanel } from './TextPanel';
import styles from './PropertiesPanel.module.css';

export function PropertiesPanel({ activeRibbonTab = 'inicio' }) {
  // Determine which panel to show based on active ribbon tab
  const renderPanelContent = () => {
    switch (activeRibbonTab) {
      case 'animaciones':
        return <TransitionsPanel />;
      case 'efectos':
        return <EffectsPanel />;
      case 'insertar':
        return <TextPanel />;
      default:
        return (
          <div className={styles.defaultPanel}>
            <div className={styles.header}>
              <h2 className={styles.title}>Properties</h2>
            </div>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⚙️</div>
              <p className={styles.emptyText}>Welcome to Movie Maker 2025</p>
              <p className={styles.emptySubtext}>
                Select a tab to access features:
                <br />
                • Animaciones → Transitions
                <br />
                • Efectos → Visual Effects
                <br />
                • Insertar → Text & Titles
              </p>
            </div>
          </div>
        );
    }
  };

  return <div className={styles.propertiesPanel}>{renderPanelContent()}</div>;
}
