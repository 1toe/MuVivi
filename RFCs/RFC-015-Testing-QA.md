# RFC-015: Testing & QA Strategy
## Movie Maker 2025 — Comprehensive Testing, E2E Tests & QA Checklist

**Status**: Draft → Ready for Implementation  
**Phase**: 5 (Quality Assurance)  
**Complexity**: Medium  
**Estimated Duration**: 3-4 days  
**Dependencies**: RFC-001-014  

---

## 🎯 Overview

RFC-015 establece la **estrategia de testing comprehensiva**: unit tests, integration tests, E2E tests, y QA manual checklist.

Al finalizar RFC-015:
- ✅ Unit tests (70%+ coverage)
- ✅ Integration tests para features clave
- ✅ E2E tests (Playwright/Cypress)
- ✅ QA manual checklist
- ✅ Performance testing básico

---

## 📋 Requirements

### R1: Unit Tests Strategy

**Coverage Goals**:
- **Utils**: 90%+ coverage
- **Components**: 70%+ coverage
- **Hooks**: 80%+ coverage
- **Context**: 80%+ coverage

**Example Tests**:

**File**: `src/utils/fileValidation.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { validateFile } from './fileValidation';

describe('fileValidation', () => {
  it('validates supported video formats', () => {
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    const result = validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.type).toBe('video');
  });

  it('rejects unsupported formats', () => {
    const file = new File([''], 'test.xyz', { type: 'application/xyz' });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported format');
  });

  it('rejects files over max size', () => {
    const largeFile = new File([new Array(600 * 1024 * 1024)], 'large.mp4');
    const result = validateFile(largeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too large');
  });
});
```

**File**: `src/components/UI/Button.test.jsx`

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders label correctly', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click" disabled />);
    expect(screen.getByText('Click')).toBeDisabled();
  });

  it('applies correct variant class', () => {
    const { container } = render(<Button label="Click" variant="primary" />);
    expect(container.firstChild).toHaveClass('primary');
  });
});
```

**Acceptance Criteria**:
- ✅ All utils tienen tests
- ✅ All UI components tienen tests
- ✅ 70%+ coverage total

---

### R2: Integration Tests

**File**: `src/__tests__/integration/mediaImport.test.jsx`

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../App';

describe('Media Import Integration', () => {
  it('imports video file and adds to Media Panel', async () => {
    render(<App />);
    
    // Create mock file
    const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' });
    
    // Find file input
    const fileInput = screen.getByLabelText(/import/i);
    
    // Upload file
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for media to appear in grid
    await waitFor(() => {
      expect(screen.getByText('test.mp4')).toBeInTheDocument();
    });
  });

  it('drag media to timeline creates clip', async () => {
    render(<App />);
    
    // ... upload media first ...
    
    // Drag media to timeline
    const mediaItem = screen.getByText('test.mp4');
    const timeline = screen.getByRole('region', { name: /timeline/i });
    
    fireEvent.dragStart(mediaItem);
    fireEvent.drop(timeline);
    
    // Verify clip appears in timeline
    await waitFor(() => {
      expect(screen.getByRole('article', { name: /clip/i })).toBeInTheDocument();
    });
  });
});
```

**Acceptance Criteria**:
- ✅ Media import flow tested
- ✅ Timeline drag & drop tested
- ✅ Player playback tested

---

### R3: E2E Tests (Playwright)

**File**: `e2e/basic-workflow.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Basic Movie Maker Workflow', () => {
  test('complete video editing workflow', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 1. Import media
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test/fixtures/sample-video.mp4');
    await expect(page.locator('.mediaItem')).toBeVisible({ timeout: 5000 });

    // 2. Drag media to timeline
    const mediaItem = page.locator('.mediaItem').first();
    const timeline = page.locator('.storyboard');
    await mediaItem.dragTo(timeline);
    await expect(page.locator('.clip')).toBeVisible();

    // 3. Add text overlay
    await page.click('text=Text');
    await page.fill('textarea[placeholder*="Enter text"]', 'Hello World');
    await page.click('button:has-text("Add Text")');
    await expect(page.locator('.textOverlay')).toBeVisible();

    // 4. Apply transition
    await page.click('text=Animations');
    const transition = page.locator('.transitionItem').first();
    const clip = page.locator('.clip').first();
    await transition.dragTo(clip);
    await expect(page.locator('.transitionIndicator')).toBeVisible();

    // 5. Play preview
    await page.click('button[aria-label="Play"]');
    await page.waitForTimeout(2000);
    await expect(page.locator('.playButton')).toContainText('⏸');

    // 6. Export video
    await page.click('button:has-text("Export")');
    await page.selectOption('select[name="resolution"]', '720p');
    await page.click('button:has-text("Export")');
    
    // Wait for export to complete
    await expect(page.locator('.progress')).toBeVisible();
    await expect(page.locator('.progress')).toHaveText(/100%/, { timeout: 30000 });
  });

  test('keyboard shortcuts work', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Load project with clips
    // ... setup ...

    // Test Space for play/pause
    await page.keyboard.press('Space');
    await expect(page.locator('.playButton')).toContainText('⏸');
    
    await page.keyboard.press('Space');
    await expect(page.locator('.playButton')).toContainText('▶');

    // Test Ctrl+S for save
    await page.keyboard.press('Control+S');
    await expect(page.locator('.notification')).toHaveText(/saved/i);

    // Test Delete for clip deletion
    await page.click('.clip');
    await page.keyboard.press('Delete');
    await expect(page.locator('.clip')).not.toBeVisible();
  });
});
```

