---
name: Legacy Editorial
colors:
  surface: '#faf8fe'
  surface-dim: '#dbd9df'
  surface-bright: '#faf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#efedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#4e4639'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f6'
  outline: '#7f7667'
  outline-variant: '#d1c5b4'
  surface-tint: '#775a19'
  primary: '#775a19'
  on-primary: '#ffffff'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#e9c176'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#a4a5a5'
  on-tertiary-container: '#393b3b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#faf8fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
  burnished-gold: '#C5A059'
  deep-charcoal: '#1A1A1A'
  off-white: '#FBFBFD'
  soft-gray: '#F5F5F7'
  glass-stroke: rgba(255, 255, 255, 0.4)
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
  quote-text:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-desktop: 80px
  margin-mobile: 24px
  gutter: 32px
  stack-lg: 64px
  stack-md: 32px
  stack-sm: 16px
---

## Brand & Style

The design system is centered on the concept of "Digital Heirloom." It evokes a sense of timelessness, reverence, and emotional depth, designed to feel like a high-end physical coffee table book brought to life in a digital space. 

The aesthetic is **Apple-inspired Minimalism mixed with Luxury Editorial**. It utilizes generous whitespace (negative space) to allow photography and personal stories to breathe, ensuring the UI never feels cluttered. The emotional response should be one of calm reflection and prestige. Every transition should feel cinematic, and every element should feel intentional and high-quality.

## Colors

The palette is restrained and sophisticated. 
- **Primary (Burnished Gold):** Reserved exclusively for high-intent accents, timeline nodes, and primary calls to action. It represents the "value" of the memories being shared.
- **Deep Charcoal:** Used for all primary headings and body text to ensure maximum legibility and a classic editorial feel.
- **Backgrounds:** Use a layered approach. The base canvas is `off-white` (#FBFBFD), with `soft-gray` (#F5F5F7) used for subtle sectional differentiation. 
- **Glassmorphism:** White-based translucent layers are used for floating elements to maintain the "light and airy" Apple-inspired aesthetic.

## Typography

The typography strategy relies on a "Serif for Emotion, Sans for Utility" framework.

- **Playfair Display** is used for storytelling, headings, and pull-quotes. Its high contrast and elegant serifs provide the "editorial" feel.
- **Inter** (as a high-quality alternative to SF Pro) handles all body copy, navigation, and functional labels. It provides the "Apple-inspired" clarity and modern edge.
- **Hierarchy:** Use large font sizes for key dates or titles to create a cinematic entry point for each timeline chapter.
- **Labels:** Small, uppercase labels with increased letter spacing should be used for dates or category tags to maintain a clean, organized appearance.

## Layout & Spacing

This design system uses a **Fixed Grid** on desktop (12 columns, 1200px max-width) and a **Fluid Grid** on mobile.

- **Margins:** Generous outer margins are essential to the premium feel. Desktop screens should never feel crowded.
- **Rhythm:** Use a 4px/8px base scaling system. Vertical spacing between timeline chapters (Stack-LG) should be aggressive to signify a change in life stages.
- **Timeline Alignment:** The central timeline axis should be slightly offset or use an asymmetrical layout to mimic modern magazine layouts.

## Elevation & Depth

Hierarchy is achieved through **Glassmorphism and Ambient Shadows**.

- **Surface Layers:** Main content sits on the `off-white` base. Overlays (like photo details or menus) use a frosted glass effect: `backdrop-filter: blur(20px)` with a 60% transparent white background and a 1px `glass-stroke`.
- **Shadows:** Avoid harsh, dark shadows. Use "Ambient Light" shadows: very large blur radius (30px-60px), low opacity (4-8%), and a slight tint of the Primary color to make elements feel like they are floating elegantly above the page.

## Shapes

The shape language is **Refined and Soft**. 

- **Cards and Containers:** Use a 16px (Rounded-LG) corner radius. This strikes a balance between the precision of luxury and the approachability of a family product.
- **Media:** Photography should use the same roundedness as cards. 
- **Buttons:** Interactive elements use a fully rounded "Pill" shape to distinguish them from content containers.

## Components

- **Timeline Nodes:** Small, circular dots in Burnished Gold. When active, they expand slightly with a soft gold outer glow.
- **Glass Cards:** Used for "Memory Snippets." These feature the frosted glass effect, a subtle inner border, and deep charcoal text.
- **Buttons:** 
  - *Primary:* Deep Charcoal background with White text, pill-shaped. 
  - *Secondary:* Transparent with a Burnished Gold outline.
- **Input Fields:** Minimalist. Only a bottom border (1px) in Soft Gray that turns to Burnished Gold on focus.
- **Navigation:** A sticky top bar with heavy background blur (Glassmorphism), using `label-caps` for links.
- **Interactive Quotes:** Centered Playfair Display text with a small Burnished Gold decorative line above it to signal a high-value memory.