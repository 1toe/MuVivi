# RFC-007: Transitions System
## Movie Maker 2025 — Transition Effects Between Clips

**Status**: Draft → Ready for Implementation  
**Phase**: 3 (Enhanced Features)  
**Complexity**: Medium-High  
**Estimated Duration**: 3-4 days  
**Dependencies**: RFC-001-006  

---

## 🎯 Overview

RFC-007 implementa **transiciones entre clips** (fade, dissolve, wipe, etc.) con **preview en tiempo real**, **drag & drop desde panel**, y **configuración de duración**.

Al finalizar RFC-007:
- ✅ Transitions panel con presets
- ✅ Drag & drop transiciones a clips
- ✅ Fade, Dissolve, Wipe, Slide implementados
- ✅ Transición duration configurable
- ✅ Preview en player
- ✅ Rendering de transiciones en canvas

---

## 📋 Requirements

### R1: Transitions Panel

**File**: `src/components/Panels/TransitionsPanel.jsx`

```jsx
import { useState } from 'react';
import styles from './TransitionsPanel.module.css';

const TRANSITIONS = [
  { id: 'fade', name: 'Fade', icon: '▓' },
  { id: 'dissolve', name: 'Dissolve', icon: '▒' },
  { id: 'wipe-left', name: 'Wipe Left', icon: '◀' },
  { id: 'wipe-right', name: 'Wipe Right', icon: '▶' },
  { id: 'slide-left', name: 'Slide Left', icon: '←' },
  { id: 'slide-right', name: 'Slide Right', icon: '→' },
];

export function TransitionsPanel() {
  const handleDragStart = (e, transition) => {
    e.dataTransfer.setData('transitionId', transition.id);
  };

  return (
    <div className={styles.transitionsPanel}>
      <h3 className={styles.panelTitle}>Transitions</h3>
      <div className={styles.transitionsGrid}>
        {TRANSITIONS.map((transition) => (
          <div
            key={transition.id}
            className={styles.transitionItem}
            draggable
            onDragStart={(e) => handleDragStart(e, transition)}
          >
            <div className={styles.transitionIcon}>{transition.icon}</div>
            <span className={styles.transitionName}>{transition.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**CSS** (`TransitionsPanel.module.css`):
```css
.transitionsPanel {
  padding: var(--spacing-md);
}

.panelTitle {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.transitionsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--spacing-md);
}

.transitionItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  cursor: grab;
  transition: var(--transition-fast);
}

.transitionItem:hover {
  background-color: var(--color-primary-light);
  transform: scale(1.05);
}

.transitionIcon {
  font-size: 32px;
  margin-bottom: var(--spacing-xs);
}

.transitionName {
  font-size: var(--font-size-sm);
  text-align: center;
}
```

**Acceptance Criteria**:
- ✅ Transitions grid muestra 6 presets
- ✅ Drag enabled
- ✅ Hover states suaves

---

### R2: Transition Application to Clips

**File**: `src/components/Editor/Clip.jsx` (update)

```jsx
// Add to Clip component:

const handleTransitionDrop = (e) => {
  e.stopPropagation();
  const transitionId = e.dataTransfer.getData('transitionId');
  
  if (transitionId) {
    dispatch({
      type: 'ADD_TRANSITION_TO_CLIP',
      payload: {
        clipId: clip.id,
        transitionId,
        duration: 1, // 1 second default
      },
    });
  }
};

return (
  <div
    className={`${styles.clip} ${isSelected ? styles.clipSelected : ''}`}
    onDrop={handleTransitionDrop}
    onDragOver={(e) => e.preventDefault()}
  >
    {/* ... existing code ... */}
    
    {clip.transition && (
      <div className={styles.transitionIndicator}>
        {getTransitionIcon(clip.transition.id)}
      </div>
    )}
  </div>
);
```

**CSS** (add to `Clip.module.css`):
```css
.transitionIndicator {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background-color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
}
```

**Acceptance Criteria**:
- ✅ Drag transition sobre clip funciona
- ✅ Transition indicator visible
- ✅ State actualiza correctamente

---

### R3: Project Context Updates

**File**: `src/context/ProjectContext.jsx` (add action)

```javascript
case 'ADD_TRANSITION_TO_CLIP':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId
        ? {
            ...clip,
            transition: {
              id: action.payload.transitionId,
              duration: action.payload.duration,
            },
          }
        : clip
    ),
  };

