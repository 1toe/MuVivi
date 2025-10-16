# RFC-016: Animated Intro Titles
## Movie Maker 2025 — Animated Title Sequences & Intro Templates

**Status**: Draft → Ready for Implementation  
**Phase**: 6 (Enhanced Features)  
**Complexity**: High  
**Estimated Duration**: 3-4 days  
**Dependencies**: RFC-001-009  

---

## 🎯 Overview

RFC-016 implementa **títulos animados e intros** estilo Windows Movie Maker 2012, con templates predefinidos, animaciones de entrada/salida, y backgrounds personalizables.

Al finalizar RFC-016:
- ✅ Panel de Intro Titles con templates
- ✅ 8+ templates de intro animados
- ✅ Drag & drop intros a timeline (como clips independientes)
- ✅ Customización de texto, colores, duración
- ✅ Animaciones smooth (fade, slide, zoom, rotate)
- ✅ Background options (solid color, gradient, image)

---

## 📋 Requirements

### R1: Intro Templates Library

**Características:**
- 8 templates de intro predefinidos:
  1. **Simple Fade** - Texto con fade in/out suave
  2. **Slide & Fade** - Texto que desliza desde abajo
  3. **Zoom In** - Texto que hace zoom desde centro
  4. **Split & Reveal** - Texto que se divide y revela
  5. **Typewriter** - Efecto de máquina de escribir
  6. **Cinematic Bars** - Barras negras con texto central
  7. **Pan & Zoom** - Background con efecto Ken Burns
  8. **Particle Title** - Texto con partículas (opcional)

**File**: `src/utils/introTemplates.js`

```javascript
export const INTRO_TEMPLATES = [
  {
    id: 'simple-fade',
    name: 'Simple Fade',
    duration: 3,
    description: 'Clean fade in and out',
    thumbnail: '/templates/simple-fade.png',
    defaultText: 'Your Title Here',
    animation: {
      type: 'fade',
      fadeIn: 1,
      fadeOut: 1,
    },
    background: {
      type: 'solid',
      color: '#000000',
    },
  },
  {
    id: 'slide-fade',
    name: 'Slide & Fade',
    duration: 4,
    description: 'Slide from bottom with fade',
    animation: {
      type: 'slide',
      direction: 'bottom',
      fadeIn: 0.8,
      fadeOut: 0.8,
    },
    background: {
      type: 'gradient',
      colors: ['#1e3a8a', '#3b82f6'],
    },
  },
  // ... more templates
];
```

**Acceptance Criteria**:
- ✅ 8 templates definidos con configuraciones
- ✅ Thumbnails visuales para cada template
- ✅ Parámetros de animación configurables
- ✅ Background options (solid, gradient, image)

---

### R2: IntroPanel Component

**File**: `src/components/Panels/IntroPanel.jsx`

