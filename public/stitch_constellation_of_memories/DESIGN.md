---
name: Paternal Heritage
colors:
  surface: '#16130b'
  surface-dim: '#16130b'
  surface-bright: '#3d392f'
  surface-container-lowest: '#110e07'
  surface-container-low: '#1f1b13'
  surface-container: '#231f17'
  surface-container-high: '#2d2a21'
  surface-container-highest: '#38342b'
  on-surface: '#eae1d4'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#eae1d4'
  inverse-on-surface: '#343027'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#b1c6f9'
  on-secondary: '#182f59'
  secondary-container: '#314671'
  on-secondary-container: '#a0b5e6'
  tertiary: '#cecece'
  on-tertiary: '#2f3131'
  tertiary-container: '#b2b3b3'
  on-tertiary-container: '#434546'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#b1c6f9'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#314671'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#16130b'
  on-background: '#eae1d4'
  surface-variant: '#38342b'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  ui-interactive:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  glass-padding: 32px
---

## Brand & Style
This design system is built upon a foundation of "Cinematic Immersion." It merges the spatial depth of modern mixed-reality interfaces with the precision of aerospace engineering. The brand personality is one of reverence, legacy, and cosmic scale—treating personal memories as celestial bodies.

The design style is a sophisticated evolution of **Glassmorphism**, layered over a deep, infinite canvas. It prioritizes high-fidelity materials, light-refraction, and a "Constellation" visual language where data points are connected by delicate, golden filament lines. The emotional response should be one of awe, quiet reflection, and the feeling of interacting with a timeless artifact.

## Colors
The palette is anchored in **Deep Midnight Navy**, serving as a non-distracting void that provides infinite perceived depth. **Heritage Gold** is used sparingly as the primary action color and to represent "memory links" or highlights.

- **Background:** #031632 (The deep canvas).
- **Surface:** A semi-transparent overlay of #0A244D at 40-60% opacity with backdrop blur.
- **Primary:** #D4AF37 (Gold) for moments of high emotional value and primary CTAs.
- **Glow:** #F9F1D0 (Pale Gold) used for soft radiance and star-like interactive states.
- **Text:** White for high-contrast readability; muted gold for secondary metadata.

## Typography
The typographic hierarchy creates a tension between the poetic and the functional. **Playfair Display** is reserved for titles, headings, and emotional quotes, utilizing its high-contrast serifs to evoke a sense of history. **Inter** provides the necessary technical balance, handling all functional UI, metadata, and long-form body text with clinical clarity.

For "Display" sizes, use slight negative letter spacing to tighten the cinematic feel. Label-caps should always be tracked out heavily (10% or more) to simulate the precise markings found in high-end instrumentation.

## Layout & Spacing
This design system utilizes a **Fixed Grid** for content containers to maintain a cinematic aspect ratio, centered within a fluid viewport. The spacing philosophy is generous, utilizing "Breathable Voids" to prevent the interface from feeling cluttered.

- **Desktop:** 12-column grid with 80px margins to create a "letterboxed" cinematic feel.
- **Mobile:** 4-column grid with 20px margins.
- **Spatial Depth:** Elements are spaced on the Z-axis. Closer elements (modals) should have larger internal padding (32px+) to emphasize their physical presence in the "room."

## Elevation & Depth
Elevation is achieved through **Optical Refraction** rather than traditional dropshadows. 
1. **Level 0 (The Void):** The background #031632 with a faint, animated "Star Field" texture.
2. **Level 1 (The Pane):** Semi-transparent surfaces with a 20px backdrop-blur and a 0.5px white inner-stroke (10% opacity) to simulate the edge of a glass pane.
3. **Level 2 (The Focus):** Elements like active cards or modals use a subtle #D4AF37 (Gold) outer glow (spread 20px, opacity 15%) to appear as if they are radiating light onto the background.
4. **Connections:** Golden "Constellation Lines" (1px width) sit between Level 0 and Level 1, connecting interactive nodes.

## Shapes
Shapes follow a "Soft Precision" geometry. Standard containers use a **0.5rem (8px)** radius to feel modern and architectural. Larger glass panels use **1.5rem (24px)** to mirror the rounded corners of spatial computing hardware. 

Interactive nodes (points on a constellation) are perfectly circular. Line endings should be capped with a circular "bulb" to maintain the celestial aesthetic.

## Components
- **Glass Buttons:** Background of 10% white, 20px backdrop blur, and a 1px Gold border. On hover, the background fill increases to 20% and the Gold border glows.
- **Memory Nodes (Chips):** Circular elements containing an image or icon. When active, they emit a soft gold pulse animation.
- **Constellation Cards:** Deep navy glass with a faint gradient from top-left to bottom-right. The header text uses Playfair Display.
- **Input Fields:** Minimalist. Only a bottom border (Gold, 1px) that expands from the center when focused. Background is a very dark, blurred navy.
- **Ambient Motion:** All transitions should use a slow, "weighted" cubic-bezier curve (0.4, 0, 0.2, 1) to simulate movement in a zero-gravity environment.
- **Spatial Modals:** Large-scale glass overlays that dim the background stars further, focusing the user entirely on the center-frame content.