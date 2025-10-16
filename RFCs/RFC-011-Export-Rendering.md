# RFC-011: Export & Rendering System
## Movie Maker 2025 — Video Export, WebM Encoding & Download

**Status**: Draft → Ready for Implementation  
**Phase**: 4 (Advanced Features)  
**Complexity**: Very High  
**Estimated Duration**: 5-6 days  
**Dependencies**: RFC-001-010  

---

## 🎯 Overview

RFC-011 implementa **export funcional** del proyecto a archivo de video (.webm), usando **MediaRecorder API** o **FFmpeg.wasm** para encoding.

Al finalizar RFC-011:
- ✅ Export button funcional
- ✅ WebM encoding (720p, 30fps)
- ✅ Progress bar durante export
- ✅ Download file automático
- ✅ Export settings (resolution, quality)

---

## 📋 Requirements

### R1: Export Modal

**File**: `src/components/Export/ExportModal.jsx`

```jsx
export function ExportModal({ isOpen, onClose }) {
  const [resolution, setResolution] = useState('1280x720');
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const blob = await exportProject({ resolution, quality, onProgress: setProgress });
      downloadBlob(blob, 'movie-maker-export.webm');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Export Video</h2>
      
      <div className={styles.settings}>
        <label>
          Resolution
          <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
            <option value="1920x1080">1080p (Full HD)</option>
            <option value="1280x720">720p (HD)</option>
            <option value="854x480">480p (SD)</option>
          </select>
        </label>
        
        <label>
          Quality
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="high">High (5 Mbps)</option>
            <option value="medium">Medium (2.5 Mbps)</option>
            <option value="low">Low (1 Mbps)</option>
          </select>
        </label>
      </div>
      
      {isExporting && (
        <div className={styles.progress}>
          <ProgressBar value={progress} />
          <p>Exporting... {progress}%</p>
        </div>
      )}
      
      <div className={styles.actions}>
        <button onClick={handleExport} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
        <button onClick={onClose} disabled={isExporting}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
```

**Acceptance Criteria**:
- ✅ Modal renderiza correctamente
- ✅ Resolution selector funciona
- ✅ Quality selector funciona
- ✅ Progress bar visible durante export

---

### R2: Export Engine (MediaRecorder)

**File**: `src/utils/exportEngine.js`

```javascript
export async function exportProject({ resolution, quality, onProgress }) {
  const [width, height] = resolution.split('x').map(Number);
  
  // Create offscreen canvas for rendering
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Get project data
  const { clips, duration, backgroundMusic } = getProjectState();
  
  // Setup MediaRecorder
  const stream = canvas.captureStream(30); // 30 FPS
  
  // Add audio track if background music exists
  if (backgroundMusic) {
    const audioCtx = new AudioContext();
    const destination = audioCtx.createMediaStreamDestination();
    const audioElement = new Audio(backgroundMusic.url);
    const source = audioCtx.createMediaElementSource(audioElement);
    source.connect(destination);
    
    const audioTrack = destination.stream.getAudioTracks()[0];
    stream.addTrack(audioTrack);
  }
  
  const mimeType = 'video/webm;codecs=vp8,opus';
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: getQualityBitrate(quality),
  });
  
  const chunks = [];
  
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };
  
  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
    
    recorder.onerror = reject;
    
    recorder.start();
    
    // Render frames
    renderFrames(ctx, clips, duration, width, height, onProgress)
      .then(() => {
        recorder.stop();
      })
      .catch(reject);
  });
}

async function renderFrames(ctx, clips, duration, width, height, onProgress) {
  const fps = 30;
  const totalFrames = Math.ceil(duration * fps);
  const frameTime = 1 / fps;
  
  for (let frame = 0; frame < totalFrames; frame++) {
    const currentTime = frame * frameTime;
    
    // Render frame (reuse existing renderEngine logic)
    await renderFrameAtTime(ctx, clips, currentTime, width, height);
    
    // Update progress
    const progress = Math.floor((frame / totalFrames) * 100);
    onProgress(progress);
    
    // Wait for next frame
    await new Promise(resolve => setTimeout(resolve, frameTime * 1000));
  }
}

function getQualityBitrate(quality) {
  switch (quality) {
    case 'high': return 5000000; // 5 Mbps
    case 'medium': return 2500000; // 2.5 Mbps
    case 'low': return 1000000; // 1 Mbps
    default: return 2500000;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

**Acceptance Criteria**:
- ✅ Frames renderizan correctamente
- ✅ MediaRecorder captura canvas
- ✅ Progress updates during rendering
- ✅ Download automático

---

### R3: Export Button in Ribbon

**File**: `src/components/Layout/RibbonMenu.jsx` (update)

```jsx
import { ExportModal } from '../Export/ExportModal';

export function RibbonMenu({ activeTab, setActiveTab }) {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className={styles.ribbon}>
      {/* ... existing tabs ... */}
      
      <div className={styles.tab} data-tab="inicio">
        {/* ... existing buttons ... */}
        
        <button
          className={styles.ribbonButton}
          onClick={() => setShowExportModal(true)}
        >
          <span className={styles.icon}>💾</span>
          <span>Export</span>
        </button>
      </div>
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Export button visible
- ✅ Opens export modal
- ✅ Modal funcional

---

## ✅ Acceptance Criteria

**RFC-011 is complete when:**

1. **Export Modal**
   - ✅ Resolution selector (1080p, 720p, 480p)
   - ✅ Quality selector (high, medium, low)
   - ✅ Export button funciona

2. **Rendering**
   - ✅ Frames renderizan correctamente
   - ✅ Effects/transitions/text incluidos
   - ✅ 30 FPS target

3. **Encoding**
   - ✅ WebM encoding funciona
   - ✅ Audio incluido si background music
   - ✅ Quality bitrate correcto

4. **UX**
   - ✅ Progress bar actualiza
   - ✅ Download automático
   - ✅ Error handling

5. **Performance**
   - ✅ Export de 1 min video < 3 min
   - ✅ No memory leaks

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  
**Next RFC**: RFC-012 (Project Save/Load)

