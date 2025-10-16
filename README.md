# 🎬 Movie Maker 2025

> A nostalgic, browser-based video editor inspired by Windows Movie Maker 2012

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/1toe/movie-maker-2025)
[![Progress](https://img.shields.io/badge/Progress-80%25-green)](./CHANGELOG.md)
[![RFCs](https://img.shields.io/badge/RFCs-12%2F15%20Complete-blue)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

---

## 🤖 AI-Powered Development Workflow

This project uses **AI-assisted development** with structured workflows and standards. Use these files with GitHub Copilot or any AI coding assistant:

### 📋 **Core Documentation Files**

#### 1. **`#file:RULES.md`** - Development Standards
Use this file to ensure **code consistency and vibe alignment**:

```
@copilot Use #file:RULES.md to implement the new feature following project standards
```

**What it contains:**
- ✅ Technology stack (React, Vite, Tailwind)
- ✅ Project structure and naming conventions
- ✅ Code standards (ES6+, React hooks best practices)
- ✅ Component architecture patterns
- ✅ Styling guidelines (design tokens, Tailwind config)
- ✅ Performance requirements
- ✅ **Vibe & emotional design** (nostalgic UI/UX)

**When to use:**
- Before implementing any new feature
- When creating new components
- To maintain consistent code style
- To preserve the "Windows Movie Maker 2012" aesthetic

---

#### 2. **`#file:workflow/`** - AI Automation Prompts
Structured prompts for common development tasks:

**Available Workflows:**

| File | Purpose | Usage |
|------|---------|-------|
| `interactive-prd-creation-prompt.md` | Create Product Requirements | Initial planning |
| `prd-to-features-prompt.md` | Break PRD into features | Feature planning |
| `prd-to-rfcs-prompt.md` | Generate technical RFCs | Implementation specs |
| `prd-to-rules-prompt.md` | Create coding standards | Team alignment |
| `implementation-prompt-template.md` | Implement features | Development |
| `prd-comprehensive-verification-prompt.md` | Validate PRD completeness | Quality check |
| `prd-change-management-prompt.md` | Track PRD changes | Documentation |

**Example Usage:**

```bash
# Generate RFCs from PRD
@copilot Use #file:workflow/prd-to-rfcs-prompt.md with #file:PRD.md to create implementation RFCs

# Implement a feature following standards
@copilot Use #file:workflow/implementation-prompt-template.md and #file:RULES.md to implement RFC-007 Transitions

# Verify project completeness
@copilot Use #file:workflow/prd-comprehensive-verification-prompt.md to audit #file:PRD.md
```

---

### 🎯 **Recommended AI Workflow**

#### Phase 1: Planning
```bash
1. Create PRD: #file:workflow/interactive-prd-creation-prompt.md
2. Generate Features: #file:workflow/prd-to-features-prompt.md
3. Generate RFCs: #file:workflow/prd-to-rfcs-prompt.md
4. Create Standards: #file:workflow/prd-to-rules-prompt.md
```

#### Phase 2: Implementation
```bash
5. For each RFC:
   @copilot Use #file:workflow/implementation-prompt-template.md 
           with #file:RULES.md 
           to implement RFC-XXX

6. Verify: #file:workflow/prd-comprehensive-verification-prompt.md
```

#### Phase 3: Maintenance
```bash
7. Track changes: #file:workflow/prd-change-management-prompt.md
8. Always reference #file:RULES.md for consistency
```

---

### 💡 **Pro Tips for AI-Assisted Development**

1. **Always attach RULES.md** when asking for code generation
2. **Reference RFCs** for detailed technical specifications
3. **Use CHANGELOG.md** to track implementation progress
4. **Combine multiple files** for context-aware responses:
   ```
   @copilot Review #file:RULES.md and #file:CHANGELOG.md 
           then implement the next pending RFC
   ```

5. **Maintain the vibe**: Always mention "Windows Movie Maker 2012 aesthetic" in prompts

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## 📋 What is Movie Maker 2025?

A modern web application that brings the simplicity and nostalgia of Windows Movie Maker 2012 to your browser. Edit videos, add transitions, effects, text overlays, and music—all client-side with no server required.

### ✨ Implemented Features (73% Complete)

#### ✅ Core Features (100% Complete)
- 🎥 **Media Import** - Drag & drop video, image, and audio files
- 📊 **Timeline/Storyboard** - Visual clip arrangement with drag & drop reordering
- ▶️ **Video Player** - Full playback controls with seek bar and volume
- 💾 **Auto-Save** - Automatic project persistence to localStorage
- ⌨️ **Keyboard Shortcuts** - 15+ productivity shortcuts (Space, Delete, Ctrl+Z, etc.)

#### ✅ Enhancement Features (100% Complete)
- ✨ **Transitions** - 8 transition types (fade, dissolve, wipe, slide)
- 🎨 **Visual Effects** - 8 effects (brightness, contrast, blur, sepia, grayscale, etc.)
- 📝 **Text & Titles** - 4 text templates with customizable content

#### ⏳ Coming Soon (27% Remaining)
- 🎵 **Background Music** - Audio track with volume control
- 🎬 **Export/Rendering** - WebM export with MediaRecorder API
- 🎨 **UI Polish** - Tooltips, loading states, error boundaries
- ✅ **Testing** - Unit and E2E tests

---

## �️ Technology Stack

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

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[MASTER-DOCS.md](./MASTER-DOCS.md)** | 📖 Complete development guide (start here) |
| **[CHANGELOG.md](./CHANGELOG.md)** | 📝 Development progress & version history |
| **[RULES.md](./RULES.md)** | 📏 Development standards & conventions |
| **[PRD.md](./PRD.md)** | 📋 Product Requirements Document |
| **[FEATURES.md](./FEATURES.md)** | ✨ Detailed feature specifications |
| **[RFCs/](./RFCs/)** | 🗺️ Technical RFCs (001-015) |

---

## 🗺️ Development Roadmap

| Phase | RFCs | Duration | Status |
|-------|------|----------|--------|
| **Phase 1: Foundation** | RFC-001 to 003 | 8 days | 🟡 30% Done |
| **Phase 2: Core Features** | RFC-004 to 006 | 17 days | ⏳ Not Started |
| **Phase 3: Enhanced Features** | RFC-007 to 009 | 14 days | ⏳ Not Started |
| **Phase 4: Advanced Features** | RFC-010 to 012 | 13 days | ⏳ Not Started |
| **Phase 5: Polish & QA** | RFC-013 to 015 | 7 days | ⏳ Not Started |

**Total:** 52 days (7.5 weeks) for MVP v1.0

See [CHANGELOG.md](./CHANGELOG.md) for detailed progress.

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

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run linter
npm run lint

# Format code
npm run format
```

**Coverage Target:** 70%+ overall

---

## 🚀 Deployment

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

Deploy to **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow [RULES.md](./RULES.md) standards
4. Write tests for new features
5. Commit changes (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

- **Project Owner** - 1toe
- **Development** - AI-assisted with GitHub Copilot
- **Architecture** - Structured workflow-driven development

---

## 📚 Quick Reference for Developers

### Essential Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **RULES.md** | Code standards & vibe guide | Every implementation |
| **CHANGELOG.md** | Implementation progress | Track what's done |
| **PRD.md** | Product requirements | Understand vision |
| **FEATURES.md** | Feature breakdown | Sprint planning |
| **RFCs/** | Technical specifications | Implementation details |
| **workflow/** | AI automation prompts | Structured development |

### Common AI Commands

```bash
# Start a new feature
@copilot Use #file:RULES.md to implement [feature name]

# Review progress
@copilot Check #file:CHANGELOG.md and suggest next steps

# Verify implementation
@copilot Compare #file:RFCs/RFC-XXX.md with current implementation

# Maintain vibe
@copilot Review #file:RULES.md section 14 (Vibe) before implementing UI
```

### Development Checklist

- [ ] Read relevant RFC in `RFCs/` folder
- [ ] Reference `RULES.md` for standards
- [ ] Update `CHANGELOG.md` after implementation
- [ ] Run tests: `npm test`
- [ ] Commit with descriptive message
- [ ] Update progress badge in README

---

## 📞 Support

- 📖 Check [CHANGELOG.md](./CHANGELOG.md) for implementation status
- 📋 Read [PRD.md](./PRD.md) for product vision
- 🐛 Report bugs via [GitHub Issues](https://github.com/1toe/movie-maker-2025/issues)
- 💬 Questions? Check relevant RFC in [RFCs/](./RFCs/) folder

---

## 🎨 Project Status

**Current Version:** 1.0-beta  
**Progress:** 80% Complete (12/15 RFCs)  
**Status:** � MVP Ready - Core features complete

**Next Steps:**
- ⏸️ RFC-011: Export & Rendering (deferred to v1.1)
- ⏸️ RFC-014: UI Polish (deferred to v1.1)
- ⏸️ RFC-015: Testing & QA (deferred to v1.1)

---

*Last Updated: October 16, 2025*

---

## 🌟 Star This Project

If you find this helpful, give it a ⭐ on [GitHub](https://github.com/1toe/movie-maker-2025)!
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


