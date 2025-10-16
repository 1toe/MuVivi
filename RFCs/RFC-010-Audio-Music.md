# RFC-010: Audio & Music System
## Movie Maker 2025 — Background Music, Audio Tracks & Volume Control

**Status**: Draft → Ready for Implementation  
**Phase**: 4 (Advanced Features)  
**Complexity**: Medium  
**Estimated Duration**: 3 days  
**Dependencies**: RFC-001-009  

---

## 🎯 Overview

RFC-010 implementa **audio tracks**, **background music**, **volume control per clip**, y **audio mixing**.

Al finalizar RFC-010:
- ✅ Audio import (MP3, WAV, OGG)
- ✅ Background music track
- ✅ Volume control per clip
- ✅ Audio waveform visualization
- ✅ Audio mixing durante playback

---

## 📋 Requirements

### R1: Audio Import

**File**: `src/utils/fileValidation.js` (update)

```javascript
const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'm4a'];

export function validateFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const isAudio = SUPPORTED_AUDIO_FORMATS.includes(extension);
  
  // ... existing video/image validation ...
  
  if (isAudio) {
    return { valid: true, type: 'audio', extension };
  }
  
  // ... rest of validation ...
}
```

**Acceptance Criteria**:
- ✅ Audio files se validan correctamente
- ✅ MP3, WAV, OGG soportados

---

### R2: Background Music Track

**File**: `src/context/ProjectContext.jsx` (update initialState)

```javascript
const initialState = {
  // ... existing state ...
  backgroundMusic: null, // { id, name, url, volume, fadeIn, fadeOut }
};

// Add actions:
case 'SET_BACKGROUND_MUSIC':
  return {
    ...state,
    backgroundMusic: {
      id: action.payload.id,
      name: action.payload.name,
      url: action.payload.url,
      volume: 0.5,
      fadeIn: 2,
      fadeOut: 2,
    },
  };

case 'UPDATE_BACKGROUND_MUSIC_VOLUME':
  return {
    ...state,
    backgroundMusic: {
      ...state.backgroundMusic,
      volume: action.payload,
    },
  };
```

**Acceptance Criteria**:
- ✅ Background music se almacena en state
- ✅ Volume configurable

---

### R3: Audio Playback

**File**: `src/hooks/usePlayer.js` (update)

```javascript
export function usePlayer() {
  const { state } = useProject();
  const audioRef = useRef(null); // Background music
  const clipAudioRefs = useRef(new Map()); // Clip audios
  
  // ... existing player logic ...
  
  useEffect(() => {
    if (!state.backgroundMusic) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(state.backgroundMusic.url);
      audioRef.current.loop = true;
      audioRef.current.volume = state.backgroundMusic.volume;
    }
    
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [isPlaying, state.backgroundMusic]);
  
  // Update volume
  useEffect(() => {
    if (audioRef.current && state.backgroundMusic) {
      audioRef.current.volume = state.backgroundMusic.volume;
    }
  }, [state.backgroundMusic?.volume]);
  
  // ... rest of hook ...
}
```

**Acceptance Criteria**:
- ✅ Background music plays durante playback
- ✅ Volume control funciona
- ✅ Pausa/resume sincronizado

---

### R4: Audio Waveform (v1.1 enhancement)

**File**: `src/utils/waveformGenerator.js`

```javascript
export async function generateWaveform(audioUrl, width = 800, height = 60) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const rawData = audioBuffer.getChannelData(0);
  const samples = width;
  const blockSize = Math.floor(rawData.length / samples);
  const waveformData = [];
  
  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[i * blockSize + j]);
    }
    waveformData.push(sum / blockSize);
  }
  
  // Normalize
  const max = Math.max(...waveformData);
  return waveformData.map(v => v / max);
}
```

**Acceptance Criteria**:
- ✅ Waveform data generado
- ✅ Normalizado 0-1

---

### R5: Audio Panel

**File**: `src/components/Panels/AudioPanel.jsx`

```jsx
export function AudioPanel() {
  const { state, dispatch } = useProject();
  const { media } = useMedia();
  const audioFiles = media.filter(m => m.type === 'audio');

  const handleSetBackgroundMusic = (audioFile) => {
    dispatch({
      type: 'SET_BACKGROUND_MUSIC',
      payload: audioFile,
    });
  };

  const handleVolumeChange = (volume) => {
    dispatch({
      type: 'UPDATE_BACKGROUND_MUSIC_VOLUME',
      payload: volume,
    });
  };

  return (
    <div className={styles.audioPanel}>
      <h3>Background Music</h3>
      
      {state.backgroundMusic ? (
        <div className={styles.currentMusic}>
          <p>{state.backgroundMusic.name}</p>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={state.backgroundMusic.volume}
            onChange={handleVolumeChange}
          />
          <button onClick={() => dispatch({ type: 'SET_BACKGROUND_MUSIC', payload: null })}>
            Remove
          </button>
        </div>
      ) : (
        <div className={styles.audioList}>
          {audioFiles.map(audio => (
            <div key={audio.id} className={styles.audioItem}>
              <span>{audio.name}</span>
              <button onClick={() => handleSetBackgroundMusic(audio)}>
                Set as Background
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Audio files list
- ✅ Set background music funciona
- ✅ Volume slider funciona

---

## ✅ Acceptance Criteria

**RFC-010 is complete when:**

1. **Audio Import**
   - ✅ MP3, WAV, OGG supported
   - ✅ Audio files en Media Panel

2. **Background Music**
   - ✅ Set background music funciona
   - ✅ Plays durante playback
   - ✅ Volume 0-100% configurable

3. **Playback**
   - ✅ Audio sincronizado con video
   - ✅ Pause/resume funciona

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-011 (Export & Rendering)

