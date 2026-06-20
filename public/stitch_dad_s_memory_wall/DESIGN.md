---
name: Paternal Heritage
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4d4635'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#e9c349'
  secondary: '#5f5e60'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfe1'
  on-secondary-container: '#636264'
  tertiary: '#5d5e60'
  on-tertiary: '#ffffff'
  tertiary-container: '#b2b3b5'
  on-tertiary-container: '#434547'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e4e2e4'
  secondary-fixed-dim: '#c8c6c8'
  on-secondary-fixed: '#1b1b1d'
  on-secondary-fixed-variant: '#474649'
  tertiary-fixed: '#e2e2e4'
  tertiary-fixed-dim: '#c6c6c8'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454749'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-main:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  message-script:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 60px
  section-gap: 120px
---

## Brand & Style
The brand personality is curated, archival, and deeply sentimental, designed to evoke the feeling of a high-end museum gallery dedicated to personal history. The target audience is individuals seeking a premium, digital-first way to honor their fathers through shared memories and refined storytelling.

The design system employs a **Modern Apple-inspired Glassmorphism** aesthetic. It prioritizes clarity and light, using layered transparency to create a sense of physical depth. The emotional response is one of quiet reverence and timeless elegance, where white space acts as a "gallery wall" to let photography and personal messages remain the focal point.

## Colors
The palette is rooted in a "Gallery White" philosophy, using varying temperatures of white and light gray to build structure without heavy borders. 

- **Primary (Metallic Gold):** Used sparingly for hairline dividers, signature icons, and "Premium" call-outs. It represents the value of the paternal bond.
- **Secondary (Ink Black):** Reserved for high-contrast typography and essential UI controls to ensure legibility.
- **Neutral / Surface:** A mix of pure `#FFFFFF` for base cards and `#F5F5F7` for background depth.
- **Glass:** Semi-transparent layers with high-saturation background blurs (20px-30px) to simulate frosted glass.

## Typography
Typography is the primary vehicle for the "Museum" feel. 

- **Headlines:** Use Playfair Display to establish an authoritative, editorial tone.
- **UI & Navigation:** Use Inter for its neutral, functional clarity, ensuring the interface stays out of the way of the content.
- **Personal Messages:** Epilogue is utilized for its distinctive, contemporary character to simulate a thoughtful, handwritten note without the cliches of traditional cursive fonts.
- **Micro-copy:** Small-caps labels with wide tracking are used for dates and metadata, mimicking museum plaque descriptions.

## Layout & Spacing
The layout follows a **Fixed Grid** system inspired by art catalogs. Content is centered within a maximum width of 1200px to maintain a premium, focused feel on ultra-wide displays.

- **Desktop:** A 12-column grid with generous 120px vertical gaps between sections to allow the design to "breathe."
- **Mobile:** A single-column flow with 20px side margins. Large display type scales down significantly to prevent awkward word breaks.
- **Rhythm:** Spacing is strictly based on 8px increments, but uses larger "Air" blocks (64px, 80px, 96px) to separate distinct "Exhibits" or memory clusters.

## Elevation & Depth
This design system uses a **Glassmorphic Tonal** approach to hierarchy.

1.  **Level 0 (Floor):** A soft, off-white background (`#F5F5F7`).
2.  **Level 1 (The Wall):** Large, semi-transparent glass containers with 32px background blurs and a subtle 1px white inner stroke (the "sheen").
3.  **Level 2 (The Exhibit):** Polaroid cards and interactive elements with multi-layered ambient shadows. Shadows should be ultra-diffused: `0 20px 40px rgba(0,0,0,0.04)`.
4.  **Level 3 (Focus):** Modals and dropdowns featuring a distinct "shimmer" effect—a linear gradient moving across the surface to suggest a reflective glass edge.

## Shapes
Shapes are deliberately soft but structured. 
- **Standard UI (Buttons, Inputs):** 0.5rem (8px) provides a modern, friendly feel.
- **Cards & Modals:** Use `rounded-xl` (1.5rem / 24px) to emphasize the "physical object" nature of the Polaroid style.
- **Dividers:** Horizontal rules are 1px thick, utilizing a Gold-to-Transparent gradient for a refined, disappearing edge.

## Components
- **Polaroid Cards:** Pure white containers with thick bottom margins for "handwritten" captions. Images inside have a subtle inner-shadow to appear recessed.
- **Glass Buttons:** Background-blur buttons with a 1px white border. On hover, a gold-tinted shimmer sweep animation plays across the button face.
- **Elegant Dividers:** Hairline gold threads (`#D4AF37`) used to separate sections of a story, often topped with a small diamond or serif icon at the center.
- **Floating Navigation:** A glassmorphic bar anchored at the bottom of the screen, housing high-contrast black icons and labels.
- **Personal Note Input:** A text field that appears as a simple underlined gold rule until focused, then expands into a soft-paper textured area for long-form writing.
- **Gallery Scroll:** Horizontal image carousels that use "momentum" scrolling, mimicking the act of walking past frames in a hallway.