```jsx
export function IntroPanel() {
  const { dispatch } = useProject();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [titleText, setTitleText] = useState('Your Title Here');
  const [subtitleText, setSubtitleText] = useState('');
  const [duration, setDuration] = useState(3);
  const [backgroundColor, setBackgroundColor] = useState('#000000');

  const handleAddIntro = () => {
    const intro = {
      id: uuid(),
      type: 'intro',
      template: selectedTemplate,
      title: titleText,
      subtitle: subtitleText,
      duration,
      backgroundColor,
      url: null, // Generated dynamically
    };

    dispatch({
      type: ActionTypes.ADD_INTRO_CLIP,
      payload: intro,
    });
  };

  return (
    <div className={styles.introPanel}>
      <div className={styles.header}>
        <h3>Intro Titles</h3>
      </div>

      <div className={styles.content}>
        {/* Templates Grid */}
        <div className={styles.section}>
          <label>Templates</label>
          <div className={styles.templatesGrid}>
            {INTRO_TEMPLATES.map((template) => (
              <button
                key={template.id}
                className={`${styles.templateCard} ${
                  selectedTemplate?.id === template.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <img src={template.thumbnail} alt={template.name} />
                <p>{template.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Customization */}
        {selectedTemplate && (
          <>
            <div className={styles.section}>
              <label>Title Text</label>
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
              />
            </div>

            <div className={styles.section}>
              <label>Subtitle (optional)</label>
              <input
                type="text"
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
              />
            </div>

            <div className={styles.section}>
              <label>Duration (seconds)</label>
              <Slider
                min={2}
                max={10}
                step={0.5}
                value={duration}
                onChange={setDuration}
              />
            </div>

            <div className={styles.section}>
              <label>Background Color</label>
              <ColorPicker
                color={backgroundColor}
                onChange={setBackgroundColor}
              />
            </div>

            <Button variant="primary" onClick={handleAddIntro}>
              Add Intro to Timeline
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Templates grid visible
- ✅ Template selection funciona
- ✅ Customization inputs funcionan
- ✅ Add button agrega intro a timeline

---

### R3: Intro Renderer

**File**: `src/utils/introRenderer.js`

```javascript
export class IntroRenderer {
  /**
   * Render intro animation frame
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} intro - Intro clip object
   * @param {number} time - Current time within intro
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  static renderIntro(ctx, intro, time, width, height) {
    const template = INTRO_TEMPLATES.find((t) => t.id === intro.template.id);
    if (!template) return;

    // Clear canvas
    this.renderBackground(ctx, intro, width, height);

    // Calculate animation progress (0-1)
    const progress = time / intro.duration;

    // Apply animation
    switch (template.animation.type) {
      case 'fade':
        this.renderFadeAnimation(ctx, intro, time, progress, width, height);
        break;
      case 'slide':
        this.renderSlideAnimation(ctx, intro, time, progress, width, height);
        break;
      case 'zoom':
        this.renderZoomAnimation(ctx, intro, time, progress, width, height);
        break;
      // ... more animations
    }
  }

  static renderBackground(ctx, intro, width, height) {
    const bg = intro.template.background || {};

    if (bg.type === 'solid') {
      ctx.fillStyle = intro.backgroundColor || bg.color;
      ctx.fillRect(0, 0, width, height);
    } else if (bg.type === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      bg.colors.forEach((color, i) => {
        gradient.addColorStop(i / (bg.colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (bg.type === 'image' && bg.imageUrl) {
      const img = new Image();
      img.src = bg.imageUrl;
      ctx.drawImage(img, 0, 0, width, height);
    }
  }

  static renderFadeAnimation(ctx, intro, time, progress, width, height) {
    const { fadeIn, fadeOut } = intro.template.animation;
    
    let opacity = 1;
    if (time < fadeIn) {
      opacity = time / fadeIn;
    } else if (time > intro.duration - fadeOut) {
      opacity = (intro.duration - time) / fadeOut;
    }

    ctx.save();
    ctx.globalAlpha = opacity;

    // Render text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 72px Arial';
    ctx.fillText(intro.title, width / 2, height / 2);

    if (intro.subtitle) {
      ctx.font = '32px Arial';
      ctx.fillText(intro.subtitle, width / 2, height / 2 + 60);
    }

    ctx.restore();
  }

  static renderSlideAnimation(ctx, intro, time, progress, width, height) {
    const { direction, fadeIn, fadeOut } = intro.template.animation;
    
    let opacity = 1;
    if (time < fadeIn) {
      opacity = time / fadeIn;
    } else if (time > intro.duration - fadeOut) {
      opacity = (intro.duration - time) / fadeOut;
    }

    // Easing function for smooth slide
    const easeProgress = this.easeOutCubic(Math.min(progress / 0.4, 1));
    
    let offsetY = 0;
    if (direction === 'bottom') {
      offsetY = (1 - easeProgress) * height * 0.3;
    }

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(0, offsetY);

    // Render text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 72px Arial';
    
    // Text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    ctx.fillText(intro.title, width / 2, height / 2);

    if (intro.subtitle) {
      ctx.font = '32px Arial';
      ctx.fillText(intro.subtitle, width / 2, height / 2 + 60);
    }

    ctx.restore();
  }

  static renderZoomAnimation(ctx, intro, time, progress, width, height) {
    // ... implement zoom animation
  }

  static easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  static easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
```

**Acceptance Criteria**:
- ✅ Renderiza backgrounds correctamente
- ✅ Fade animation funciona smooth
- ✅ Slide animation con easing
- ✅ Zoom animation (opcional)
- ✅ Text shadows para legibilidad

---

### R4: Integration with Player

**File**: `src/components/Editor/Player.jsx` (update)

```jsx
import { IntroRenderer } from '../../utils/introRenderer';

// Inside renderFrame useEffect:
const { clip, relativeTime } = clipInfo;

if (clip.type === 'intro') {
  // Render intro animation
  IntroRenderer.renderIntro(ctx, clip, relativeTime, canvas.width, canvas.height);
} else if (clip.type === 'video') {
  // ... existing video rendering
}
```

**Acceptance Criteria**:
- ✅ Intros se renderizan en player
- ✅ Animaciones smooth durante playback
- ✅ Intros funcionan como clips normales en timeline

---

### R5: PropertiesPanel Integration

**File**: `src/components/Layout/MainLayout.jsx` (update RibbonMenu)

Add "Intro" tab to ribbon menu with IntroPanel component.

**Acceptance Criteria**:
- ✅ Tab "Intro" visible en ribbon
- ✅ IntroPanel renderiza en sidebar
- ✅ Seamless integration con otros paneles

---

## ✅ Acceptance Criteria

**RFC-016 is complete when:**

1. **Templates**
   - ✅ 8 intro templates disponibles
   - ✅ Thumbnails visuales
   - ✅ Configuraciones predefinidas

2. **UI**
   - ✅ IntroPanel funcional
   - ✅ Template selection
   - ✅ Customization inputs
   - ✅ Add to timeline button

3. **Rendering**
   - ✅ IntroRenderer implementado
   - ✅ Fade animation
   - ✅ Slide animation
   - ✅ Zoom animation (optional)
   - ✅ Background rendering

4. **Integration**
   - ✅ Intro clips en timeline
   - ✅ Player renderiza intros
   - ✅ Drag & drop soporte (opcional)

5. **UX**
   - ✅ Smooth animations
   - ✅ Preview en real-time
   - ✅ Performance optimizado

---

## 🎨 Templates Examples

### Simple Fade
- Background: Solid black
- Animation: Fade in (1s) → Hold → Fade out (1s)
- Text: Center, white, 72px

### Slide & Fade
- Background: Blue gradient
- Animation: Slide from bottom + fade in → Hold → Fade out
- Text: Center, white, 72px with shadow

### Zoom In
- Background: Dark blue
- Animation: Zoom from 50% to 100% + fade in → Hold → Fade out
- Text: Center, white, 72px with glow effect

### Cinematic Bars
- Background: Black with top/bottom bars
- Animation: Bars slide in → Text fade in → Hold → Fade out
- Text: Center, white, 60px

---

## 📊 Technical Considerations

**Performance:**
- Canvas-based rendering (no DOM overhead)
- Requestanimationframe para smooth playback
- Easing functions para natural motion

**Extensibility:**
- Easy to add new templates
- Configurable animation parameters
- Custom background support

**Browser Compatibility:**
- Canvas 2D API (universal support)
- No WebGL required (for simplicity)

---

## 🚀 Future Enhancements (v1.4+)

- [ ] Custom template creator
- [ ] More animation types (rotate, 3D flip, etc.)
- [ ] Video backgrounds
- [ ] Audio sync with intro
- [ ] Export intro as separate file
- [ ] Import custom fonts

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-017 (Audio Editing)
