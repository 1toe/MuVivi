# RFC-006: Player & Preview System
## Movie Maker 2025 — Video Player, Playback Controls & Preview

**Status**: Draft → Ready for Implementation  
**Phase**: 2 (Core Features)  
**Complexity**: High  
**Estimated Duration**: 4-5 days  
**Dependencies**: RFC-001, RFC-002, RFC-003, RFC-004, RFC-005  

---

## 🎯 Overview

RFC-006 implementa el **video player** con controles de reproducción, **preview del proyecto**, **playback engine** sincronizado con el timeline, y **player controls** (play, pause, seek, volume).

Al finalizar RFC-006:
- ✅ Video player funcional con HTML5 `<video>`
- ✅ Playback sincronizado con timeline
- ✅ Controls: play, pause, stop, seek
- ✅ Volume control con slider
- ✅ Timecode display actualizado
- ✅ Scrubber en timeline sincronizado
- ✅ Keyboard shortcuts (Space = play/pause, Arrow keys = seek)

---

## 📋 Requirements

### R1: Player Component

**File**: `src/components/Editor/Player.jsx`

```jsx
import { useRef, useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { PlayerControls } from './PlayerControls';
import styles from './Player.module.css';

export function Player() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const {
    currentTime,
    duration,
    isPlaying,
    volume,
    isMuted,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer();

  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  return (
    <div className={styles.player}>
      <div className={styles.videoContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={1920}
          height={1080}
        />
        <video
          ref={videoRef}
          className={styles.video}
          style={{ display: 'none' }}
        />
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
      />
    </div>
  );
}
```

**CSS** (`Player.module.css`):
```css
.player {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.videoContainer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  position: relative;
}

.canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.video {
  display: none;
}
```

**Acceptance Criteria**:
- ✅ Player renderiza correctamente
- ✅ Canvas muestra preview
- ✅ Video element controlado programáticamente

---

### R2: Player Controls Component

**File**: `src/components/Editor/PlayerControls.jsx`

```jsx
import { Slider } from '../UI/Slider';
import styles from './PlayerControls.module.css';

export function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
}) {
  const handleSeek = (value) => {
    onSeek(value);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.progressBar}>
        <Slider
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className={styles.seekBar}
        />
        <div className={styles.timecode}>
          <span>{formatTimecode(currentTime)}</span>
          <span>/</span>
          <span>{formatTimecode(duration)}</span>
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.playButton}
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          className={styles.stopButton}
          onClick={() => onSeek(0)}
          aria-label="Stop"
        >
          ⏹
        </button>

        <div className={styles.volumeControl}>
          <button
            className={styles.muteButton}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className={styles.volumeSlider}
          />
        </div>
      </div>
    </div>
  );
}

function formatTimecode(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}
```

**CSS** (`PlayerControls.module.css`):
```css
.controls {
  padding: var(--spacing-md);
  background-color: var(--color-bg-accent);
  border-top: 1px solid var(--color-border-light);
}

.progressBar {
  margin-bottom: var(--spacing-sm);
}

.timecode {
  display: flex;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
  justify-content: center;
}

.buttons {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  justify-content: center;
}

.playButton,
.stopButton {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background-color: var(--color-primary);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.playButton:hover,
.stopButton:hover {
  background-color: var(--color-primary-dark);
  transform: scale(1.05);
}

.volumeControl {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.muteButton {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.muteButton:hover {
  transform: scale(1.1);
}

.volumeSlider {
  width: 100px;
}
```

**Acceptance Criteria**:
- ✅ Play/Pause button funcional
- ✅ Seek bar actualiza en tiempo real
- ✅ Volume slider funciona
- ✅ Timecode muestra tiempo actual/total

---

### R3: usePlayer Hook

**File**: `src/hooks/usePlayer.js`

```javascript
import { useState, useEffect, useCallback, useRef } from 'react';
import { useProject } from '../context/ProjectContext';

export function usePlayer() {
  const { state } = useProject();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const duration = state.clips.reduce((acc, clip) => acc + clip.duration, 0);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const newTime = prev + deltaTime;
        if (newTime >= duration) {
          setIsPlaying(false);
          return 0; // Loop or stop
        }
        return newTime;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration]);

  const play = useCallback(() => {
    setIsPlaying(true);
    lastTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const seek = useCallback((time) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
  }, [duration]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(currentTime - 1);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, seek, toggleMute]);

  return {
    currentTime,
    duration,
    isPlaying,
    volume,
    isMuted,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
  };
}
```

**Acceptance Criteria**:
- ✅ Play/pause state management
- ✅ currentTime actualiza cada frame
- ✅ Seek funciona correctamente
- ✅ Keyboard shortcuts operativos

---

### R4: Timeline Playhead/Scrubber

**File**: `src/components/Editor/Storyboard.jsx` (update)

