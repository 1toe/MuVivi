# RFC-014: UI Polish & Animations (Optional)
## Movie Maker 2025 — Visual Polish, Micro-interactions & Loading States

**Status**: Draft → Optional Enhancement  
**Phase**: 5 (Polish & UX)  
**Complexity**: Low  
**Estimated Duration**: 2 days  
**Dependencies**: RFC-001-013  

---

## 🎯 Overview

RFC-014 implementa **pulido visual**: loading states, skeleton screens, micro-animations, tooltips, y polish general de UX.

**Note**: Este RFC es **opcional** para MVP v1.0. Puede implementarse en v1.1+.

Al finalizar RFC-014:
- ✅ Loading states para operations async
- ✅ Skeleton screens para lazy-loading
- ✅ Tooltips en todos los buttons
- ✅ Micro-animations suaves
- ✅ Empty states mejorados

---

## 📋 Requirements

### R1: Loading States

**File**: `src/components/UI/LoadingSpinner.jsx`

```jsx
export function LoadingSpinner({ size = 'md', message }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
```

**CSS**:
```css
.spinner {
  border: 3px solid var(--color-bg-accent);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.sm { width: 20px; height: 20px; }
.spinner.md { width: 40px; height: 40px; }
.spinner.lg { width: 60px; height: 60px; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Acceptance Criteria**:
- ✅ Spinner renderiza
- ✅ 3 sizes disponibles
- ✅ Smooth animation

---

### R2: Tooltips

**File**: `src/components/UI/Tooltip.jsx`

```jsx
export function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          {content}
        </div>
      )}
    </div>
  );
}
```

**CSS**:
```css
.tooltipContainer {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.tooltip.top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

**Acceptance Criteria**:
- ✅ Tooltip aparece en hover
- ✅ Fade in animation
- ✅ 4 positions (top, bottom, left, right)

---

### R3: Skeleton Screens

**File**: `src/components/UI/Skeleton.jsx`

```jsx
export function Skeleton({ width, height, variant = 'rect' }) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]}`}
      style={{ width, height }}
    />
  );
}

export function MediaGridSkeleton() {
  return (
    <div className={styles.grid}>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} width="100%" height="120px" variant="rect" />
      ))}
    </div>
  );
}
```

**CSS**:
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 0%,
    var(--color-bg-accent) 50%,
    var(--color-bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton.rect { border-radius: var(--radius-sm); }
.skeleton.circle { border-radius: 50%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Acceptance Criteria**:
- ✅ Skeleton muestra durante loading
- ✅ Shimmer animation
- ✅ Variants (rect, circle)

---

### R4: Improved Empty States

**File**: `src/components/Shared/EmptyState.jsx`

```jsx
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
```

**CSS**:
```css
.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  text-align: center;
}

.icon {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  max-width: 400px;
}
```

**Acceptance Criteria**:
- ✅ Empty state renderiza
- ✅ Icon + title + description
- ✅ Optional action button

---

### R5: Micro-animations

**File**: `src/styles/animations.css` (update)

```css
/* Button hover scale */
.button {
  transition: transform 0.2s, box-shadow 0.2s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button:active {
  transform: translateY(0);
}

/* Clip drag feedback */
.clip.dragging {
  opacity: 0.6;
  transform: rotate(2deg);
}

/* Modal entrance */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal {
  animation: modalSlideIn 0.3s ease-out;
}

/* Notification slide in */
@keyframes notificationSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification {
  animation: notificationSlideIn 0.3s ease-out;
}
```

**Acceptance Criteria**:
- ✅ Buttons tienen hover animations
- ✅ Modals slide in
- ✅ Notifications slide in
- ✅ Drag feedback visual

---

## ✅ Acceptance Criteria

**RFC-014 is complete when:**

1. **Loading States**
   - ✅ Spinner component funcional
   - ✅ Used durante async operations

2. **Tooltips**
   - ✅ All buttons tienen tooltips
   - ✅ Fade in animation

3. **Skeleton Screens**
   - ✅ Skeleton durante media loading
   - ✅ Shimmer animation

4. **Empty States**
   - ✅ All empty states tienen icon + message
   - ✅ Visual consistency

5. **Micro-animations**
   - ✅ Smooth transitions
   - ✅ No jarring movements

---

**Versión**: 1.0  
**Status**: ✅ Optional for v1.0, Recommended for v1.1  
**Next RFC**: RFC-015 (Testing & QA)

