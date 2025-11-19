# Design System

> **Philosophy**: Limit font sizes to 2-3 maximum. Use only a few grays. Add color sparingly. Keep layout clean, focused, and seamless.

This design system follows radical minimalism — stripping away unnecessary complexity to create a clean, elegant, and consistent experience.

**Inspired by**: Brutalist/Utilitarian web design — raw, honest, content-first.

---

## Typography

### Font Philosophy

**Default Font**: Inter (Sans-serif) — Clean, neutral, and legible.
**Accent Font**: Geist Mono (Monospace) — For captions, metadata, and technical details.

### Font Sizes (3 Maximum)

We use **exactly 3 font sizes** throughout the entire application:

#### 1. Heading
```tsx
className="text-heading"
// 1.25rem (20px)
// Font: Inter
// Weight: 500
// Line height: 1.3
// Letter spacing: -0.02em
```

**Usage**: Page titles, section headings.

**Example**:
```tsx
<h1 className="text-heading" style={{ color: 'var(--gray-900)' }}>
  Work
</h1>
```

#### 2. Body
```tsx
className="text-body"
// 1rem (16px)
// Font: Inter
// Weight: 400
// Line height: 1.6
// Letter spacing: -0.01em
```

**Usage**: Primary content, links, section labels.

**Example**:
```tsx
<p className="text-body" style={{ color: 'var(--gray-700)' }}>
  I'm currently pursuing work in the fintech space.
</p>
```

#### 3. Caption
```tsx
className="text-caption"
// 0.8125rem (13px)
// Font: Geist Mono
// Weight: 400
// Line height: 1.4
// Letter spacing: -0.01em
```

**Usage**: Metadata, timestamps, small labels, secondary information.

**Example**:
```tsx
<p className="text-caption" style={{ color: 'var(--gray-400)' }}>
  Kanye West
</p>
```

---

## Color Palette

### Grays (4 Total)

We use **exactly 4 grays** with specific purposes:

```css
--gray-900: #171717  /* Headings */
--gray-700: #404040  /* Body text */
--gray-400: #A3A3A3  /* Labels, metadata, secondary text */
--gray-100: #F5F5F5  /* Borders, dividers, subtle backgrounds */
```

#### Usage Guide

| Element | Color | Usage |
|---------|-------|-------|
| Page titles | `--gray-900` | Main headings |
| Body text | `--gray-700` | Primary reading content |
| Labels/metadata | `--gray-400` | Section labels, timestamps, categories |
| Borders | `--gray-100` | Dividers, underlines, separators |

### Accent Color - Minimal Approach

**No bright accent colors** — links use the same gray as body text with underline for subtle emphasis.

**Link Pattern**:
```tsx
<Link
  href="/work"
  className="text-body hover:opacity-70 transition-opacity underline"
  style={{ color: 'var(--gray-700)' }}
>
  work
</Link>
```

---

## Layout Structure

### Seamless Box Model

**Layout is seamless and blends with the background.** No visible cards or borders around the main content area.

```tsx
// Desktop: Seamless centered column
<div className="md:flex min-h-screen overflow-y-auto overflow-x-hidden justify-center"
     style={{ backgroundColor: "var(--bg-outer)" }}>
  <div className="w-full max-w-xl mx-auto px-6 py-12 md:py-20 relative z-0" 
       style={{ backgroundColor: "var(--bg-content)" }}>
    {children}
  </div>
</div>
```

**Key Principles:**
-   **Seamless**: Content background matches outer background.
-   **Focused Width**: `max-w-xl` (approx 576px) for optimal reading measure.
-   **Generous Vertical Space**: `py-20` on desktop.
-   **Nonchalant**: No decorative frames or shadows on the main container.

### Navigation Pattern

**Two-way navigation system:**

1.  **Home Page → Other Pages**: Navigation embedded in copy with underlined links
2.  **Other Pages → Home**: Click page title to return home

---

## Component Patterns

### Section with Label

```tsx
<div>
  <p className="text-caption mb-3" style={{ color: 'var(--gray-400)' }}>
    SECTION LABEL
  </p>
  <p className="text-body" style={{ color: 'var(--gray-700)' }}>
    Content text goes here.
  </p>
</div>
```

### Divider

```tsx
<div className="h-px w-16" style={{ backgroundColor: 'var(--gray-100)' }} />
```

---

## Best Practices

### ✅ DO

-   Use `.text-heading` for page titles (Inter)
-   Use `.text-body` for main content (Inter)
-   Use `.text-caption` for metadata (Geist Mono)
-   Keep labels in `--gray-400`
-   Keep body text in `--gray-700`
-   Use consistent vertical spacing
-   Make links `underline` in `--gray-700` with `hover:opacity-70`
-   Maintain a focused reading width (`max-w-xl`)

### ❌ DON'T

-   Add visible borders around the main content column
-   Use serif fonts (we've reverted to sans for neutral utility)
-   Use bright accent colors
-   Center align body text (keep it left-aligned for readability)

---

**Last Updated**: November 2025
**Version**: 2.3
