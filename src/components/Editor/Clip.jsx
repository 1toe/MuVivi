import { useRef } from 'react';
import styles from './Clip.module.css';

export function Clip({ 
  clip, 
  index, 
  isSelected, 
  onSelect, 
  onDelete, 
  onDragStart, 
  onDragEnd,
  onTransitionDrop,
  onEffectDrop 
}) {
  const clipRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    if (onDragStart) {
      onDragStart(index);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const transitionId = e.dataTransfer.getData('transitionId');
    const effectId = e.dataTransfer.getData('effectId');
    
    if (transitionId && onTransitionDrop) {
      onTransitionDrop(clip.id, transitionId);
    }
    
    if (effectId && onEffectDrop) {
      onEffectDrop(clip.id, effectId);
    }
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={clipRef}
      className={`${styles.clip} ${isSelected ? styles.clipSelected : ''}`}
      onClick={() => onSelect(clip.id)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={styles.thumbnail}>
        <img src={clip.thumbnail} alt={clip.name} />
        {clip.transition && (
          <div className={styles.transitionBadge} title={`Transition: ${clip.transition.id}`}>
            ✨
          </div>
        )}
      </div>

      <div className={styles.clipInfo}>
        <p className={styles.clipName} title={clip.name}>
          {clip.name}
        </p>
        <p className={styles.clipDuration}>{formatDuration(clip.duration)}</p>
      </div>

      {clip.effects && clip.effects.length > 0 && (
        <div className={styles.effectsBadge} title={`${clip.effects.length} effect(s)`}>
          🎨 {clip.effects.length}
        </div>
      )}

      {clip.texts && clip.texts.length > 0 && (
        <div className={styles.textsBadge} title={`${clip.texts.length} text(s)`}>
          📝 {clip.texts.length}
        </div>
      )}

      <button
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(clip.id);
        }}
        aria-label="Delete clip"
      >
        ×
      </button>
    </div>
  );
}
