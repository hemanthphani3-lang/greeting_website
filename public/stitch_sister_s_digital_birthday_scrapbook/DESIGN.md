---
name: Ethereal Keepsake
colors:
  surface: '#fff7fb'
  surface-dim: '#e9d3ed'
  surface-bright: '#fff7fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ffefff'
  surface-container: '#fce7ff'
  surface-container-high: '#f7e1fb'
  surface-container-highest: '#f2dbf5'
  on-surface: '#241729'
  on-surface-variant: '#524346'
  inverse-surface: '#392b3f'
  inverse-on-surface: '#fdebff'
  outline: '#847376'
  outline-variant: '#d7c1c5'
  surface-tint: '#8e495e'
  primary: '#8e495e'
  on-primary: '#ffffff'
  primary-container: '#f49fb6'
  on-primary-container: '#733347'
  inverse-primary: '#ffb1c5'
  secondary: '#665781'
  on-secondary: '#ffffff'
  secondary-container: '#dfccfe'
  on-secondary-container: '#63547e'
  tertiary: '#74593f'
  on-tertiary: '#ffffff'
  tertiary-container: '#d3b192'
  on-tertiary-container: '#5c432b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e1'
  primary-fixed-dim: '#ffb1c5'
  on-primary-fixed: '#3b061b'
  on-primary-fixed-variant: '#713246'
  secondary-fixed: '#ebdcff'
  secondary-fixed-dim: '#d1beef'
  on-secondary-fixed: '#21143a'
  on-secondary-fixed-variant: '#4e4068'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#e3c0a0'
  on-tertiary-fixed: '#2a1704'
  on-tertiary-fixed-variant: '#5a422a'
  background: '#fff7fb'
  on-background: '#241729'
  surface-variant: '#f2dbf5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style
The design system is centered on the concepts of digital preservation and emotional connection. It targets a premium audience looking to celebrate milestones with high-fidelity aesthetics. The personality is sophisticated yet tender, blending the sleekness of high-end technology with the warmth of a physical scrapbook.

The design style is **Glassmorphism**, heavily influenced by Apple’s editorial layouts. It utilizes deep background blurs, multi-layered transparency, and light-refracting borders to create a sense of physical presence in a digital space. The visual response should feel like opening a cherished gift—precious, lightweight, and luminous.

## Colors
The palette is built on a soft, ethereal transition between **Soft Peach**, **Rose Pink**, and **Lavender**. The background is never a solid color but a dynamic, wide-gamut gradient that shifts subtly. 

**Rose Pink** serves as the primary action color, used for celebratory highlights and key interactions. **Lavender** provides a cooling secondary tone for secondary information and accents. The **On-Surface** color is a deep, muted Plum rather than pure black, maintaining the premium feel while ensuring high legibility against translucent backgrounds.

## Typography
The typography strategy employs a "High-Low" contrast approach. **Playfair Display** is used for headlines to evoke an editorial, luxury magazine feel, with its high-contrast strokes and elegant serifs. 

For functional text and body copy, **Plus Jakarta Sans** provides a modern, soft, and highly legible counterpoint. Its slightly rounded terminals complement the overall shape language of the design system. Display text should use tighter letter-spacing for a "locked-in" premium look, while labels use expanded tracking for better scanability.

## Layout & Spacing
This design system uses a **Fluid Grid** with generous white space to allow content "room to breathe." On desktop, a 12-column grid is used with large 64px outer margins to center the content as a focused "canvas." 

On mobile, the grid shifts to 4 columns. Spacing between elements (Stack) is strictly proportional to the 8px base unit. To maintain the premium "Apple Event" feel, avoid overcrowding; if a screen feels busy, increase the `stack-xl` vertical spacing. All glass containers should have internal padding of at least `stack-lg` (32px) to prevent content from touching the luminous edges.

## Elevation & Depth
Depth is created through **Glassmorphism and Tinted Shadows** rather than traditional grey shadows. 
1.  **The Canvas:** The bottom-most layer is the vibrant peach-to-lavender gradient.
2.  **Glass Containers:** Primary surfaces use a 60% white opacity with a 20px-30px backdrop blur. They feature a 1px solid white border at 30% opacity to define the edges.
3.  **Floating Elements:** Buttons and active cards use a soft, diffused shadow tinted with the primary Rose Pink color (`rgba(244, 159, 182, 0.3)`) to create a glowing effect that feels integrated into the background.
4.  **Active State:** When pressed or hovered, elements should slightly scale up (1.02x) and increase their blur radius to simulate physical lifting.

## Shapes
The shape language is consistently **Rounded**. Sharp corners are avoided to maintain the friendly and welcoming emotional tone. Standard containers use the `rounded-lg` (16px) setting, while interactive buttons and image frames often move toward the `rounded-xl` (24px) or full pill-shape to emphasize the organic, soft nature of the brand.

## Components
- **Glass Cards:** The foundational component. Must have a `backdrop-filter: blur(20px)`, a thin light stroke, and high internal padding.
- **Celebrate Button:** The primary CTA. Solid Rose Pink with white text, using a subtle inner glow and a soft drop shadow.
- **Memory Chips:** Small, semi-transparent lavender tags used for dating or categorizing scrapbook entries.
- **Media Frames:** Photography should always have rounded corners (`rounded-lg`) and a subtle white inner-border to separate the image from the glass background.
- **Input Fields:** Minimalist design with only a bottom stroke or a very light translucent fill. The focus state should highlight the border in the primary Rose Pink color.
- **Interactive Timeline:** A vertical or horizontal line in thin lavender, with glass-circles as anchor points for "memories" or "milestones."