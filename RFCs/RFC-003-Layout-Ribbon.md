# RFC-003: Layout & Ribbon Menu Structure
## Movie Maker 2025 — Application Shell & UI Navigation

**Status**: Draft → Ready for Implementation  
**Phase**: 1 (Foundation)  
**Complexity**: Medium  
**Estimated Duration**: 2-3 days  
**Dependencies**: RFC-001, RFC-002  

---

## 🎯 Overview

RFC-003 construye la **estructura principal del layout**, el **Ribbon Menu** (tabs funcionales), y la **organización general de la interfaz**.

Al finalizar RFC-003:
- ✅ App.jsx con layout responsivo completo
- ✅ RibbonMenu.jsx con tabs (Inicio, Animaciones, Efectos, Insertar)
- ✅ MainLayout estructura base
- ✅ Responsive design (1024px+)
- ✅ Espacios placeholder para paneles (Media, Player, Storyboard, Properties)

---

## 📋 Requirements

### R1: Main App Component

**File**: `src/App.jsx`

```javascript
import { ProjectProvider } from './context/ProjectContext';
import { MainLayout } from './components/Layout/MainLayout';
import { NotificationProvider } from './context/NotificationContext'; // v1.1
import './styles/theme.css';
import './styles/animations.css';
import './styles/reset.css';
import './index.css';

function App() {
  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  );
}

export default App;
```

**Acceptance Criteria**:
- ✅ App monta sin errores
- ✅ ProjectProvider accessible desde componentes
- ✅ Estilos globales aplicados

---

### R2: Main Layout Component

**File**: `src/components/Layout/MainLayout.jsx`

**Structure**:
```
┌─────────────────────────────────────────────────────┐
│  RibbonMenu (Tabs: Inicio, Animaciones, Efectos)    │
├──────────┬──────────────────────────────┬───────────┤
│          │                              │           │
│  Media   │       Editor Area             │ Properties│
│  Panel   │  (Player + Storyboard)        │ Panel     │
│ (150px)  │                              │(300px)    │
│          │                              │           │
└──────────┴──────────────────────────────┴───────────┘
```

**Features**:
- Flex layout responsivo
- Media panel left sidebar (collapsible)
- Editor central (Player + Storyboard horizontal split)
- Properties panel right sidebar (contextual)
- Ribbon menu top (fixed)

```javascript
import { useState } from 'react';
import { RibbonMenu } from './RibbonMenu';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isMediaPanelOpen, setIsMediaPanelOpen] = useState(true);

  return (
    <div className={styles.appWrapper}>
      <RibbonMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className={styles.mainContent}>
        {/* Left: Media Panel */}
        {isMediaPanelOpen && (
          <aside className={styles.mediaPanel}>
            {/* Media Library Placeholder */}
            <div className={styles.panelHeader}>Media</div>
            <div className={styles.mediaGrid}>
              {/* Clips will render here (RFC-004) */}
            </div>
          </aside>
        )}

        {/* Center: Editor */}
        <main className={styles.editor}>
          <div className={styles.playerContainer}>
            {/* Player Placeholder (RFC-006) */}
            <div className={styles.playerPlaceholder}>
              Player Area
            </div>
          </div>

          <div className={styles.storyboardContainer}>
            {/* Storyboard Placeholder (RFC-005) */}
            <div className={styles.storyboardPlaceholder}>
              Storyboard Area
            </div>
          </div>
        </main>

        {/* Right: Properties Panel */}
        <aside className={styles.propertiesPanel}>
          <div className={styles.panelHeader}>Properties</div>
          <div className={styles.panelContent}>
            {/* Contextual properties (RFC-008+) */}
          </div>
        </aside>
      </div>
    </div>
  );
}
```

