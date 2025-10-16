# RFC-009: Text & Titles System
## Movie Maker 2025 — Text Overlays, Titles & Captions

**Status**: Draft → Ready for Implementation  
**Phase**: 3 (Enhanced Features)  
**Complexity**: Medium-High  
**Estimated Duration**: 3-4 days  
**Dependencies**: RFC-001-008  

---

## 🎯 Overview

RFC-009 implementa **text overlays** que se pueden añadir sobre clips, con **customización de fuente, tamaño, color, posición**, y **animaciones de entrada/salida**.

Al finalizar RFC-009:
- ✅ Text panel con templates
- ✅ Add text sobre clips
- ✅ Font, size, color customization
- ✅ Position draggable
- ✅ Text duration configurable
- ✅ Fade in/out animations
- ✅ Canvas rendering de text

---

## 📋 Requirements

### R1: Text Panel

**File**: `src/components/Panels/TextPanel.jsx`

```jsx
const TEXT_TEMPLATES = [
  { id: 'title', name: 'Title', fontSize: 48, position: 'center' },
  { id: 'subtitle', name: 'Subtitle', fontSize: 32, position: 'bottom' },
  { id: 'caption', name: 'Caption', fontSize: 24, position: 'top' },
  { id: 'credit', name: 'Credit', fontSize: 18, position: 'bottom-right' },
];

export function TextPanel() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [textInput, setTextInput] = useState('');

  const handleAddText = () => {
    if (!textInput.trim()) return;
    
    dispatch({
      type: 'ADD_TEXT_TO_CLIP',
      payload: {
        clipId: state.selectedClipId,
        text: textInput,
        template: selectedTemplate || TEXT_TEMPLATES[0],
      },
    });
    
    setTextInput('');
  };

  return (
    <div className={styles.textPanel}>
      <h3>Add Text</h3>
      
      <div className={styles.templates}>
        {TEXT_TEMPLATES.map(template => (
          <button
            key={template.id}
            className={selectedTemplate?.id === template.id ? styles.active : ''}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.name}
          </button>
        ))}
      </div>

      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter text..."
        className={styles.textInput}
      />

      <button onClick={handleAddText} className={styles.addButton}>
        Add Text
      </button>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ 4 text templates disponibles
- ✅ Input text funcional
- ✅ Add text button funciona

---

### R2: Text Object Structure

**File**: `src/context/ProjectContext.jsx` (add action)

```javascript
case 'ADD_TEXT_TO_CLIP':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId
        ? {
            ...clip,
            texts: [
              ...(clip.texts || []),
              {
                id: uuidv4(),
                content: action.payload.text,
                fontSize: action.payload.template.fontSize,
                fontFamily: 'Segoe UI, Arial, sans-serif',
                color: '#FFFFFF',
                position: action.payload.template.position, // 'center', 'top', 'bottom', etc.
                x: 0, // Offset from position
                y: 0,
                startTime: 0, // Relative to clip
                duration: clip.duration, // Full clip duration
                fadeIn: 0.5,
                fadeOut: 0.5,
              },
            ],
          }
        : clip
    ),
  };

case 'UPDATE_TEXT':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId
        ? {
            ...clip,
            texts: clip.texts.map(text =>
              text.id === action.payload.textId
                ? { ...text, ...action.payload.updates }
                : text
            ),
          }
        : clip
    ),
  };

case 'REMOVE_TEXT':
  return {
    ...state,
    clips: state.clips.map(clip =>
      clip.id === action.payload.clipId
        ? {
            ...clip,
            texts: clip.texts.filter(text => text.id !== action.payload.textId),
          }
        : clip
    ),
  };
```

**Acceptance Criteria**:
- ✅ Text objects se almacenan en clips
- ✅ Text properties configurables
- ✅ Update/remove funciona

---

### R3: Text Renderer

**File**: `src/utils/textRenderer.js`

```javascript
export class TextRenderer {
  static renderTexts(ctx, texts, clipLocalTime, width, height) {
    if (!texts || texts.length === 0) return;

    texts.forEach(text => {
      // Check if text should be visible at current time
      if (clipLocalTime < text.startTime || clipLocalTime > text.startTime + text.duration) {
        return;
      }

      const timeInText = clipLocalTime - text.startTime;
      let opacity = 1;

      // Fade in
      if (timeInText < text.fadeIn) {
        opacity = timeInText / text.fadeIn;
      }
      
      // Fade out
      if (timeInText > text.duration - text.fadeOut) {
        opacity = (text.duration - timeInText) / text.fadeOut;
      }

      ctx.save();
      ctx.globalAlpha = opacity;

      // Set font
      ctx.font = `${text.fontSize}px ${text.fontFamily}`;
      ctx.fillStyle = text.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calculate position
      const { x, y } = this.calculatePosition(text.position, text.x, text.y, width, height);

      // Draw text with shadow for readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillText(text.content, x, y);

      ctx.restore();
    });
  }

