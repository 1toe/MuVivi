# RFC-005: Storyboard & Timeline Management
## Movie Maker 2025 — Clip Arrangement, Drag & Drop Timeline

**Status**: Draft → Ready for Implementation  
**Phase**: 2 (Core Features)  
**Complexity**: High  
**Estimated Duration**: 4-5 days  
**Dependencies**: RFC-001, RFC-002, RFC-003, RFC-004  

---

## 🎯 Overview

RFC-005 implementa el **Storyboard (timeline)** donde los usuarios organizan clips en secuencia, con **drag & drop**, **reorder**, **trim**, y **delete** funcionalidades.

Al finalizar RFC-005:
- ✅ Storyboard horizontal scrollable
- ✅ Drag & drop clips desde Media Panel
- ✅ Reorder clips en timeline
- ✅ Clip selection (active clip highlighting)
- ✅ Delete clips del timeline
- ✅ Clip duration display
- ✅ Timeline ruler con timecodes

---

## 📋 Requirements

### R1: Storyboard Component

**File**: `src/components/Editor/Storyboard.jsx`

```jsx
import { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Clip } from './Clip';
import styles from './Storyboard.module.css';

export function Storyboard() {
  const { state, dispatch } = useProject();
  const [draggedClipId, setDraggedClipId] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    
    // Drop from Media Panel (new clip)
    const mediaId = e.dataTransfer.getData('mediaId');
    if (mediaId) {
      dispatch({
        type: 'ADD_CLIP_FROM_MEDIA',
        payload: { mediaId },
      });
      return;
    }

    // Reorder existing clip
    const clipId = e.dataTransfer.getData('clipId');
    if (clipId && draggedClipId) {
      const dropIndex = parseInt(e.dataTransfer.getData('dropIndex'));
      dispatch({
        type: 'REORDER_CLIP',
        payload: { clipId, newIndex: dropIndex },
      });
    }

    setDraggedClipId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.storyboard}>
      <div className={styles.timelineRuler}>
        <TimelineRuler duration={state.duration} />
      </div>

      <div
        className={styles.clipContainer}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {state.clips.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Drag media here to add clips</p>
          </div>
        ) : (
          state.clips.map((clip, index) => (
            <Clip
              key={clip.id}
              clip={clip}
              index={index}
              isSelected={state.selectedClipId === clip.id}
              onSelect={() => dispatch({ type: 'SET_SELECTED_CLIP', payload: clip.id })}
              onDragStart={() => setDraggedClipId(clip.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Storyboard renderiza sin errores
- ✅ Drag & drop funciona desde Media Panel
- ✅ Clips se añaden al timeline
- ✅ Empty state muestra mensaje

---

### R2: Clip Component

**File**: `src/components/Editor/Clip.jsx`

```jsx
import { useRef } from 'react';
import styles from './Clip.module.css';

