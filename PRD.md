# Product Requirements Document (PRD)
## Movie Maker 2025 — Web-Based Video Editing SPA

---

## 📋 Executive Summary

**Movie Maker 2025** es una aplicación web de edición de vídeo moderna que reimagina la experiencia icónica del **Windows Movie Maker 2012**, pero en la era 2025. 

Combinamos la **nostalgia estética** del clásico (UI Aero, colores azules suaves, transiciones fluidas) con **tecnología web moderna** (React, Vite, Tailwind CSS) para crear un editor de vídeo web completamente funcional que sea:

- **Intuitivo**: Que "se sienta como Movie Maker 2012"
- **Fluido**: Respuesta inmediata a cada acción del usuario
- **Accesible**: Sin necesidad de instalación, completamente en el navegador
- **Extensible**: Arquitectura modular para futuras mejoras

---

## 🎯 Objetivos Principales

### Objetivo Funcional
Crear un SPA (Single Page Application) que permita a usuarios de cualquier nivel:
1. **Importar medios** locales (vídeo, imágenes, audio)
2. **Organizar** contenido en un timeline/storyboard
3. **Aplicar transiciones visuales** entre clips
4. **Añadir efectos y filtros** (grayscale, sepia, brillo, etc.)
5. **Insertar y editar textos** (títulos, captions, créditos)
6. **Visualizar preview en tiempo real** de la composición
7. **Exportar** el proyecto (estructura de datos para futuro renderizado)

