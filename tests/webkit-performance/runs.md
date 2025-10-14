# Test Runs History

## ✅ Stage 1: Performance Isolation Tests - COMPLETED

### Goal

Identify exact source of frame drops by disabling components one by one

### Test Plan

#### 1. Baseline (current)

- **Status:** ✅ DONE
- **Config:** All features enabled
- **Results:** 56.5% frame drops, 17.4s stalling
- **Command:** Current test

#### 2. Disable GlassEffect Component

- **Status:** ✅ DONE
- **What:** Comment out `<GlassEffect>` in KeypadButton.vue
- **Expected:** Should reduce GPU load from displacement filter
- **File:** `src/components/keypad/KeypadButton.vue` line 17-20
- **Change:** Comment `<GlassEffect>` component

#### 3. Disable GeDisplacement Filter Only

- **Status:** ✅ DONE
- **What:** Keep GlassEffect but disable displacement map
- **Expected:** Reduce SVG filter overhead
- **File:** `src/components/keypad/glassEffectConfig.js`
- **Change:** Set `displacementMap: ""` or `displacementScale: 0`

#### 4. Disable Background Numbers

- **Status:** ✅ DONE
- **What:** Disable big background numbers rendering
- **Expected:** Reduce layout/paint cost
- **File:** `src/components/keypad/Keypad.vue`
- **Change:** Comment out `.background-numbers` divs

#### 5. Disable Keypad Button Backgrounds

- **Status:** ✅ DONE
- **What:** Disable mask-element background sync
- **Expected:** Reduce mask-element overhead
- **File:** `src/components/keypad/KeypadButton.vue`
- **Change:** Remove `v-mask-element` or disable background in CSS

#### 6. Disable Hover Distortion

- **Status:** ✅ DONE
- **What:** Disable v-hover-distortion directive
- **Expected:** Check if 3D distortion on hover adds overhead
- **File:** `src/components/keypad/KeypadButton.vue`
- **Change:** Remove or disable `v-hover-distortion`

### Results Tracking

| Test                  | Frame Drops       | Stall Time | Worst Gap | Notes                               |
| --------------------- | ----------------- | ---------- | --------- | ----------------------------------- |
| Baseline              | 56.5% (1450/2565) | 17380.9ms  | 459ms     | All features ON                     |
| No GlassEffect        | 55.8% (1732/3104) | **75.3ms** | **92ms**  | 🔥 231x improvement!                |
| No Displacement       | 55.3% (1702/3078) | **43.3ms** | **60ms**  | 🔥 Displacement is the culprit!     |
| No Background Numbers | 56.2% (1465/2607) | 13496.5ms  | 404ms     | Minor improvement (-22%)            |
| No Button Backgrounds | 55.1% (1714/3109) | **34.3ms** | **51ms**  | 🔥 mask-element is part of issue!   |
| No Hover Distortion   | 58.2% (1390/2388) | 36125.7ms  | 518ms     | ⚠️ WORSE! Distortion helps somehow? |

### 🎯 Conclusions

**Primary Culprit:** GlassEffect displacement filter (SVG feDisplacementMap)

- Removing just displacement: **401x improvement** (17.4s → 43ms)
- Removing GlassEffect entirely: **231x improvement** (17.4s → 75ms)
- Removing mask-element: **507x improvement** (17.4s → 34ms)

**Secondary Issue:** Background numbers contribute ~22% overhead

**Root Cause:** SVG displacement filter applied via mask-element creates massive GPU/compositing bottleneck in WebKit

**Recommendation:** Replace displacement filter with simpler effect or optimize mask-element implementation

---

## TODO - Stage 2: GeFilter Optimization Tests

### Goal

Optimize GeFilter performance without changing visual effect

### Hypotheses to Test

#### 1. Reduce displacementScale (PRIORITY: HIGH)

- **What:** Lower displacementScale from 300 to 100-150
- **Why:** Scale 300 too high for WebKit SVG filter processing
- **Expected:** Less GPU load, visual almost identical
- **File:** `src/components/keypad/glassEffectConfig.js` line 3
- **Change:** `displacementScale: 150` (or 100)
- **Status:** ⏸️ TODO

#### 2. Add will-change to mask-element (PRIORITY: HIGH)

- **What:** Add `will-change: filter, transform` to CSS
- **Why:** WebKit doesn't know element will animate frequently
- **Expected:** Better GPU compositing, separate layer
- **File:** `src/directives/mask-element/maskElement.css`
- **Change:** Add `will-change: filter, transform;` to `.mask-element`
- **Status:** ⏸️ TODO

