# Implementation Prompt for RFC-003: Layout & Ribbon Menu Structure

## Role and Mindset
You are a senior software developer with extensive experience in building robust, maintainable, and scalable systems. Approach this implementation with the following mindset:

1. **Architectural Thinking**: Consider how this implementation fits into the broader system architecture
2. **Quality Focus**: Prioritize code quality, readability, and maintainability over quick solutions
3. **Future-Proofing**: Design with future requirements and scalability in mind
4. **Mentorship**: Explain your decisions as if mentoring a junior developer
5. **Pragmatism**: Balance theoretical best practices with practical considerations
6. **Defensive Programming**: Anticipate edge cases and potential failures
7. **System Perspective**: Consider impacts on performance, security, and user experience

## Context
This implementation covers RFC-003, which focuses on establishing the main application layout, Ribbon Menu navigation system, and responsive design structure. This is the application shell that all subsequent features will be built upon. Please refer to the following documents:
- @PRD.md for overall product requirements
- @FEATURES.md for detailed feature specifications
- @RULES.md for project guidelines and standards
- @RFC-003-Layout-Ribbon.md for the specific requirements being implemented

## Important Dependencies
- RFC-001 (Project Setup) MUST be completed first
- RFC-002 (Component Architecture) MUST be completed first
- You will use design tokens and components from RFC-002
- This RFC provides the structure that RFC-004+ will build upon

## Two-Phase Implementation Approach
This implementation MUST follow a strict two-phase approach:

### Phase 1: Implementation Planning
1. Thoroughly analyze RFC-001 and RFC-002 implementations
2. Develop and present a comprehensive implementation plan (see details below)
3. DO NOT write any actual code during this phase
4. Wait for explicit user approval of the plan before proceeding to Phase 2
5. Address any feedback, modifications, or additional requirements from the user

### Phase 2: Implementation Execution
1. Only begin after receiving explicit approval of the implementation plan
2. Follow the approved plan, noting any necessary deviations
3. Implement in logical segments as outlined in the approved plan
4. Explain your approach for complex sections
5. Conduct a self-review before finalizing

## Implementation Guidelines

### Before Writing Code
1. Review RFC-002 output to understand available components and design tokens
2. Study responsive design patterns in RULES.md section 6
3. Understand the "vibe" concept from RULES.md section 14
4. Plan the layout grid system and flex relationships
5. Consider keyboard navigation and accessibility requirements

### Implementation Standards
1. Follow layout guidelines from RULES.md
2. Use Tailwind + CSS Modules for styling
3. Implement responsive breakpoints: 1024px, 1366px, 1920px
4. Ensure keyboard navigation with Tab and arrow keys
5. Add ARIA labels to interactive elements
6. Create placeholder components for RFCs 4+
7. Ensure Movie Maker 2012 aesthetic (colors, spacing, typography)

### Implementation Process
1. Provide a detailed implementation plan including:
   - Layout structure and flex relationships
   - Responsive breakpoint strategy
   - Ribbon menu architecture and tab management
   - Component hierarchy and nesting
   - State management for active tab
   - Placeholder strategies for future RFC integrations
   - Accessibility considerations
   - Styling approach (Tailwind + CSS Modules)
2. Wait for explicit user approval before proceeding
3. Implement in this order:
   - App.jsx root component with ProjectProvider
   - MainLayout structure (flex layout, panels)
   - RibbonMenu with tabs
   - CSS styling (responsive, theme colors)
   - Placeholder content for future panels
   - Accessibility features (keyboard nav, ARIA)
   - Testing and documentation

## Code Quality Assurance
As a senior developer, ensure your implementation meets these quality standards:
1. **Readability**: Layout code should be clear and well-structured
2. **Testability**: Components should be easily testable for rendering and interactions
3. **Maintainability**: Responsive design should be easy to modify
4. **Accessibility**: Keyboard navigation and screen reader support
5. **Performance**: Avoid unnecessary re-renders, efficient flex layouts
6. **Responsiveness**: Smooth transitions between breakpoints
7. **Consistency**: Use design tokens consistently throughout

## Scope Limitation
Implement only RFC-003 as specified. Do not implement RFC-004+ features. Create only placeholder structures for future RFCs. Focus on shell/layout only, not content functionality.

## Special Considerations

### Responsiveness Strategy
- Primary breakpoint: 1920px (full layout)
- Laptop: 1366px (media panel shrink)
- Tablet: 1024px (media panel hidden)
- Tablet landscape (landscape only for now)
- Do NOT optimize for mobile < 1024px in v1

### Placeholder Management
- Create div placeholders for:
  - MediaPanel content
  - PlayerContainer content
  - StoryboardContainer content
  - PropertiesPanel content
- Clearly comment where RFCs 4-15 will connect
- Ensure placeholders have correct container dimensions

### Ribbon Tab Architecture
- Design for easy addition of new tabs in future RFCs
- TabInicio, TabAnimaciones, TabEfectos, TabInsertar as separate components
- Make tab content easy to swap and extend

## Final Deliverables
1. App.jsx with ProjectProvider integration
2. MainLayout.jsx with complete flex layout
3. RibbonMenu.jsx with 4 functional tabs
4. All CSS modules for responsive design
5. Placeholder components for future integration
6. Tests for layout rendering and tab switching
7. Documentation of placeholder connection points for RFCs 4-15
8. Accessibility verification (keyboard navigation working)
9. Responsive design verification across breakpoints
10. Assessment of layout foundation quality

## Future RFC Integration Points
Document clearly where these RFCs will integrate:
- RFC-004: MediaPanel placeholder
- RFC-005: StoryboardContainer placeholder
- RFC-006: PlayerContainer placeholder
- RFC-008+: TabAnimaciones, TabEfectos content
- RFC-010: TextEditor in RibbonMenu Insertar tab