  static calculatePosition(position, offsetX, offsetY, width, height) {
    let x = width / 2;
    let y = height / 2;

    switch (position) {
      case 'center':
        x = width / 2;
        y = height / 2;
        break;
      case 'top':
        x = width / 2;
        y = height * 0.15;
        break;
      case 'bottom':
        x = width / 2;
        y = height * 0.85;
        break;
      case 'top-left':
        x = width * 0.15;
        y = height * 0.15;
        break;
      case 'top-right':
        x = width * 0.85;
        y = height * 0.15;
        break;
      case 'bottom-left':
        x = width * 0.15;
        y = height * 0.85;
        break;
      case 'bottom-right':
        x = width * 0.85;
        y = height * 0.85;
        break;
    }

    return { x: x + offsetX, y: y + offsetY };
  }
}
```

**Acceptance Criteria**:
- ✅ Text renderiza en canvas
- ✅ Fade in/out animations
- ✅ Position calculations correctos
- ✅ Shadow para readability

---

### R4: Render Engine Update

**File**: `src/utils/renderEngine.js` (update)

```javascript
import { TextRenderer } from './textRenderer';

async renderFrame(currentTime) {
  // ... existing rendering logic ...
  
  // After applying effects:
  if (targetClip.effects && targetClip.effects.length > 0) {
    EffectsRenderer.applyEffects(/*...*/);
  }
  
  // Render texts
  if (targetClip.texts && targetClip.texts.length > 0) {
    TextRenderer.renderTexts(
      this.ctx,
      targetClip.texts,
      clipLocalTime,
      this.canvas.width,
      this.canvas.height
    );
  }
  
  // Then transitions...
}
```

**Acceptance Criteria**:
- ✅ Texts renderizan sobre video
- ✅ Fade animations funcionan
- ✅ Multiple texts soportados

---

### R5: Properties Panel - Text Settings

**File**: `src/components/Editor/PropertiesPanel.jsx` (update)

```jsx
export function PropertiesPanel() {
  const { state, dispatch } = useProject();
  const selectedClip = state.clips.find(c => c.id === state.selectedClipId);
  const [selectedText, setSelectedText] = useState(null);

  if (!selectedClip) return <div>No clip selected</div>;

  const handleTextUpdate = (textId, updates) => {
    dispatch({
      type: 'UPDATE_TEXT',
      payload: {
        clipId: selectedClip.id,
        textId,
        updates,
      },
    });
  };

  return (
    <div className={styles.propertiesPanel}>
      <h3>Clip Properties</h3>
      
      {/* ... existing effects section ... */}
      
      <div className={styles.section}>
        <h4>Text Overlays</h4>
        {!selectedClip.texts || selectedClip.texts.length === 0 ? (
          <p>No text overlays</p>
        ) : (
          selectedClip.texts.map(text => (
            <div key={text.id} className={styles.textItem}>
              <button onClick={() => setSelectedText(text)}>
                {text.content.substring(0, 20)}...
              </button>
              
              {selectedText?.id === text.id && (
                <div className={styles.textSettings}>
                  <label>
                    Font Size
                    <Slider
                      min={12}
                      max={72}
                      value={text.fontSize}
                      onChange={(v) => handleTextUpdate(text.id, { fontSize: v })}
                    />
                  </label>
                  
                  <label>
                    Color
                    <ColorPicker
                      value={text.color}
                      onChange={(v) => handleTextUpdate(text.id, { color: v })}
                    />
                  </label>
                  
                  <label>
                    Position
                    <select
                      value={text.position}
                      onChange={(e) => handleTextUpdate(text.id, { position: e.target.value })}
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </label>
                  
                  <button
                    onClick={() => dispatch({
                      type: 'REMOVE_TEXT',
                      payload: { clipId: selectedClip.id, textId: text.id },
                    })}
                  >
                    Remove Text
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Text list muestra todos los texts
- ✅ Font size slider funciona
- ✅ Color picker funciona
- ✅ Position selector funciona
- ✅ Remove text funciona

---

## 🏗️ File Structure After RFC-009

```
src/
├── components/
│   ├── Panels/
│   │   ├── TextPanel.jsx           ← New
│   │   └── TextPanel.module.css
│   └── Editor/
│       └── PropertiesPanel.jsx     ← Updated
└── utils/
    ├── textRenderer.js             ← New
    └── renderEngine.js             ← Updated
```

---

## ✅ Acceptance Criteria

**RFC-009 is complete when:**

1. **Text Panel**
   - ✅ 4 templates disponibles
   - ✅ Text input funcional
   - ✅ Add text funciona

2. **Text Rendering**
   - ✅ Text renderiza sobre video
   - ✅ Fade in/out animations
   - ✅ Shadow para legibilidad
   - ✅ Multiple texts soportados

3. **Customization**
   - ✅ Font size 12-72px
   - ✅ Color customizable
   - ✅ 7 positions presets
   - ✅ Duration configurable

4. **Properties Panel**
   - ✅ Text settings accesibles
   - ✅ Real-time preview
   - ✅ Remove text funciona

5. **Performance**
   - ✅ Text rendering a 30+ FPS
   - ✅ 5+ texts sin lag

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-010 (Audio & Music System)