#### 3. Add transform: translateZ(0) for GPU acceleration (PRIORITY: HIGH)

- **What:** Force GPU layer with transform
- **Why:** Ensure hardware acceleration active
- **Expected:** Dedicated compositing layer
- **File:** `src/components/glass-effect/GeDisplacement.vue` CSS
- **Change:** Add `transform: translateZ(0);` to `.glass-filter`
- **Status:** ⏸️ TODO

#### 4. Add CSS contain property (PRIORITY: HIGH)

- **What:** Add `contain: layout style paint` to button wrapper
- **Why:** Isolate layout calculations to button only
- **Expected:** Limit repaint scope, faster layout
- **File:** `src/components/keypad/KeypadButton.vue` CSS
- **Change:** Add `contain: layout style paint;` to `.keypad-button-wrapper`
- **Status:** ⏸️ TODO

#### 5. Debounce updateMaskRect calls (PRIORITY: MEDIUM)

- **What:** Throttle updateMaskRect to max 1 call per 16ms
- **Why:** Too many rect updates on scroll/resize
- **Expected:** 50-80% fewer rect calculations
- **File:** `src/components/glass-effect/GeDisplacement.vue` line 47
- **Change:** Wrap updateMaskRect in throttle/debounce
- **Status:** ⏸️ TODO

#### 6. Disconnect ResizeObserver when not hovering (PRIORITY: MEDIUM)

- **What:** Enable observer only during hover state
- **Why:** Wasted work when button inactive
- **Expected:** 80% less observer overhead
- **File:** `src/components/glass-effect/GeDisplacement.vue`
- **Change:** Connect/disconnect observer based on hover state
- **Status:** ⏸️ TODO

#### 7. Cache filterId CSS value (PRIORITY: LOW)

- **What:** Set filter URL once, don't recalculate
- **Why:** Avoid style recalculations
- **Expected:** Minor improvement in style updates
- **File:** `src/components/glass-effect/GeDisplacement.vue` line 92
- **Change:** Set once in applyFilterToMaskElement, don't update
- **Status:** ⏸️ TODO

#### 8. Round rect coordinates to 4px grid (PRIORITY: LOW)

- **What:** Round to nearest 4px instead of 1px
- **Why:** Reduce sub-pixel invalidations
- **Expected:** Fewer repaints on micro-movements
- **File:** `src/components/glass-effect/GeDisplacement.vue` line 54-59
- **Change:** `Math.round(value / 4) * 4`
- **Status:** ⏸️ TODO

#### 9. Optimize layoutBatcher batching strategy (PRIORITY: MEDIUM)

- **What:** Group multiple scheduleTask before RAF
- **Why:** Currently each call creates RAF, could batch better
- **Expected:** Fewer RAF cycles, consolidated reads/writes
- **File:** `src/directives/mask-element/layoutBatcher.js`
- **Change:** Add small delay before scheduleBatch RAF
- **Status:** ⏸️ TODO

#### 10. Replace ResizeObserver with IntersectionObserver (PRIORITY: LOW)

- **What:** Use IntersectionObserver with threshold
- **Why:** Only trigger on meaningful visibility changes
- **Expected:** 30-50% fewer callbacks
- **File:** `src/components/glass-effect/GeDisplacement.vue` line 97
- **Change:** Replace with IntersectionObserver
- **Status:** ⏸️ TODO

### Recommended Test Order

1. **#1** - Reduce displacementScale (easiest, one number)
2. **#2** - Add will-change (one CSS line)
3. **#3** - Add translateZ(0) (one CSS line)
4. **#4** - Add contain (one CSS line)
5. **#5** - Debounce updateMaskRect
6. **#6** - Conditional ResizeObserver
7. **#7** - Cache filterId
8. **#8** - Coarser rounding
9. **#9** - Optimize batcher
10. **#10** - Replace observer

### Results Tracking - Stage 2

