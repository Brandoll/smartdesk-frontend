---
name: Kinetic
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
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
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
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d5e3ff'
  tertiary-fixed-dim: '#a6c8ff'
  on-tertiary-fixed: '#001c3b'
  on-tertiary-fixed-variant: '#004787'
  background: '#fff8f6'
  on-background: '#281713'
  surface-variant: '#fcdbd4'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-page: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built for high-velocity workflows where clarity and speed are paramount. It targets a professional user base that values precision and a premium, tool-like aesthetic. The brand personality is authoritative yet unobtrusive, positioning the interface as a high-performance engine for productivity.

The visual style draws from **Minimalism** and **Corporate Modern** aesthetics, specifically influenced by contemporary engineering-led platforms. It utilizes a restrained palette and generous whitespace to reduce cognitive load. The goal is to create a "glass-box" feel—where the structure is invisible, and only the data and primary actions remain in focus.

## Colors

The color strategy centers on high-contrast functionalism. The primary **Intense Orange** is reserved strictly for call-to-actions, active states, and critical highlights, ensuring it remains an effective directional signal. 

Backgrounds utilize a layered approach: the base application layer is a cool, very light gray to provide a soft canvas, while the interactive and content layers (cards, modals) are pure white. This distinction creates immediate visual hierarchy without the need for heavy borders. Neutral tones are pulled from a slate palette to maintain a sophisticated, tech-forward atmosphere.

## Typography

This design system employs **Inter** for all functional UI elements, optimized for screen legibility. The typographic rhythm is characterized by tight tracking (letter-spacing) on larger headings to create a compact, "designed" look reminiscent of modern editorial layouts.

Hierarchy is established through weight rather than just size. Headlines use semi-bold and bold weights with negative letter-spacing, while body text remains neutral for maximum readability. A secondary monospaced font is introduced for data-heavy displays, IDs, and technical values to reinforce the professional SaaS utility.

## Layout & Spacing

The layout follows a **fluid grid** model within a maximum container width of 1440px. The underlying spacing logic is built on a 4px baseline grid, ensuring all components align with mathematical rigor. 

Layouts should favor a "Sidebar + Main Stage" architecture. Gutters are kept generous (24px) to allow the content to breathe, while vertical stacking uses a scale of 8px, 16px, and 32px to group related information. The use of whitespace is intentional; it is treated as a structural element that separates different functional zones without the need for visual noise like lines or fills.

## Elevation & Depth

Depth is conveyed through **tonal layers** and **ambient shadows**. Instead of heavy shadows, the design system utilizes "micro-elevations"—very soft, highly diffused shadows with a low opacity (4-6%). 

- **Level 0 (Base):** Very light gray background (#F8FAFC).
- **Level 1 (Card):** Pure white surface with a 1px subtle border (#E2E8F0) and a soft ambient shadow.
- **Level 2 (Overlay/Menu):** Pure white surface with a more pronounced shadow and a slightly darker border to define edges against cards.

Backdrop blurs (12px-20px) are applied to sticky navigation bars and modals to maintain context of the underlying data while bringing the focus forward.

## Shapes

The shape language is defined by a **rounded-xl** philosophy. This soft rounding (ranging from 12px to 24px) counteracts the "cold" feeling of data-heavy interfaces, making the product feel modern and approachable.

- **Small elements (Buttons, Inputs):** 8px (rounded-lg)
- **Medium elements (Cards, Modals):** 12px (rounded-xl)
- **Large containers (Sections, Sidebars):** 16px to 24px

Interactive elements like checkboxes use a slightly smaller radius (4px) to maintain their functional identity, while primary action buttons use the standard 8px radius to feel substantial and tactile.

## Components

### Buttons
Primary buttons use the intense orange (#F53D0A) with white text. Secondary buttons are white with a subtle border and slate text. Tertiary buttons are ghost-style, appearing only on hover to keep the UI clean.

### Cards
Cards are the primary container. They must be pure white with a 12px corner radius and a 1px border (#E2E8F0). Avoid inner padding less than 24px to maintain the premium feel.

### Input Fields
Inputs feature a 1px border that shifts to the primary orange on focus. Labels should be small, medium-weight slate text, positioned 8px above the input field.

### Chips & Tags
Used for status and categorization. They utilize a desaturated version of the status color with high-contrast text (e.g., a very pale orange background with dark orange text for "In Progress").

### Iconography
Icons should be minimalist, 20px or 24px line icons with a consistent 1.5px stroke weight. They should be monochromatic (Slate 500) except when indicating a specific active state or destructive action.

### Feedback Systems
Toasts and alerts should be positioned in the top-right or bottom-center, using the same elevation and rounding as modals to ensure consistency.