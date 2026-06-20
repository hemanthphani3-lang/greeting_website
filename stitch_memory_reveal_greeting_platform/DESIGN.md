---
name: Paternal Heritage
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#edeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#44474d'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#4e5f7e'
  primary: '#031632'
  on-primary: '#ffffff'
  primary-container: '#1a2b48'
  on-primary-container: '#8293b5'
  inverse-primary: '#b6c7eb'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#370005'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e000f'
  on-tertiary-container: '#ff575e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#b6c7eb'
  on-primary-fixed: '#081b38'
  on-primary-fixed-variant: '#374765'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b1'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001c'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  accent-quote:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 42px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 8px
  container-max: 1120px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 80px
---

## Brand & Style
The design system focuses on creating an emotional sanctuary for Father’s Day memories. The brand personality is timeless, professional, and deeply sentimental, aiming to evoke a sense of quiet reverence and enduring love. 

The aesthetic is heavily inspired by modern Apple-style minimalism, blending high-end editorial layouts with digital intimacy. We employ a sophisticated light theme that prioritizes negative space to let personal photography and heartfelt text breathe. The visual narrative is driven by "Digital Tactility"—a mix of clean lines and soft, physical-world metaphors like glass and subtle paper-like textures.

## Colors
The palette is rooted in a foundation of "Heritage White" (#F9F9FB) and "Gallery Grey" (#E5E7EB) to provide a clean, museum-like backdrop. 

- **Primary (Midnight Navy):** Used for primary actions and authoritative typography. It conveys stability and strength.
- **Secondary (Burnished Gold):** Used sparingly for premium flourishes, borders on high-value items, or subtle call-to-actions that signify value.
- **Tertiary (Heritage Red):** Reserved strictly for emotional touchpoints, heart icons, and subtle interactive states related to "liking" or "favoriting" a memory.
- **Neutral:** A spectrum of warm grays that prevent the interface from feeling cold or clinical.

## Typography
The typographic system uses a dual-font approach. **Inter** provides the structural, modern foundation for navigation and interface elements, ensuring maximum legibility and a professional feel. 

To introduce the "emotional" layer, **Playfair Display** (italicized) is utilized for pull-quotes, personal messages, and signature lines. This contrast between the systematic Sans and the elegant Serif mimics the feel of a handwritten note inside a sleek, modern card. Use tight letter-spacing for headlines to achieve the premium "display" look, while keeping body text generous to ensure an easy reading experience for all generations.

## Layout & Spacing
The layout follows a fluid-to-fixed grid model. On desktop, content is centered within a 1120px container to maintain an intimate "reading width." 

- **The Rhythm:** We use an 8px base grid. Massive vertical breathing room (section gaps of 80px+) is encouraged to separate different "chapters" of the user journey.
- **Mobile:** Margins reduce to 20px, and complex grids collapse into a single-column stack.
- **Safe Areas:** Cards and imagery should utilize generous internal padding (min 32px) to ensure the content never feels cramped against its container.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Ambient Shadows** rather than stark borders.

- **Surface Layers:** Use a background blur (Backdrop Filter: blur(20px)) with a semi-transparent white fill (rgba(255, 255, 255, 0.7)) for navigation bars and floating modals.
- **Shadows:** Utilize "Long-Tail Shadows"—low opacity (4-8%), very high blur (40px-60px), and a slight Y-axis offset. This makes cards appear to float gently above the surface without creating harsh edges.
- **Interaction:** On hover, elevation should subtly increase through a slightly deeper shadow and a 1-2% scale increase to simulate physical "reach."

## Shapes
The shape language is sophisticated and "Rounded" (Level 2). 

- **Primary Cards:** Use 1rem (16px) corner radius to strike a balance between modern and friendly.
- **Buttons:** Use a slightly higher radius or full pills for a softer, more approachable interactive feel.
- **Media:** Photography should always follow the container's roundedness. Avoid sharp 0px corners, as they appear too aggressive for the brand personality.

## Components
- **Buttons:** Primary buttons are solid Midnight Navy with white text. Secondary buttons use a transparent background with a thin Gold border. High-end buttons should include a subtle "shimmer" transition on hover.
- **Memory Cards:** The hero of the system. These use a white background, soft ambient shadows, and generous padding. Images within cards should have a subtle 1px inner border to define edges against white backgrounds.
- **Input Fields:** Minimalist design with only a bottom border that thickens and changes to Gold on focus. Labels use the `label-caps` style for a technical, clean look.
- **Chips/Tags:** Used for "Year" or "Category" (e.g., #1995, #FirstWalk). These should be low-contrast (light gray background) with dark navy text.
- **Glass Modals:** For adding new memories, use full-screen glass overlays with high-intensity backdrop blurs to keep the focus entirely on the emotional entry.
- **Timeline Indicator:** A vertical 1px line in Gold, connecting memory nodes to visualize the passage of time.