### Objetivo de Experiencia (Vibe)
Revivir la **sensación táctil emocional** del Movie Maker 2012:
- Colores azules (#1E72BD), blancos (#E6F0FA) y grises (#F3F3F3)
- Transiciones suaves y sombras delicadas
- Interactividad inmediata con feedback visual
- Sensación de "fluidez" en cada clic y drag

### Objetivo de Arquitectura
Implementar una base **sólida, modular y escalable** para futuras características:
- Componentes React desacoplados
- Engine de timeline reutilizable
- Sistema de plugins para efectos/transiciones
- Preparación para renderizado en backend (FFmpeg, MediaEncoder)

---

## 📊 Scope

### ✅ Incluido en v1.0 (MVP)

#### Core Features
- **Media Import**: Carga de archivos locales (.mp4, .jpg, .png, .wav)
- **Storyboard/Timeline**: Visualización de clips con thumbnails
- **Drag & Drop**: Reordenamiento de clips en el timeline
- **Transiciones Básicas**: 
  - Corte (Cut)
  - Desvanecer (Fade)
  - Diapositiva (Slide)
  - Barrido (Wipe)
- **Efectos Visuales**:
  - Escala de grises (Grayscale)
  - Sepia
  - Brillo/Contraste
  - Pixelado
- **Capas de Texto**:
  - Títulos al inicio
  - Captions durante clips
  - Créditos al final
  - Edición en tiempo real
- **Player/Preview**: Reproductor con play/pause/stop y controles de timeline
- **Persistencia Local**: Guardado de proyectos en localStorage

#### UI/UX Components
- **Ribbon Menu**: Pestañas funcionales (Inicio, Animaciones, Efectos, Insertar)
- **Properties Panel**: Paneles contextuales para ajustar duración, efectos, texto
- **Storyboard View**: Vista de clips con miniaturas
- **Player View**: Reproductor centrado con controles
- **Timeline/Duration Editor**: Control de duración de cada elemento

### ❌ Excluido de v1.0 (Future Releases)

- Renderizado/exportación a archivo de vídeo (requiere backend + FFmpeg)
- Audio sincronizado (track de música, voice-over)
- Animaciones complejas (keyframes, interpolación)
- Efectos 3D o convolucionales (blur, glow, sombras dinámicas)
- Colaboración en tiempo real
- Autenticación de usuarios
- Almacenamiento en la nube
- Plantillas prediseñadas
- Subtítulos automáticos (ASR)

---

## 👥 Target Audience & User Personas

### Persona 1: **Nostálgico Creativo**
- **Edad**: 30-45 años
- **Perfil**: Persona que creció con Movie Maker 2012, quiere revivir esa experiencia
- **Necesidad**: Editar vídeos simples sin curva de aprendizaje
- **Dolor**: Herramientas modernas demasiado complejas (Premiere, DaVinci Resolve)
- **Uso**: Compilaciones personales, vídeos familiares, recuerdos nostálgicos

### Persona 2: **Creator Principiante**
- **Edad**: 18-30 años
- **Perfil**: Content creator en redes sociales, sin experiencia en edición
- **Necesidad**: Herramienta fácil, rápida, accesible desde el navegador
- **Dolor**: No quiere descargar software pesado
- **Uso**: TikTok, YouTube Shorts, vídeos para Instagram

### Persona 3: **Educador/Docente**
- **Edad**: 35-60 años
- **Perfil**: Profesor que desea integrar edición de vídeo en clase
- **Necesidad**: Herramienta simple, intuitiva, sin barreras técnicas
- **Dolor**: Estudiantes pierden tiempo en controles complicados
- **Uso**: Proyectos escolares, vídeos educativos, contenido didáctico

---

## 📋 Functional Requirements

### FR-1: Media Import
- El usuario puede seleccionar archivos locales (.mp4, .jpg, .png) mediante un diálogo de archivos
- Los archivos se cargan en memoria del navegador (hasta cierto límite)
- Se generan automáticamente **thumbnails** para visualización en storyboard
- **Validación**: Solo se aceptan formatos soportados

**User Story**: _"Como creator, quiero importar vídeos e imágenes para comenzar mi proyecto"_

### FR-2: Storyboard Organization
- El timeline muestra todos los clips/elementos en orden secuencial
- Cada elemento tiene **thumbnail, duración, tipo de media** visible
- Los clips pueden **reordenarse** mediante drag & drop
- **Delete**: Eliminar clips del storyboard

**User Story**: _"Como editor, quiero organizar mis clips en el orden deseado sin complicaciones"_

### FR-3: Playback & Preview
- Un **reproductor central** muestra la composición en tiempo real
- Controles: Play, Pause, Stop, Timeline scrubbing
- La reproducción **respeta transiciones y efectos** del clip actual
- **Preview en vivo** al cambiar parámetros

**User Story**: _"Como usuario, quiero ver cómo queda mi vídeo mientras lo edito"_

### FR-4: Transitions (Transiciones)
- Disponibles: Cut, Fade, Slide, Wipe
- Duración configurable (0.1 - 3.0 segundos)
- **Visual feedback**: El preview muestra la transición en tiempo real
- Se aplica al final de cada clip

**User Story**: _"Como nostálgico, quiero añadir transiciones suaves como en el Movie Maker antiguo"_

### FR-5: Visual Effects
- **Grayscale**: Conversión a escala de grises
- **Sepia**: Tonalidad sepia vintage
- **Brightness/Contrast**: Ajustables con sliders
- **Pixelate**: Efecto pixelado (configurable por tamaño de píxel)
- Cada efecto puede **combinarse** (filtros en cascada)

**User Story**: _"Como editor creativo, quiero aplicar efectos visuales para darle estilo a mis clips"_

### FR-6: Text Layers
- **Tipo de texto**: Título, Caption, Crédito
- **Propiedades editables**: Texto, tamaño, color, fuente, duración
- **Posicionamiento**: Arriba, centro, abajo (presets)
- **Animaciones de entrada**: Fade in, Zoom in (suave)

**User Story**: _"Como creator, quiero añadir títulos y captions sin necesidad de software externo"_

### FR-7: Project Persistence
- El usuario puede **guardar** su proyecto en localStorage
- Se almacena la estructura completa (clips, efectos, transiciones, textos)
- Opción de **cargar** proyecto anterior
- Opción de **limpiar** proyecto (new)

**User Story**: _"Como usuario, quiero guardar mi progreso para continuar después"_

---

## 🏗️ Non-Functional Requirements

### Performance
- **Carga inicial**: < 2 segundos
- **Interactividad**: Respuesta a acciones < 100ms
- **Preview smooth**: 30+ FPS durante reproducción
- **Eficiencia de memoria**: Manejo de hasta 100 clips simultáneamente

### Compatibility
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Resoluciones**: Desktop (1024px+), soporte responsive

### Accessibility
- **WCAG 2.1 AA**: Contraste suficiente, botones accesibles
- **Teclado**: Navegación completa por teclado
- **Screen readers**: Etiquetas ARIA en controles principales

### Security
- No se envía información a servidores externos (por ahora)
- Validación de tipos de archivo
- Límite de tamaño de archivos (~500MB por archivo)

### Scalability
- Arquitectura preparada para renderizado en backend
- Sistema modular de plugins para efectos/transiciones
- API clara para extensiones futuras

---

## 🎨 Aesthetic Guidelines (Vibe Direction)

### Color Palette
- **Primary Blue**: #1E72BD (confianza, nostalgia Windows)
- **Light Background**: #E6F0FA (limpieza, claridad)
- **Neutral Gray**: #F3F3F3 (profesionalismo)
- **Text Dark**: #2C3E50 (legibilidad)
- **Accent**: #27AE60 (confirmación, éxito)

### Typography
- **Font Family**: "Segoe UI", Arial, sans-serif
- **Headlines**: 18-24px, semi-bold
- **Body**: 14px, regular
- **Monospace** (si aplica): "Courier New"

### Visual Language
- **Sombras**: Suaves, `box-shadow: 0 2px 8px rgba(0,0,0,0.1)`
- **Bordes**: Radio sutilmente redondeado, 4-6px
- **Transiciones**: 300ms ease-in-out
- **Hover States**: Ligero cambio de color + scale 1.02

### Emotional Tone
- Nostalgia sin ser retro excesivo
- Moderno pero reconocible
- Suave, no agresivo
- Responsive y vivo

---

## 🔄 User Journeys

### Journey 1: Crear un Vídeo Simple
```
1. Usuario abre la aplicación (carga rápida, interface clara)
   ↓
2. Importa 3-5 vídeos/imágenes mediante el diálogo
   ↓
3. Arrastra los clips en el storyboard al orden deseado
   ↓
4. Añade transiciones suaves entre cada clip (Fade)
   ↓
5. Previsualizá el vídeo en el player
   ↓
6. Ajusta duración de transiciones si es necesario
   ↓
7. Guarda el proyecto
```

### Journey 2: Aplicar Efectos y Textos
```
1. Selecciona un clip del storyboard
   ↓
2. En el panel de propiedades, aplica un efecto (Sepia)
   ↓
3. Ajusta parámetros (intensidad, duración)
   ↓
4. Previsualizá en tiempo real
   ↓
5. Añade un título al inicio del proyecto (Título)
   ↓
6. Edita el texto y estilo
   ↓
7. Guarda cambios
```

### Journey 3: Reorder & Refine
```
1. Ve el preview y nota que el orden no es óptimo
   ↓
2. Arrastra clips para reordenarlos
   ↓
3. Elimina un clip innecesario
   ↓
4. Añade más transiciones entre nuevas posiciones
   ↓
5. Preview final
   ↓
6. Guarda versión final
```

---

## 📈 Success Metrics

### User Experience Metrics
1. **First Load Time**: < 2 segundos (target: 100% de usuarios)
2. **Interaction Latency**: < 100ms en respuesta a clicks/drags (target: 95%+)
3. **Preview Smoothness**: 30+ FPS durante reproducción (target: 98%+)

### Feature Adoption
1. **Media Import**: 100% de usuarios lo usan en primera sesión
2. **Storyboard Drag & Drop**: 80%+ de usuarios lo utilizan
3. **Transiciones**: 70%+ de proyectos tienen al menos una transición
4. **Efectos**: 60%+ de clips tienen al menos un efecto

### Retention
1. **Project Save Rate**: 85%+ de sesiones resultan en guardado
2. **Return Users**: 60%+ de usuarios regresan en 7 días
3. **Average Session Duration**: 15-30 minutos

### Satisfaction
1. **Ease of Use Score**: 8/10 (NPS-like, después de usar 5 minutos)
2. **Aesthetic Appeal**: 7.5/10 ("¿Se siente como Movie Maker 2012?")
3. **Feature Completeness**: 8.5/10 para MVP

---

## 📅 Implementation Timeline

### Phase 1: Foundation (Weeks 1-2)
- Setup proyecto (React + Vite + Tailwind)
- Componentes base (App, Layout, Ribbon Menu)
- Estilos y sistema de diseño

### Phase 2: Core Features (Weeks 3-4)
- Media import y thumbnail generation
- Storyboard y drag & drop
- Player/preview básico

### Phase 3: Enhancement (Weeks 5-6)
- Transiciones
- Efectos visuales
- Text layers

### Phase 4: Polish & Testing (Week 7)
- Performance optimization
- Compatibilidad navegadores
- Testing exhaustivo
- Documentación

### Phase 5: Launch (Week 8)
- Deployment
- Documentación de usuario
- Feedback loop

---

## ❓ Open Questions & Assumptions

### Assumptions
1. **Browser Storage**: Asumimos localStorage es suficiente para v1 (< 5-10 proyectos)
2. **No Video Export Rendering**: v1 solo guarda estructura, no renderiza vídeo final (future feature)
3. **Local Files Only**: No integramos servicios cloud en v1
4. **Desktop Focus**: Optimizamos primero para desktop, mobile es secundario

### Open Questions
1. ¿Queremos soportar audio (music/voice-over) en v1?
   - **Current**: No (para simplificar v1)
   
2. ¿Cuál es el límite de tamaño de proyecto (número de clips)?
   - **Current**: Objetivo 100+ clips sin degradación significativa
   
3. ¿Planeamos monetización (ads, premium features)?
   - **Current**: No incluido en v1, considerar para roadmap futuro

4. ¿Qué navegadores mínimos debemos soportar?
   - **Current**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)

---

## 📚 References & Related Documents

- `FEATURES.md` — Desglose detallado de features con MoSCoW prioritization
- `RULES.md` — Estándares técnicos, stack, convenciones
- `RFCS.md` — RFCs individuales con desglose de implementación
- `implementation-prompt-RFC-XXX.md` — Prompts específicos para cada RFC

---

## ✅ PRD Sign-off

- **Versión**: 1.0
- **Fecha**: 15 de octubre de 2025
- **Estado**: Draft → Ready for Verification
- **Próximo paso**: Verificación exhaustiva y validación de gaps