**CSS** (`src/components/Layout/MainLayout.module.css`):
```css
.appWrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-bg-primary);
}

.mainContent {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.mediaPanel {
  width: 150px;
  border-right: 1px solid var(--color-border-light);
  background-color: var(--color-bg-secondary);
  overflow-y: auto;
}

.editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.playerContainer {
  flex: 0 0 400px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.storyboardContainer {
  flex: 1;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.propertiesPanel {
  width: 300px;
  border-left: 1px solid var(--color-border-light);
  background-color: var(--color-bg-secondary);
  overflow-y: auto;
}

.panelHeader {
  padding: var(--spacing-md);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.panelContent {
  padding: var(--spacing-md);
}

/* Responsive */
@media (max-width: 1366px) {
  .mediaPanel { width: 120px; }
  .propertiesPanel { width: 250px; }
}

@media (max-width: 1024px) {
  .mediaPanel { display: none; }
  .propertiesPanel { width: 200px; }
}
```

**Acceptance Criteria**:
- ✅ Layout visible sin errores
- ✅ 3 paneles + ribbon renderizan
- ✅ Responsive 1024px+
- ✅ Estilos tema Movie Maker

---

### R3: Ribbon Menu Component

**File**: `src/components/Layout/RibbonMenu.jsx`

**Tabs**:
1. **Inicio** (Home):
   - Nuevo proyecto
   - Abrir proyecto
   - Guardar proyecto
   - Exportar

2. **Animaciones** (Animations):
   - Transiciones
   - Entrada de clip

3. **Efectos** (Effects):
   - Filtros visuales
   - Presets

4. **Insertar** (Insert):
   - Insertar texto
   - Insertar forma
   - Insertar media

```javascript
import { useState } from 'react';
import styles from './RibbonMenu.module.css';

export function RibbonMenu({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'animaciones', label: 'Animaciones' },
    { id: 'efectos', label: 'Efectos' },
    { id: 'insertar', label: 'Insertar' },
  ];

  return (
    <nav className={styles.ribbon}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles['tab--active'] : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'inicio' && <TabInicio />}
        {activeTab === 'animaciones' && <TabAnimaciones />}
        {activeTab === 'efectos' && <TabEfectos />}
        {activeTab === 'insertar' && <TabInsertar />}
      </div>
    </nav>
  );
}

// Placeholder components
function TabInicio() {
  return (
    <div className={styles.tabContent}>
      {/* Buttons for Nuevo, Abrir, Guardar, Exportar */}
    </div>
  );
}

function TabAnimaciones() {
  return <div className={styles.tabContent}>Animaciones</div>;
}

function TabEfectos() {
  return <div className={styles.tabContent}>Efectos</div>;
}

function TabInsertar() {
  return <div className={styles.tabContent}>Insertar</div>;
}
```

**CSS** (`src/components/Layout/RibbonMenu.module.css`):
```css
.ribbon {
  background-color: var(--color-bg-accent);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.tabs {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-light);
}

.tab {
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-text-primary);
  transition: var(--transition-fast);
  border-bottom: 2px solid transparent;
}

.tab:hover {
  background-color: rgba(30, 114, 189, 0.1);
}

.tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.content {
  padding: var(--spacing-md);
  background-color: white;
  min-height: 60px;
}

.tabContent {
  display: flex;
  gap: var(--spacing-md);
}
```

**Acceptance Criteria**:
- ✅ 4 tabs funcionales (click cambia tab)
- ✅ Active tab resaltado
- ✅ Ribbon visible y responsive
- ✅ Tab content cambia dinámicamente

---

### R4: Responsive Design & Media Queries

**Breakpoints**:
```css
/* Desktop (primary) */
@media (min-width: 1920px) {
  /* Full layout */
}

/* Laptop */
@media (max-width: 1366px) {
  .mediaPanel { width: 120px; }
  .propertiesPanel { width: 250px; }
}

/* Tablet (secondary) */
@media (max-width: 1024px) {
  .mediaPanel { display: none; }
  .mainContent { flex-direction: column; }
  .propertiesPanel { width: 100%; }
}
```

**Acceptance Criteria**:
- ✅ Funciona 1024px, 1366px, 1920px
- ✅ No horizontal scroll > 1920px
- ✅ Tablet layout functional (basic)

