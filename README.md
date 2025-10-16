# 🎬 MuVivi

> A nostalgic, browser-based video editor inspired by Windows Movie Maker 2012

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/1toe/movie-maker-2025)
[![Progress](https://img.shields.io/badge/Progress-80%25-green)](./CHANGELOG.md)
[![RFCs](https://img.shields.io/badge/RFCs-12%2F15%20Complete-blue)](./CHANGELOG.md)
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

## 🎯 Getting Started

### For Developers

1. Read [MASTER-DOCS.md](./MASTER-DOCS.md) - Complete development guide
2. Review [RULES.md](./RULES.md) - Coding standards
3. Choose an RFC from [RFCs/](./RFCs/) folder
4. Implement following the specification
5. Write tests (70%+ coverage target)
6. Submit PR

### For Project Managers

1. Review [PRD.md](./PRD.md) - Product requirements
2. Check [FEATURES.md](./FEATURES.md) - Feature list
3. Monitor [CHANGELOG.md](./CHANGELOG.md) - Progress tracking
4. Assign RFCs to team members

### For Designers

1. Review design system in [RULES.md](./RULES.md#6-styling--visual-design)
2. Check "vibe" section in [RULES.md](./RULES.md#14-vibe--emotional-design)
3. Create mockups following color palette (#1E72BD primary)
4. Ensure Windows Movie Maker 2012 aesthetic

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

**Last Updated**: October 15, 2025  

