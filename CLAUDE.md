# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 portfolio project with advanced visual effects (glass-effect, distortion, animations) and comprehensive performance testing infrastructure. The app features a keypad unlock mechanism leading to a main page with interactive rectangles and case studies.

## Development Commands

```bash
# Development
npm run dev                          # Start dev server (http://localhost:5173)
npm run build                        # Production build
npm run preview                      # Preview production build

# Performance Testing (IMPORTANT)
npm run test:perf -- --comment="Description"                    # Resize performance test
npm run test:perf:headless -- --comment="Description"           # Resize test (headless)
npm run test:interaction -- --comment="Description"             # UI interaction test
npm run test:interaction:headless -- --comment="Description"    # Interaction test (headless)
npm run test:perf -- --cpu=4 --comment="Mid-range device"       # With CPU throttling
npm run test:interaction -- --browser=webkit --comment="Safari" # Different browser
npm run test:compare                                            # Compare last two tests
npm run test:compare:json                                       # Compare with JSON output

# E2E Testing
npm run test:e2e                     # Playwright tests (headless)
npm run test:e2e:headed              # Playwright tests (visible browser)
```

## Critical Performance Rules

### BgToSvg Component - MAIN PERFORMANCE BOTTLENECK

**Location:** `src/components/bg-to-svg/BgToSvg.vue`

**CRITICAL:** The resize listener MUST remain disabled (lines 76-84):
```javascript
// PERFORMANCE: resize listener DISABLED
// Causes 4x slowdown and +468% performance degradation
// window.addEventListener("resize", handleResize, { passive: true });
```

**Why:**
- Uses `toPng` from `html-to-image` (~50-200ms per call)
- With resize listener: 10.85s total, 467ms avg resize, +468% degradation ❌
- Without resize listener: 2.61s total, 74ms avg resize, no degradation ✅

**Only regenerates on:**
- Component mount
- `watchData` changes (e.g., Keypad digit input)

If resize support is needed, add debounce (300-500ms minimum).

### Performance Testing Workflow

**Before making changes:**
```bash
npm run test:perf -- --comment="Baseline before changes"
```

**After changes:**
```bash
npm run test:perf -- --comment="After optimization"
npm run test:compare
```

**Performance targets:**
- ✅ Good: <100ms avg resize, >30 FPS, <20% degradation
- ⚠️ Warning: 100-500ms, 15-30 FPS, 20-100% degradation
- 🚨 Critical: >500ms, <15 FPS, >100% degradation

### CPU Throttling for Device Testing

```bash
--cpu=1  # No throttling (powerful desktop) - default
--cpu=4  # Mid-range laptop - use for PR validation
--cpu=6  # Low-end device - test for broad audience
--cpu=8  # Very weak device/old mobile
```

## Architecture

### Component Hierarchy

```
App.vue (Main entry)
├── Keypad (unlock screen, 4 digits required)
│   ├── KeypadButton (10 buttons with glass-effect + directives)
│   └── BgToSvg (CRITICAL: generates PNG background)
│
└── RouterView (after unlock)
    └── MainPage
        ├── Intro (hero + 4 interactive rectangles)
        ├── Cases (Case1, Case2, Case3)
        ├── Values
        └── Contacts
```

### Key Directives (Applied to Interactive Elements)

**`v-mask-element`** (`src/directives/mask-element/maskElement.js`)
- Uses **ResizeObserver** - DO NOT DISABLE (critical for glass-effect)
- Syncs background positioning via `syncBackground.js`
- Uses `layoutBatcher.js` to batch DOM reads/writes (prevents layout thrashing)

**`v-hover-distortion`** (`src/directives/hover-distortion/hoverDistortion.js`)
- Applies transform distortion on hover
- Has resize listener (minimal performance impact)
- Used on KeypadButton components

### Glass Effect System

**Core components:**
- `GlassEffect.vue` - Main wrapper component
- `GeFilter.vue` - SVG filter orchestrator with ResizeObserver
- Individual filters: `GeNoise`, `GeLight`, `GeHighlight`, etc.

**Performance characteristics:**
- Uses SVG filters (feGaussianBlur, feDisplacementMap, etc.)
- Has resize listener + ResizeObserver in GeFilter
- Applied to every KeypadButton (10 instances)

### Layout Batching Optimization

**Location:** `src/directives/mask-element/layoutBatcher.js`