```jsx
// Add to Storyboard component:

import { usePlayer } from '../../hooks/usePlayer';

export function Storyboard() {
  const { currentTime, duration, seek } = usePlayer();
  const { state, dispatch } = useProject();

  const playheadPosition = (currentTime / duration) * 100;

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  return (
    <div className={styles.storyboard}>
      <div className={styles.timelineRuler} onClick={handleScrubberClick}>
        <TimelineRuler duration={duration} />
        <div
          className={styles.playhead}
          style={{ left: `${playheadPosition}%` }}
        />
      </div>
      {/* ... rest of component */}
    </div>
  );
}
```

**CSS** (add to `Storyboard.module.css`):
```css
.playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--color-error);
  pointer-events: none;
  z-index: 10;
}

.playhead::before {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  width: 14px;
  height: 14px;
  background-color: var(--color-error);
  border-radius: 50%;
  border: 2px solid white;
}
```

**Acceptance Criteria**:
- ✅ Playhead muestra posición actual
- ✅ Click en timeline hace seek
- ✅ Playhead sincronizado con player

---

### R5: Rendering Engine (Canvas-based)

**File**: `src/utils/renderEngine.js`

```javascript
export class RenderEngine {
  constructor(canvas, clips) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.clips = clips;
    this.currentClip = null;
    this.videoCache = new Map();
  }

  async loadClip(clip) {
    if (this.videoCache.has(clip.id)) {
      return this.videoCache.get(clip.id);
    }

    const video = document.createElement('video');
    video.src = clip.url;
    video.preload = 'auto';

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = reject;
    });

    this.videoCache.set(clip.id, video);
    return video;
  }

  async renderFrame(currentTime) {
    // Find clip at current time
    let accumulatedTime = 0;
    let targetClip = null;
    let clipLocalTime = 0;

    for (const clip of this.clips) {
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clip.duration) {
        targetClip = clip;
        clipLocalTime = currentTime - accumulatedTime;
        break;
      }
      accumulatedTime += clip.duration;
    }

    if (!targetClip) {
      // Clear canvas if no clip
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    // Load clip video
    const video = await this.loadClip(targetClip);
    
    // Seek to correct time within clip
    video.currentTime = clipLocalTime + targetClip.inPoint;

    // Wait for seek to complete
    await new Promise((resolve) => {
      video.onseeked = resolve;
      if (video.readyState >= 2) resolve();
    });

    // Draw video frame to canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

    // Apply effects (future: RFC-009)
    // this.applyEffects(targetClip.effects);
  }

  cleanup() {
    this.videoCache.forEach(video => {
      video.src = '';
      video.load();
    });
    this.videoCache.clear();
  }
}
```

**Acceptance Criteria**:
- ✅ Canvas renderiza frame correcto en tiempo actual
- ✅ Clips transicionan suavemente
- ✅ Video cache evita recargas

---

## 🏗️ File Structure After RFC-006

```
src/
├── components/
│   └── Editor/
│       ├── Player.jsx              ← Main player component
│       ├── Player.module.css
│       ├── PlayerControls.jsx      ← Controls UI
│       ├── PlayerControls.module.css
│       ├── Storyboard.jsx          ← Updated with playhead
│       └── Storyboard.module.css   ← Updated styles
├── hooks/
│   └── usePlayer.js                ← Player state & logic
└── utils/
    └── renderEngine.js             ← Canvas rendering
```

---

## 📊 Testing Requirements

**Test Files**:
- `Player.test.jsx`
- `PlayerControls.test.jsx`
- `usePlayer.test.js`
- `renderEngine.test.js`

**Test Cases**:
```javascript
describe('Player', () => {
  it('renders player controls', () => {});
  it('plays on play button click', () => {});
  it('pauses on pause button click', () => {});
});

describe('usePlayer', () => {
  it('updates currentTime while playing', () => {});
  it('seeks to correct position', () => {});
  it('handles keyboard shortcuts', () => {});
});
```

---

## ✅ Acceptance Criteria

**RFC-006 is complete when:**

1. **Player Display**
   - ✅ Canvas renders video frames
   - ✅ Player controls visible
   - ✅ Responsive sizing

2. **Playback**
   - ✅ Play/pause funciona
   - ✅ Stop resets a 0
   - ✅ Seek actualiza posición
   - ✅ Loop o stop al final

3. **Controls**
   - ✅ Play/pause button
   - ✅ Seek bar interactiva
   - ✅ Volume slider
   - ✅ Mute toggle
   - ✅ Timecode display

4. **Synchronization**
   - ✅ Player sincronizado con timeline
   - ✅ Playhead muestra posición actual
   - ✅ Click en timeline hace seek

5. **Keyboard Shortcuts**
   - ✅ Space = play/pause
   - ✅ Arrow Left/Right = seek ±1s
   - ✅ M = mute toggle

6. **Performance**
   - ✅ 30+ FPS durante playback
   - ✅ Smooth seeking
   - ✅ No frame drops con 3+ clips

---

## 🎨 Vibe Checklist

- [ ] Player controls azul (#1E72BD)
- [ ] Play button circular con hover scale
- [ ] Seek bar con thumb grande visible
- [ ] Timecode fuente monospace
- [ ] Playhead rojo (#E74C3C) visible
- [ ] Volume slider suave
- [ ] Canvas fondo negro (#000)

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-007 (Transitions System)

