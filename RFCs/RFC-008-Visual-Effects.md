# RFC-008: Visual Effects System
## Movie Maker 2025 — Filters, Color Grading & Visual Effects

**Status**: Draft → Ready for Implementation  
**Phase**: 3 (Enhanced Features)  
**Complexity**: High  
**Estimated Duration**: 4-5 days  
**Dependencies**: RFC-001-007  

---

## 🎯 Overview

RFC-008 implementa **efectos visuales aplicables a clips**: brightness, contrast, saturation, blur, sepia, grayscale, etc. Efectos se aplican en tiempo real usando **canvas image manipulation**.

Al finalizar RFC-008:
- ✅ Effects panel con presets
- ✅ Drag & drop efectos a clips
- ✅ 8+ efectos visuales disponibles
- ✅ Effect intensity configurable
- ✅ Multiple effects stackable
- ✅ Real-time preview
- ✅ Canvas-based rendering

---

## 📋 Requirements

### R1: Effects Panel

**File**: `src/components/Panels/EffectsPanel.jsx`

```jsx
const EFFECTS = [
  { id: 'brightness', name: 'Brightness', icon: '☀️' },
  { id: 'contrast', name: 'Contrast', icon: '◐' },
  { id: 'saturation', name: 'Saturation', icon: '🎨' },
  { id: 'blur', name: 'Blur', icon: '◎' },
  { id: 'sepia', name: 'Sepia', icon: '📜' },
  { id: 'grayscale', name: 'Grayscale', icon: '⬛' },
  { id: 'invert', name: 'Invert', icon: '🔄' },
  { id: 'vignette', name: 'Vignette', icon: '⭕' },
];

export function EffectsPanel() {
  const handleDragStart = (e, effect) => {
    e.dataTransfer.setData('effectId', effect.id);
  };

  return (
    <div className={styles.effectsPanel}>
      <h3 className={styles.panelTitle}>Visual Effects</h3>
      <div className={styles.effectsGrid}>
        {EFFECTS.map((effect) => (
          <div
            key={effect.id}
            className={styles.effectItem}
            draggable
            onDragStart={(e) => handleDragStart(e, effect)}
          >
            <div className={styles.effectIcon}>{effect.icon}</div>
            <span className={styles.effectName}>{effect.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ 8 effects visible
- ✅ Drag enabled
- ✅ Icons descriptivos

---

### R2: Effect Application to Clips

**File**: `src/context/ProjectContext.jsx` (add actions)

```javascript
case 'ADD_EFFECT_TO_CLIP':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId
        ? {
            ...clip,
            effects: [
              ...clip.effects,
              {
                id: uuidv4(),
                type: action.payload.effectId,
                intensity: 0.5, // 0-1
              },
            ],
          }
        : clip
    ),
  };

case 'UPDATE_EFFECT':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId
        ? {
            ...clip,
            effects: clip.effects.map(eff =>
              eff.id === action.payload.effectId
                ? { ...eff, intensity: action.payload.intensity }
                : eff
            ),
          }
        : clip
    ),
  };

case 'REMOVE_EFFECT':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId
        ? {
            ...clip,
            effects: clip.effects.filter(eff => eff.id !== action.payload.effectId),
          }
        : clip
    ),
  };
```

**Acceptance Criteria**:
- ✅ Effects se añaden a clips
- ✅ Multiple effects stackeables
- ✅ Update/remove funciona

---

### R3: Effects Renderer

**File**: `src/utils/effectsRenderer.js`

```javascript
export class EffectsRenderer {
  static applyEffects(ctx, effects, width, height) {
    if (!effects || effects.length === 0) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (const effect of effects) {
      switch (effect.type) {
        case 'brightness':
          this.applyBrightness(data, effect.intensity);
          break;
        case 'contrast':
          this.applyContrast(data, effect.intensity);
          break;
        case 'saturation':
          this.applySaturation(data, effect.intensity);
          break;
        case 'blur':
          this.applyBlur(ctx, width, height, effect.intensity);
          return; // Blur uses different approach
        case 'sepia':
          this.applySepia(data, effect.intensity);
          break;
        case 'grayscale':
          this.applyGrayscale(data, effect.intensity);
          break;
        case 'invert':
          this.applyInvert(data, effect.intensity);
          break;
        case 'vignette':
          this.applyVignette(data, width, height, effect.intensity);
          break;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  static applyBrightness(data, intensity) {
    // intensity: 0 = dark, 0.5 = normal, 1 = bright
    const adjustment = (intensity - 0.5) * 255;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + adjustment));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment)); // B
    }
  }

  static applyContrast(data, intensity) {
    // intensity: 0 = no contrast, 0.5 = normal, 1 = high contrast
    const factor = (259 * (intensity * 255 + 255)) / (255 * (259 - intensity * 255));
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
    }
  }

  static applySaturation(data, intensity) {
    // intensity: 0 = desaturated, 0.5 = normal, 1 = super saturated
    const factor = intensity * 2;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
      
      data[i] = Math.max(0, Math.min(255, gray + factor * (data[i] - gray)));
      data[i + 1] = Math.max(0, Math.min(255, gray + factor * (data[i + 1] - gray)));
      data[i + 2] = Math.max(0, Math.min(255, gray + factor * (data[i + 2] - gray)));
    }
  }

  static applyBlur(ctx, width, height, intensity) {
    const blurAmount = Math.floor(intensity * 10);
    if (blurAmount === 0) return;
    
    // Simple box blur (can be optimized with stack blur)
    ctx.filter = `blur(${blurAmount}px)`;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(ctx.canvas, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
  }

  static applySepia(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;
      
      data[i] = r + intensity * (tr - r);
      data[i + 1] = g + intensity * (tg - g);
      data[i + 2] = b + intensity * (tb - b);
    }
  }

  static applyGrayscale(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
      
      data[i] = data[i] + intensity * (gray - data[i]);
      data[i + 1] = data[i + 1] + intensity * (gray - data[i + 1]);
      data[i + 2] = data[i + 2] + intensity * (gray - data[i + 2]);
    }
  }

  static applyInvert(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + intensity * (255 - data[i] - data[i]);
      data[i + 1] = data[i + 1] + intensity * (255 - data[i + 1] - data[i + 1]);
      data[i + 2] = data[i + 2] + intensity * (255 - data[i + 2] - data[i + 2]);
    }
  }

  static applyVignette(data, width, height, intensity) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const vignette = 1 - (distance / maxDistance) * intensity;
        
        const i = (y * width + x) * 4;
        data[i] *= vignette;
        data[i + 1] *= vignette;
        data[i + 2] *= vignette;
      }
    }
  }
}
```

**Acceptance Criteria**:
- ✅ Brightness funciona
- ✅ Contrast funciona
- ✅ Saturation funciona
- ✅ Blur funciona
- ✅ Sepia/Grayscale/Invert funcionan
- ✅ Vignette funciona

---

### R4: Render Engine Update

**File**: `src/utils/renderEngine.js` (update)

```javascript
import { EffectsRenderer } from './effectsRenderer';

