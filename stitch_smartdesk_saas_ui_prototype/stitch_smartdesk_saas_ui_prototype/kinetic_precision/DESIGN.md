---
name: Kinetic Precision
colors:
  surface: '#fff8f6'
  surface-dim: '#f3d3cb'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ed'
  surface-container: '#ffe9e4'
  surface-container-high: '#ffe2db'
  surface-container-highest: '#fcdbd4'
  on-surface: '#281713'
  on-surface-variant: '#5d4039'
  inverse-surface: '#402c27'
  inverse-on-surface: '#ffede9'
  outline: '#926f67'
  outline-variant: '#e7bdb4'
  surface-tint: '#b52700'
  primary: '#b02600'
  on-primary: '#ffffff'
  primary-container: '#dd3200'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a2'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#005cac'
  on-tertiary: '#ffffff'
  tertiary-container: '#0075d7'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3d0700'
  on-primary-fixed-variant: '#8a1c00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d5e3ff'
  tertiary-fixed-dim: '#a6c8ff'
  on-tertiary-fixed: '#001c3b'
  on-tertiary-fixed-variant: '#004787'
  background: '#fff8f6'
  on-background: '#281713'
  surface-variant: '#fcdbd4'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono:
    fontFamily: JetBrains Mono, monospace
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  container-max: 1440px
---

## Brand & Style

The visual identity of this design system centers on the intersection of high-velocity automation and professional reliability. It is designed to evoke a sense of "calm productivity"—where the interface recedes to highlight user tasks, yet remains energetic through the strategic use of an intense primary accent.

The style is **Modern Corporate Minimalism**. It borrows the structural rigor of engineering tools like Linear and the spatial clarity of Notion. The aesthetic prioritizes legibility and functional density, ensuring that multi-tenant environments feel private, organized, and scalable. Every element serves a purpose; decorative flourishes are replaced by purposeful whitespace and systematic alignment.

## Colors

The palette is anchored by "Intense Orange," used sparingly for primary actions, notifications, and critical brand touchpoints to maintain high visual impact without fatigue. 

*   **Primary:** #F53D0A provides a high-energy focal point.
*   **Surface Hierarchy:** Pure White (#FFFFFF) is reserved strictly for cards and interactive containers to "pop" against the Very Light Gray (#F9FAFB) application background.
*   **Typography:** Dark Gray (#111827) provides optimal contrast for long-form ticket reading.
*   **Semantic Colors:** Statuses follow a standard traffic-light system but use slightly desaturated background tints for badges to keep the UI professional and accessible.

## Typography

This design system utilizes **Inter** for all UI elements to ensure maximum legibility across various screen densities. The typographic scale is built on a tight 4px baseline grid.

**Hierarchy Strategy:**
- **Headlines:** Use tighter letter-spacing and heavier weights to anchor pages.
- **Body:** The default size is 14px for density, with 16px reserved for focused reading (e.g., ticket descriptions).
- **Metadata:** Captions and labels use 12px or 13px to differentiate secondary information.
- **Monospace:** A secondary monospace font is recommended for Ticket IDs and automated logs to signify technical data.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a 12-column system. It is designed to adapt from expansive monitor views to condensed laptop displays without losing information density.

- **Standard Margin:** 24px on desktop; 16px on mobile.
- **Gutter:** 24px fixed gutter between primary grid columns to ensure clean separation of data.
- **Spacing Rhythm:** All margins and paddings must be multiples of 4px. Use 16px (md) for standard internal padding within cards and 8px (sm) for grouping related small elements like labels and inputs.

## Elevation & Depth

Depth in this system is communicated through **Tonal Layers** supplemented by **Ambient Shadows**. This creates a clear hierarchy where the background is the lowest point, and interactive content "floats" above it.

- **Level 0 (Background):** Very Light Gray (#F9FAFB). No shadow.
- **Level 1 (Cards/Sidebar):** White surface. Shadow: `0px 1px 3px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.1)`. This provides a sharp, paper-like lift.
- **Level 2 (Dropdowns/Modals):** White surface. Shadow: `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)`.
- **Level 3 (Tooltips):** Dark Gray surface (#111827). No shadow; high contrast provides the depth.

## Shapes

The shape language is **Rounded**, reflecting a modern and approachable corporate identity. 

- **Components:** Standard buttons, input fields, and checkboxes use a `0.5rem` (8px) radius.
- **Containers:** Large cards and modals use a `rounded-lg` (16px) or `rounded-xl` (24px) radius to soften the layout and emphasize the "white card" aesthetic.
- **Small Elements:** Badges and tags use a pill-shape (full rounding) to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid Intense Orange (#F53D0A) with white text. High-contrast, bold.
- **Secondary:** White background with a subtle gray border (#E5E7EB) and dark gray text.
- **Ghost:** No background or border. Intense Orange text for actions, Dark Gray for navigation.

### Cards
Cards are the primary container for tickets. They feature a 1px border (#F3F4F6), a White background, and the Level 1 Ambient Shadow. Headers within cards should be separated by a subtle horizontal rule.

### Input Fields
Inputs use a White background with a 1px Light Gray border. On focus, the border transitions to Intense Orange with a subtle 2px outer glow of the same color at 10% opacity.

### Status Badges
Badges use a "Soft Fill" style:
- **Resolved:** Light Green background / Dark Green text.
- **Pending:** Light Yellow background / Brown text.
- **Critical:** Light Red background / Dark Red text.

### Navigation
Vertical sidebar following the Notion/Linear style. Use subtle gray hover states and an Intense Orange vertical "pill" indicator to show the active route.