**Acceptance Criteria**:
- ✅ Complete workflow E2E test
- ✅ Keyboard shortcuts E2E test
- ✅ Export process E2E test

---

### R4: QA Manual Checklist

**File**: `QA-CHECKLIST.md`

```markdown
# Movie Maker 2025 — QA Manual Testing Checklist

## Media Import
- [ ] Drag & drop video files funciona
- [ ] Click import button funciona
- [ ] Multiple files upload simultáneamente
- [ ] Unsupported formats rejected
- [ ] Files > 500MB rejected
- [ ] Thumbnails generan correctamente
- [ ] Metadata (duration, resolution) correcto

## Timeline / Storyboard
- [ ] Drag media to timeline adds clip
- [ ] Clips reorder con drag & drop
- [ ] Delete clip funciona
- [ ] Clip selection visual feedback
- [ ] Timeline scrollable horizontalmente
- [ ] Playhead sincronizado con player
- [ ] Click en timeline hace seek

## Player
- [ ] Play button funciona
- [ ] Pause button funciona
- [ ] Seek bar interactive
- [ ] Volume slider funciona
- [ ] Mute toggle funciona
- [ ] Timecode display correcto
- [ ] Video renderiza en canvas

## Transitions
- [ ] Drag transition a clip funciona
- [ ] Fade transition visual correcto
- [ ] Wipe transition visual correcto
- [ ] Slide transition visual correcto
- [ ] Transition duration configurable
- [ ] Remove transition funciona

## Effects
- [ ] Brightness effect funciona
- [ ] Contrast effect funciona
- [ ] Saturation effect funciona
- [ ] Blur effect funciona
- [ ] Sepia/Grayscale/Invert funcionan
- [ ] Vignette effect funciona
- [ ] Multiple effects stack correctamente
- [ ] Effect intensity configurable

## Text Overlays
- [ ] Add text overlay funciona
- [ ] Text renderiza sobre video
- [ ] Font size configurable
- [ ] Color picker funciona
- [ ] Position selector funciona
- [ ] Fade in/out animations funcionan
- [ ] Remove text funciona

## Audio
- [ ] Background music import funciona
- [ ] Background music plays durante preview
- [ ] Volume control funciona
- [ ] Audio sincronizado con video

## Export
- [ ] Export modal abre
- [ ] Resolution selector funciona
- [ ] Quality selector funciona
- [ ] Export progress bar actualiza
- [ ] Download automático funciona
- [ ] Exported video reproduces correctamente

## Save/Load
- [ ] Auto-save cada 30s funciona
- [ ] Save Project button funciona
- [ ] Open Project button funciona
- [ ] Project carga correctamente
- [ ] localStorage persiste proyecto

## Keyboard Shortcuts
- [ ] Space = play/pause
- [ ] Delete = delete clip
- [ ] Ctrl+Z = undo
- [ ] Ctrl+Y = redo
- [ ] Ctrl+S = save
- [ ] Ctrl+E = export
- [ ] Arrow keys = seek
- [ ] M = mute
- [ ] ? = shortcuts help

## UI/UX
- [ ] Responsive design 1024px+
- [ ] No visual glitches
- [ ] Hover states suaves
- [ ] Loading states visible
- [ ] Error messages claros
- [ ] Empty states friendly
- [ ] Colors consistentes con tema

## Performance
- [ ] Timeline con 20+ clips fluido
- [ ] Player playback 30+ FPS
- [ ] Effects render sin lag
- [ ] Export completa sin errors
- [ ] No memory leaks detectados
- [ ] App carga en < 3s

## Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)

## Accessibility
- [ ] Keyboard navigation funciona
- [ ] ARIA labels presentes
- [ ] Focus states visibles
- [ ] Screen reader compatible (básico)
```

**Acceptance Criteria**:
- ✅ Checklist completo
- ✅ All items pasados antes de release

---

### R5: Performance Testing

**File**: `src/__tests__/performance/renderPerformance.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { performance } from 'perf_hooks';

describe('Render Performance', () => {
  it('renders frame in < 33ms (30 FPS)', async () => {
    const renderEngine = new RenderEngine(/*...*/);
    
    const start = performance.now();
    await renderEngine.renderFrame(5.0);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(33); // 30 FPS = 33ms per frame
  });

  it('applies effects in < 50ms', async () => {
    const ctx = canvas.getContext('2d');
    const effects = [
      { type: 'brightness', intensity: 0.7 },
      { type: 'contrast', intensity: 0.6 },
      { type: 'saturation', intensity: 0.8 },
    ];
    
    const start = performance.now();
    EffectsRenderer.applyEffects(ctx, effects, 1920, 1080);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(50);
  });
});
```

**Acceptance Criteria**:
- ✅ Render performance tests
- ✅ All tests pass
- ✅ 30+ FPS maintained

---

## ✅ Acceptance Criteria

**RFC-015 is complete when:**

1. **Unit Tests**
   - ✅ 70%+ coverage total
   - ✅ All utils tested
   - ✅ All components tested

2. **Integration Tests**
   - ✅ 5+ integration tests
   - ✅ Key workflows covered

3. **E2E Tests**
   - ✅ 3+ E2E scenarios
   - ✅ Complete workflow tested

4. **QA Checklist**
   - ✅ Checklist completo
   - ✅ All items verificados

5. **Performance**
   - ✅ 30+ FPS rendering
   - ✅ No memory leaks

---

## 📊 Testing Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run performance tests
npm run test:perf
```

---

**Versión**: 1.0  
**Status**: ✅ Ready for Implementation  
**Final RFC**: This completes all 15 RFCs for Movie Maker 2025 v1.0