case 'UPDATE_TRANSITION_DURATION':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId && clip.transition
        ? {
            ...clip,
            transition: {
              ...clip.transition,
              duration: action.payload.duration,
            },
          }
        : clip
    ),
  };

case 'REMOVE_TRANSITION':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload
        ? { ...clip, transition: null }
        : clip
    ),
  };
```

**Acceptance Criteria**:
- ✅ ADD_TRANSITION_TO_CLIP funciona
- ✅ Transition se almacena en clip state
- ✅ UPDATE_TRANSITION_DURATION funciona

---

### R4: Transition Rendering

**File**: `src/utils/transitionRenderer.js`

```javascript
export class TransitionRenderer {
  static async renderTransition(ctx, fromFrame, toFrame, transitionId, progress, width, height) {
    switch (transitionId) {
      case 'fade':
        return this.renderFade(ctx, fromFrame, toFrame, progress, width, height);
      case 'dissolve':
        return this.renderDissolve(ctx, fromFrame, toFrame, progress, width, height);
      case 'wipe-left':
        return this.renderWipe(ctx, fromFrame, toFrame, progress, width, height, 'left');
      case 'wipe-right':
        return this.renderWipe(ctx, fromFrame, toFrame, progress, width, height, 'right');
      case 'slide-left':
        return this.renderSlide(ctx, fromFrame, toFrame, progress, width, height, 'left');
      case 'slide-right':
        return this.renderSlide(ctx, fromFrame, toFrame, progress, width, height, 'right');
      default:
        return this.renderFade(ctx, fromFrame, toFrame, progress, width, height);
    }
  }

  static renderFade(ctx, fromFrame, toFrame, progress, width, height) {
    ctx.clearRect(0, 0, width, height);
    
    // Draw from frame with fading opacity
    ctx.globalAlpha = 1 - progress;
    ctx.drawImage(fromFrame, 0, 0, width, height);
    
    // Draw to frame with increasing opacity
    ctx.globalAlpha = progress;
    ctx.drawImage(toFrame, 0, 0, width, height);
    
    ctx.globalAlpha = 1;
  }

  static renderDissolve(ctx, fromFrame, toFrame, progress, width, height) {
    // Similar to fade but with noise/dither (simplified version)
    this.renderFade(ctx, fromFrame, toFrame, progress, width, height);
  }

  static renderWipe(ctx, fromFrame, toFrame, progress, width, height, direction) {
    ctx.clearRect(0, 0, width, height);
    
    const wipeX = direction === 'left' ? width * progress : width * (1 - progress);
    
    // Draw from frame
    ctx.drawImage(fromFrame, 0, 0, width, height);
    
    // Create clipping region for to frame
    ctx.save();
    ctx.beginPath();
    if (direction === 'left') {
      ctx.rect(0, 0, wipeX, height);
    } else {
      ctx.rect(wipeX, 0, width - wipeX, height);
    }
    ctx.clip();
    ctx.drawImage(toFrame, 0, 0, width, height);
    ctx.restore();
  }

  static renderSlide(ctx, fromFrame, toFrame, progress, width, height, direction) {
    ctx.clearRect(0, 0, width, height);
    
    if (direction === 'left') {
      // From frame slides out to left
      ctx.drawImage(fromFrame, -width * progress, 0, width, height);
      // To frame slides in from right
      ctx.drawImage(toFrame, width * (1 - progress), 0, width, height);
    } else {
      // From frame slides out to right
      ctx.drawImage(fromFrame, width * progress, 0, width, height);
      // To frame slides in from left
      ctx.drawImage(toFrame, -width * (1 - progress), 0, width, height);
    }
  }
}
```

**Acceptance Criteria**:
- ✅ Fade transition smooth
- ✅ Wipe transition funcional
- ✅ Slide transition funcional
- ✅ Progress 0-1 controla transición

---

### R5: Render Engine Update

**File**: `src/utils/renderEngine.js` (update)

```javascript
import { TransitionRenderer } from './transitionRenderer';

// In renderFrame method, add transition logic:

