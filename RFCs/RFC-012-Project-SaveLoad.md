# RFC-012: Project Save & Load System
## Movie Maker 2025 — Local Storage Persistence & JSON Export/Import

**Status**: Draft → Ready for Implementation  
**Phase**: 4 (Advanced Features)  
**Complexity**: Medium  
**Estimated Duration**: 2-3 days  
**Dependencies**: RFC-001-011  

---

## 🎯 Overview

RFC-012 implementa **save/load de proyectos** usando **localStorage** y **JSON export/import** para backup.

Al finalizar RFC-012:
- ✅ Auto-save cada 30s
- ✅ Save project manually
- ✅ Load project from localStorage
- ✅ Export project as JSON file
- ✅ Import project from JSON file

---

## 📋 Requirements

### R1: Local Storage Persistence

**File**: `src/hooks/useAutoSave.js`

```javascript
import { useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

export function useAutoSave(interval = 30000) { // 30s default
  const { state } = useProject();

  useEffect(() => {
    const saveToLocalStorage = () => {
      try {
        const serialized = JSON.stringify(state);
        localStorage.setItem('movie-maker-project', serialized);
        console.log('[AutoSave] Project saved');
      } catch (error) {
        console.error('[AutoSave] Failed to save:', error);
      }
    };

    const timer = setInterval(saveToLocalStorage, interval);

    return () => clearInterval(timer);
  }, [state, interval]);
}
```

**Acceptance Criteria**:
- ✅ Auto-save cada 30s
- ✅ localStorage actualizado
- ✅ No crashes en stringify

---

### R2: Load from Local Storage

**File**: `src/context/ProjectContext.jsx` (update initialState)

```javascript
function loadFromLocalStorage() {
  try {
    const serialized = localStorage.getItem('movie-maker-project');
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (error) {
    console.error('[Load] Failed to load from localStorage:', error);
  }
  return null;
}

const initialState = loadFromLocalStorage() || {
  projectName: 'Untitled',
  clips: [],
  // ... rest of initial state ...
};
```

**Acceptance Criteria**:
- ✅ Proyecto carga al refresh
- ✅ State restaurado correctamente
- ✅ Fallback a default si error

---

### R3: Export Project as JSON

**File**: `src/components/Layout/RibbonMenu.jsx` (update)

```jsx
import { exportProjectToJSON } from '../../utils/projectIO';

export function RibbonMenu() {
  const { state } = useProject();

  const handleExportJSON = () => {
    try {
      const json = exportProjectToJSON(state);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.projectName || 'project'}.mmproject`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className={styles.ribbon}>
      <button onClick={handleExportJSON}>
        Save Project
      </button>
    </div>
  );
}
```

**File**: `src/utils/projectIO.js`

```javascript
export function exportProjectToJSON(state) {
  const project = {
    version: '1.0.0',
    projectName: state.projectName,
    clips: state.clips,
    backgroundMusic: state.backgroundMusic,
    duration: state.duration,
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(project, null, 2);
}
```

**Acceptance Criteria**:
- ✅ Export JSON funciona
- ✅ Download automático
- ✅ .mmproject extension

---

### R4: Import Project from JSON

**File**: `src/components/Layout/RibbonMenu.jsx` (update)

```jsx
import { importProjectFromJSON } from '../../utils/projectIO';

export function RibbonMenu() {
  const { dispatch } = useProject();
  const fileInputRef = useRef(null);

  const handleImportJSON = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const project = importProjectFromJSON(text);
      
      dispatch({ type: 'LOAD_PROJECT', payload: project });
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div className={styles.ribbon}>
      <button onClick={() => fileInputRef.current?.click()}>
        Open Project
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".mmproject,.json"
        onChange={handleImportJSON}
        style={{ display: 'none' }}
      />
    </div>
  );
}
```

**File**: `src/utils/projectIO.js` (update)

```javascript
export function importProjectFromJSON(jsonString) {
  try {
    const project = JSON.parse(jsonString);
    
    // Validate structure
    if (!project.version || !project.clips) {
      throw new Error('Invalid project file');
    }
    
    return {
      projectName: project.projectName || 'Imported Project',
      clips: project.clips || [],
      backgroundMusic: project.backgroundMusic || null,
      duration: project.duration || 0,
    };
  } catch (error) {
    throw new Error(`Failed to import project: ${error.message}`);
  }
}
```

**Acceptance Criteria**:
- ✅ File input abre selector
- ✅ .mmproject/.json acepted
- ✅ Project carga correctamente
- ✅ Validation de estructura

---

### R5: Project Context Action

**File**: `src/context/ProjectContext.jsx` (add action)

```javascript
case 'LOAD_PROJECT':
  return {
    ...initialState,
    ...action.payload,
  };

case 'RESET_PROJECT':
  return initialState;
```

**Acceptance Criteria**:
- ✅ LOAD_PROJECT funciona
- ✅ State reemplazado correctamente
- ✅ RESET_PROJECT funciona

---

## ✅ Acceptance Criteria

**RFC-012 is complete when:**

1. **Auto-Save**
   - ✅ Proyecto guarda cada 30s
   - ✅ localStorage persistente

2. **Save/Load**
   - ✅ Save Project button funciona
   - ✅ Open Project button funciona
   - ✅ .mmproject file format

3. **Import/Export**
   - ✅ Export JSON funciona
   - ✅ Import JSON funciona
   - ✅ Validation de estructura

4. **UX**
   - ✅ Save confirmation visible
   - ✅ Load confirmation visible
   - ✅ Error handling

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-013 (Keyboard Shortcuts)

