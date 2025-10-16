import { useState } from 'react';
import styles from './TransitionsPanel.module.css';

const TRANSITIONS = [
  { id: 'fade', name: 'Fade', icon: '▓', description: 'Smooth fade transition' },
  { id: 'dissolve', name: 'Dissolve', icon: '◐', description: 'Cross dissolve' },
  { id: 'wipe-left', name: 'Wipe Left', icon: '◀', description: 'Wipe from right to left' },
  { id: 'wipe-right', name: 'Wipe Right', icon: '▶', description: 'Wipe from left to right' },
  { id: 'wipe-up', name: 'Wipe Up', icon: '▲', description: 'Wipe from bottom to top' },
  { id: 'wipe-down', name: 'Wipe Down', icon: '▼', description: 'Wipe from top to bottom' },
  { id: 'slide-left', name: 'Slide Left', icon: '←', description: 'Slide from right' },
  { id: 'slide-right', name: 'Slide Right', icon: '→', description: 'Slide from left' },
];

export function TransitionsPanel() {
  const [selectedTransition, setSelectedTransition] = useState(null);

  const handleDragStart = (e, transition) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('transitionId', transition.id);
    e.dataTransfer.setData('transitionName', transition.name);
  };

  return (
    <div className={styles.transitionsPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Transitions</h3>
      </div>

      <div className={styles.transitionsGrid}>
        {TRANSITIONS.map((transition) => (
          <div
            key={transition.id}
            className={`${styles.transitionItem} ${
              selectedTransition === transition.id ? styles.transitionItemSelected : ''
            }`}
            onClick={() => setSelectedTransition(transition.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, transition)}
            title={transition.description}
          >
            <div className={styles.transitionIcon}>{transition.icon}</div>
            <p className={styles.transitionName}>{transition.name}</p>
          </div>
        ))}
      </div>

      <div className={styles.info}>
        <p className={styles.infoText}>
          💡 Drag transitions onto clips in the timeline
        </p>
      </div>
    </div>
  );
}
