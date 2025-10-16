# 🎬 MuVivi

> A nostalgic, browser-based video editor inspired by Windows Movie Maker 2012

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/1toe/movie-maker-2025)
[![Progress](https://img.shields.io/badge/Progress-93%25-brightgreen)](./CHANGELOG.md)
[![RFCs](https://img.shields.io/badge/RFCs-14%2F15%20Complete-brightgreen)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

---

## 📋 What is MuVivi?

A modern web application that brings the simplicity and nostalgia of Windows Movie Maker 2012 to your browser. Edit videos, add transitions, effects, text overlays, and music—all client-side with no server required.

## ⚙️ Technology Stack

- **React 18.2** - UI framework
- **Vite 5.0** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Vitest** - Unit testing
- **HTML5 Canvas** - Video rendering
- **MediaRecorder API** - Video export

---

## 📁 Project Structure

```
movie-maker-2025/
├── src/
│   ├── components/     # React components (Layout, Editor, Panels, UI)
│   ├── context/        # State management (ProjectContext, MediaContext)
│   ├── hooks/          # Custom hooks (usePlayer, useProject, useUndo)
│   ├── utils/          # Utilities (renderEngine, fileValidation, etc.)
│   └── styles/         # CSS (theme, animations, reset)
├── RFCs/               # Technical specifications (001-015)
├── CHANGELOG.md        # Development progress
├── MASTER-DOCS.md      # Complete documentation guide
└── README.md           # You are here
```

---

### 💡 **AI-Assisted Development**

1. **Always attach RULES.md** when asking for code generation
2. **Reference RFCs** for detailed technical specifications
3. **Use CHANGELOG.md** to track implementation progress
4. **Combine multiple files** for context-aware responses:
   ```
   @copilot Review #file:RULES.md and #file:CHANGELOG.md 
           then implement the next pending RFC
   ```

5. **Maintain the vibe**: Always mention "Windows Movie Maker 2012 aesthetic" in prompts


## 👥 Team

- **Project Owner** - 1toe
- **Development** - AI-assisted with GitHub Copilot
- **Architecture** - Structured workflow-driven development

---

See [workflow/](workflow/) for development workflow and AI prompts.

---

**Last Updated**: October 16, 2025  

