import { useRef } from 'react';
import { useProject } from '../../hooks/useProject';
import { ActionTypes } from '../../context/ProjectContext';
import { Button } from '../UI/Button';
import { Slider } from '../UI/Slider';
import styles from './MusicPanel.module.css';

export function MusicPanel() {
  const { state, dispatch } = useProject();
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate audio file
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    const url = URL.createObjectURL(file);
    const audio = new Audio();

    audio.onloadedmetadata = () => {
      dispatch({
        type: ActionTypes.SET_BACKGROUND_MUSIC,
        payload: {
          name: file.name,
          url,
          duration: audio.duration,
          volume: 0.5,
        },
      });
    };

    audio.src = url;
  };

  const handleVolumeChange = (volume) => {
    if (state.backgroundMusic) {
      dispatch({
        type: ActionTypes.UPDATE_MUSIC_VOLUME,
        payload: volume,
      });
    }
  };

  const handleRemoveMusic = () => {
    if (state.backgroundMusic?.url) {
      URL.revokeObjectURL(state.backgroundMusic.url);
    }
    dispatch({
      type: ActionTypes.REMOVE_BACKGROUND_MUSIC,
    });
  };

  return (
    <div className={styles.musicPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Background Music</h3>
      </div>

      <div className={styles.content}>
        {!state.backgroundMusic ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎵</div>
            <p className={styles.emptyText}>No background music</p>
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              className={styles.addButton}
            >
              + Add Music
            </Button>
          </div>
        ) : (
          <div className={styles.musicInfo}>
            <div className={styles.musicItem}>
              <div className={styles.musicIcon}>🎵</div>
              <div className={styles.musicDetails}>
                <p className={styles.musicName}>{state.backgroundMusic.name}</p>
                <p className={styles.musicDuration}>
                  {Math.floor(state.backgroundMusic.duration / 60)}:
                  {Math.floor(state.backgroundMusic.duration % 60)
                    .toString()
                    .padStart(2, '0')}
                </p>
              </div>
              <button
                className={styles.removeButton}
                onClick={handleRemoveMusic}
                aria-label="Remove music"
              >
                ×
              </button>
            </div>

            <div className={styles.volumeSection}>
              <label className={styles.label}>
                Volume: {Math.round(state.backgroundMusic.volume * 100)}%
              </label>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={state.backgroundMusic.volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
