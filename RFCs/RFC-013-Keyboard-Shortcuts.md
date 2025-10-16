# RFC-013: Keyboard Shortcuts & Hotkeys
## Movie Maker 2025 — Productivity Shortcuts & Accessibility

**Status**: Draft → Ready for Implementation  
**Phase**: 5 (Polish & UX)  
**Complexity**: Low-Medium  
**Estimated Duration**: 2 days  
**Dependencies**: RFC-001-012  

---

## 🎯 Overview

RFC-013 implementa **keyboard shortcuts** para acciones comunes: play/pause, delete, undo/redo, save, etc.

Al finalizar RFC-013:
- ✅ 15+ keyboard shortcuts
- ✅ Shortcuts help modal
- ✅ Context-aware shortcuts
- ✅ Undo/Redo (Ctrl+Z/Ctrl+Y)

---

## 📋 Shortcuts List

| Shortcut | Action |
|----------|--------|
| **Space** | Play/Pause |
| **Delete** | Delete selected clip |
| **Ctrl+Z** | Undo |
| **Ctrl+Y** | Redo |
| **Ctrl+S** | Save project |
| **Ctrl+O** | Open project |
| **Ctrl+E** | Export video |
| **←** | Seek -1s |
| **→** | Seek +1s |
| **Ctrl+←** | Previous clip |
| **Ctrl+→** | Next clip |
| **M** | Toggle mute |
| **+** | Zoom in timeline |
| **-** | Zoom out timeline |
| **Ctrl+A** | Select all clips |

---

## 📋 Requirements

### R1: Keyboard Shortcuts Hook

**File**: `src/hooks/useKeyboardShortcuts.js`

```javascript
import { useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { usePlayer } from './usePlayer';

export function useKeyboardShortcuts() {
  const { state, dispatch } = useProject();
  const { isPlaying, play, pause, seek, currentTime, toggleMute } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          isPlaying ? pause() : play();
          break;

        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          if (state.selectedClipId) {
            dispatch({ type: 'DELETE_CLIP', payload: state.selectedClipId });
          }
          break;

        case 'KeyZ':
          if (isCtrl) {
            e.preventDefault();
            dispatch({ type: 'UNDO' });
          }
          break;

        case 'KeyY':
          if (isCtrl) {
            e.preventDefault();
            dispatch({ type: 'REDO' });
          }
          break;

        case 'KeyS':
          if (isCtrl) {
            e.preventDefault();
            // Trigger save
            const event = new CustomEvent('project-save');
            window.dispatchEvent(event);
          }
          break;

        case 'KeyO':
          if (isCtrl) {
            e.preventDefault();
            // Trigger open
            const event = new CustomEvent('project-open');
            window.dispatchEvent(event);
          }
          break;

        case 'KeyE':
          if (isCtrl) {
            e.preventDefault();
            // Trigger export
            const event = new CustomEvent('project-export');
            window.dispatchEvent(event);
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (isCtrl) {
            // Previous clip
            const currentIndex = state.clips.findIndex(c => c.id === state.selectedClipId);
            if (currentIndex > 0) {
              dispatch({
                type: 'SET_SELECTED_CLIP',
                payload: state.clips[currentIndex - 1].id,
              });
            }
          } else {
            // Seek backward
            seek(currentTime - 1);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (isCtrl) {
            // Next clip
            const currentIndex = state.clips.findIndex(c => c.id === state.selectedClipId);
            if (currentIndex < state.clips.length - 1) {
              dispatch({
                type: 'SET_SELECTED_CLIP',
                payload: state.clips[currentIndex + 1].id,
              });
            }
          } else {
            // Seek forward
            seek(currentTime + 1);
          }
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        case 'Equal': // +
          if (isCtrl) {
            e.preventDefault();
            dispatch({ type: 'ZOOM_IN_TIMELINE' });
          }
          break;

        case 'Minus': // -
          if (isCtrl) {
            e.preventDefault();
            dispatch({ type: 'ZOOM_OUT_TIMELINE' });
          }
          break;

        case 'KeyA':
          if (isCtrl) {
            e.preventDefault();
            dispatch({ type: 'SELECT_ALL_CLIPS' });
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, isPlaying, currentTime, dispatch, play, pause, seek, toggleMute]);
}
```

