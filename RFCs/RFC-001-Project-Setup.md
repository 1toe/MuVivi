# RFC-001: Project Setup & Configuration
## Movie Maker 2025 — Foundation & Development Environment

**Status**: Draft → Ready for Implementation  
**Phase**: 1 (Foundation)  
**Complexity**: Low  
**Estimated Duration**: 2-3 days  
**Dependencies**: None  

---

## 🎯 Overview

RFC-001 establece la **infraestructura base** del proyecto: configuración de Vite, React, Tailwind CSS, herramientas de desarrollo (ESLint, Prettier), testing (Vitest), y CI/CD.

Al finalizar RFC-001:
- ✅ Proyecto Vite + React 18 funcional
- ✅ Stack tooling completamente configurado
- ✅ CI/CD pipeline básico en GitHub Actions
- ✅ Estructura de carpetas lista para desarrollo
- ✅ Entorno de desarrollo optimizado (HMR, hot reload)

---

## 📋 Requirements

### R1: Vite Project Setup
- [ ] Crear proyecto nuevo con `npm create vite@latest`
- [ ] Node 18.0+, npm 9.0+
- [ ] React 18.2.0+ como dependency
- [ ] package.json con scripts (dev, build, test, lint, format)
- [ ] vite.config.js configurado para SPA

**Technical Details**:
```bash
npm create vite@latest movie-maker-2025 -- --template react
cd movie-maker-2025
npm install
```

**vite.config.js**:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

---

### R2: Tailwind CSS Integration
- [ ] Instalar Tailwind CSS 3.3.0+
- [ ] Configurar tailwind.config.js con colores personalizados (theme)
- [ ] Agregar PostCSS 8.4.31+
- [ ] Crear postcss.config.js
- [ ] Importar Tailwind en index.css

**Installation**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js**:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1E72BD',
        'primary-dark': '#0F4C8B',
        'primary-light': '#4A9FD8',
        'accent': '#E6F0FA',
        'neutral-light': '#F3F3F3',
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Arial', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
```

**index.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #2C3E50;
  background-color: #FFFFFF;
}
```

---

### R3: React Directory Structure
- [ ] `src/` con estructura clara
- [ ] `src/components/`, `src/hooks/`, `src/utils/`, `src/context/`, `src/styles/`
- [ ] App.jsx como root component
- [ ] main.jsx como entry point
- [ ] public/ para assets estáticos

**Folder Structure** (creado al inicio):
```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── Layout/
│   ├── Editor/
│   ├── Panels/
│   ├── UI/
│   └── Shared/
├── hooks/
├── context/
├── utils/
├── styles/
├── types/
└── assets/
    ├── icons/
    ├── fonts/
    └── images/
```

---

### R4: Linting & Code Formatting
- [ ] ESLint 8.0+ configurado
- [ ] Prettier 3.0+ para auto-formatting
- [ ] .eslintrc.json con reglas React
- [ ] .prettierrc para consistencia
- [ ] Pre-commit hooks (opcional, Husky)

**Installation**:
```bash
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks prettier
npm install -D husky lint-staged
npx husky install
```

**.eslintrc.json**:
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "warn"
  }
}
```

**.prettierrc**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

### R5: Testing Setup (Vitest + React Testing Library)
- [ ] Vitest configurado como test runner
- [ ] React Testing Library 14.0+
- [ ] vitest.config.js
- [ ] Tests pueden correr con `npm test`
- [ ] Coverage reporting incluido

**Installation**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom
```

**vitest.config.js**:
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
})
```

**src/test/setup.js**:
```javascript
import '@testing-library/jest-dom'
```

**Example Test** (src/App.test.jsx):
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/Movie Maker/i)).toBeInTheDocument()
  })
})
```

---

### R6: Git & Version Control Setup
- [ ] .gitignore configurado
- [ ] Initial commit
- [ ] Remote origin (GitHub)
- [ ] Main branch protection ready

**.gitignore**:
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

---

### R7: GitHub Actions CI/CD (Básico)
- [ ] Workflow para build y test en cada push
- [ ] Deploy preview (Vercel o Netlify)
- [ ] Environment variables listos

**.github/workflows/ci.yml**:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

### R8: Environment Configuration
- [ ] .env.example con variables requeridas
- [ ] Variables para dev/test/production
- [ ] API endpoints (si aplica en futuro)

**.env.example**:
```
VITE_APP_NAME=Movie Maker 2025
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

---

### R9: Documentation Files
- [ ] README.md básico con instrucciones setup
- [ ] docs/ folder con ARCHITECTURE.md
- [ ] CONTRIBUTING.md

**README.md**:
```markdown
# Movie Maker 2025

A nostalgic web-based video editor inspired by Windows Movie Maker 2012.

## Quick Start

### Prerequisites
- Node.js 18.0+
- npm 9.0+

### Installation

