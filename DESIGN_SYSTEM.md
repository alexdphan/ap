# Design System

> **Philosophy**: Limit font sizes to 2-3 maximum. Use only a few grays. Add color sparingly. Keep layout clean and centered.

This design system follows radical minimalism — stripping away unnecessary complexity to create a clean, elegant, and consistent experience across all pages.

**Inspired by**: Clean, centered layouts like [leerob.com](https://leerob.com) — minimal navigation, content-first design.

---

## Typography

### Font Philosophy

**Default Font**: Lora (serif) — body text uses beautiful serif typography by default  
**Accent Font**: Playfair Display (serif, italic) — for headings and emphasis

### Font Sizes (3 Maximum)

We use **exactly 3 font sizes** throughout the entire application — no more, no less:

#### 1. Heading
```tsx
className="text-heading"
// 1.5rem (24px)
// Font: Playfair Display
// Weight: 500
// Line height: 1.3
// Letter spacing: -0.01em
```

**Usage**: Page titles, section headings, pull quotes

**Example**:
```tsx
<h1 className="text-heading" style={{ color: 'var(--gray-900)' }}>
  Work
</h1>
```

#### 2. Body
```tsx
className="text-body"
// 0.9375rem (15px)
// Font: Lora
// Weight: 400
// Line height: 1.65
// Letter spacing: 0
```

**Usage**: Primary content, links, section labels

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
// Font: Lora
// Weight: 400
// Line height: 1.5
// Letter spacing: 0
```

**Usage**: Metadata, artist names, timestamps, small labels, secondary information

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

**Examples**:
```tsx
// Heading
<h1 className="text-heading" style={{ color: 'var(--gray-900)' }}>Bio</h1>

// Body text
<p className="text-body" style={{ color: 'var(--gray-700)' }}>
  Main content goes here
</p>

// Label/metadata
<p className="text-body" style={{ color: 'var(--gray-400)' }}>
  Introduction
</p>

// Border
<div className="h-px w-full" style={{ backgroundColor: 'var(--gray-100)' }} />
```

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

**Why**: Underlined text in the same color as body text is more elegant and less distracting than bright orange links. Hover reduces opacity for feedback.

---

## Layout Structure

### Box Model Layout (Contained & Structured)

**Every page uses a proper CSS box model structure** — margin, border, padding, content.

```tsx
// Desktop: Box model with generous padding
<div className="museum-grid-bg hidden md:flex min-h-screen items-center justify-center 
     overflow-y-auto overflow-x-hidden p-8">
  <div className="w-full max-w-6xl bg-white/50 backdrop-blur-sm p-16 my-8" 
       style={{ border: '1px solid var(--gray-100)' }}>
    {children}
  </div>
</div>

// Mobile: Same box model, smaller padding
<div className="museum-grid-bg md:hidden min-h-screen overflow-y-auto overflow-x-hidden p-4">
  <div className="bg-white/50 backdrop-blur-sm p-8 my-4" 
       style={{ border: '1px solid var(--gray-100)' }}>
    {children}
  </div>
</div>
```

**Box Model Layers:**
1. **Margin** — `p-8` (32px) viewport padding on desktop, `p-4` on mobile
2. **Border** — `1px solid var(--gray-100)` subtle frame
3. **Padding** — `p-16` (64px) on desktop, `p-8` (32px) on mobile
4. **Content** — `max-w-6xl` (1152px) for generous space

**Key Principles:**
- **Structured containment** — visible box model with border
- **Generous padding** — 64px on desktop creates breathing room
- **Subtle background** — `bg-white/50 backdrop-blur-sm` for soft depth
- **Centered & responsive** — adapts to screen size
- **No horizontal scroll** — always `overflow-x-hidden`

### Navigation Pattern

**Two-way navigation system:**

1. **Home Page → Other Pages**: Navigation embedded in copy with underlined links
2. **Other Pages → Home**: Click page title to return home

**Page Title as Home Button:**

```tsx
<Link href="/" className="inline-block hover:opacity-70 transition-opacity">
  <h1 className="text-heading" style={{ color: 'var(--gray-900)' }}>
    Work
  </h1>
</Link>
```

**Home Page Navigation:**

```tsx
<p className="text-body" style={{ color: 'var(--gray-700)' }}>
  I'm currently pursuing{" "}
  <Link
    href="/work"
    className="text-body hover:opacity-70 transition-opacity underline"
    style={{ color: 'var(--gray-700)' }}
  >
    work
  </Link>{" "}
  in the fintech space. Read more{" "}
  <Link
    href="/now"
    className="text-body hover:opacity-70 transition-opacity underline"
    style={{ color: 'var(--gray-700)' }}
  >
    about what I'm doing now
  </Link>, or check out my{" "}
  <Link
    href="/inspiration"
    className="text-body hover:opacity-70 transition-opacity underline"
    style={{ color: 'var(--gray-700)' }}
  >
    inspiration
  </Link>{" "}
  and{" "}
  <Link
    href="/investments"
    className="text-body hover:opacity-70 transition-opacity underline"
    style={{ color: 'var(--gray-700)' }}
  >
    investments
  </Link>.
</p>
```

**Why this works:**
- **Intuitive**: Page titles naturally feel clickable
- **Minimal**: No back buttons or navigation chrome
- **Consistent**: Works the same on every page
- **Discoverable**: Hover shows it's interactive
- **Mobile nav available**: Still accessible via bottom nav on mobile

### Page Structure

All pages follow this consistent pattern:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  className="w-full"
>
  {/* Header */}
  <div className="mb-6">
    <h1 className="text-heading" style={{ color: 'var(--gray-900)' }}>
      Page Title
    </h1>
    <div className="h-px w-full mt-2" style={{ backgroundColor: 'var(--gray-100)' }} />
  </div>

  {/* Content */}
  <div className="space-y-6">
    {/* Content sections */}
  </div>

  {/* Page Number */}
  <div className="mt-6 flex justify-between items-center">
    <div className="h-px flex-1" style={{ backgroundColor: 'var(--gray-100)' }} />
    <div className="px-4">
      <p className="text-body" style={{ color: 'var(--gray-400)' }}>01</p>
    </div>
    <div className="h-px flex-1" style={{ backgroundColor: 'var(--gray-100)' }} />
  </div>
</motion.div>
```

---

## Spacing System

### Vertical Rhythm

**Compact spacing** for content-heavy pages to enable smooth scrolling:

```tsx
mb-6   // Primary section header spacing
mb-3   // Label to content spacing
mb-2   // Heading to border spacing
mt-2   // Border below heading
mt-6   // Footer/page number spacing

space-y-6  // Main content sections
space-y-4  // Subsections
space-y-2  // Tight grouped content
```

**Note**: Use compact spacing (6, 4, 2) to fit more content and enable scrolling rather than overflow.

### Horizontal Elements

```tsx
gap-8   // Column gaps (desktop)
gap-6   // Standard gaps
gap-4   // Tight gaps
px-4    // Horizontal padding
```

### Media Sizing

**Video Aspect Ratios** (responsive, no black bars):

```tsx
aspect-[4/3]    // NYC/SF videos (now page) - more square
aspect-video    // Project videos (work page) - standard 16:9
bg-black        // Background color for letterboxing
```

**Video Embed** (no zoom):
```tsx
<iframe
  className="absolute pointer-events-none w-full h-full"
  style={{ 
    border: 0,
    top: '0',
    left: '0'
  }}
/>
```

**Note**: Use aspect ratios (not fixed heights) for responsive sizing. Videos display at 100% (no zoom) to avoid cropping.

---

## Component Patterns

### Section with Label

```tsx
<div>
  <p className="text-body mb-3" style={{ color: 'var(--gray-400)' }}>
    Section Label
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

### Pull Quote

```tsx
<div className="py-4" style={{ 
  borderTop: '1px solid var(--gray-100)', 
  borderBottom: '1px solid var(--gray-100)' 
}}>
  <p className="text-heading text-center" style={{ color: 'var(--gray-700)' }}>
    "Quote text here"
  </p>
</div>
```

### Music Player Text Pattern

```tsx
{/* Song title */}
<p className="text-body" style={{ color: 'var(--gray-900)' }}>
  Song Title
</p>

{/* Artist name - use caption for smaller text */}
<p className="text-caption" style={{ color: 'var(--gray-400)' }}>
  Artist Name
</p>
```

---

## Best Practices

### ✅ DO

- Use `.text-heading` for page titles
- Use `.text-body` for main content
- Use `.text-caption` for metadata, artist names, timestamps
- Keep labels in `--gray-400`
- Keep body text in `--gray-700`
- Keep headings in `--gray-900`
- Use consistent spacing (compact: `mb-6`, `space-y-6`, etc.)
- Make links `underline` in `--gray-700` with `hover:opacity-70`
- Use box model layout with border, padding, and contained content
- Apply generous padding: `p-16` (64px) on desktop, `p-8` (32px) on mobile
- Use mobile nav for quick access across pages

### ❌ DON'T

- Create new font sizes (limit to 3 maximum)
- Add inline font-size overrides
- Use bright accent colors like orange (keep it minimal)
- Override fonts with sans-serif (serif is intentional)
- Add uppercase/text-transform (let content speak naturally)
- Create page-specific padding variations
- Add sidebars or navigation chrome
- Position decorative elements too far outside container
- Allow horizontal scrolling (always use `overflow-x-hidden`)

---

## Migration Notes

### Deprecated Classes

The following are redirected to `.text-body` for backwards compatibility:

```css
.text-heading-lg  /* Use .text-heading instead */
.text-heading-md  /* Use .text-heading instead */
.text-label       /* Use .text-body with --gray-400 */
```

### Converting Existing Code

**Before**:
```tsx
<h2 className="text-label mb-4" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
  SECTION TITLE
</h2>
<p className="text-body" style={{ color: 'var(--gray-700)', fontSize: '0.85rem' }}>
  Content
</p>
```

**After**:
```tsx
<p className="text-body mb-3" style={{ color: 'var(--gray-400)' }}>
  Section Title
</p>
<p className="text-body" style={{ color: 'var(--gray-700)' }}>
  Content
</p>
```

---

## Quick Reference

```tsx
// Page Structure
className="w-full"                    // Page container
className="mb-8"                      // Section spacing

// Typography (3 sizes maximum)
className="text-heading"              // Page titles (24px)
className="text-body"                 // Main content (15px)
className="text-caption"              // Metadata, small text (13px)

// Colors (4 grays only, no bright accents)
style={{ color: 'var(--gray-900)' }} // Headings
style={{ color: 'var(--gray-700)' }} // Body text, links
style={{ color: 'var(--gray-400)' }} // Labels/metadata
style={{ backgroundColor: 'var(--gray-100)' }} // Borders

// Links (subtle underline, no color change)
className="underline hover:opacity-70"
style={{ color: 'var(--gray-700)' }}

// Spacing (Compact for scrollable content)
mb-6   // Primary sections
mb-3   // Label to content
mb-2   // Small gaps
mt-2   // After heading
mt-6   // Footer spacing
space-y-6  // Main sections
space-y-4  // Subsections
space-y-2  // Grouped content
```

---

## Sticker Components

**Reusable animated stickers** in `/components/stickers/` — all are draggable, clickable, and float:

### Available Stickers

```tsx
import { 
  CityOfDreamsSticker,
  StarburstSticker, 
  TicketSticker,
  PaperNoteSticker 
} from "@/components/stickers";

// City of Dreams - Orange badge
<CityOfDreamsSticker isVisible={isLoaded} />

// Starburst - Red/gold comic book style
<StarburstSticker text="Find Rho in action!" isVisible={isLoaded} />

// Ticket - Pink travel ticket
<TicketSticker from="NYC" to="SF" distance="2,906 mi" duration="6 hrs" isVisible={isLoaded} />

// Paper Note - Vintage paper note
<PaperNoteSticker text="Director and Series B Launch" isVisible={isLoaded} />
```

**Features:**
- ✨ **Floating animation** — slow vertical/rotational movement
- 🖱️ **Draggable** — users can drag them around (constrained)
- 👆 **Interactive** — hover effects, cursor feedback
- 🎨 **Customizable** — pass custom className for positioning

---

## Examples

See implemented examples in:
- `/app/page.tsx` - Home page layout
- `/app/bio/page.tsx` - Simple content page
- `/app/work/page.tsx` - Complex multi-section page with stickers
- `/app/now/page.tsx` - Grid layout with media and stickers
- `/components/FloatingMusicPlayer.tsx` - Interactive component with typography
- `/components/MiniMusicPlayer.tsx` - Compact header component
- `/components/stickers/` - Reusable animated sticker components

---

**Last Updated**: November 2024  
**Version**: 1.0