async renderFrame(currentTime) {
  // ... existing clip finding logic ...

  // Check if we're in a transition zone
  const nextClipIndex = this.clips.indexOf(targetClip) + 1;
  const nextClip = this.clips[nextClipIndex];

  if (nextClip && nextClip.transition) {
    const transitionStartTime = nextClip.startTime;
    const transitionDuration = nextClip.transition.duration;
    const transitionEndTime = transitionStartTime + transitionDuration;

    if (currentTime >= transitionStartTime && currentTime < transitionEndTime) {
      // We're in transition zone
      const progress = (currentTime - transitionStartTime) / transitionDuration;

      // Get frames from both clips
      const fromVideo = await this.loadClip(targetClip);
      const toVideo = await this.loadClip(nextClip);

      fromVideo.currentTime = clipLocalTime + targetClip.inPoint;
      toVideo.currentTime = nextClip.inPoint;

      await Promise.all([
        new Promise(r => { fromVideo.onseeked = r; if (fromVideo.readyState >= 2) r(); }),
        new Promise(r => { toVideo.onseeked = r; if (toVideo.readyState >= 2) r(); }),
      ]);

      // Render transition
      TransitionRenderer.renderTransition(
        this.ctx,
        fromVideo,
        toVideo,
        nextClip.transition.id,
        progress,
        this.canvas.width,
        this.canvas.height
      );
      return;
    }
  }

  // ... normal frame rendering ...
}
```

**Acceptance Criteria**:
- ✅ Transiciones renderizan durante playback
- ✅ Progress calcula correctamente
- ✅ Transition zone detectada correctamente

---

### R6: Properties Panel - Transition Settings

**File**: `src/components/Editor/PropertiesPanel.jsx` (update)

```jsx
import { Slider } from '../UI/Slider';

export function PropertiesPanel() {
  const { state, dispatch } = useProject();
  const selectedClip = state.clips.find(c => c.id === state.selectedClipId);

  if (!selectedClip || !selectedClip.transition) {
    return <div>No transition selected</div>;
  }

  const handleDurationChange = (value) => {
    dispatch({
      type: 'UPDATE_TRANSITION_DURATION',
      payload: {
        clipId: selectedClip.id,
        duration: value,
      },
    });
  };

  const handleRemove = () => {
    dispatch({
      type: 'REMOVE_TRANSITION',
      payload: selectedClip.id,
    });
  };

  return (
    <div className={styles.propertiesPanel}>
      <h3>Transition Settings</h3>
      
      <div className={styles.property}>
        <label>Type</label>
        <p>{selectedClip.transition.id}</p>
      </div>

      <div className={styles.property}>
        <label>Duration (seconds)</label>
        <Slider
          min={0.5}
          max={3}
          step={0.1}
          value={selectedClip.transition.duration}
          onChange={handleDurationChange}
        />
        <span>{selectedClip.transition.duration.toFixed(1)}s</span>
      </div>

      <button onClick={handleRemove} className={styles.removeButton}>
        Remove Transition
      </button>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Duration slider funciona
- ✅ Remove transition funciona
- ✅ Settings actualizan en tiempo real

---

## 🏗️ File Structure After RFC-007

```
src/
├── components/
│   ├── Panels/
│   │   ├── TransitionsPanel.jsx    ← New
│   │   └── TransitionsPanel.module.css
│   └── Editor/
│       ├── Clip.jsx                ← Updated
│       ├── PropertiesPanel.jsx     ← Updated
│       └── PropertiesPanel.module.css
├── context/
│   └── ProjectContext.jsx          ← Updated actions
└── utils/
    ├── transitionRenderer.js       ← New
    └── renderEngine.js             ← Updated
```

---

## ✅ Acceptance Criteria

**RFC-007 is complete when:**

1. **Transitions Panel**
   - ✅ 6 transition presets visible
   - ✅ Drag & drop funcional

2. **Application**
   - ✅ Drag transition a clip funciona
   - ✅ Transition indicator visible en clip
   - ✅ State actualiza correctamente

3. **Rendering**
   - ✅ Fade renderiza smooth
   - ✅ Wipe renderiza correctamente
   - ✅ Slide renderiza correctamente
   - ✅ Transiciones se ven en player

4. **Configuration**
   - ✅ Duration configurable 0.5-3s
   - ✅ Remove transition funciona
   - ✅ Settings en Properties Panel

5. **Performance**
   - ✅ Transitions renderizan a 30+ FPS
   - ✅ No frame drops durante transición

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-008 (Visual Effects System)

