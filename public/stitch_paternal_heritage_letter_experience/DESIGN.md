---
name: Paternal Heritage
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdb'
  on-secondary-container: '#63635f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#261900'
  on-tertiary-container: '#a17f3b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2dd'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1b1c19'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4201'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
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
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  letter-handwritten:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.8'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is crafted for a premium, luxury editorial experience. It balances the emotional weight of paternal legacy with the refined precision of modern high-end digital interfaces. The aesthetic is "New Heritage"—a fusion of classical typography and Apple-inspired minimalism.

The user experience should evoke a sense of timelessness and quiet confidence. We achieve this through an expansive use of whitespace (breathing room), a rigorous grid inspired by broadsheet journalism, and tactility that feels both digital and physical. The interface behaves like a luxury magazine: deliberate, high-contrast, and focused on the narrative power of the written word.

## Colors
The palette is rooted in the materials of traditional correspondence and luxury archives.

- **Deep Charcoal (#121212):** Our primary ink. Used for high-contrast headlines and structural elements.
- **Warm Parchment (#F9F7F2):** The foundation of the system. This off-white provides a softer, more sophisticated background than pure white, mimicking high-quality stationery.
- **Subtle Gold (#C5A059):** Reserved for high-value accents, active states, and premium signifiers. It should be used sparingly to maintain its impact.
- **Muted Slate (#6B6B6B):** Used for secondary metadata and supporting body copy to maintain a clear visual hierarchy without distracting from the primary message.

## Typography
The typography system uses a classic serif/sans-serif pairing to establish authority and readability.

- **Playfair Display** is our voice. It is used for all major headlines and the "Letter" itself. For the letter content, use the italic variant to mimic a refined, handwritten signature style.
- **Inter** provides the functional structure. It is used for all navigational elements, UI controls, and long-form body text.
- **Letter Spacing:** Headlines should have slight negative kerning to feel tight and editorial. Labels and secondary navigation should use increased tracking (0.1em) for a modern, architectural feel.

## Layout & Spacing
This design system utilizes a **Fixed Grid** on desktop (12 columns) and a **Fluid Grid** on mobile (4 columns). 

- **The Golden Ratio:** Use 8px base units, but favor larger increments (32px, 64px, 128px) for vertical section spacing to ensure the "Luxury Editorial" feel. 
- **Margins:** Desktop layouts must feature generous 64px margins to prevent the content from feeling crowded. 
- **The Letter Card:** Always centered within the viewport, often breaking the standard grid to appear as a physical object resting on the page.

## Elevation & Depth
Depth is conveyed through a mix of **Glassmorphism** and **Tonal Layering**, rather than traditional heavy shadows.

- **The Letter Card:** Features a backdrop blur (20px) and a semi-transparent Parchment fill (90% opacity). It uses a very soft, large-radius shadow (#121212 at 5% opacity) to suggest it is floating slightly above the background.
- **Overlays:** Modals and menus use a frosted glass effect to maintain the visual context of the editorial content beneath.
- **Borders:** Use hairline borders (0.5px or 1px) in a slightly darker shade of Parchment or Gold to define sections without adding visual weight.

## Shapes
The shape language is "Soft-Modern." We avoid the playfulness of fully rounded pills in favor of professional, subtle corners.

- **Global Radius:** Use a consistent 4px (0.25rem) radius for buttons and input fields to maintain a sharp, clean-cut look.
- **The Letter Card:** Uses a slightly larger radius (8px) to feel more like a premium cardstock or heavy paper product.
- **Images:** Should remain sharp (0px radius) to emphasize the editorial, "photography-first" nature of the brand.

## Components
- **Primary Button:** Solid Deep Charcoal background with Gold text. High contrast, rectangular with a 4px corner radius. No shadows; the impact comes from the color contrast.
- **The Letter Card:** The centerpiece component. It uses the glassmorphism style defined in Elevation. It features an elegant 1px Gold border and utilizes the "letter-handwritten" typography.
- **Input Fields:** Minimalist "Underline" style or a very light Parchment-tinted box with a 1px Slate border. Labels should use the "label-caps" style sitting above the field.
- **Chips/Tags:** Small, outlined with Gold or Slate. Used for categories like "Memories," "Legacy," or "Appreciation."
- **Navigation:** Top-aligned, utilizing generous horizontal spacing. The logo is always centered, using Playfair Display.
- **Lists:** Clean, separated by hairline dividers. No bullet points; use indentation or Gold-tinted numbers for a more sophisticated list style.