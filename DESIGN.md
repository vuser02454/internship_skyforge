---
name: Indigo Mint FinTech
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464652'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777683'
  outline-variant: '#c7c5d4'
  surface-tint: '#4f54b4'
  primary: '#15157d'
  on-primary: '#ffffff'
  primary-container: '#2e3192'
  on-primary-container: '#9da1ff'
  inverse-primary: '#c0c1ff'
  secondary: '#006c50'
  on-secondary: '#ffffff'
  secondary-container: '#4cfac4'
  on-secondary-container: '#007054'
  tertiary: '#19293d'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f3f54'
  on-tertiary-container: '#9aaac3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#04006d'
  on-primary-fixed-variant: '#373a9b'
  secondary-fixed: '#50fdc7'
  secondary-fixed-dim: '#1ee0ac'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#00513c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
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
    letterSpacing: 0.05em
  budget-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

This design system establishes a "FinTech-Forward" aesthetic tailored for a micro-task economy. The brand personality is rooted in institutional trust and operational speed. It balances the "Old Money" reliability of Deep Indigo with the "New Tech" energy of Mint Green.

The visual style is **Corporate Modern**, characterized by structured information density and a clear sense of order. It avoids unnecessary decorative elements, favoring functional clarity and high-performance interactions. The emotional response is one of confidence; users should feel that their earnings are secure and the platform is technologically superior.

## Colors

The palette is anchored by **Deep Indigo**, used for primary actions, navigation, and brand-heavy components to signify stability. **Mint Green** is reserved strictly for value-positive moments: earnings, successful task completions, and growth indicators.

**Slate Grey** provides a sophisticated neutral tone for secondary text and icons, preventing the UI from feeling overly heavy. Backgrounds utilize a very light grey (#F8FAFC) to create a soft contrast against pure white cards, while high-contrast black (#0F172A) is used for budget labels (₹) to ensure maximum legibility for financial figures.

## Typography

This design system utilizes a dual-font strategy. **Plus Jakarta Sans** is used for headings and currency displays to provide a modern, slightly rounded tech feel. **Inter** is used for all body copy and UI labels due to its exceptional legibility at small sizes, which is critical for micro-task descriptions.

Financial figures (Budget Labels) must always be rendered in a heavier weight (600 or 700) and high-contrast color to stand out immediately within task lists. Use `label-caps` for metadata like category tags or status indicators.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (12 columns) and a fluid single-column model on mobile. Content is organized primarily through a vertical stack of cards.

Spacing is based on an 8px rhythmic scale. Components like task cards use 16px internal padding for a compact but breathable feel. Group related tasks with 12px gaps, while larger section transitions should use 32px to 48px of whitespace to maintain a clean information hierarchy.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and tonal layering rather than heavy borders. The "Base" layer is the light neutral background. The "Surface" layer consists of pure white cards.

Shadows should be soft and natural: `0px 4px 12px rgba(46, 49, 146, 0.05)`. Note the subtle Indigo tint in the shadow to keep the palette cohesive. Interactive cards should slightly increase their shadow spread on hover to provide tactile feedback, simulating a lift effect.

## Shapes

The design system uses a **Rounded** shape language to soften the "institutional" feel of the indigo palette. 

- Standard components (Buttons, Input Fields): 8px corner radius.
- Container elements (Cards, Modals): 12px corner radius.
- Small indicators (Tags, Chips): 4px corner radius or full pill-shape for status badges.

## Components

- **Buttons**: Primary buttons are solid Deep Indigo with white text. Success actions use Mint Green with dark indigo text for contrast. Secondary buttons use a Slate Grey outline or ghost style.
- **Cards**: The central component. Must have a white background, 12px corner radius, and the standard ambient shadow. Headlines within cards should be Plus Jakarta Sans Bold.
- **Budget Chips**: High-contrast badges for currency (₹). Use a light mint background with dark green text for "Available" tasks, and light indigo with primary indigo text for "In Progress."
- **Input Fields**: 8px radius with a 1px Slate Grey border. On focus, the border transitions to Deep Indigo with a subtle outer glow.
- **Status Indicators**: Small pill-shaped badges. "Completed" is Mint Green, "Pending" is Slate Grey, and "Urgent" uses a soft red tint.
- **Progress Bars**: Used for task completion and earnings goals. Use a Slate Grey track with a Mint Green fill to visualize growth.