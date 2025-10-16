# RULES.md
## Movie Maker 2025 — Development Standards & Guidelines

---

## 📋 Overview

Este documento establece los **estándares técnicos, convenciones de código y directrices de desarrollo** para **Movie Maker 2025**.

Se aplica a todos los RFCs y commits. El objetivo es garantizar:
- ✅ Coherencia visual y funcional
- ✅ Código modular y mantenible
- ✅ Performance optimizado
- ✅ Experiencia nostálgica (vibe)

---

## 📑 Tabla de Contenidos

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Naming Conventions](#3-naming-conventions)
4. [Code Standards](#4-code-standards)
5. [Component Architecture](#5-component-architecture)
6. [Styling & Visual Design](#6-styling--visual-design)
7. [State Management](#7-state-management)
8. [Performance Requirements](#8-performance-requirements)
9. [Testing Standards](#9-testing-standards)
10. [Documentation Standards](#10-documentation-standards)
11. [Error Handling & Logging](#11-error-handling--logging)
12. [Accessibility Standards](#12-accessibility-standards)
13. [Development Workflow](#13-development-workflow)
14. [Vibe & Emotional Design](#14-vibe--emotional-design)

---

## 1. Technology Stack

### Core Framework
- **React**: 18.2.0+
- **Bundler**: Vite 4.5.0+ (preferable) | Create React App 5.0.1+
- **Node.js**: 18.0+
- **npm**: 9.0+

### Styling
- **Tailwind CSS**: 3.3.0+
- **CSS Modules**: For component-specific styles
- **PostCSS**: 8.4.31+

### State Management
- **Context API**: Para global state
- **useContext + useReducer**: Patrones de hook
- **localStorage**: Para persistencia

### Utilities
- **react-beautiful-dnd**: Drag & drop (alternative: HTML5 API nativo)
- **uuid**: Generación de IDs únicas
- **date-fns**: Manipulación de fechas (future use)

### Development
- **ESLint**: 8.0+
- **Prettier**: 3.0+
- **Vitest**: Testing (or Jest)
- **React Testing Library**: Unit testing

### Build & Deploy
- **Vite build**: Bundling production
- **Vercel / Netlify**: Hosting (decision pending)

### Optional (v1.5+)
- **FFmpeg.js**: Client-side video rendering
- **react-i18next**: Internationalization
- **zustand**: State management (if Context insufficient)

---

## 2. Project Structure

### Root Directory
```
movie-maker-2025/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vitest.config.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── context/
│   ├── types/
│   └── assets/
├── public/
├── docs/
├── PRD.md
├── FEATURES.md
├── RULES.md
├── RFCS.md
├── workflow/
└── README.md
```

### src/ Directory Detail
```
src/
├── App.jsx                          # Root component
├── main.jsx                         # React entry point
├── index.css                        # Global styles
├── components/
│   ├── Layout/
│   │   ├── MainLayout.jsx          # Main app wrapper
│   │   ├── RibbonMenu.jsx          # Ribbon tabs
│   │   └── MainLayout.module.css
│   ├── Editor/
│   │   ├── Player.jsx              # Video player
│   │   ├── Storyboard.jsx          # Timeline
│   │   ├── PropertiesPanel.jsx     # Right sidebar
│   │   └── Editor.module.css
│   ├── Panels/
│   │   ├── MediaPanel.jsx
│   │   ├── TransitionsPanel.jsx
│   │   ├── EffectsPanel.jsx
│   │   ├── TextPanel.jsx
│   │   └── Panels.module.css
│   ├── UI/
│   │   ├── Button.jsx
│   │   ├── Slider.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── Dropdown.jsx
│   │   ├── Modal.jsx
│   │   ├── Notification.jsx
│   │   └── UI.module.css
│   └── Shared/
│       └── Icon.jsx
├── hooks/
│   ├── useProject.js               # Project CRUD
│   ├── usePlayer.js                # Player control
│   ├── useStoryboard.js            # Clip management
│   ├── useEffects.js               # Effects logic
│   └── useUndo.js                  # Undo/redo
├── context/
│   ├── ProjectContext.jsx          # Global project state
│   └── NotificationContext.jsx     # Notifications
├── utils/
│   ├── timelineEngine.js           # Playback logic
│   ├── effectsRenderer.js          # Canvas effects
│   ├── transitionRenderer.js       # Transition logic
│   ├── thumbnailGenerator.js       # Thumbnail creation
│   ├── projectSerializer.js        # Save/load
│   ├── validators.js               # Input validation
│   ├── constants.js                # Global constants
│   └── helpers.js                  # Utility functions
├── styles/
│   ├── theme.css                   # Design tokens
│   ├── animations.css              # Keyframes
│   ├── responsive.css              # Media queries
│   └── reset.css                   # CSS reset
├── types/
│   └── index.js                    # JSDoc type definitions
└── assets/
    ├── icons/
    ├── fonts/
    └── images/
```

### Documentation
```
docs/
├── ARCHITECTURE.md                 # System design
├── COMPONENT_GUIDE.md              # Component patterns
├── PERFORMANCE.md                  # Optimization tips
├── TROUBLESHOOTING.md              # Common issues
└── API_REFERENCE.md                # Internal API
```

---

## 3. Naming Conventions

### Files & Folders
- **Components**: PascalCase (ej: `Player.jsx`, `RibbonMenu.jsx`)
- **Hooks**: camelCase prefix `use` (ej: `useProject.js`, `usePlayer.js`)
- **Utils**: camelCase (ej: `timelineEngine.js`, `validators.js`)
- **Styles**: .module.css (ej: `Player.module.css`)
- **Folders**: lowercase (ej: `components/`, `utils/`, `hooks/`)

### Variables & Functions
- **Constants**: UPPER_SNAKE_CASE (ej: `MAX_CLIP_DURATION`, `COLOR_BLUE_PRIMARY`)
- **Functions**: camelCase (ej: `getClipDuration()`, `applyEffect()`)
- **Variables**: camelCase (ej: `isPlaying`, `currentTime`, `clipList`)
- **Boolean variables**: Prefix `is`, `has`, `can` (ej: `isLoading`, `hasError`)
- **React State**: camelCase (ej: `const [activeTab, setActiveTab] = useState()`)

### Component Props
```jsx
// Good
<Button 
  label="Save" 
  onClick={handleSave} 
  isDisabled={isSaving}
  variant="primary"
/>

// Bad
<Button 
  text="Save" 
  handleClick={handleSave} 
  disabled={isSaving}
  type="primary"
/>
```

### IDs & Keys
- **Element IDs**: `clip_${uuid}`, `text_${uuid}`, `effect_${uuid}`
- **React Keys**: Use `id` attribute, NEVER index
- **localStorage Keys**: `moviemaker_${projectName}_${timestamp}`

---

## 4. Code Standards

### JavaScript/ES6+
- **Use strict modern JS** (ES2020+)
- **const by default**, let if reassignment needed, never var
- **Arrow functions** for callbacks
- **Destructuring** when possible
- **Template literals** for strings (not concatenation)
- **Optional chaining** `obj?.prop` instead of `obj && obj.prop`
- **Nullish coalescing** `value ?? default` instead of `value || default`

#### Examples

**Good**:
```javascript
// Destructuring
const { clips, isPlaying } = project;

// Template literals
console.log(`Clip duration: ${clip.duration}ms`);

// Arrow functions
clips.map(clip => renderClip(clip));

// Optional chaining
const duration = clip?.metadata?.duration ?? 0;

// Const by default
const MAX_CLIPS = 100;
const projectName = "Untitled";
```

**Bad**:
```javascript
// Avoid concatenation
console.log("Clip duration: " + clip.duration + "ms");

// Avoid var
var clips = [];

// Avoid index as key
clips.map((clip, idx) => <Clip key={idx} />);

// Avoid nested ternaries
const status = isLoading ? "loading" : isError ? "error" : "ready";
```

### React Hooks Best Practices
- **Use hooks at top level only** (not in conditionals or loops)
- **One concern per hook** (composition over monolithic hooks)
- **useCallback for memoization** of event handlers
- **useMemo only if measurable performance impact**
- **useRef for uncontrolled DOM access**

#### Hook Pattern

```javascript
// Custom hook example
function useStoryboard() {
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);

  const addClip = useCallback((clip) => {
    setClips(prev => [...prev, { ...clip, id: uuid() }]);
  }, []);

  const removeClip = useCallback((clipId) => {
    setClips(prev => prev.filter(c => c.id !== clipId));
  }, []);

  return {
    clips,
    selectedClip,
    setSelectedClip,
    addClip,
    removeClip
  };
}
```

### Function Signatures
```javascript
// Single responsibility
function calculateDuration(clips) {
  return clips.reduce((sum, clip) => sum + clip.duration, 0);
}

// Clear, descriptive names
function applyEffectToClip(clip, effect) {
  // implementation
}

// Avoid side effects
function getClipThumbnail(clip) {
  // Only compute, don't modify
  return clip.thumbnail || generateDefault();
}
```

---

## 5. Component Architecture

### Component Classification

#### 1. Containers (Smart Components)
- **Location**: `src/components/Editor/`, `src/components/Layout/`
- **Responsibility**: Logic, state management, API calls
- **Exports**: Connected component with context/hooks

```javascript
// Good: Container
export function Player() {
  const { isPlaying, currentTime } = usePlayer();
  const { clip } = useStoryboard();

  return <PlayerView 
    clip={clip} 
    isPlaying={isPlaying} 
    currentTime={currentTime} 
  />;
}
```

#### 2. Presentational Components
- **Location**: `src/components/UI/`
- **Responsibility**: Only rendering, props-driven
- **No side effects, no context**

```javascript
// Good: Presentational
export function Button({ 
  label, 
  onClick, 
  isDisabled = false, 
  variant = "primary" 
}) {
  return (
    <button 
      onClick={onClick} 
      disabled={isDisabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

#### 3. Layout Components
- **Location**: `src/components/Layout/`
- **Responsibility**: Page structure, routing, context providers

```javascript
// Good: Layout
export function MainLayout() {
  return (
    <div className="app-wrapper">
      <RibbonMenu />
      <div className="main-editor">
        <Player />
        <Storyboard />
      </div>
      <PropertiesPanel />
    </div>
  );
}
```

### Component File Structure
```javascript
// src/components/Player/Player.jsx
import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../hooks';
import { renderFrame } from '../../utils/timelineEngine';
import PlayerView from './PlayerView';
import styles from './Player.module.css';

/**
 * Player component - renders video timeline with effects
 * @component
 * @returns {JSX.Element}
 */
export function Player() {
  const [isBuffering, setIsBuffering] = useState(false);
  const canvasRef = useRef(null);
  const { isPlaying, currentTime } = usePlayer();

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const frame = renderFrame(currentTime);
    drawFrame(canvasRef.current, frame);
  }, [currentTime]);

  return <PlayerView ref={canvasRef} isBuffering={isBuffering} />;
}

export default Player;
```

---

## 6. Styling & Visual Design

### Color Palette (Design Tokens)

```css
/* src/styles/theme.css */

:root {
  /* Primary Colors (Movie Maker 2012 Blue) */
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
  --color-text-light: #FFFFFF;

  /* Status */
  --color-success: #27AE60;
  --color-error: #E74C3C;
  --color-warning: #F39C12;
  --color-info: #3498DB;

  /* Borders */
  --color-border-primary: #BDC3C7;
  --color-border-light: #ECF0F1;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);

  /* Spacing */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */

  /* Typography */
  --font-family: 'Segoe UI', Arial, sans-serif;
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        primary: '#1E72BD',
        secondary: '#F3F3F3',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### CSS Class Naming (BEM-like)

```css
/* .module.css files */
.player {
  /* Block */
}

.player__canvas {
  /* Element */
}

.player--loading {
  /* Modifier */
}

.player__control {
  /* Element */
}

.player__control--active {
  /* Element Modifier */
}
```

### Styling Best Practices

1. **Use CSS Modules for component isolation**
```javascript
import styles from './Player.module.css';

export function Player() {
  return <div className={styles.player}>...</div>;
}
```

2. **Use Tailwind for utility styling**
```jsx
<div className="flex items-center justify-between p-4 bg-gray-100">
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Save
  </button>
</div>
```

3. **Animations via CSS Keyframes**
```css
/* animations.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fadeIn {
  animation: fadeIn 300ms ease-in-out;
}
```

4. **Responsive Design (Mobile First)**
```css
.container {
  width: 100%; /* Mobile */
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    width: 768px;
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 1024px;
  }
}
```

---

## 7. State Management

### Context API Pattern

```javascript
// src/context/ProjectContext.jsx
import { createContext, useContext, useReducer } from 'react';

const ProjectContext = createContext();

const initialState = {
  clips: [],
  selectedClip: null,
  currentTime: 0,
  isPlaying: false,
  effects: [],
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'ADD_CLIP':
      return {
        ...state,
        clips: [...state.clips, action.payload],
      };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
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

### Usage in Components

```javascript
function Player() {
  const { state, dispatch } = useProject();

  const handlePlay = () => {
    dispatch({ type: 'SET_PLAYING', payload: true });
  };

  return (
    <button onClick={handlePlay}>
      {state.isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}
```

### localStorage Integration

```javascript
// src/utils/projectSerializer.js
export function saveProject(projectName, state) {
  const key = `moviemaker_${projectName}_${Date.now()}`;
  localStorage.setItem(key, JSON.stringify(state));
  return key;
}

export function loadProject(key) {
  const data = localStorage.getItem(key);
  if (!data) throw new Error('Project not found');
  return JSON.parse(data);
}

export function listProjects() {
  const projects = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('moviemaker_')) {
      projects.push({ key, ...JSON.parse(localStorage.getItem(key)) });
    }
  }
  return projects;
}
```

---

## 8. Performance Requirements

### Performance Budgets

| Metric | Target | Acceptable |
|--------|--------|-----------|
| **Carga inicial** | < 2s | < 3s |
| **First Contentful Paint** | < 1.5s | < 2s |
| **Time to Interactive** | < 3s | < 4s |
| **Acción del usuario** | < 100ms | < 150ms |
| **Preview FPS** | 30+ | 24+ |
| **Memory heap** | < 500MB | < 800MB |

### Optimization Guidelines

1. **Code Splitting**
```javascript
// Lazy load components
const EffectsPanel = React.lazy(() => import('./EffectsPanel'));

<Suspense fallback={<Loader />}>
  <EffectsPanel />
</Suspense>
```

2. **Memoization (cuando es necesario)**
```javascript
// Memo components si props cambian frecuentemente
export const ClipThumbnail = React.memo(function ClipThumbnail({ clip }) {
  return <img src={clip.thumbnail} />;
});

// useMemo para cálculos costosos
const totalDuration = useMemo(() => {
  return clips.reduce((sum, clip) => sum + clip.duration, 0);
}, [clips]);
```

3. **Virtual Rendering para listas largas**
```javascript
// Para 50+ clips, considerar react-window
import { FixedSizeList } from 'react-window';

function StoryboardList({ clips }) {
  return (
    <FixedSizeList
      height={100}
      itemCount={clips.length}
      itemSize={120}
    >
      {({ index, style }) => (
        <div style={style}>
          <Clip clip={clips[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

4. **Event Throttling/Debouncing**
```javascript
// Throttle timeline scrubbing
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const handleScrub = throttle((time) => {
  dispatch({ type: 'SET_CURRENT_TIME', payload: time });
}, 50);
```

5. **Canvas Optimization para efectos**
```javascript
// Reutilizar canvas cuando sea posible
const canvasRef = useRef(document.createElement('canvas'));

useEffect(() => {
  const ctx = canvasRef.current.getContext('2d');
  // Redibujar solo si cambió clip/efecto
}, [clip, effects]);
```

---

## 9. Testing Standards

### Test Structure

```javascript
// src/components/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
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

  it('is disabled when isDisabled prop is true', () => {
    render(<Button label="Click" isDisabled={true} />);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

### Coverage Requirements
- **Statements**: 70%+
- **Branches**: 65%+
- **Functions**: 70%+
- **Lines**: 70%+

### Test Categories
1. **Unit Tests**: Funciones, utilidades, hooks
2. **Component Tests**: Renderizado, props, eventos
3. **Integration Tests**: Flujos completos (import → preview → save)
4. **E2E Tests** (future): Cypress o Playwright

---

## 10. Documentation Standards

### JSDoc Comments
```javascript
/**
 * Aplica un efecto visual a un clip
 * @param {Object} clip - El clip a modificar
 * @param {string} clip.id - ID único del clip
 * @param {Blob} clip.data - Datos del vídeo
 * @param {string} effectType - Tipo de efecto (grayscale, sepia, etc)
 * @returns {Promise<Object>} Clip modificado
 * @throws {Error} Si el tipo de efecto no es válido
 * @example
 * const result = await applyEffect(clip, 'grayscale');
 */
export async function applyEffect(clip, effectType) {
  // implementation
}
```

### README en Cada Componente
```markdown
# Player Component

## Purpose
Reproductor central que muestra la composición con soporte para transiciones y efectos.

## Props
- `clip` (Object): Clip actual a reproducir
- `isPlaying` (boolean): Estado de reproducción
- `onTimeUpdate` (function): Callback cuando cambia el tiempo

## Usage
\`\`\`jsx
<Player 
  clip={currentClip} 
  isPlaying={isPlaying}
  onTimeUpdate={handleTimeChange}
/>
\`\`\`

## Technical Notes
- Usa Canvas para aplicar efectos en tiempo real
- requestAnimationFrame para smooth 60 FPS
```

---

## 11. Error Handling & Logging

### Error Types

```javascript
// src/utils/errors.js
export class MovieMakerError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'MovieMakerError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends MovieMakerError {
  constructor(message, details) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class FileError extends MovieMakerError {
  constructor(message, details) {
    super(message, 'FILE_ERROR', details);
    this.name = 'FileError';
  }
}
```

### Error Handling Pattern

```javascript
function handleFileImport(file) {
  try {
    // Validation
    if (!['video/mp4', 'image/jpeg'].includes(file.type)) {
      throw new ValidationError('Tipo de archivo no soportado', { file: file.name });
    }

    if (file.size > 500 * 1024 * 1024) {
      throw new ValidationError('Archivo muy grande', { size: file.size });
    }

    // Processing
    processFile(file);
  } catch (error) {
    if (error instanceof ValidationError) {
      notifyUser(`Error: ${error.message}`, 'error');
      logError('VALIDATION_FAILED', error.details);
    } else {
      notifyUser('Ocurrió un error inesperado', 'error');
      logError('UNKNOWN_ERROR', { error: error.message });
    }
  }
}
```

### Logging

```javascript
// src/utils/logger.js
export const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data),
  error: (code, details) => {
    console.error(`[ERROR] ${code}`, details);
    // Send to analytics/monitoring service (v1.5+)
  },
  debug: (message, data) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};
```

---

## 12. Accessibility Standards

### WCAG 2.1 Level AA Requirements

1. **Color Contrast**: 4.5:1 mínimo (normal text), 3:1 (large text)
2. **Keyboard Navigation**: Todos los elementos accesibles por teclado
3. **ARIA Labels**: Descripciones para screen readers
4. **Focus Visible**: :focus-visible en todos los interactivos
5. **Semantic HTML**: `<button>`, `<label>`, etc (no divs)

### Implementation

```jsx
// Good: Semantic, accessible
function ClipControl() {
  return (
    <div className="clip-controls">
      <label htmlFor="duration-input">Duración del clip</label>
      <input 
        id="duration-input"
        type="range" 
        min="0" 
        max="30" 
        aria-label="Duración en segundos"
      />
      
      <button 
        onClick={handleDelete}
        aria-label="Eliminar clip actual"
        className="btn--delete"
      >
        Delete
      </button>
    </div>
  );
}
```

### Keyboard Shortcuts

```javascript
// Register keyboard handlers
const KEY_MAP = {
  ' ': 'play-pause',
  'Backspace': 'delete-clip',
  'Control+s': 'save',
  'Control+z': 'undo',
};

useEffect(() => {
  function handleKeyPress(event) {
    const action = KEY_MAP[event.key] || KEY_MAP[`${event.ctrlKey ? 'Control+' : ''}${event.key}`];
    if (action) {
      event.preventDefault();
      executeAction(action);
    }
  }

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## 13. Development Workflow

### Git Conventions

```bash
# Branch naming
feature/add-transitions        # Nueva feature
bugfix/player-jank            # Bug fix
refactor/optimize-player      # Refactoring
docs/update-readme            # Documentación

# Commit messages
feat: add fade transition      # Nueva feature
fix: prevent player stuttering # Bug fix
docs: update README           # Documentación
refactor: extract hook logic  # Refactoring
test: add unit tests          # Tests
```

### PR Checklist

- [ ] Código sigue RULES.md
- [ ] Tests pasan (coverage 70%+)
- [ ] Documentación actualizada
- [ ] Accessibility verificada
- [ ] Performance < budgets
- [ ] No console errors/warnings
- [ ] Changelog actualizado

### Development Commands

```bash
# Install dependencies
npm install

# Development mode (HMR)
npm run dev

# Build production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Type check (future)
npm run type-check
```

---

## 14. Vibe & Emotional Design

### Filosofía de Diseño

**Movie Maker 2025** no es solo funcional, debe *sentirse* como Movie Maker 2012:
- Suavidad en transiciones (no digital/abrupto)
- Colores azules y grises claros (profesionales, confiables)
- Respuesta inmediata (feedback visual en cada acción)
- Nostalgia con modernidad (respeto por el original, tecnología actual)

### Vibe Checklist

- [ ] Colores: Azul #1E72BD, blanco #E6F0FA, gris #F3F3F3
- [ ] Transiciones: 300ms ease-in-out suaves
- [ ] Sombras: Sutiles `0 2px 8px rgba(0,0,0,0.1)`
- [ ] Bordes: Redondeados 4-6px
- [ ] Tipografía: Segoe UI, ligera, clara
- [ ] Hover states: Scale 1.02, color shift suave
- [ ] Loading states: Animación suave (no spinning)
- [ ] Error messages: Claros, constructivos, NO red alarmista
- [ ] Notificaciones: Aparecen suave, desaparecen fade out
- [ ] Feedback: Todo clic/drag tiene respuesta visual

### Example: Vibe-Compliant Button

```jsx
// Segue la filosofía de vibe
export function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md font-medium
        transition-all duration-300
        ${variant === 'primary' 
          ? 'bg-[#1E72BD] text-white hover:bg-[#0F4C8B] active:scale-95' 
          : 'bg-[#F3F3F3] text-[#2C3E50] hover:bg-[#E6F0FA]'}
        focus:outline-none focus:ring-2 focus:ring-[#1E72BD] focus:ring-offset-2
      `}
    >
      {label}
    </button>
  );
}
```

---

## ✅ Validation Checklist

Antes de cada PR/commit:
- [ ] Sigue naming conventions (3)
- [ ] Código limpio sin TODOs (4)
- [ ] Componentes modular (5)
- [ ] Estilos vía Tailwind + modules (6)
- [ ] State management claro (7)
- [ ] Performance dentro budgets (8)
- [ ] Tests pasan con 70%+ coverage (9)
- [ ] Documentación actual (10)
- [ ] Error handling robusto (11)
- [ ] Accesibilidad WCAG AA (12)
- [ ] Vibe checklist completado (14)

---

## 📞 Quick Reference

| Qué | Dónde | Archivo |
|-----|-------|---------|
| Setup proyecto | Primero | `vite.config.js` |
| Componentes | Frecuente | `src/components/` |
| Estilos | Frecuente | `.module.css` + Tailwind |
| Estado | Menos frecuente | `src/context/` |
| Utilidades | Cuando sea necesario | `src/utils/` |
| Tests | Después de código | `.test.jsx` |
| Documentación | Final | `docs/` + JSDoc |

---

**Versión**: 1.0  
**Última Actualización**: 15 de octubre de 2025  
**Status**: ✅ Ready for Implementation

