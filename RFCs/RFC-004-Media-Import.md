# RFC-004: Media Import & Management
## Movie Maker 2025 — File Upload, Media Library & Asset Management

**Status**: Draft → Ready for Implementation  
**Phase**: 2 (Core Features)  
**Complexity**: Medium-High  
**Estimated Duration**: 3-4 days  
**Dependencies**: RFC-001, RFC-002, RFC-003  

---

## 🎯 Overview

RFC-004 implementa el **sistema de importación de medios** (videos, imágenes), **gestión de biblioteca de assets**, y **preview de archivos** en el Media Panel.

Al finalizar RFC-004:
- ✅ Drag & drop de archivos funcional
- ✅ Input file upload (click para seleccionar)
- ✅ Preview de videos e imágenes en Media Panel
- ✅ Metadata extraction (duración, resolución, tipo)
- ✅ Thumbnails generados automáticamente
- ✅ Media storage en state (Context API)
- ✅ Validación de formatos soportados

---

## 📋 Requirements

### R1: File Upload System

**Files**:
- `src/components/Panels/MediaPanel.jsx`
- `src/hooks/useMediaUpload.js`
- `src/utils/fileValidation.js`
- `src/utils/thumbnailGenerator.js`

**Features**:
- Drag & drop area en Media Panel
- Click para abrir file selector
- Multiple file upload simultáneo
- Progress indicator durante upload
- Validación de tipos: `.mp4`, `.mov`, `.avi`, `.webm`, `.jpg`, `.jpeg`, `.png`, `.gif`
- Max file size: 500MB (configurable)

**MediaPanel.jsx** (estructura):
```jsx
import { useRef } from 'react';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import styles from './MediaPanel.module.css';

export function MediaPanel() {
  const fileInputRef = useRef(null);
  const { uploadFiles, isUploading, uploadProgress } = useMediaUpload();

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    uploadFiles(files);
  };

  return (
    <div className={styles.mediaPanel}>
      <div className={styles.panelHeader}>
        <h3>Media Library</h3>
        <button onClick={() => fileInputRef.current.click()}>
          + Import
        </button>
      </div>

      <div
        className={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {isUploading ? (
          <div>Uploading... {uploadProgress}%</div>
        ) : (
          <p>Drag & drop files or click to select</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <MediaGrid />
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Drag & drop funciona sin errores
- ✅ Click import abre file selector
- ✅ Múltiples archivos se cargan simultáneamente
- ✅ Progress bar visible durante upload

---

### R2: File Validation & Processing

**File**: `src/utils/fileValidation.js`

```javascript
const SUPPORTED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export function validateFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const isVideo = SUPPORTED_VIDEO_FORMATS.includes(extension);
  const isImage = SUPPORTED_IMAGE_FORMATS.includes(extension);

  if (!isVideo && !isImage) {
    return {
      valid: false,
      error: `Unsupported format: .${extension}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max 500MB)`,
    };
  }

  return {
    valid: true,
    type: isVideo ? 'video' : 'image',
    extension,
  };
}

export function extractMetadata(file, type) {
  return new Promise((resolve, reject) => {
    if (type === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        });
        URL.revokeObjectURL(video.src);
      };

      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    } else {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    }
  });
}
```

**Acceptance Criteria**:
- ✅ Archivos no soportados son rechazados
- ✅ Archivos > 500MB muestran error
- ✅ Metadata se extrae correctamente

---

### R3: Thumbnail Generation

**File**: `src/utils/thumbnailGenerator.js`

```javascript
export async function generateThumbnail(file, type) {
  if (type === 'image') {
    // Para imágenes, usar la imagen misma
    return URL.createObjectURL(file);
  }

  // Para videos, capturar frame en 1 segundo
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      video.currentTime = 1; // Capturar frame en 1s
    };

    video.onseeked = () => {
      canvas.width = 160;
      canvas.height = 90; // 16:9 aspect ratio
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const thumbnailUrl = URL.createObjectURL(blob);
        resolve(thumbnailUrl);
        URL.revokeObjectURL(video.src);
      }, 'image/jpeg', 0.8);
    };

    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
}
```

**Acceptance Criteria**:
- ✅ Thumbnails de videos se generan en 1s frame
- ✅ Imágenes usan preview directo
- ✅ Thumbnails son 160x90px (16:9)

---

### R4: Media Context State

**File**: `src/context/MediaContext.jsx`

```javascript
import { createContext, useContext, useReducer } from 'react';

const MediaContext = createContext();

const initialState = {
  media: [], // Array of media objects
  isLoading: false,
  error: null,
};