| Hypothesis               | Frame Drops | Stall Time | Worst Gap | Improvement | Notes               |
| ------------------------ | ----------- | ---------- | --------- | ----------- | ------------------- |
| Baseline (Stage 1)       | 56.5%       | 17380.9ms  | 459ms     | -           | Current performance |
| #1 Scale 150             | ?           | ?          | ?         | ?           | -                   |
| #2 will-change           | ?           | ?          | ?         | ?           | -                   |
| #3 translateZ            | ?           | ?          | ?         | ?           | -                   |
| #4 contain               | ?           | ?          | ?         | ?           | -                   |
| #5 debounce              | ?           | ?          | ?         | ?           | -                   |
| #6 conditional observer  | ?           | ?          | ?         | ?           | -                   |
| #7 cache filterId        | ?           | ?          | ?         | ?           | -                   |
| #8 coarse rounding       | ?           | ?          | ?         | ?           | -                   |
| #9 optimize batcher      | ?           | ?          | ?         | ?           | -                   |
| #10 IntersectionObserver | ?           | ?          | ?         | ?           | -                   |

### Commands

```bash
# 1. Baseline (current)
cd tests/webkit-performance && npm run test:headed

# 2-6. After making each change:
# - Edit file
# - Run test
# - Record results in table above
# - Revert change before next test
```

---

# Past Runs

## Run #1 - 2025-10-14

### Configuration

- **Browser:** WebKit (Safari)
- **Viewport:** 1920x980
- **Window Position:** 0,25 (top-left, below menu bar)
- **SlowMo:** 70ms
- **Test Duration:** ~41s

### Test Scenario

- **Sequences:** 3 cycles of button presses
  - Cycle 1: 5, 8, 0
  - Cycle 2: 1, 2, 3
  - Cycle 3: 7, 4, 9
- **Mouse Movement:** Chaotic with zigzag pattern (25 steps per button, 20 steps to Clear)
- **Hover Duration:** 100ms per button
- **Click Delay:** 70ms after each click
- **Clear Delay:** 170ms after Clear

### Results

#### Performance Metrics

- **Frame drops detected:** 94
- **Frame gaps ≥ 50ms:** 86
- **Total stall time:** 11994.8ms
- **Worst frame gap:** 461ms @ 19051ms
- **First Contentful Paint:** 2142ms
- **CLS Score:** 0.000

#### Top 10 Frame Gaps

1. 461ms @ 19051ms
2. 444ms @ 30647ms
3. 443ms @ 25241ms
4. 408ms @ 2836ms
5. 408ms @ 9721ms
6. 408ms @ 13022ms
7. 401ms @ 22034ms
8. 365ms @ 39474ms
9. 352ms @ 35290ms
10. 349ms @ 37120ms

#### Detailed Analysis

- **Rendering Performance:**
  - Total frames: 0 (tracking issue)
  - Dropped frames: 0 (tracking issue)
  - Average frame duration: 0ms (tracking issue)
- **DOM Operations:**

  - Total mutations: 0 (tracking issue)
  - Nodes added: 0 (tracking issue)
  - Nodes removed: 0 (tracking issue)

- **Network Activity:**
  - Total resources: 0 (tracking issue)
  - Total size: 0MB (tracking issue)

#### Identified Bottlenecks

- **CRITICAL:** excessive-frame-gaps
  - Count: 49 gaps
  - Average gap: 229.14ms
  - Location: Throughout animation cycles

### Critical Issues

- ⚠️ Severe frame stalling: 11994.8ms total
- ⚠️ 49 excessive frame gaps averaging 229ms
- ⚠️ Frame gaps during button animations (400-461ms)

### Timeline Markers

```
3188ms  - page-ready
3192ms  - cycle-1-start
5866ms  - click button 5
8989ms  - click button 8
12277ms - click button 0
14879ms - clear cycle 1
15055ms - cycle-2-start
17786ms - click button 1
21305ms - click button 2
24418ms - click button 3
27141ms - clear cycle 2
27315ms - cycle-3-start
29827ms - click button 7
33121ms - click button 4
36605ms - click button 9
39184ms - clear cycle 3
39359ms - test-completed
```

### Observations

- Consistent lag spikes around 400-460ms during button interactions
- Frame gaps appear during:
  - Initial page load (~400ms @ 2836ms)
  - Each button click animation
  - Clear button animations
- No long tasks detected (all < 120ms)
- No layout shifts detected
- Detailed profiling metrics not collecting (DOM mutations, network, rendering frames)

### Notes

- Detailed profiling needs debugging - DOM/Network/Rendering metrics returning 0
- Main performance issue is in animation rendering, not JavaScript execution
- Likely GPU/compositing bottleneck rather than CPU

### Files Generated

- `performance-summary.md`
- `performance-metrics.json`
- `performance-analysis.json`
- `detailed-profiling.md`
- `detailed-metrics.json`
- `recommendations.json`

---