async renderFrame(currentTime) {
  // ... existing clip finding and rendering logic ...
  
  // After drawing video frame to canvas:
  this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
  
  // Apply effects if any
  if (targetClip.effects && targetClip.effects.length > 0) {
    EffectsRenderer.applyEffects(
      this.ctx,
      targetClip.effects,
      this.canvas.width,
      this.canvas.height
    );
  }
  
  // Then apply transitions if in transition zone...
}
```

**Acceptance Criteria**:
- ✅ Effects se aplican en render loop
- ✅ Multiple effects se apilan correctamente
- ✅ Performance aceptable

---

### R5: Properties Panel - Effect Settings

**File**: `src/components/Editor/PropertiesPanel.jsx` (update)

```jsx
export function PropertiesPanel() {
  const { state, dispatch } = useProject();
  const selectedClip = state.clips.find(c => c.id === state.selectedClipId);

  if (!selectedClip) return <div>No clip selected</div>;

  const handleEffectIntensityChange = (effectId, intensity) => {
    dispatch({
      type: 'UPDATE_EFFECT',
      payload: {
        clipId: selectedClip.id,
        effectId,
        intensity,
      },
    });
  };

  const handleRemoveEffect = (effectId) => {
    dispatch({
      type: 'REMOVE_EFFECT',
      payload: {
        clipId: selectedClip.id,
        effectId,
      },
    });
  };

  return (
    <div className={styles.propertiesPanel}>
      <h3>Clip Properties</h3>
      
      <div className={styles.section}>
        <h4>Effects</h4>
        {selectedClip.effects.length === 0 ? (
          <p>No effects applied</p>
        ) : (
          selectedClip.effects.map((effect) => (
            <div key={effect.id} className={styles.effectControl}>
              <div className={styles.effectHeader}>
                <span>{effect.type}</span>
                <button onClick={() => handleRemoveEffect(effect.id)}>×</button>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={effect.intensity}
                onChange={(value) => handleEffectIntensityChange(effect.id, value)}
              />
              <span>{(effect.intensity * 100).toFixed(0)}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Effects list muestra todos los efectos
- ✅ Intensity slider funciona
- ✅ Remove effect funciona
- ✅ Real-time preview

---

## 🏗️ File Structure After RFC-008

```
src/
├── components/
│   ├── Panels/
│   │   ├── EffectsPanel.jsx        ← New
│   │   └── EffectsPanel.module.css
│   └── Editor/
│       └── PropertiesPanel.jsx     ← Updated
└── utils/
    ├── effectsRenderer.js          ← New
    └── renderEngine.js             ← Updated
```

---

## ✅ Acceptance Criteria

**RFC-008 is complete when:**

1. **Effects Panel**
   - ✅ 8+ effects disponibles
   - ✅ Drag & drop funcional

2. **Application**
   - ✅ Effects se aplican a clips
   - ✅ Multiple effects stackeables

3. **Rendering**
   - ✅ Brightness/Contrast/Saturation funcionan
   - ✅ Blur funciona
   - ✅ Sepia/Grayscale/Invert funcionan
   - ✅ Vignette funciona
   - ✅ Real-time preview

4. **Configuration**
   - ✅ Intensity configurable 0-100%
   - ✅ Remove effect funciona
   - ✅ Effects list en Properties Panel

5. **Performance**
   - ✅ Effects renderizan a 30+ FPS
   - ✅ 3+ effects stackeados sin lag

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-009 (Text & Titles System)

