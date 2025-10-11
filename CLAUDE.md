# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 portfolio project featuring a keypad unlock mechanism, glass-effect visual components, and animated case study presentations. Built with Vite and uses advanced visual effects including distortion, glass morphism, and smooth animations via motion-v.

## Development Commands

```bash
# Development
npm run dev                          # Start dev server (http://localhost:5173)
npm run build                        # Production build
npm run preview                      # Preview production build

# Testing (Playwright E2E)
npm run test:e2e                     # Run E2E tests (headless)
npm run test:e2e:headed              # Run E2E tests (visible browser)

# Documentation
npm run docs:dev                     # Start VitePress docs dev server
npm run docs:build                   # Build documentation
npm run docs:preview                 # Preview built documentation
```

## Architecture

### Component Hierarchy

```
App.vue (Main entry)
├── Keypad (unlock screen, requires code "8651")
│   ├── KeypadButton (10 buttons with glass-effect)
│   ├── GeBackground (generates PNG background from DOM)
│   └── Motion animations (background digits + grid)
│
└── RouterView (after unlock)
    └── MainPage (scroll-snap sections)
        ├── Intro (hero with 4 interactive rectangles)
        ├── CaseItem (3 case studies with videos)
        ├── AI Play (placeholder)
        └── Contacts
```

### Key Pages

- **MainPage** (`src/pages/main-page/MainPage.vue`): Uses `vue-scroll-snap` for fullscreen snap sections. Manages navigation intro animations and scroll position restoration when returning from case pages.

- **CasePage** (`src/pages/case-page/CasePage.vue`): Individual case study pages with Task/Process/Results structure. Receives `caseId` prop for content selection.

### Glass Effect System

**Core Components:**
- `GlassEffect.vue` - Main wrapper combining displacement + highlight effects
- `GeBackground.vue` - Converts DOM to PNG background using `html-to-image`
- `GeDisplacement.vue` - SVG displacement map effects
- `GeHighlight.vue` - Light/reflection highlights

**Performance Note:** GeBackground uses `toPng()` which is CPU-intensive (~50-200ms). Component only regenerates on mount or when `watchData` changes (e.g., keypad digits). Disabled on mobile devices for performance.

### Custom Directives

**`v-mask-element`** (`src/directives/mask-element/maskElement.js`)
- Creates inner element for background masking
- Uses ResizeObserver to sync background positioning
- Uses `layoutBatcher.js` to prevent layout thrashing

**`v-hover-distortion`** (`src/directives/hover-distortion/hoverDistortion.js`)
- Applies 3D distortion transform on hover
- Manages CSS variables for light/parallax/rotation effects
- Has window resize listener for rect cache updates
- Can be disabled by passing `null` or `false` as value

### Layout Optimization

**`layoutBatcher.js`** (`src/directives/mask-element/layoutBatcher.js`)
- Singleton pattern preventing layout thrashing
- Batches all DOM reads in one phase, writes in another
- Uses single requestAnimationFrame for all scheduled tasks
- Critical for performance with multiple interactive elements

### Routing & Navigation

**Router** (`src/router/index.js`)
- Routes: `/` (MainPage), `/story/one`, `/story/two`, `/story/three`
- Preserves scroll position when navigating from home to case and back
- Sets meta flags (`skipNavIntro`, `restoreScrollTop`) for animation control

**PageNavigation** (`src/components/page-navigation/PageNavigation.vue`)
- Animated navigation with motion-v variants
- Skips intro animation when returning from case pages
- Emits `animation-complete` to trigger content visibility

### Animation Library

Uses **motion-v** (Vue wrapper for Framer Motion):
- `<Motion>` component with `:variants`, `:animate`, `:transition` props
- Variants defined in separate files (e.g., `variants.js`, `keypadVariants.js`)
- Spring and timing-based transitions

Example usage in `IntroRectangle.vue`, `Keypad.vue`, `PageNavigation.vue`.

## Key Composables

**`useMediaQuery.js`** - Reactive media query composable
- `useIsMobile()` - Detects screens < 768px
- `useHasHover()` - Detects hover capability
- `useIsTouchDevice()` - Detects touch devices

**`useMeta.js`** - Dynamic meta tags management for SEO

## Project Structure

```
src/
├── assets/              # Static assets (videos, displacement maps)
├── components/
│   ├── app-footer/      # Footer component
│   ├── glass-effect/    # Glass effect system components
│   ├── glass-debugger/  # Dev tools for glass effects
│   ├── keypad/          # Unlock keypad components
│   ├── page-navigation/ # Section navigation
│   └── common/          # Shared components
├── composables/         # Vue composables (media queries, meta)
├── directives/          # Custom Vue directives
│   ├── mask-element/    # Background masking + batching
│   ├── hover-distortion/# 3D hover effects
│   └── backdrop-filter/ # Backdrop filter utilities
├── pages/               # Route pages
│   ├── main-page/       # Home page with sections
│   ├── case-page/       # Case study wrapper
│   ├── case1-page/      # Case 1 content
│   ├── case2-page/      # Case 2 content
│   └── case3-page/      # Case 3 content
├── router/              # Vue Router config
├── config/              # App configuration
└── styles/              # Global styles
```

## Important Implementation Details

### Keypad Unlock Code

The correct unlock code is **8651** (hardcoded in [Keypad.vue:142](src/components/keypad/Keypad.vue#L142)). Code requires exactly 4 digits.

### Scroll Behavior

- MainPage uses custom scroll position tracking in router
- Scroll container selector: `.scroll-snap-container.fullscreen`
- Preserves position via `scrollPositions` Map in router

### Path Aliases

Uses `@` alias pointing to `src/` directory (configured in [vite.config.js:12](vite.config.js#L12)).

### Mobile Optimizations

- GeBackground disabled on mobile (performance)
- Responsive layouts via `useMediaQuery` composables
- Different grid layouts for keypad background digits (2x2 grid on mobile, horizontal on desktop)

## Common Gotchas

1. **GeBackground Performance** - Avoid adding resize listeners. Only regenerates on mount or `watchData` changes.

2. **ResizeObserver in v-mask-element** - Required for glass-effect, do not remove.

3. **Layout Batching** - When adding new interactive elements with background sync, use `layoutBatcher` to prevent performance issues.

4. **motion-v Syntax** - Uses kebab-case props (`:animate`, `:variants`) not PascalCase.

5. **Scroll Container** - MainPage uses VueScrollSnap which creates `.scroll-snap-container.fullscreen` element, affecting scroll position logic.

6. **Keypad Digits** - Background digit layout changes based on screen size (grid vs horizontal flex).