Batches all DOM read/write operations in a single requestAnimationFrame:
1. **Read phase:** Collect all getBoundingClientRect calls
2. **Write phase:** Apply all style changes
3. **Result:** Prevents layout thrashing, reduces reflows

Used by `v-mask-element` directive on every interactive element.

## Testing Infrastructure

### Two Test Scenarios

**1. Resize Performance Test** (`tests/e2e/scenarios/resize-performance.js`)
- 20 random viewport resizes
- Measures: time, FPS, memory, degradation
- Detects performance regression over time

**2. Interaction Performance Test** (`tests/e2e/scenarios/interaction-performance.js`)
- Hardcore stress test with 6 interaction patterns:
  - Sequential hovers
  - Activate all
  - Zigzag hovers (stress test)
  - Deactivate reverse
  - Rapid toggle
  - Random hovers
- 150+ interactions per test run
- Uses keypad code: 1515 (4 digits required for unlock)
- Scroll is locked to prevent viewport issues
- Supports multiple browsers via `--browser` flag

### Browser Support

```bash
--browser=chromium  # Default (best for consistent results)
--browser=webkit    # Safari engine (slower, may need increased timeouts)
--browser=firefox   # Firefox engine
```

**Note:** WebKit must be installed: `npx playwright install webkit`

### Test Results Location

All results saved to `tests/e2e/results/`:
- `resize-performance-*.json` - Raw performance data
- `resize-performance-analysis-*.json` - Analyzed metrics
- `interaction-performance-*.json` - Interaction test data

### Known Performance Baselines

From extensive testing (see `.clinerules`):
- **SVG + resize listener:** 10.85s, 467ms avg, +468% degradation ❌
- **PNG + resize listener:** 5.17s, 187ms avg, +501% degradation ⚠️
- **PNG without resize:** 2.61s, 74ms avg, no degradation ✅

## Performance Debugging Process

When degradation is detected:

1. **Check BgToSvg first** (most common culprit)
   - Verify resize listener is disabled in `BgToSvg.vue`
   - Confirm using `toPng` not `toSvg`

2. **Identify components with resize/ResizeObserver:**
   ```bash
   grep -r "addEventListener.*resize" src/ --include="*.vue" --include="*.js"
   grep -r "ResizeObserver" src/ --include="*.vue" --include="*.js"
   ```

3. **Systematic component elimination:**
   - Comment out suspected component
   - Run `npm run test:perf -- --comment="Without ComponentName"`
   - Compare: `npm run test:compare`
   - Repeat until degradation disappears

4. **Check these hot spots:**
   - `src/components/bg-to-svg/BgToSvg.vue` - resize listener
   - `src/components/glass-effect/GeFilter.vue` - SVG filters + ResizeObserver
   - `src/directives/mask-element/maskElement.js` - ResizeObserver (don't disable!)
   - `src/directives/hover-distortion/hoverDistortion.js` - resize listener

## Important File Locations

**Performance-critical files:**
- `src/components/bg-to-svg/BgToSvg.vue` - Main bottleneck when resize enabled
- `src/directives/mask-element/layoutBatcher.js` - Prevents layout thrashing
- `src/directives/mask-element/syncBackground.js` - Background sync logic
- `src/components/glass-effect/GeFilter.vue` - SVG filter system

**Test infrastructure:**
- `tests/e2e/run.js` - Test runner entry point
- `tests/e2e/compare.js` - Results comparison tool
- `tests/e2e/helpers/performance.js` - FPS/memory tracking
- `tests/e2e/helpers/analyzer.js` - Degradation detection

**Configuration:**
- `.clinerules` - Performance testing rules and known baselines
- `tests/e2e/README.md` - Comprehensive testing documentation

## Motion-v Animation Library

This project uses `motion-v` for Vue 3 animations. Components use:
- `<motion.div>` - Animated HTML elements
- `:variants` - Animation state definitions
- `:animate` - Current animation state
- `:transition` - Spring/timing configs

See `IntroRectangle.vue` for reference implementation.

## Common Gotchas

1. **Keypad requires 4 digits** - Tests use code "1515" (4 clicks to unlock)
2. **Viewport matters** - Tests use 1280x800 for consistent coordinates
3. **WebKit is slower** - May need increased timeouts vs Chromium
4. **ResizeObserver in v-mask-element** - Never disable, critical for glass-effect
5. **Scroll blocking in tests** - Interaction test disables scroll to prevent viewport issues
6. **Headless mode** - Use `:headless` suffix or `--headless` flag for faster CI testing
