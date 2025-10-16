# RFC-002: Component Architecture & Design System
## Movie Maker 2025 — Foundation Components & Visual Language

**Status**: Draft → Ready for Implementation  
**Phase**: 1 (Foundation)  
**Complexity**: Medium  
**Estimated Duration**: 3-4 days  
**Dependencies**: RFC-001  

---

## 🎯 Overview

RFC-002 establece la **arquitectura de componentes base**, **design system**, y **patrones de desarrollo** que serán la base para todos los componentes posteriores.

Al finalizar RFC-002:
- ✅ Design tokens (colores, spacing, tipografía, sombras) definidos
- ✅ Componentes base reutilizables (Button, Slider, ColorPicker, Modal, etc)
- ✅ Context API setup con ProjectContext
- ✅ Custom hooks base (useProject, useUndo)
- ✅ Sistema de animaciones establecido
- ✅ Convenciones CSS (BEM-like) implementadas

---

## 📋 Requirements

### R1: Design Tokens & Theme System
**Files**:
- `src/styles/theme.css`
- `tailwind.config.js` (extensiones)
- `src/styles/animations.css`
- `src/styles/reset.css`

**Colors** (Movie Maker 2012 Aesthetic):
```css
:root {
  /* Primary */
  --color-primary: #1E72BD;
  --color-primary-dark: #0F4C8B;
  --color-primary-light: #4A9FD8;
  
  /* Backgrounds */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F3F3F3;
  --color-bg-accent: #E6F0FA;
  
  /* Text */
  --color-text-primary: #2C3E50;
  --color-text-secondary: #7F8C8D;
  
  /* Status */
  --color-success: #27AE60;
  --color-error: #E74C3C;
  --color-warning: #F39C12;
  --color-info: #3498DB;
  
  /* Spacing (8px base) */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family: 'Segoe UI', Arial, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
  
  /* Shadows (suaves) */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

**Acceptance Criteria**:
- ✅ Todos los tokens accesibles desde CSS
- ✅ Consistencia entre Tailwind config y CSS variables
- ✅ Reset.css normaliza cross-browser

---

### R2: Base UI Components

#### Button Component
**File**: `src/components/UI/Button.jsx`

**Features**:
- Variants: primary, secondary, ghost, danger
- Sizes: sm, md, lg
- States: normal, hover, active, disabled
- Icons support (left/right)

```jsx
export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  icon = null,
  children,
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`btn btn-${variant} btn-${size}`}
      {...props}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {children || label}
    </button>
  );
}
```

**Acceptance Criteria**:
- ✅ Todos los variants visuales
- ✅ Accesible (ARIA, keyboard)
- ✅ Hover/focus states claros

---

#### Slider Component
**File**: `src/components/UI/Slider.jsx`

**Features**:
- Range slider (min-max)
- Step configurable
- Labels y marks
- Tooltip al arrastrar

**Acceptance Criteria**:
- ✅ Smooth dragging
- ✅ Keyboard navigation (arrows)
- ✅ Accessible labels

---

#### ColorPicker Component
**File**: `src/components/UI/ColorPicker.jsx`

**Features**:
- Hex color input
- Color swatch selector
- Preset colors (tema)
- Live preview

**Acceptance Criteria**:
- ✅ Seleccionar color
- ✅ Input hex funcionando

---

#### Modal/Dialog Component
**File**: `src/components/UI/Modal.jsx`

**Features**:
- Header, body, footer
- Close button
- Backdrop blur
- Esc key closes
- Focus trap

**Acceptance Criteria**:
- ✅ Modal aparece/desaparece
- ✅ Escape cierra
- ✅ Backdrop funciona

---

#### Notification Component
**File**: `src/components/UI/Notification.jsx`

**Features**:
- Types: success, error, warning, info
- Auto-dismiss (configurable)
- Stack position (top-right)
- Fade in/out animations

**Acceptance Criteria**:
- ✅ Notificación visible
- ✅ Auto-dismiss después 3s
- ✅ Animaciones suaves

---

### R3: Context API Setup

**File**: `src/context/ProjectContext.jsx`

```javascript
import { createContext, useContext, useReducer, useCallback } from 'react';

const ProjectContext = createContext();

