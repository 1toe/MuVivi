import { useState } from 'react';
import styles from './EffectsPanel.module.css';

const EFFECTS = [
  { id: 'brightness', name: 'Brightness', icon: '☀️', description: 'Adjust brightness' },
  { id: 'contrast', name: 'Contrast', icon: '◐', description: 'Adjust contrast' },
  { id: 'saturation', name: 'Saturation', icon: '🎨', description: 'Adjust color saturation' },
  { id: 'blur', name: 'Blur', icon: '🌫️', description: 'Blur effect' },
  { id: 'sepia', name: 'Sepia', icon: '🟤', description: 'Sepia tone' },
  { id: 'grayscale', name: 'Grayscale', icon: '⚫', description: 'Black and white' },
  { id: 'invert', name: 'Invert', icon: '🔄', description: 'Invert colors' },
  { id: 'vignette', name: 'Vignette', icon: '⭕', description: 'Vignette effect' },
];

export function EffectsPanel() {
  const [selectedEffect, setSelectedEffect] = useState(null);

  const handleDragStart = (e, effect) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('effectId', effect.id);
    e.dataTransfer.setData('effectName', effect.name);
  };

  return (
    <div className={styles.effectsPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Visual Effects</h3>
      </div>

      <div className={styles.effectsGrid}>
        {EFFECTS.map((effect) => (
          <div
            key={effect.id}
            className={`${styles.effectItem} ${
              selectedEffect === effect.id ? styles.effectItemSelected : ''
            }`}
            onClick={() => setSelectedEffect(effect.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, effect)}
            title={effect.description}
          >
            <div className={styles.effectIcon}>{effect.icon}</div>
            <p className={styles.effectName}>{effect.name}</p>
          </div>
        ))}
      </div>

      <div className={styles.info}>
        <p className={styles.infoText}>
          💡 Drag effects onto clips to apply visual filters
        </p>
      </div>
    </div>
  );
}