**Acceptance Criteria**:
- ✅ All shortcuts funcionan
- ✅ No conflicts con browser shortcuts
- ✅ Ignore when typing

---

### R2: Shortcuts Help Modal

**File**: `src/components/UI/ShortcutsHelp.jsx`

```jsx
const SHORTCUTS = [
  { key: 'Space', action: 'Play/Pause' },
  { key: 'Delete', action: 'Delete selected clip' },
  { key: 'Ctrl+Z', action: 'Undo' },
  { key: 'Ctrl+Y', action: 'Redo' },
  { key: 'Ctrl+S', action: 'Save project' },
  { key: 'Ctrl+O', action: 'Open project' },
  { key: 'Ctrl+E', action: 'Export video' },
  { key: '← →', action: 'Seek ±1s' },
  { key: 'Ctrl+← →', action: 'Previous/Next clip' },
  { key: 'M', action: 'Toggle mute' },
  { key: 'Ctrl++', action: 'Zoom in timeline' },
  { key: 'Ctrl+-', action: 'Zoom out timeline' },
  { key: 'Ctrl+A', action: 'Select all clips' },
];

export function ShortcutsHelp({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Keyboard Shortcuts</h2>
      
      <div className={styles.shortcutsList}>
        {SHORTCUTS.map((shortcut, index) => (
          <div key={index} className={styles.shortcutItem}>
            <kbd className={styles.key}>{shortcut.key}</kbd>
            <span className={styles.action}>{shortcut.action}</span>
          </div>
        ))}
      </div>
      
      <p className={styles.tip}>
        Press <kbd>?</kbd> anytime to open this help
      </p>
    </Modal>
  );
}
```

**CSS**:
```css
.shortcutsList {
  display: grid;
  gap: var(--spacing-sm);
}

.shortcutItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.key {
  background-color: var(--color-bg-accent);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-border-light);
}

.action {
  color: var(--color-text-primary);
}
```

**Acceptance Criteria**:
- ✅ Modal muestra todos los shortcuts
- ✅ Estilo visual claro
- ✅ ? key abre modal

---

### R3: Undo/Redo Implementation

**File**: `src/hooks/useUndo.js` (from RFC-002, now complete)

```javascript
import { useReducer, useCallback } from 'react';

export function useUndo(initialState) {
  const [state, dispatch] = useReducer(
    (state, action) => {
      const { past, present, future } = state;

      switch (action.type) {
        case 'UNDO':
          if (past.length === 0) return state;
          const previous = past[past.length - 1];
          const newPast = past.slice(0, past.length - 1);
          return {
            past: newPast,
            present: previous,
            future: [present, ...future],
          };

        case 'REDO':
          if (future.length === 0) return state;
          const next = future[0];
          const newFuture = future.slice(1);
          return {
            past: [...past, present],
            present: next,
            future: newFuture,
          };

        case 'SET':
          if (present === action.payload) return state;
          return {
            past: [...past, present],
            present: action.payload,
            future: [],
          };

        default:
          return state;
      }
    },
    {
      past: [],
      present: initialState,
      future: [],
    }
  );

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const set = useCallback((newPresent) => dispatch({ type: 'SET', payload: newPresent }), []);

  return [state.present, { undo, redo, set, canUndo: state.past.length > 0, canRedo: state.future.length > 0 }];
}
```

**Acceptance Criteria**:
- ✅ Undo funciona
- ✅ Redo funciona
- ✅ canUndo/canRedo state correcto

---

### R4: App.jsx Integration

**File**: `src/App.jsx` (update)

```jsx
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts(); // Enable shortcuts globally

  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  );
}
```

**Acceptance Criteria**:
- ✅ Shortcuts enabled globally
- ✅ No conflicts

---

## ✅ Acceptance Criteria

**RFC-013 is complete when:**

1. **Shortcuts**
   - ✅ 15+ shortcuts funcionan
   - ✅ Context-aware (no trigger cuando typing)

2. **Help Modal**
   - ✅ ? key abre modal
   - ✅ Lista completa de shortcuts
   - ✅ Visual styling claro

3. **Undo/Redo**
   - ✅ Ctrl+Z undo funciona
   - ✅ Ctrl+Y redo funciona
   - ✅ State history correcto

4. **UX**
   - ✅ No conflicts con browser
   - ✅ Tooltips muestran shortcuts

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-014 (UI Polish & Animations)