const initialState = {
  projectName: 'Untitled',
  clips: [],
  textLayers: [],
  selectedClipId: null,
  currentTime: 0,
  isPlaying: false,
  duration: 0,
  settings: {
    language: 'en',
    autoSaveInterval: 30,
    previewQuality: 'medium',
  },
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'ADD_CLIP':
      return { ...state, clips: [...state.clips, action.payload] };
    case 'REMOVE_CLIP':
      return { ...state, clips: state.clips.filter(c => c.id !== action.payload) };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_SELECTED_CLIP':
      return { ...state, selectedClipId: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const actions = {
    addClip: useCallback((clip) => {
      dispatch({ type: 'ADD_CLIP', payload: clip });
    }, []),
    removeClip: useCallback((clipId) => {
      dispatch({ type: 'REMOVE_CLIP', payload: clipId });
    }, []),
    setPlaying: useCallback((isPlaying) => {
      dispatch({ type: 'SET_PLAYING', payload: isPlaying });
    }, []),
    setCurrentTime: useCallback((time) => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }, []),
  };

  return (
    <ProjectContext.Provider value={{ state, dispatch, ...actions }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
```

**Acceptance Criteria**:
- ✅ ProjectProvider funciona
- ✅ useProject hook accesible
- ✅ State actualiza correctamente

---

### R4: Custom Hooks

**File**: `src/hooks/useUndo.js`

```javascript
export function useUndo(initialState) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [historyStep, setHistoryStep] = useState(0);

  const push = (newState) => {
    setHistory(h => [...h.slice(0, historyStep + 1), newState]);
    setHistoryStep(s => s + 1);
    setState(newState);
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setState(history[newStep]);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setState(history[newStep]);
      setHistoryStep(newStep);
    }
  };

  return { state, setState: push, undo, redo, canUndo: historyStep > 0, canRedo: historyStep < history.length - 1 };
}
```

**Acceptance Criteria**:
- ✅ Undo/redo funcionan
- ✅ 10+ niveles de history

---

### R5: CSS Modules & BEM Convention

**File**: `src/components/UI/Button.module.css`

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn--primary {
  background-color: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: scale(1.02);
}

.btn--primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__icon {
  display: inline-flex;
  align-items: center;
}
```

**Acceptance Criteria**:
- ✅ BEM naming consistente
- ✅ CSS modules aislados

---

### R6: Animations System

**File**: `src/styles/animations.css`

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromTop {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn { animation: fadeIn var(--transition-base); }
.animate-slideInFromTop { animation: slideInFromTop var(--transition-base); }
.animate-zoomIn { animation: zoomIn var(--transition-base); }
```

**Acceptance Criteria**:
- ✅ Animaciones suaves 60FPS
- ✅ Reutilizables en toda app

---

## 🏗️ Component File Structure

```
src/components/
├── UI/
│   ├── Button.jsx
│   ├── Button.module.css
│   ├── Slider.jsx
│   ├── Slider.module.css
│   ├── ColorPicker.jsx
│   ├── Modal.jsx
│   ├── Notification.jsx
│   ├── Dropdown.jsx
│   └── UI.module.css
├── Shared/
│   └── Icon.jsx
├── Layout/
│   ├── MainLayout.jsx
│   └── MainLayout.module.css
└── index.js (exports)
```

---

## 📊 Testing Requirements

**Test Coverage**: 70%+ para componentes base

**Example Tests** (`src/components/UI/Button.test.jsx`):
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('is disabled when isDisabled is true', () => {
    render(<Button label="Click" isDisabled={true} />);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

---

## ✅ Acceptance Criteria

**RFC-002 is complete when:**

1. **Design Tokens**
   - ✅ theme.css completo con todos los tokens
   - ✅ tailwind.config.js extiende con colores personalizados
   - ✅ Colores consistentes: azul #1E72BD, blanco #E6F0FA

2. **Base Components**
   - ✅ Button, Slider, ColorPicker, Modal, Notification creados
   - ✅ Todos accesibles (WCAG basics)
   - ✅ Styling consistente

3. **Context API**
   - ✅ ProjectContext funcional
   - ✅ useProject hook funciona
   - ✅ Reducer actions claras

4. **Custom Hooks**
   - ✅ useUndo funciona 10+ niveles
   - ✅ Tests pasan

5. **CSS Architecture**
   - ✅ CSS Modules en componentes
   - ✅ BEM naming consistency
   - ✅ Tailwind + custom CSS conviven

6. **Testing**
   - ✅ 70%+ coverage en componentes base
   - ✅ Tests pasan sin warnings

7. **Documentation**
   - ✅ Cada componente tiene JSDoc
   - ✅ Design system documented

---

## 🎨 Vibe Checklist

- [ ] Colores nostálgicos (azul #1E72BD, blanco)
- [ ] Transiciones suaves 300ms
- [ ] Bordes redondeados 4-6px
- [ ] Sombras sutiles (no dramáticas)
- [ ] Hover states con scale 1.02
- [ ] Tipografía Segoe UI clara
- [ ] Feedback visual en cada interacción

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  

**Next RFC**: RFC-003 (Layout & Ribbon Menu Structure)