---

### R5: Keyboard Navigation & Accessibility

**Features**:
- Tab navigates between ribbons tabs
- Alt+Key shortcuts for tabs (future)
- Focus visible on all interactive elements
- ARIA labels en ribbon

**Acceptance Criteria**:
- ✅ Tab key navega tabs
- ✅ Enter selecciona tab
- ✅ Focus visible clara

---

## 🏗️ File Structure After RFC-003

```
src/
├── App.jsx                           ← Root component
├── components/
│   ├── Layout/
│   │   ├── MainLayout.jsx           ← Main structure
│   │   ├── MainLayout.module.css
│   │   ├── RibbonMenu.jsx           ← Tabs + navigation
│   │   └── RibbonMenu.module.css
│   └── UI/
│       ├── Button.jsx
│       ├── Slider.jsx
│       └── ... (from RFC-002)
├── context/
│   └── ProjectContext.jsx           ← Global state
├── styles/
│   ├── theme.css
│   ├── animations.css
│   ├── reset.css
│   └── responsive.css
└── hooks/
    └── useUndo.js
```

---

## 📊 Testing Requirements

**Components to Test**:
- MainLayout renders without crashing
- Ribbon tabs switch correctly
- Responsive breakpoints work
- Accessibility: tab navigation, ARIA labels

**Example Test** (`src/components/Layout/RibbonMenu.test.jsx`):
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { RibbonMenu } from './RibbonMenu';

describe('RibbonMenu Component', () => {
  it('renders all tabs', () => {
    render(<RibbonMenu activeTab="inicio" setActiveTab={() => {}} />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Animaciones')).toBeInTheDocument();
  });

  it('switches tab on click', () => {
    const setActiveTab = vi.fn();
    render(<RibbonMenu activeTab="inicio" setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Efectos'));
    expect(setActiveTab).toHaveBeenCalledWith('efectos');
  });
});
```

---

## ✅ Acceptance Criteria

**RFC-003 is complete when:**

1. **Main Layout**
   - ✅ App.jsx funciona con ProjectProvider
   - ✅ MainLayout estructura visible
   - ✅ 3 paneles (media, editor, properties) rendering

2. **Ribbon Menu**
   - ✅ 4 tabs funcionales
   - ✅ Tab switching funciona
   - ✅ Active tab resaltado
   - ✅ Placeholder content en cada tab

3. **Styling**
   - ✅ Tema Movie Maker 2012 (azul, blanco, gris)
   - ✅ Colores consistentes
   - ✅ Hover/active states visibles

4. **Responsive Design**
   - ✅ 1024px: funcional (media panel collapse)
   - ✅ 1366px: funcional
   - ✅ 1920px: full layout sin horizontal scroll

5. **Accessibility**
   - ✅ Tab navigation funcional
   - ✅ Focus visible en botones ribbon
   - ✅ ARIA labels en tabs

6. **Testing**
   - ✅ Tests pasan sin warnings
   - ✅ 70%+ coverage

---

## 🎨 Vibe Final Check

- [ ] Ribbon azul #E6F0FA suave (no agresivo)
- [ ] Paneles gris #F3F3F3 neutral
- [ ] Transiciones tab smooth 300ms
- [ ] Sin colores saturationes
- [ ] Tipografía clara, profesional
- [ ] Layout ordenado, simétrico
- [ ] Espaciado consistente

---

## 🚀 Dependencies for Next RFCs

Una vez RFC-003 completo:
- RFC-004 (Media Import): Usa `mediaPanel` placeholder
- RFC-005 (Storyboard): Usa `storyboardContainer` placeholder
- RFC-006 (Player): Usa `playerContainer` placeholder
- RFC-008+ (Ribbon content): Usan TabAnimaciones, TabEfectos, etc

---

**Versión**: 1.0  
**Status**: ✅ Ready for Development  

**Next RFC**: RFC-004 (Media Import & Management)

