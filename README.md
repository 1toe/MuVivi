# 🎬 Movie Maker 2025

A nostalgic web-based video editor inspired by **Windows Movie Maker 2012**, built with modern web technologies for the year 2025.

## ✨ Features

- 🎥 **Import Media** — Videos, images, and audio files
- 📺 **Live Preview** — Real-time video composition preview
- ✂️ **Transitions** — Cut, Fade, Slide, Wipe effects
- 🎨 **Visual Effects** — Grayscale, Sepia, Brightness, Pixelate
- 📝 **Text Layers** — Titles, captions, credits
- 💾 **Project Persistence** — Save/load projects locally
- 🎹 **Intuitive UI** — Ribbon menu, drag & drop timeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+
- npm 9.0+

### Installation

```bash
git clone https://github.com/1toe/movie-maker-2025.git
cd movie-maker-2025
npm install
```

### Development

```bash
npm run dev
# Opens http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📚 Documentation

- **[QUICK-START.md](QUICK-START.md)** — Navigation guide (start here!)
- **[PRD.md](PRD.md)** — Product Requirements Document
- **[FEATURES.md](FEATURES.md)** — Complete feature breakdown (43 features)
- **[RULES.md](RULES.md)** — Development standards & conventions
- **[RFCS.md](RFCS.md)** — Implementation roadmap (15 RFCs, 52 days)
- **[PROJECT-STATUS.md](PROJECT-STATUS.md)** — Project status & readiness

### For Developers

If you're implementing RFC-001:
1. Read [QUICK-START.md](QUICK-START.md)
2. Read [RFCs/RFC-001-Project-Setup.md](RFCs/RFC-001-Project-Setup.md)
3. Read [RFCs/implementation-prompt-RFC-001.md](RFCs/implementation-prompt-RFC-001.md)
4. Create implementation plan

## 🎨 Design System

### Colors (Movie Maker 2012 Aesthetic)
- **Primary Blue**: #1E72BD
- **Light Background**: #E6F0FA
- **Neutral Gray**: #F3F3F3

### Typography
- Font: Segoe UI, Arial, sans-serif

## 🛠️ Technology Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.5.0
- **Styling**: Tailwind CSS 3.3.0 + CSS Modules
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## 📊 Project Status

✅ **Phase 1 (Documentation)**: 100% Complete
- PRD, Features, Rules, RFCS.md created
- RFC-001, 002, 003 detailed & ready
- Implementation prompts prepared

🟡 **Phase 2 (Development)**: Ready to Start
- RFC-001: Project Setup (2-3 days)
- RFC-002: Component Architecture (3-4 days)
- RFC-003: Layout & Ribbon (2-3 days)
- RFC-004+: Core features (15 more RFCs)

**Estimated Timeline**: 52 days (7.5 weeks) for v1.0

## 🧪 Testing

```bash
npm test            # Run tests
npm test -- --ui    # With UI
npm test -- --coverage  # With coverage report
```

## 📋 Code Quality

```bash
npm run lint        # Check linting
npm run lint:fix    # Auto-fix
npm run format      # Format code with Prettier
```

## 🎯 MVP Scope (v1.0)

**25 Features**:
- 17 Must-Have (core functionality)
- 8 Should-Have (quality & UX)

**Core Features**:
- Media import & management
- Timeline/storyboard
- Real-time preview
- Transitions
- Visual effects
- Text layers
- Project save/load

## 🗺️ Roadmap

| Phase | RFCs | Features | Timeline |
|-------|------|----------|----------|
| Foundation | 001-003 | Setup, components, layout | Week 1-2 |
| Core | 004-007 | Media, storyboard, player, playback | Week 3-4 |
| Enhancement | 008-010 | Transitions, effects, text | Week 4.5-5.5 |
| Polish | 011-013 | Save/load, undo, settings | Week 6-7 |
| Quality | 014-015 | Testing, accessibility, performance | Week 7.5-8 |

## 💡 Philosophy

Movie Maker 2025 isn't just functional—it should **feel** like the original 2012 version:
- ✨ Smooth transitions (300ms ease-in-out)
- 🎨 Soft colors (blues, grays, whites)
- ⚡ Immediate feedback to every action
- 📖 Clear, intuitive workflows
- 🔄 Nostalgia + modernity

## 📝 License

MIT

## 👥 Contributing

See [workflow/](workflow/) for development workflow and AI prompts.

---

**Status**: ✅ Ready for Development  
**Last Updated**: October 15, 2025  
**Next Step**: Start RFC-001 implementation