function mediaReducer(state, action) {
  switch (action.type) {
    case 'ADD_MEDIA':
      return {
        ...state,
        media: [...state.media, action.payload],
      };
    case 'ADD_MEDIA_BATCH':
      return {
        ...state,
        media: [...state.media, ...action.payload],
      };
    case 'REMOVE_MEDIA':
      return {
        ...state,
        media: state.media.filter(m => m.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function MediaProvider({ children }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState);

  return (
    <MediaContext.Provider value={{ state, dispatch }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within MediaProvider');
  }
  return context;
}
```

**Acceptance Criteria**:
- ✅ Media se almacena en Context
- ✅ useMedia hook accesible
- ✅ Media persiste durante sesión

---

### R5: Media Grid Display

**File**: `src/components/Panels/MediaGrid.jsx`

```jsx
import { useMedia } from '../../context/MediaContext';
import styles from './MediaGrid.module.css';

export function MediaGrid() {
  const { state } = useMedia();

  if (state.media.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No media imported yet</p>
      </div>
    );
  }

  return (
    <div className={styles.mediaGrid}>
      {state.media.map((item) => (
        <MediaItem key={item.id} media={item} />
      ))}
    </div>
  );
}

function MediaItem({ media }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('mediaId', media.id);
  };

  return (
    <div
      className={styles.mediaItem}
      draggable
      onDragStart={handleDragStart}
    >
      <img src={media.thumbnail} alt={media.name} />
      <div className={styles.mediaInfo}>
        <p className={styles.mediaName}>{media.name}</p>
        {media.type === 'video' && (
          <span className={styles.mediaDuration}>
            {formatDuration(media.duration)}
          </span>
        )}
      </div>
    </div>
  );
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

**CSS** (`MediaGrid.module.css`):
```css
.mediaGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.mediaItem {
  cursor: grab;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  transition: var(--transition-fast);
}

.mediaItem:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.mediaItem img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.mediaInfo {
  padding: var(--spacing-sm);
}

.mediaName {
  font-size: var(--font-size-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mediaDuration {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
```

**Acceptance Criteria**:
- ✅ Media grid muestra todos los archivos
- ✅ Thumbnails visibles
- ✅ Drag enabled para cada item
- ✅ Empty state cuando no hay media

---

### R6: useMediaUpload Hook

**File**: `src/hooks/useMediaUpload.js`

```javascript
import { useState } from 'react';
import { useMedia } from '../context/MediaContext';
import { validateFile, extractMetadata } from '../utils/fileValidation';
import { generateThumbnail } from '../utils/thumbnailGenerator';
import { v4 as uuidv4 } from 'uuid';

export function useMediaUpload() {
  const { dispatch } = useMedia();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    const validatedFiles = files.map(validateFile).filter(v => v.valid);
    const totalFiles = validatedFiles.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const validation = validatedFiles[i];

      try {
        const metadata = await extractMetadata(file, validation.type);
        const thumbnail = await generateThumbnail(file, validation.type);

        const mediaObject = {
          id: uuidv4(),
          name: file.name,
          type: validation.type,
          extension: validation.extension,
          size: file.size,
          thumbnail,
          url: URL.createObjectURL(file),
          file,
          ...metadata,
          addedAt: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_MEDIA', payload: mediaObject });
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        dispatch({
          type: 'SET_ERROR',
          payload: `Failed to upload ${file.name}`,
        });
      }
    }

    setIsUploading(false);
    setUploadProgress(100);
  };

  return { uploadFiles, isUploading, uploadProgress };
}
```

**Acceptance Criteria**:
- ✅ Upload procesa múltiples archivos
- ✅ Progress actualiza correctamente
- ✅ Errores se capturan y reportan

---

## 🏗️ File Structure After RFC-004

```
src/
├── components/
│   └── Panels/
│       ├── MediaPanel.jsx          ← Main upload component
│       ├── MediaGrid.jsx           ← Grid display
│       └── MediaPanel.module.css
├── context/
│   └── MediaContext.jsx            ← Media state
├── hooks/
│   └── useMediaUpload.js           ← Upload logic
└── utils/
    ├── fileValidation.js           ← Validation & metadata
    └── thumbnailGenerator.js       ← Thumbnail creation
```

---

## 📊 Testing Requirements

**Test Files**:
- `MediaPanel.test.jsx`
- `useMediaUpload.test.js`
- `fileValidation.test.js`

**Test Cases**:
```javascript
describe('MediaPanel', () => {
  it('renders upload zone', () => {});
  it('handles drag and drop', () => {});
  it('opens file selector on click', () => {});
});

describe('useMediaUpload', () => {
  it('validates supported formats', () => {});
  it('rejects unsupported formats', () => {});
  it('extracts video metadata', () => {});
  it('generates thumbnails', () => {});
});
```

---

## ✅ Acceptance Criteria

**RFC-004 is complete when:**

1. **File Upload**
   - ✅ Drag & drop funciona
   - ✅ Click import funciona
   - ✅ Múltiples archivos se cargan

2. **Validation**
   - ✅ Formatos soportados validados
   - ✅ Max size 500MB enforced
   - ✅ Errores reportados claramente

3. **Metadata**
   - ✅ Duración de videos extraída
   - ✅ Resolución (width/height) extraída
   - ✅ Thumbnails generados automáticamente

4. **Media Grid**
   - ✅ Grid muestra todos los archivos
   - ✅ Drag enabled
   - ✅ Empty state funcional

5. **State Management**
   - ✅ MediaContext funciona
   - ✅ Media persiste durante sesión
   - ✅ useMedia hook accesible

6. **Performance**
   - ✅ Upload de 10+ archivos fluido
   - ✅ Thumbnails generan en < 2s
   - ✅ No memory leaks (URLs revocados)

---

## 🎨 Vibe Checklist

- [ ] Upload zone inviting (azul suave)
- [ ] Drag & drop feedback visual claro
- [ ] Thumbnails con border radius
- [ ] Hover states suaves (scale 1.05)
- [ ] Progress bar visible y clara
- [ ] Empty state friendly message

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-005 (Storyboard & Timeline Management)

