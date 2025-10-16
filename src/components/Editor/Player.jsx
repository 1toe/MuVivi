import { useRef, useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { useProject } from '../../hooks/useProject';
import { EffectsRenderer } from '../../utils/effectsRenderer';
import { TextRenderer } from '../../utils/textRenderer';
import styles from './Player.module.css';

export function Player() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const { state } = useProject();
  const {
    isPlaying,
    currentTime,
    totalDuration,
    volume,
    isMuted,
    progress,
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
    formatTime,
    getCurrentClipInfo,
  } = usePlayer();

  // Render current frame to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    const clipInfo = getCurrentClipInfo();

    if (!clipInfo) {
      // Clear canvas if no clip
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const { clip, relativeTime } = clipInfo;

    // Load and render video/image
    if (clip.type === 'video') {
      video.src = clip.url;
      video.currentTime = relativeTime;
      
      const drawFrame = () => {
        if (video.readyState >= 2) {
          // Draw video frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Apply visual effects
          if (clip.effects && clip.effects.length > 0) {
            EffectsRenderer.applyEffects(ctx, clip.effects, canvas.width, canvas.height);
          }
          
          // Render text overlays
          if (clip.texts && clip.texts.length > 0) {
            TextRenderer.renderTexts(ctx, clip.texts, relativeTime, canvas.width, canvas.height);
          }
        }
      };

      video.addEventListener('seeked', drawFrame);
      return () => video.removeEventListener('seeked', drawFrame);
    } else if (clip.type === 'image') {
      const img = new Image();
      img.src = clip.url;
      img.onload = () => {
        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply visual effects
        if (clip.effects && clip.effects.length > 0) {
          EffectsRenderer.applyEffects(ctx, clip.effects, canvas.width, canvas.height);
        }
        
        // Render text overlays
        if (clip.texts && clip.texts.length > 0) {
          TextRenderer.renderTexts(ctx, clip.texts, relativeTime, canvas.width, canvas.height);
        }
      };
    }
  }, [currentTime, getCurrentClipInfo]);

  // Set volume on video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSeekBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    seek(percentage * totalDuration);
  };

  const handleVolumeChange = (e) => {
    changeVolume(parseFloat(e.target.value));
  };

  return (
    <div className={styles.player}>
      <div className={styles.videoContainer}>
        {state.clips.length === 0 ? (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>▶</div>
            <p className={styles.placeholderText}>No clips in timeline</p>
            <p className={styles.placeholderSubtext}>Add media to start editing</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              width={1280}
              height={720}
            />
            <video
              ref={videoRef}
              className={styles.video}
              playsInline
            />
          </>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.mainControls}>
          <button
            className={styles.controlButton}
            onClick={togglePlayPause}
            disabled={state.clips.length === 0}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className={styles.seekBar} onClick={handleSeekBarClick}>
            <div className={styles.seekBarProgress} style={{ width: `${progress}%` }} />
            <div className={styles.seekBarHandle} style={{ left: `${progress}%` }} />
          </div>

          <span className={styles.timecode}>
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        <div className={styles.volumeControls}>
          <button
            className={styles.volumeButton}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
