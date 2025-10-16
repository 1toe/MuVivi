# FEATURES.md
## Movie Maker 2025 — Complete Feature Breakdown

---

## 📊 Overview

Este documento desglosía todas las features de **Movie Maker 2025**, organizadas por categoría, prioridad (MoSCoW), complejidad y aceptación.

**Resumen de Cantidades**:
- **Must-Have (MVP)**: 17 features
- **Should-Have (v1.0)**: 8 features
- **Could-Have (v1.5+)**: 6 features
- **Won't-Have (Roadmap lejano)**: 7 features
- **Total Features v1.0**: 25

---

## 📑 Tabla de Contenidos

1. [Media Management](#1-media-management)
2. [Project Management](#2-project-management)
3. [Storyboard & Timeline](#3-storyboard--timeline)
4. [Playback & Preview](#4-playback--preview)
5. [Transitions](#5-transitions)
6. [Effects & Filters](#6-effects--filters)
7. [Text & Captions](#7-text--captions)
8. [UI/UX & Interaction](#8-uiux--interaction)
9. [Settings & Preferences](#9-settings--preferences)
10. [Accessibility & Internalization](#10-accessibility--internationalization)

---

## 1. Media Management

### F1.1: Import Media (Multi-format)
**Priority**: 🔴 **MUST HAVE** (Core)  
**Category**: Media Management  
**Complexity**: Medium  

**Description**:
Usuarios pueden importar archivos de múltiples formatos (vídeo, imagen, audio) mediante diálogo de selección o drag & drop.

**Acceptance Criteria**:
- ✓ Soporta .mp4, .webm, .jpg, .png, .wav
- ✓ Drag & drop en área designada
- ✓ File picker dialog (múltiple selección)
- ✓ Validación de formato y tamaño
- ✓ Muestra progreso de carga
- ✓ Max 500MB por archivo, 2GB total proyecto
- ✓ Thumbnails generados automáticamente (100x75px)

**Technical Notes**:
- Usar FileReader API para lectura local
- Canvas para thumbnail generation
- Validar MIME type + header file

**Testing**:
- Test formatos válidos e inválidos
- Test límites de tamaño
- Test drag & drop + picker
- Test error messages claros

---

### F1.2: Media Library Panel
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Media Management  
**Complexity**: Low  

**Description**:
Panel izquierdo que muestra todos los medios importados como galería mini-thumbnails.

**Acceptance Criteria**:
- ✓ Muestra todos los clips importados
- ✓ Permite búsqueda por nombre
- ✓ Opción de previsar individual (click)
- ✓ Drag clip a storyboard
- ✓ Delete media (confirmar)

**Technical Notes**:
- State management en App.jsx
- Filtro por búsqueda string matching

---

### F1.3: Media Validation & Error Handling
**Priority**: 🔴 **MUST HAVE**  
**Category**: Media Management  
**Complexity**: Medium  

**Description**:
Sistema robusto de validación y mensajes de error claros.

**Error Cases & Messages**:
| Error | Message | Action |
|-------|---------|--------|
| Formato inválido | "Formato no soportado. Usa: MP4, WebM, JPG, PNG, WAV" | Sugerencia |
| Archivo > 500MB | "Tu archivo es XXMb. Máximo: 500MB" | Rechazo |
| Corrupto | "El archivo parece dañado. Intenta otro." | Rechazo |
| Navegador sin soporte | "Tu navegador no soporta este formato" | Info + alternativa |

**Acceptance Criteria**:
- ✓ Validación MIME type
- ✓ Validación tamaño
- ✓ Try/catch en FileReader
- ✓ Mensajes traducibles (i18n ready)

---

## 2. Project Management

### F2.1: Create New Project
**Priority**: 🔴 **MUST HAVE**  
**Category**: Project Management  
**Complexity**: Low  

**Description**:
Crear un nuevo proyecto en blanco (limpia estado actual).

**Acceptance Criteria**:
- ✓ Botón "Nuevo Proyecto" en Ribbon
- ✓ Confirmación si hay cambios sin guardar
- ✓ Limpia todos los clips, efectos, textos
- ✓ Reset nombre proyecto a "Untitled"

**Technical Notes**:
- Mostrar confirmación dialog
- Reset context state completo

---

### F2.2: Save Project (localStorage)
**Priority**: 🔴 **MUST HAVE**  
**Category**: Project Management  
**Complexity**: Medium  

**Description**:
Guardar proyecto en localStorage con serialización JSON.

**Acceptance Criteria**:
- ✓ Ctrl+S o botón "Guardar"
- ✓ Auto-save cada 30 segundos (sin interrumpir UX)
- ✓ Mostrar notificación "Guardado ✓" temporal
- ✓ Máximo 10 proyectos en localStorage (5-10MB)
- ✓ Confirmación si intenta sobreescribir

**Technical Notes**:
- JSON.stringify() del state
- setInterval para auto-save
- localStorage.setItem("moviemaker_projects", data)

**Edge Cases**:
- Storage lleno → sugerir export/cleanup
- Pérdida de conexión → no aplica (local only)

---

### F2.3: Load Project (from localStorage)
**Priority**: 🔴 **MUST HAVE**  
**Category**: Project Management  
**Complexity**: Medium  

**Description**:
Cargar proyecto guardado desde localStorage.

**Acceptance Criteria**:
- ✓ Botón "Abrir Proyecto" abre dialog
- ✓ Lista de proyectos guardados con fecha
- ✓ Preview thumbnail del proyecto
- ✓ Cargar estado exacto (clips, efectos, textos)
- ✓ Confirmación si hay cambios sin guardar

**Technical Notes**:
- Reconstruir state desde JSON
- Validar versión de dato (future-proof)

---

### F2.4: Export Project as JSON
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Project Management  
**Complexity**: Low  

**Description**:
Exportar proyecto a archivo .json para backup o compartir.

**Acceptance Criteria**:
- ✓ Botón "Exportar Proyecto" en Ribbon
- ✓ Download archivo .json con timestamp
- ✓ Incluye metadata (proyecto, clips, efectos, textos)

**Technical Notes**:
- Usar Blob + download trigger

---

### F2.5: Import Project from JSON
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Project Management  
**Complexity**: Low  

**Description**:
Importar proyecto desde archivo .json.

**Acceptance Criteria**:
- ✓ Botón "Importar Proyecto"
- ✓ File picker (.json)
- ✓ Validar estructura JSON
- ✓ Mostrar confirmación antes de cargar
- ✓ Error message si JSON inválido

---

### F2.6: Project Metadata Editor
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Project Management  
**Complexity**: Low  

**Description**:
Editar nombre, descripción, duración total del proyecto.

**Acceptance Criteria**:
- ✓ Diálogo "Propiedades Proyecto"
- ✓ Editar: nombre, descripción
- ✓ Mostrar: duración total, # clips, tamaño
- ✓ Cambios se guardan automáticamente

---

## 3. Storyboard & Timeline

### F3.1: Storyboard View
**Priority**: 🔴 **MUST HAVE**  
**Category**: Timeline & Organization  
**Complexity**: High  

**Description**:
Vista de clips en orden secuencial con thumbnails, duración y tipo de media visible.

**Acceptance Criteria**:
- ✓ Timeline horizontal con clips en orden
- ✓ Cada clip muestra:
  - Thumbnail (100x75px)
  - Duración (ej: "5.2s")
  - Tipo de media (icono)
- ✓ Clip actual resaltado
- ✓ Scroll horizontal si > 1920px
- ✓ Max 100 clips sin jank visible

**Technical Notes**:
- Canvas o img para thumbnails
- Scroll nativo o custom wheel handling
- Virtual rendering si > 50 clips (performance)

**Performance Target**: 60 FPS al scroll

---

### F3.2: Drag & Drop Reordering
**Priority**: 🔴 **MUST HAVE**  
**Category**: Timeline & Organization  
**Complexity**: High  

**Description**:
Reordenar clips arrastrando en el storyboard (nativo HTML5).

**Acceptance Criteria**:
- ✓ Draggable clips con visual feedback
- ✓ Drop zone clara durante arrastre
- ✓ Opacity 0.5 en clip siendo arrastrado
- ✓ Border highlight en zona de drop
- ✓ Clip reordenado se refleja inmediatamente
- ✓ Smooth animation (300ms) al soltar

**Technical Notes**:
- HTML5 drag & drop API
- dragstart, dragover, drop, dragend listeners
- Actualizar array de clips en state

**Alternative**: React Beautiful DnD (si HTML5 native insuficiente)

---

### F3.3: Clip Selection & Context Menu
**Priority**: 🔴 **MUST HAVE**  
**Category**: Timeline & Organization  
**Complexity**: Medium  

**Description**:
Seleccionar clip y acceder a opciones contextuales.

**Acceptance Criteria**:
- ✓ Click selecciona clip (visual highlight)
- ✓ Right-click abre context menu:
  - Duplicate
  - Delete
  - Properties
  - Split at current time
- ✓ Delete muestra confirmación
- ✓ Keyboard: Delete key borra clip

**Technical Notes**:
- Context menu custom (no browser default)
- Prevent default en right-click

---

### F3.4: Clip Duration Editor
**Priority**: 🔴 **MUST HAVE**  
**Category**: Timeline & Organization  
**Complexity**: Medium  

**Description**:
Editar duración individual de clips (trim, extend).

**Acceptance Criteria**:
- ✓ Properties panel muestra "Duración"
- ✓ Slider de duración (0.5s - max video length)
- ✓ Input numérico (segundos)
- ✓ Preview actualiza en vivo
- ✓ Limita a duración máxima del vídeo

**Technical Notes**:
- Slider 0-100 mapped a duración real
- onChange trigger preview update

---

### F3.5: Bulk Clip Operations
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Timeline & Organization  
**Complexity**: Medium  

**Description**:
Operaciones en múltiples clips (select all, delete all effects, etc.).

**Acceptance Criteria**:
- ✓ Ctrl+A selecciona todos los clips
- ✓ Shift+Click selecciona rango
- ✓ Menú "Edición" con:
  - Duplicate all selected
  - Delete all selected
  - Apply effect to all
- ✓ Confirmación para operaciones destructivas

---

## 4. Playback & Preview

### F4.1: Central Player/Preview
**Priority**: 🔴 **MUST HAVE**  
**Category**: Playback  
**Complexity**: High  

**Description**:
Reproductor central que muestra la composición en tiempo real con soporte de transiciones y efectos.

**Acceptance Criteria**:
- ✓ Reproductor responsivo (aspect ratio 16:9)
- ✓ Canvas o video element
- ✓ Muestra clip actual con efectos aplicados
- ✓ Transición entre clips visible
- ✓ Duración y time actual mostrados
- ✓ 30+ FPS smooth playback

**Technical Architecture**:
```
TimelineEngine
├── calcActiveClip(currentTime) → Clip
├── applyEffectsToCanvas(clip, canvas)
├── renderTransition(fromClip, toClip, progress)
└── requestAnimationFrame() → update
```

**Technical Notes**:
- Canvas para aplicar efectos CSS filters
- requestAnimationFrame para smooth animation
- Sincronización audio (v1.5+)

---

### F4.2: Player Controls
**Priority**: 🔴 **MUST HAVE**  
**Category**: Playback  
**Complexity**: Medium  

**Description**:
Controles básicos del reproductor (play, pause, stop, volume).

**Acceptance Criteria**:
- ✓ Play (⏯) - inicia reproducción
- ✓ Pause (⏸) - pausa en posición
- ✓ Stop (⏹) - detiene y va a inicio
- ✓ Volume slider (0-100%)
- ✓ Current time display (MM:SS)
- ✓ Total duration display (MM:SS)
- ✓ Keyboard: Space (play/pause), → (skip 5s), ← (back 5s)

**Technical Notes**:
- State: isPlaying, currentTime, volume
- setInterval para playback (fallback a RAF)

---

### F4.3: Timeline Scrubbing
**Priority**: 🔴 **MUST HAVE**  
**Category**: Playback  
**Complexity**: Medium  

**Description**:
Barra de progreso clickeable/draggable para navegar timeline.

**Acceptance Criteria**:
- ✓ Barra horizontal mostrando progreso
- ✓ Click en barra salta a tiempo
- ✓ Drag scrubber para navegación suave
- ✓ Hover muestra preview thumbnail de frame
- ✓ Feedback visual mientras scrubbing

**Performance**: Respuesta < 50ms

---

### F4.4: Live Preview on Property Change
**Priority**: 🔴 **MUST HAVE**  
**Category**: Playback  
**Complexity**: Medium  

**Description**:
El reproductor actualiza en tiempo real cuando el usuario cambia efectos, transiciones o propiedades.

**Acceptance Criteria**:
- ✓ Cambio de slider → preview actualiza
- ✓ Sin delay perceptible (< 100ms)
- ✓ Pausa automática si estava playing
- ✓ Resume después si estaba playing

**Technical Notes**:
- useEffect en cambios de properties
- Throttle updates para performance

---

## 5. Transitions

### F5.1: Transition Selector & Applicator
**Priority**: 🔴 **MUST HAVE**  
**Category**: Transitions  
**Complexity**: High  

**Description**:
Interfaz para seleccionar y aplicar transiciones entre clips.

**Available Transitions**:
1. **Cut**: Cambio instantáneo (sin duración)
2. **Fade**: Desvanecimiento a negro
3. **Slide**: Desplazamiento L→R
4. **Wipe**: Barrido diagonal NW→SE

**Acceptance Criteria**:
- ✓ Dropdown selector en Properties
- ✓ Muestra lista de transiciones disponibles
- ✓ Icono representativo de cada
- ✓ Seleccionar aplica a clip actual
- ✓ Preview vivo de transición
- ✓ Aplicable a todos los clips (batch)

**Technical Notes**:
- Transiciones como objetos con función render
- Almacenadas en clip state: `transition: { type: 'fade', duration: 300 }`

---

### F5.2: Transition Duration Editor
**Priority**: 🔴 **MUST HAVE**  
**Category**: Transitions  
**Complexity**: Medium  

**Description**:
Configurar duración de la transición (0.1 - 3.0 segundos).

**Acceptance Criteria**:
- ✓ Slider 0.1 - 3.0 segundos
- ✓ Input numérico (milisegundos)
- ✓ Preview actualiza en vivo
- ✓ Debe ser < duración del clip siguiente

**Technical Notes**:
- Validación: transitionDuration < nextClipDuration

---

### F5.3: Transition Preview
**Priority**: 🔴 **MUST HAVE**  
**Category**: Transitions  
**Complexity**: High  

**Description**:
Visualizar la transición en el preview durante edición.

**Acceptance Criteria**:
- ✓ Mostrar transición entre clip actual y siguiente
- ✓ Actualizar en vivo al cambiar tipo/duración
- ✓ Loop transición si está seleccionada
- ✓ 30+ FPS smooth

**Technical Implementation**:
- Canvas rendering con progress 0→1
- Cada transición tiene función: `render(ctx, progress, clip1, clip2)`

---

### F5.4: Batch Apply Transitions
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Transitions  
**Complexity**: Medium  

**Description**:
Aplicar misma transición a todos los clips con un clic.

**Acceptance Criteria**:
- ✓ Botón "Aplicar a Todo" en Properties
- ✓ Confirmación
- ✓ Todos los clips obtienen misma transición + duración

---

## 6. Effects & Filters

### F6.1: Grayscale Effect
**Priority**: 🔴 **MUST HAVE**  
**Category**: Visual Effects  
**Complexity**: Low  

**Description**:
Convertir clip a escala de grises (saturación 0%).

**Acceptance Criteria**:
- ✓ Toggle checkbox o slider intensity (0-100%)
- ✓ Preview en vivo
- ✓ CSS filter: `grayscale(value%)`

---

### F6.2: Sepia Effect
**Priority**: 🔴 **MUST HAVE**  
**Category**: Visual Effects  
**Complexity**: Low  

**Description**:
Tonalidad sepia vintage.

**Acceptance Criteria**:
- ✓ Slider intensity (0-100%)
- ✓ CSS filter: `sepia(value%)`
- ✓ Preview en vivo

---

### F6.3: Brightness/Contrast
**Priority**: 🔴 **MUST HAVE**  
**Category**: Visual Effects  
**Complexity**: Low  

**Description**:
Ajustar brillo (-50% a +50%) y contraste (-50% a +50%).

**Acceptance Criteria**:
- ✓ Dos sliders independientes
- ✓ CSS filters: `brightness(value%)`, `contrast(value%)`
- ✓ Preview en vivo
- ✓ Reset a 100% (default)

---

### F6.4: Pixelate Effect
**Priority**: 🔴 **MUST HAVE**  
**Category**: Visual Effects  
**Complexity**: Medium  

**Description**:
Efecto pixelado (tamaño de píxel configurable).

**Acceptance Criteria**:
- ✓ Slider tamaño píxel (2-32px)
- ✓ Canvas-based rendering (no CSS filter nativo)
- ✓ Preview en vivo
- ✓ Performance: 30+ FPS

**Technical Notes**:
- Custom canvas function (no filter CSS nativo)
- Muestreo y escalado de imagen

---

### F6.5: Effect Stacking/Composition
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Visual Effects  
**Complexity**: High  

**Description**:
Aplicar múltiples efectos en cascada al mismo clip.

**Acceptance Criteria**:
- ✓ Effects panel muestra lista de efectos aplicados
- ✓ Orden de aplicación: Grayscale → Sepia → Brightness → Contrast → Pixelate
- ✓ Checkbox para habilitar/deshabilitar cada uno
- ✓ Drag reordenar efectos
- ✓ Delete individual
- ✓ Reset all effects

**Technical Notes**:
- Aplicar en orden: `filter1(filter2(filter3(image)))`

---

### F6.6: Effect Preset Templates
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Visual Effects  
**Complexity**: Medium  

**Description**:
Presets pre-configurados (Vintage, B&W, Dark, Bright).

**Presets**:
- **Vintage**: Sepia 60% + Brightness -20%
- **B&W**: Grayscale 100% + Contrast +30%
- **Dark**: Brightness -40% + Contrast +20%
- **Bright**: Brightness +40%

**Acceptance Criteria**:
- ✓ Botón "Presets" en Effects panel
- ✓ Dropdown con opciones
- ✓ Click aplica todos los efectos
- ✓ Puede ajustarse después

---

## 7. Text & Captions

### F7.1: Text Layer Insertion
**Priority**: 🔴 **MUST HAVE**  
**Category**: Text & Captions  
**Complexity**: High  

**Description**:
Insertar capas de texto (Título, Caption, Crédito).

**Text Types**:
- **Title**: Posición top-center, duración 3-5s
- **Caption**: Posición center, durante clip específico
- **Credit**: Posición bottom-center, duración configurable

**Acceptance Criteria**:
- ✓ Botón "Insertar Texto" en Ribbon (Insertar tab)
- ✓ Dropdown selector tipo texto
- ✓ Crea texto en storyboard
- ✓ Abre editor inline
- ✓ Muestra en preview en tiempo real

**Technical Notes**:
- Texto como elemento adicional en timeline
- State: `textLayers: [{ id, type, content, position, duration, style }]`

---

### F7.2: Text Editor (Content & Style)
**Priority**: 🔴 **MUST HAVE**  
**Category**: Text & Captions  
**Complexity**: Medium  

**Description**:
Editor de propiedades de texto (contenido, tamaño, color, fuente).

**Acceptance Criteria**:
- ✓ Input textarea para contenido
- ✓ Slider tamaño (12-72px)
- ✓ Color picker (default azul Movie Maker)
- ✓ Font selector (Segoe UI, Arial, serif, monospace)
- ✓ Preview en vivo en player
- ✓ Drop shadow checkbox (suave, default)

**Technical Notes**:
- canvas.font = `${size}px ${fontFamily}`
- fillStyle = color
- Shadow: `shadowColor, shadowBlur, shadowOffsetX/Y`

---

### F7.3: Text Duration & Position
**Priority**: 🔴 **MUST HAVE**  
**Category**: Text & Captions  
**Complexity**: Medium  

**Description**:
Configurar duración y posición del texto.

**Acceptance Criteria**:
- ✓ Slider duración (0.5 - 30s)
- ✓ Position presets: Top, Center, Bottom
- ✓ Margenes desde bordes (auto)
- ✓ Mostrar en preview

---

### F7.4: Text Animation/Entrance
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Text & Captions  
**Complexity**: Medium  

**Description**:
Animaciones de entrada para textos.

**Available Animations**:
- **Fade In**: Opacidad 0 → 1 (300ms)
- **Zoom In**: Scale 0.5 → 1 (300ms)
- **None**: Sin animación

**Acceptance Criteria**:
- ✓ Dropdown selector en Text panel
- ✓ Preview muestra animación
- ✓ Duración fija 300ms (v1), configurable v2

---

### F7.5: Subtitle Support
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Text & Captions  
**Complexity**: Medium  

**Description**:
Subtítulos cargables desde archivo .srt o editables en panel.

**Acceptance Criteria** (v1.1):
- ✓ Opción "Cargar subtítulos .srt"
- ✓ Parsing automático de timestamps
- ✓ Crea caption para cada línea
- ✓ Editor sincronización manual

---

## 8. UI/UX & Interaction

### F8.1: Ribbon Menu (Tab-based)
**Priority**: 🔴 **MUST HAVE**  
**Category**: UI/UX  
**Complexity**: Medium  

**Description**:
Interfaz Ribbon con pestañas funcionales (como Office/Movie Maker 2012).

**Tabs**:
- **Inicio**: Archivo, Nuevo, Abrir, Guardar, Importar
- **Animaciones**: Transiciones, Entrada de clip
- **Efectos**: Efectos visuales, Presets
- **Insertar**: Texto, Títulos, Créditos

**Acceptance Criteria**:
- ✓ Tab activo resaltado
- ✓ Contenido de tab cambia dinámicamente
- ✓ Estilos: azul #1E72BD, bordes sutiles
- ✓ Botones con hover effect

---

### F8.2: Properties Panel (Right Sidebar)
**Priority**: 🔴 **MUST HAVE**  
**Category**: UI/UX  
**Complexity**: Medium  

**Description**:
Panel contextual derecho que muestra propiedades del clip/elemento seleccionado.

**Contenido dinámico**:
- Clip seleccionado: Duración, Transición, Efectos, Posición
- Texto seleccionado: Contenido, Estilo, Posición, Animación
- Nada seleccionado: Info proyecto, duración total

**Acceptance Criteria**:
- ✓ Panel responsivo (300px width)
- ✓ Scrollable si contenido > viewport
- ✓ Cambios reflejados en preview
- ✓ Collapsar/expandir secciones

---

### F8.3: Notification Center
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: UI/UX  
**Complexity**: Low  

**Description**:
Notificaciones floating (auto-save, errores, operaciones).

**Notification Types**:
- **Success**: "Guardado ✓" (verde, 2s)
- **Error**: "Error al cargar" (rojo, 5s)
- **Info**: "Auto-saving..." (azul, temporal)

**Acceptance Criteria**:
- ✓ Aparece top-right
- ✓ Desaparece automáticamente
- ✓ Max 3 notificaciones simultáneas
- ✓ Stack vertical

---

### F8.4: Responsive Layout
**Priority**: 🔴 **MUST HAVE**  
**Category**: UI/UX  
**Complexity**: Medium  

**Description**:
Interfaz se adapta a diferentes resoluciones (primary: desktop 1920x1080).

**Breakpoints**:
- **Desktop** (1920x1080): Full layout
- **Laptop** (1366x768): Reducir media panel width
- **Tablet** (1024x768): Storyboard abajo (v1.5+)

**Acceptance Criteria**:
- ✓ Funciona en 1024x768+
- ✓ Scroll si necesario
- ✓ Sin horizontal overflow > 1920px
- ✓ Touch-friendly buttons (v1.5+)

---

### F8.5: Keyboard Shortcuts
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: UI/UX  
**Complexity**: Medium  

**Description**:
Atajos de teclado para operaciones comunes.

**Shortcuts**:
| Acción | Shortcut |
|--------|----------|
| Play/Pause | Space |
| Save | Ctrl+S |
| New | Ctrl+N |
| Undo | Ctrl+Z |
| Redo | Ctrl+Y |
| Delete | Delete |
| Next frame | → |
| Previous frame | ← |
| Skip 5s forward | Shift+→ |
| Skip 5s back | Shift+← |

**Acceptance Criteria**:
- ✓ Registrador de global shortcuts
- ✓ Help panel muestra lista
- ✓ No conflicto con browser defaults

---

### F8.6: Undo/Redo Stack
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: UI/UX  
**Complexity**: High  

**Description**:
Sistema de undo/redo para todas las operaciones.

**Acceptance Criteria**:
- ✓ Ctrl+Z deshacer (10+ niveles)
- ✓ Ctrl+Y rehacer
- ✓ Botones en Ribbon (disabled si no aplica)
- ✓ Snapshot de state antes de cada operación

**Technical Notes**:
- Stack-based: `[state1, state2, ...]`
- Limit a 50 snapshots para memory

---

## 9. Settings & Preferences

### F9.1: Application Settings
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Settings  
**Complexity**: Low  

**Description**:
Preferencias globales de la aplicación.

**Settings**:
- Idioma (English, Español)
- Auto-save interval (15s, 30s, 60s)
- Quality preview (low, medium, high)
- Theme (Light, Dark) - v1.1

**Acceptance Criteria**:
- ✓ Diálogo "Preferencias" en Ribbon
- ✓ Guardadas en localStorage
- ✓ Aplicadas al recargar

---

### F9.2: Project Settings
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Settings  
**Complexity**: Low  

**Description**:
Configuración por proyecto (resolución target, frame rate, etc.).

**Acceptance Criteria**:
- ✓ Diálogo accesible desde Properties
- ✓ Target resolution (720p, 1080p, 4K)
- ✓ Target FPS (24, 30, 60)
- ✓ Aspect ratio (16:9, 4:3, 1:1)

---

## 10. Accessibility & Internationalization

### F10.1: WCAG 2.1 AA Compliance
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Accessibility  
**Complexity**: Medium  

**Description**:
Conformidad con estándares de accesibilidad.

**Acceptance Criteria**:
- ✓ Contraste de color 4.5:1 (WCAG AA)
- ✓ ARIA labels en botones, inputs
- ✓ Navegación por teclado completa
- ✓ Screen reader compatible
- ✓ Focus visible en todos los elementos

---

### F10.2: Keyboard Navigation
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Accessibility  
**Complexity**: Medium  

**Description**:
Navegación completa usando solo teclado.

**Acceptance Criteria**:
- ✓ Tab entre elementos
- ✓ Enter/Space activa botones
- ✓ Arrow keys en menus
- ✓ Escape cierra dialogs
- ✓ Focus trap en modals

---

### F10.3: Internationalization (i18n)
**Priority**: 🟡 **SHOULD HAVE**  
**Category**: Internationalization  
**Complexity**: Medium  

**Description**:
Soporte multi-idioma desde v1.

**Idiomas v1.0**:
- English
- Español

**v1.5+**: Más idiomas (French, German, etc.)

**Acceptance Criteria**:
- ✓ JSON files: `/locales/en.json`, `/es.json`
- ✓ i18n library (react-i18next)
- ✓ Selector de idioma en Settings
- ✓ Persistencia de idioma elegido

---

## 📊 Feature Summary Table

| ID | Feature | Priority | Complexity | Status | v1.0 |
|----|---------| ---------|-----------|--------|------|
| F1.1 | Import Media | MUST | Medium | Planned | ✓ |
| F1.2 | Media Library | SHOULD | Low | Planned | ✓ |
| F1.3 | Validation | MUST | Medium | Planned | ✓ |
| F2.1 | New Project | MUST | Low | Planned | ✓ |
| F2.2 | Save Project | MUST | Medium | Planned | ✓ |
| F2.3 | Load Project | MUST | Medium | Planned | ✓ |
| F2.4 | Export JSON | SHOULD | Low | Planned | ✓ |
| F2.5 | Import JSON | SHOULD | Low | Planned | ✓ |
| F2.6 | Metadata Editor | SHOULD | Low | Planned | ✓ |
| F3.1 | Storyboard View | MUST | High | Planned | ✓ |
| F3.2 | Drag & Drop | MUST | High | Planned | ✓ |
| F3.3 | Clip Selection | MUST | Medium | Planned | ✓ |
| F3.4 | Duration Editor | MUST | Medium | Planned | ✓ |
| F3.5 | Bulk Operations | SHOULD | Medium | Planned | ✓ |
| F4.1 | Player/Preview | MUST | High | Planned | ✓ |
| F4.2 | Controls | MUST | Medium | Planned | ✓ |
| F4.3 | Timeline Scrub | MUST | Medium | Planned | ✓ |
| F4.4 | Live Preview | MUST | Medium | Planned | ✓ |
| F5.1 | Transition Selector | MUST | High | Planned | ✓ |
| F5.2 | Duration Editor | MUST | Medium | Planned | ✓ |
| F5.3 | Preview | MUST | High | Planned | ✓ |
| F5.4 | Batch Apply | SHOULD | Medium | Planned | ✓ |
| F6.1 | Grayscale | MUST | Low | Planned | ✓ |
| F6.2 | Sepia | MUST | Low | Planned | ✓ |
| F6.3 | Brightness | MUST | Low | Planned | ✓ |
| F6.4 | Pixelate | MUST | Medium | Planned | ✓ |
| F6.5 | Effect Stacking | SHOULD | High | Planned | ✓ |
| F6.6 | Presets | SHOULD | Medium | Planned | ✓ |
| F7.1 | Text Insertion | MUST | High | Planned | ✓ |
| F7.2 | Text Editor | MUST | Medium | Planned | ✓ |
| F7.3 | Duration & Position | MUST | Medium | Planned | ✓ |
| F7.4 | Text Animation | SHOULD | Medium | Planned | ✓ |
| F7.5 | Subtitles | SHOULD | Medium | Planned | ✓ |
| F8.1 | Ribbon Menu | MUST | Medium | Planned | ✓ |
| F8.2 | Properties Panel | MUST | Medium | Planned | ✓ |
| F8.3 | Notifications | SHOULD | Low | Planned | ✓ |
| F8.4 | Responsive | MUST | Medium | Planned | ✓ |
| F8.5 | Shortcuts | SHOULD | Medium | Planned | ✓ |
| F8.6 | Undo/Redo | SHOULD | High | Planned | ✓ |
| F9.1 | App Settings | SHOULD | Low | Planned | ✓ |
| F9.2 | Project Settings | SHOULD | Low | Planned | ✓ |
| F10.1 | WCAG A.A | SHOULD | Medium | Planned | ✓ |
| F10.2 | Keyboard Nav | SHOULD | Medium | Planned | ✓ |
| F10.3 | i18n | SHOULD | Medium | Planned | ✓ |

---

## 📈 Dependencies & Implementation Order Hints

**Foundation (RFC-001-003)**:
- Project infrastructure
- Component architecture
- Styling system

**Core (RFC-004-006)**:
- Media import
- Storyboard
- Player/Preview

**Enhancement (RFC-007-009)**:
- Transitions
- Effects
- Text layers

**Polish (RFC-010+)**:
- Settings
- Accessibility
- i18n

---

## ✅ Conclusion

**25 features totales**, organizadas por:
- **Must-Have**: 17 (funcionalidad core)
- **Should-Have**: 8 (mejora UX/robustez)
- **Could-Have**: 6 (futuros, v1.5+)

**v1.0 Scope**: 25 features completos con calidad MVP

**Próximo paso**: Crear RULES.md para estándares técnicos