export function Clip({ clip, index, isSelected, onSelect, onDragStart }) {
  const clipRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('clipId', clip.id);
    e.dataTransfer.setData('dropIndex', index);
    onDragStart();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    // Dispatch delete action
  };

  return (
    <div
      ref={clipRef}
      className={`${styles.clip} ${isSelected ? styles.clipSelected : ''}`}
      draggable
      onDragStart={handleDragStart}
      onClick={onSelect}
      style={{
        width: `${clip.duration * 100}px`, // 100px = 1 second
      }}
    >
      <img
        src={clip.thumbnail}
        alt={clip.name}
        className={styles.clipThumbnail}
      />

      <div className={styles.clipOverlay}>
        <span className={styles.clipDuration}>
          {formatDuration(clip.duration)}
        </span>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          aria-label="Delete clip"
        >
          ×
        </button>
      </div>

      {isSelected && (
        <div className={styles.clipHandles}>
          <div className={styles.handleLeft} />
          <div className={styles.handleRight} />
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

**CSS** (`Clip.module.css`):
```css
.clip {
  position: relative;
  height: 80px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: grab;
  transition: var(--transition-fast);
  border: 2px solid transparent;
  margin-right: var(--spacing-xs);
}

.clip:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}

.clipSelected {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.clipThumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clipOverlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: var(--spacing-xs);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clipDuration {
  font-size: var(--font-size-xs);
  color: white;
  font-weight: 600;
}

.deleteButton {
  background: rgba(231, 76, 60, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: var(--transition-fast);
}

.deleteButton:hover {
  background: var(--color-error);
  transform: scale(1.1);
}

.clipHandles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.handleLeft,
.handleRight {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  background-color: var(--color-primary);
  cursor: ew-resize;
  pointer-events: all;
}

.handleLeft {
  left: 0;
}

.handleRight {
  right: 0;
}
```

**Acceptance Criteria**:
- ✅ Clip renderiza con thumbnail
- ✅ Duración visible
- ✅ Delete button funciona
- ✅ Drag & drop funcional
- ✅ Selection highlighting claro

---

### R3: Timeline Ruler

**File**: `src/components/Editor/TimelineRuler.jsx`

```jsx
import styles from './TimelineRuler.module.css';

export function TimelineRuler({ duration }) {
  const tickCount = Math.ceil(duration);
  const ticks = Array.from({ length: tickCount }, (_, i) => i);

  return (
    <div className={styles.ruler}>
      {ticks.map((tick) => (
        <div key={tick} className={styles.tick} style={{ left: `${tick * 100}px` }}>
          <div className={styles.tickMark} />
          <span className={styles.tickLabel}>{formatTimecode(tick)}</span>
        </div>
      ))}
    </div>
  );
}

function formatTimecode(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

**CSS** (`TimelineRuler.module.css`):
```css
.ruler {
  position: relative;
  height: 30px;
  background-color: var(--color-bg-accent);
  border-bottom: 1px solid var(--color-border-light);
}

.tick {
  position: absolute;
  top: 0;
}

.tickMark {
  width: 1px;
  height: 10px;
  background-color: var(--color-text-secondary);
}

.tickLabel {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  position: absolute;
  top: 12px;
  left: 4px;
}
```

**Acceptance Criteria**:
- ✅ Ruler muestra timecodes cada 1s
- ✅ Tick marks visibles
- ✅ Sincronizado con duración total

---

### R4: Project Context Updates

**File**: `src/context/ProjectContext.jsx` (añadir actions)

```javascript
// Añadir a projectReducer:

case 'ADD_CLIP_FROM_MEDIA':
  const mediaItem = getMediaById(action.payload.mediaId); // Helper
  const newClip = {
    id: uuidv4(),
    mediaId: action.payload.mediaId,
    name: mediaItem.name,
    type: mediaItem.type,
    thumbnail: mediaItem.thumbnail,
    duration: mediaItem.duration || 3, // 3s default for images
    startTime: state.clips.reduce((acc, c) => acc + c.duration, 0),
    inPoint: 0,
    outPoint: mediaItem.duration || 3,
    effects: [],
    transitions: null,
  };
  return {
    ...state,
    clips: [...state.clips, newClip],
    duration: state.duration + newClip.duration,
  };

case 'REORDER_CLIP':
  const clips = [...state.clips];
  const fromIndex = clips.findIndex(c => c.id === action.payload.clipId);
  const [movedClip] = clips.splice(fromIndex, 1);
  clips.splice(action.payload.newIndex, 0, movedClip);
  
  // Recalculate startTimes
  let currentTime = 0;
  clips.forEach(clip => {
    clip.startTime = currentTime;
    currentTime += clip.duration;
  });
  
  return { ...state, clips };

case 'DELETE_CLIP':
  const updatedClips = state.clips.filter(c => c.id !== action.payload);
  return {
    ...state,
    clips: updatedClips,
    duration: updatedClips.reduce((acc, c) => acc + c.duration, 0),
    selectedClipId: null,
  };
```

**Acceptance Criteria**:
- ✅ ADD_CLIP_FROM_MEDIA funciona
- ✅ REORDER_CLIP actualiza orden
- ✅ DELETE_CLIP remueve clip
- ✅ Duration total actualiza

---

### R5: Clip Trimming (Future Enhancement v1.1)

**Note**: Trimming handles (inPoint/outPoint adjustment) será implementado en v1.1 como enhancement. RFC-005 incluye **estructura** pero funcionalidad completa en futuro RFC.

**Placeholder**:
```jsx
// En Clip.jsx, handles están visibles pero no funcionales aún
// RFC-008 (v1.1) implementará trim logic
```

---

## 🏗️ File Structure After RFC-005

```
src/
├── components/
│   └── Editor/
│       ├── Storyboard.jsx          ← Main timeline
│       ├── Storyboard.module.css
│       ├── Clip.jsx                ← Individual clip
│       ├── Clip.module.css
│       ├── TimelineRuler.jsx       ← Timecode ruler
│       └── TimelineRuler.module.css
├── context/
│   └── ProjectContext.jsx          ← Updated with clip actions
```

---

## 📊 Testing Requirements

**Test Files**:
- `Storyboard.test.jsx`
- `Clip.test.jsx`
- `TimelineRuler.test.jsx`

**Test Cases**:
```javascript
describe('Storyboard', () => {
  it('renders empty state', () => {});
  it('adds clip from media', () => {});
  it('reorders clips on drag', () => {});
});

describe('Clip', () => {
  it('renders with thumbnail', () => {});
  it('shows duration', () => {});
  it('highlights when selected', () => {});
  it('deletes on click delete', () => {});
});
```

---

## ✅ Acceptance Criteria

**RFC-005 is complete when:**

1. **Storyboard Display**
   - ✅ Timeline renderiza horizontalmente
   - ✅ Scrollable cuando > viewport width
   - ✅ Empty state funcional

2. **Clip Management**
   - ✅ Drag from Media Panel adds clip
   - ✅ Clips se reordenan con drag & drop
   - ✅ Delete button funciona
   - ✅ Selection highlighting claro

3. **Timeline Ruler**
   - ✅ Ruler muestra timecodes
   - ✅ Sincronizado con duración
   - ✅ Tick marks cada 1s

4. **State Management**
   - ✅ Clips se almacenan en ProjectContext
   - ✅ ADD_CLIP_FROM_MEDIA funciona
   - ✅ REORDER_CLIP funciona
   - ✅ DELETE_CLIP funciona
   - ✅ Duration total calcula correctamente

5. **UX/UI**
   - ✅ Drag feedback visual
   - ✅ Hover states suaves
   - ✅ Selected clip tiene border azul
   - ✅ Delete button rojo hover

6. **Performance**
   - ✅ Timeline con 20+ clips fluido
   - ✅ Drag & drop sin lag
   - ✅ Reorder instantáneo

---

## 🎨 Vibe Checklist

- [ ] Timeline horizontal scroll suave
- [ ] Clips con border radius 4px
- [ ] Selected clip border azul #1E72BD
- [ ] Hover states con scale subtle
- [ ] Delete button rojo (#E74C3C) pero soft
- [ ] Empty state friendly message
- [ ] Drag cursor "grabbing"

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-006 (Player & Preview System)

