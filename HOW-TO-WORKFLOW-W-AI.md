## AI-Powered Development Workflow

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
- **Before implementing any new feature**
- When creating new components
- To maintain consistent code style
- To preserve the core aesthetic

---

#### 2. **`#file:workflow/`** - **AI Automation Prompts**
Structured prompts for common development tasks:

**Available Workflows:**

| File                                       | Purpose                     | Usage                |
| ------------------------------------------ | --------------------------- | -------------------- |
| `interactive-prd-creation-prompt.md`       | Create Product Requirements | Initial planning     |
| `prd-to-features-prompt.md`                | Break PRD into features     | Feature planning     |
| `prd-to-rfcs-prompt.md`                    | Generate technical RFCs     | Implementation specs |
| `prd-to-rules-prompt.md`                   | Create coding standards     | Team alignment       |
| `implementation-prompt-template.md`        | Implement features          | Development          |
| `prd-comprehensive-verification-prompt.md` | Validate PRD completeness   | Quality check        |
| `prd-change-management-prompt.md`          | Track PRD changes           | Documentation        |

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