\`\`\`bash
git clone https://github.com/1toe/movie-maker-2025.git
cd movie-maker-2025
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
# Opens http://localhost:3000
\`\`\`

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

### Testing

\`\`\`bash
npm test            # Run tests
npm test -- --ui    # With UI
npm test -- --coverage  # With coverage
\`\`\`

### Code Quality

\`\`\`bash
npm run lint        # Check linting
npm run lint:fix    # Auto-fix
npm run format      # Format code
\`\`\`

## Project Structure

See docs/ARCHITECTURE.md for detailed structure.

## Contributing

See CONTRIBUTING.md for guidelines.

## License

MIT
\`\`\`

**docs/ARCHITECTURE.md**:
```markdown
# Architecture Overview

## Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.5.0
- **Styling**: Tailwind CSS 3.3.0
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Folder Structure
- `/src/components` - React components
- `/src/hooks` - Custom React hooks
- `/src/context` - Context API setup
- `/src/utils` - Utility functions
- `/src/styles` - Global styles and theme
- `/public` - Static assets
- `/docs` - Project documentation

## Key Technologies

### Why Vite?
- ⚡ Instant HMR (Hot Module Replacement)
- 🚀 Lightning-fast builds
- 📦 Optimized production bundles

### Why Tailwind?
- 🎨 Rapid UI development
- 📐 Design system consistency
- 🔧 Easy customization

### Why Vitest?
- ⚡ Fast test execution
- 🔄 Native ES modules support
- 📊 Built-in coverage reporting
```

---

## 🏗️ Implementation Tasks

### Phase 1: Initial Setup (Day 1)
- [ ] Create Vite project
- [ ] Install React 18.2.0
- [ ] Install Tailwind CSS
- [ ] Configure ESLint + Prettier
- [ ] Basic folder structure created
- [ ] All scripts working (npm run dev, build, test, lint)

### Phase 2: Configuration & Tooling (Day 2)
- [ ] Vitest fully configured
- [ ] Example test passing
- [ ] GitHub Actions workflow set up
- [ ] .env and .gitignore configured
- [ ] Pre-commit hooks (optional)

### Phase 3: Documentation (Day 2-3)
- [ ] README.md complete
- [ ] ARCHITECTURE.md documented
- [ ] Initial commit to GitHub
- [ ] Verify CI/CD pipeline runs

---

## ✅ Acceptance Criteria

**RFC-001 is complete when:**

1. **Project Setup**
   - ✅ `npm install` instala todas las dependencias
   - ✅ `npm run dev` inicia servidor en localhost:3000
   - ✅ Hot reload funciona sin errores
   - ✅ `npm run build` crea bundle optimizado en `/dist`

2. **Code Quality**
   - ✅ `npm run lint` sin errores o warnings
   - ✅ `npm run format` formatea código correctamente
   - ✅ ESLint + Prettier en conflicto resuelto

3. **Testing**
   - ✅ `npm test` ejecuta sin errores
   - ✅ Example test pasa
   - ✅ Coverage reporting funciona

4. **CI/CD**
   - ✅ GitHub Actions workflow corre en cada push
   - ✅ Build exitoso en CI
   - ✅ Tests pasan en CI

5. **Documentation**
   - ✅ README.md con instrucciones claras
   - ✅ ARCHITECTURE.md documenta stack
   - ✅ Nuevo dev puede seguir README y tener setup funcionando

6. **Git**
   - ✅ Proyecto pusheado a GitHub
   - ✅ .gitignore configurado correctamente
   - ✅ Initial commit descriptivo

---

## 🚀 Next Steps After RFC-001

Una vez RFC-001 completo:
- RFC-002: Component Architecture & Design System comienza
- Todos los scripts están listos para desarrollo
- CI/CD pipeline monitorea calidad

---

## 📚 Key Files to Create

| Archivo | Propósito |
|---------|----------|
| package.json | Dependencias y scripts |
| vite.config.js | Configuración Vite |
| tailwind.config.js | Tema y extensiones Tailwind |
| postcss.config.js | Configuración PostCSS |
| vitest.config.js | Configuración Vitest |
| .eslintrc.json | Reglas ESLint |
| .prettierrc | Reglas Prettier |
| .gitignore | Git ignore patterns |
| .env.example | Variables de entorno |
| .github/workflows/ci.yml | CI/CD pipeline |
| README.md | Documentación usuario |
| docs/ARCHITECTURE.md | Arquitectura sistema |

---

## 🎨 Vibe Check

Aunque RFC-001 es infrastructure, sienta el tono:
- ✨ Setup rápido, sin frustración (DX first)
- 🚀 HMR inmediato → iteración rápida
- 📊 Documentación clara → onboarding suave
- 🛡️ Linting + Testing → confianza en código

---

## 📞 Questions & Clarifications

**Q: ¿Usar Vite o Create React App?**  
**A**: Vite por velocidad HMR y modernidad. CRA es más lento en dev.

**Q: ¿Prettier vs ESLint formatting?**  
**A**: Ambos. ESLint para quality, Prettier para format (conflictos resueltos en config).

**Q: ¿Pre-commit hooks (Husky)?**  
**A**: Opcional para v1. Añadir en v1.1 si workflow lo requiere.

**Q: ¿Qué Node version usar?**  
**A**: 18+ (LTS). CI tests en 18.x y 20.x.

---

**Versión**: 1.0  
**Fecha**: 15 de octubre de 2025  
**Status**: ✅ Ready for Development  

**Next RFC**: RFC-002 (Component Architecture & Design System)

