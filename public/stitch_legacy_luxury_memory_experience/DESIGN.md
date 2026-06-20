---
name: Heritage & Legacy
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
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#081b37'
  on-primary-container: '#7484a6'
  inverse-primary: '#b6c7eb'
  secondary: '#7d5702'
  on-secondary: '#ffffff'
  secondary-container: '#fdc970'
  on-secondary-container: '#775300'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1c19'
  on-tertiary-container: '#86837f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#b6c7eb'
  on-primary-fixed: '#081b37'
  on-primary-fixed-variant: '#364765'
  secondary-fixed: '#ffdeab'
  secondary-fixed-dim: '#f1be66'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5f4100'
  tertiary-fixed: '#e6e2dd'
  tertiary-fixed-dim: '#c9c6c1'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#484743'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  serif-quote:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.4'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
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
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
This design system centers on a "Modern Heirloom" aesthetic, blending the precision of high-end consumer technology with the warmth of a bespoke editorial scrapbook. The target audience seeks a premium, high-trust environment to curate and preserve intimate family memories.

The design style is a hybrid of **Apple-inspired minimalism** and **Luxury Editorial**. It utilizes expansive white space, precise typography, and a "physical" sense of layering. The emotional response should be one of quiet reverence, nostalgia, and exclusivity—moving away from the frantic nature of social media toward a slow, intentional "gallery" experience.

## Colors
The palette is rooted in **Heritage White** (#F9F9FB), providing a clean, bright canvas that feels more sophisticated than a standard pure white. **Midnight Navy** (#031632) serves as the primary anchor for text and structural elements, offering a deep, authoritative contrast.

**Warm Gold** (#D4A44F) is reserved for moments of "celebration"—luxury highlights, call-to-action accents, and premium status indicators. To add depth, a **Champagne Gradient** should be applied to high-level surfaces or special buttons to evoke a tactile, metallic quality. **Soft Cream** (#F7F3EE) is used for secondary surfaces and cards to create a gentle "paper" layering effect against the Heritage White background.

## Typography
The typography system uses a functional-emotional split. **Inter** provides the structural backbone, ensuring maximum readability and a modern, "designed" feel for all functional UI and long-form body text. 

**Playfair Display (Italic)** is the "soul" of the design system. It should be used sparingly for quotes, emotive sub-headings, and decorative callouts to provide the luxury editorial contrast. To maintain the premium feel, headings should use tighter letter-spacing, while uppercase labels should be tracked out significantly to create an "archival" look.

## Layout & Spacing
The layout follows a **Fluid Grid** with generous, intentional margins. On desktop, a 12-column grid is used with large 64px outer margins to create a "letterboxed" feel, reminiscent of high-end coffee table books. 

Spacing should lean toward "oversized." Avoid crowding elements; allow the Heritage White background to act as a frame for the content. Transitions between sections should use substantial vertical padding (80px to 120px) to pace the user's emotional journey through the memory experience.

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** and **Tonal Layering**. Unlike the sharp, harsh shadows of standard UI, this design system uses "Long & Soft" shadows (Blur: 40px+, Opacity: 4-6%) with a subtle Midnight Navy tint to make elements appear as if they are floating slightly above a paper surface.

Cards and containers should use the Soft Cream (#F7F3EE) fill to distinguish themselves from the Heritage White background. For a "Glassmorphic" editorial effect, top navigation bars and overlays should use a high-saturation background blur (20px) with 80% opacity Heritage White, allowing the colors of photos to bleed through softly as the user scrolls.

## Shapes
The shape language is refined and "Soft" (0.25rem to 0.75rem). While completely sharp corners feel too aggressive and pill-shapes feel too "app-like," the soft-radius approach mimics the cut of high-quality cardstock or a framed photograph. Larger containers like memory cards or image frames should use the `rounded-lg` (0.5rem) setting to feel approachable yet structured.

## Components
- **Buttons:** Primary buttons use the Midnight Navy background with Heritage White text. Secondary buttons use the Champagne Gradient or a Soft Cream fill with a subtle 1px border in Gold.
- **Memory Cards:** High-shadow, Soft Cream containers. Images within cards should have a subtle inner-glow to look like they are set into the paper.
- **Input Fields:** Minimalist design—only a bottom border in a light Navy (15% opacity), which transitions to Warm Gold upon focus. Labels use the `label-caps` typography style.
- **Lists:** Clean, borderless rows separated by wide white space. Indicators should use the Warm Gold for a touch of luxury.
- **Media Frames:** Photographs should often include a "matting" effect—a Soft Cream border around the image before the card edge—to reinforce the scrapbook/gallery theme.
- **Timeline/Steppers:** Thin, Midnight Navy lines with Warm Gold dots, signifying the progression of a legacy or story.