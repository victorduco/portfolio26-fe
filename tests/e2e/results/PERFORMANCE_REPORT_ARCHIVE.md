# Performance Testing Report - IntroRectangle Component
**Date:** 2025-10-05
**Browser:** WebKit (Playwright)
**Test Environment:** macOS, viewport 1600x900

---

## Keypad Investigation (New Notes)

- Without GlassEffect on keypad buttons: noticeably faster interactions and smoother visuals (no SVG filters/ResizeObserver in the button overlay).
- Without hover-distortion: UI still stutters, so removing the distortion alone does not resolve the slowdown.
- Tried: keep distortion enabled, and disable GeBackground re-rendering on data changes (only initial render). Implemented via `GeBackground.vue` prop `observeChanges=false` in `Keypad.vue`.
- Result: still significantly laggy under interaction load.
- Then disabled `v-mask-element` on keypad buttons: lag disappeared as well (similar to removing GlassEffect).
- Conclusion: both GlassEffect and v-mask-element can introduce overhead; keypad feels smooth when either is removed.
- Action: revert probe changes and return keypad to “all on” state for baseline (GlassEffect ON, hover-distortion ON, v-mask-element ON, GeBackground observes changes).

 Files changed during probes (now reverted to baseline settings):
 - src/components/keypad/KeypadButton.vue: GlassEffect ON, v-mask-element ON, hover-distortion ON.
 - src/components/glass-effect/GeBackground.vue: `observeChanges` prop added; currently GeBackground observes changes.
 - src/components/keypad/Keypad.vue: GeBackground uses `:observe-changes="true"`.

No automated metrics captured for these notes yet — qualitative observations only.

---

## What Was Disabled in Each Test

### Test 1: Without motion-v
**File:** `src/pages/main-page/intro/IntroRectangle.vue`

**Changes:**
```diff
- <motion.li
+ <li
-   @hoverStart="isHovered = true"
-   @hoverEnd="isHovered = false"
+   @mouseenter="isHovered = true"
+   @mouseleave="isHovered = false"
-   :variants="boxVariants"
-   :animate="getAnimationState()"
-   :transition="{ default: spring, marginLeft: marginSpring, marginRight: marginSpring }"
-   initial="default"

- <motion.div class="intro-square-content-wrap" :variants="..." :animate="..." :transition="...">
+ <div class="intro-square-content-wrap">

- <motion.div class="intro-content-number" :variants="..." :animate="..." :custom="index">
+ <div class="intro-content-number">

- <motion.div class="intro-content-bullet" :variants="..." :animate="...">
+ <div class="intro-content-bullet">
```

**What was removed:**
- All `<motion.*>` components → replaced with native HTML elements
- All animation variants (boxVariants, contentWrapVariants, squareContentVariants)
- All transition configurations (spring, marginSpring)
- Motion-v event handlers (@hoverStart, @hoverEnd) → replaced with native (@mouseenter, @mouseleave)

---

### Test 2: Without v-mask-element
**File:** `src/pages/main-page/intro/IntroRectangle.vue`

**Changes:**
```diff
- class="mask-element intro-square"
+ class="intro-square"
- v-mask-element="'#171717'"
```

**What was removed:**
- `v-mask-element` directive
- `mask-element` CSS class

**What this disables:**
- ResizeObserver in maskElement.js (line 38: `ro.observe(el)`)
- MutationObserver for attribute changes (line 31-35)
- Background synchronization (syncBackground.js)
- Layout batching system (layoutBatcher.js)
- `.mask-element-inner` div creation

---

### Test 3: Without GlassEffect
**File:** `src/pages/main-page/intro/IntroRectangle.vue`

**Changes:**
```diff
+ <!-- GlassEffect DISABLED for Test 3
  <GlassEffect
    ref="glassEffectRef"
    :user-options="INTRO_GLASS_CONFIG"
    :intensity="glassIntensity"
    static-displacement-map="/distmaps/nummp1.png"
    class="intro-square-glass"
  >
  </GlassEffect>
+ -->
```

**What was removed:**
- Entire `<GlassEffect>` component

**What this disables:**
- GeCard component
- GeFilter component (SVG filters + ResizeObserver)
- GeHighlight component
- GeNoise component
- GeLight component
- All SVG filter effects (feGaussianBlur, feDisplacementMap, etc.)

---

### Test 4: Without GeFilter
**File:** `src/components/glass-effect/GlassEffect.vue`

**Changes:**
```diff
+ <!-- GeFilter DISABLED for Test 4
  <GeFilter
    :options="opts"
    :intensity="finalIntensity"
    :static-displacement-map="finalStaticMap"
    :displacement-mode="finalMode"
  />
+ -->
```

**What was removed:**
- `<GeFilter>` component only (kept GeCard, GeHighlight, GeNoise, GeLight)

**What this disables:**
- SVG filter system (GeFilter.vue)
- ResizeObserver in GeFilter (line 171-172)
- Window resize listener in GeFilter (line 142)
- Window scroll listener in GeFilter (line 141)
- Displacement map rendering (feImage, feDisplacementMap)
- Edge processing filters (GeFilterEdgeProcessing)
- Layout batching for filter updates

---

### Test 5: Without ResizeObserver in GeFilter
**File:** `src/components/glass-effect/GeFilter.vue`

**Changes:**
```diff
  updateMaskRect();
+ // ResizeObserver DISABLED for Test 5
- resizeObserver?.disconnect();
- resizeObserver = new ResizeObserver(updateMaskRect);
- resizeObserver.observe(maskElement);
+ // resizeObserver?.disconnect();
+ // resizeObserver = new ResizeObserver(updateMaskRect);
+ // resizeObserver.observe(maskElement);
  toggleListeners(true);
```

**What was removed:**
- ResizeObserver initialization (line 171)
- ResizeObserver.observe() call (line 172)

**What remains active:**
- Window resize listener (still active via toggleListeners)
- Window scroll listener (still active via toggleListeners)
- Initial updateMaskRect() call
- All SVG filters and other GlassEffect components

---

## Test Summary

| Test | Description | Total Time | FPS Avg | FPS Min/Max | Individual Hover Avg |
|------|-------------|------------|---------|-------------|---------------------|
| **Baseline** | Full setup (all features) | 23.70s | 26.17 | 15 / 44 | **818ms** |
| **Test 1** | Without motion-v | 11.60s | 72.20 | 69 / 85 | **41ms** |
| **Test 2** | Without v-mask-element | 19.20s | 67.00 | 60 / 78 | **763ms** |
| **Test 3** | Without GlassEffect | 22.36s | 64.50 | 60 / 67 | **617ms** |
| **Test 4** | Without GeFilter | 18.71s | 65.83 | 60 / 73 | **764ms** |
| **Test 5** | Without ResizeObserver | 20.35s | 33.67 | 20 / 53 | **809ms** |

---

## Detailed Metrics

### Baseline (Full Setup)
**Components:** motion-v + v-mask-element + GlassEffect + GeFilter + ResizeObserver

| Metric | Value |
|--------|-------|
| Total Test Time | 23.70s (23,702ms) |
| Total Interactions | 29 |
| Average Interaction Duration | 2,347ms |
| Min/Max Interaction | 111ms / 6,178ms |
| **Individual Hover Timings** | **[50ms, 1493ms, 111ms, 1618ms]** |
| **Individual Hover Average** | **818ms** |
| FPS Average | 26.17 |
| FPS Min/Max | 15 / 44 |
| FPS History | [37, 44, 15, 15, 15, 31] |

**Pattern Breakdown:**
- hover-sequential: 3,374ms
- activate-all: 251ms
- hover-zigzag: 3,923ms
- deactivate-reverse: 250ms
- rapid-toggle: 111ms
- hover-random: 6,178ms

**Key Observation:** 2 out of 4 hovers show **~1.5 second delay** (1493ms, 1618ms)

---

### Test 1: Without motion-v
**Change:** Removed all `<motion.*>` components, replaced with native elements

| Metric | Value | vs Baseline |
|--------|-------|-------------|
| Total Test Time | 11.60s (11,601ms) | **-51% ✅** |
| Average Interaction Duration | 293ms | **-87% ✅** |
| Min/Max Interaction | 97ms / 520ms | **-91% / -92% ✅** |
| **Individual Hover Timings** | **[47ms, 38ms, 40ms, 40ms]** | **-95% ✅** |
| **Individual Hover Average** | **41ms** | **-95% ✅** |
| FPS Average | 72.20 | **+176% ✅** |
| FPS Min/Max | 69 / 85 | **+360% / +93%** |
| FPS History | [69, 69, 69, 69, 85] | Stable high FPS |

**Pattern Breakdown:**
- hover-sequential: 271ms (was 3,374ms) **-92%**
- activate-all: 234ms (was 251ms)
- hover-zigzag: 520ms (was 3,923ms) **-87%**
- deactivate-reverse: 231ms (was 250ms)
- rapid-toggle: 97ms (was 111ms)
- hover-random: 406ms (was 6,178ms) **-93%**

**Key Finding:** NO more 1.5s delays! All hovers consistently ~40ms

---

### Test 2: Without v-mask-element
**Change:** Removed `v-mask-element` directive (syncBackground + ResizeObserver)

| Metric | Value | vs Baseline |
|--------|-------|-------------|
| Total Test Time | 19.20s (19,196ms) | **-19% ✅** |
| Average Interaction Duration | 1,584ms | **-32% ✅** |
| Min/Max Interaction | 111ms / 3,795ms | **0% / -39%** |
| **Individual Hover Timings** | **[48ms, 1475ms, 54ms, 1475ms]** | **-7%** |
| **Individual Hover Average** | **763ms** | **-7%** |
| FPS Average | 67.00 | **+156% ✅** |
| FPS Min/Max | 60 / 78 | **+300% / +77%** |
| FPS History | [63, 63, 60, 78, 78, 60] | More stable |

**Pattern Breakdown:**
- hover-sequential: 3,158ms (was 3,374ms) **-6%**
- activate-all: 255ms (was 251ms)
- hover-zigzag: 1,941ms (was 3,923ms) **-51% ✅**
- deactivate-reverse: 246ms (was 250ms)
- rapid-toggle: 111ms (was 111ms)
- hover-random: 3,795ms (was 6,178ms) **-39% ✅**

**Key Observation:** Still has 1.5s delays on hovers 2 & 4, but zigzag and random improved

---

### Test 3: Without GlassEffect
**Change:** Removed entire GlassEffect component

| Metric | Value | vs Baseline |
|--------|-------|-------------|
| Total Test Time | 22.36s (22,363ms) | **-6%** |
| Average Interaction Duration | 2,108ms | **-10%** |
| Min/Max Interaction | 109ms / 7,514ms | **-2% / +22%** |
| **Individual Hover Timings** | **[46ms, 1459ms, 39ms, 924ms]** | **-25% ✅** |
| **Individual Hover Average** | **617ms** | **-25% ✅** |
| FPS Average | 64.50 | **+147% ✅** |
| FPS Min/Max | 60 / 67 | **+300% / +52%** |
| FPS History | [63, 63, 67, 67, 67, 60] | Stable 60-67 |

**Pattern Breakdown:**
- hover-sequential: 2,573ms (was 3,374ms) **-24% ✅**
- activate-all: 257ms (was 251ms)
- hover-zigzag: 1,945ms (was 3,923ms) **-50% ✅**
- deactivate-reverse: 251ms (was 250ms)
- rapid-toggle: 109ms (was 111ms)
- hover-random: 7,514ms (was 6,178ms) **+22% ❌**

**Key Observation:** Hover 2 still ~1.5s, but Hover 4 improved to 924ms (was 1618ms)

---

### Test 4: Without GeFilter
**Change:** Removed GeFilter component (SVG filters + ResizeObserver)

| Metric | Value | vs Baseline |
|--------|-------|-------------|
| Total Test Time | 18.71s (18,715ms) | **-21% ✅** |
| Average Interaction Duration | 1,734ms | **-26% ✅** |
| Min/Max Interaction | 110ms / 4,682ms | **-1% / -24%** |
| **Individual Hover Timings** | **[50ms, 1475ms, 56ms, 1474ms]** | **-7%** |
| **Individual Hover Average** | **764ms** | **-7%** |
| FPS Average | 65.83 | **+152% ✅** |
| FPS Min/Max | 60 / 73 | **+300% / +66%** |
| FPS History | [63, 63, 60, 73, 73, 63] | Stable |

**Pattern Breakdown:**
- hover-sequential: 3,158ms (was 3,374ms) **-6%**
- activate-all: 256ms (was 251ms)
- hover-zigzag: 1,944ms (was 3,923ms) **-50% ✅**
- deactivate-reverse: 255ms (was 250ms)
- rapid-toggle: 110ms (was 111ms)
- hover-random: 4,682ms (was 6,178ms) **-24% ✅**

**Key Observation:** Still has 1.5s delays, similar to baseline

---

### Test 5: Without ResizeObserver in GeFilter
**Change:** Disabled ResizeObserver in GeFilter.vue

| Metric | Value | vs Baseline |
|--------|-------|-------------|
| Total Test Time | 20.35s (20,348ms) | **-14%** |
| Average Interaction Duration | 1,833ms | **-22%** |
| Min/Max Interaction | 112ms / 4,497ms | **+1% / -27%** |
| **Individual Hover Timings** | **[49ms, 1474ms, 110ms, 1601ms]** | **-1%** |
| **Individual Hover Average** | **809ms** | **-1%** |
| FPS Average | 33.67 | **+29%** |
| FPS Min/Max | 20 / 53 | **+33% / +20%** |
| FPS History | [40, 49, 20, 20, 20, 53] | Unstable, drops to 20 |

**Pattern Breakdown:**
- hover-sequential: 3,339ms (was 3,374ms) **-1%**
- activate-all: 252ms (was 251ms)
- hover-zigzag: 2,549ms (was 3,923ms) **-35% ✅**
- deactivate-reverse: 246ms (was 250ms)
- rapid-toggle: 112ms (was 111ms)
- hover-random: 4,497ms (was 6,178ms) **-27% ✅**

**Key Observation:** Virtually no improvement, FPS actually worse

---

## Individual Hover Analysis

### Pattern Discovery
All tests show a **consistent pattern** for the 4 sequential hovers:

| Test | Hover 1 | Hover 2 | Hover 3 | Hover 4 | Pattern |
|------|---------|---------|---------|---------|---------|
| **Baseline** | 50ms | **1493ms** ❌ | 111ms | **1618ms** ❌ | Fast-Slow-Fast-Slow |
| **Test 1** | 47ms | 38ms ✅ | 40ms | 40ms ✅ | Fast-Fast-Fast-Fast |
| **Test 2** | 48ms | **1475ms** ❌ | 54ms | **1475ms** ❌ | Fast-Slow-Fast-Slow |
| **Test 3** | 46ms | **1459ms** ❌ | 39ms | **924ms** ⚠️ | Fast-Slow-Fast-Medium |
| **Test 4** | 50ms | **1475ms** ❌ | 56ms | **1474ms** ❌ | Fast-Slow-Fast-Slow |
| **Test 5** | 49ms | **1474ms** ❌ | 110ms | **1601ms** ❌ | Fast-Slow-Fast-Slow |

### Key Findings:

1. **Alternating Pattern:** Hovers 1 & 3 are fast (~40-50ms), Hovers 2 & 4 are slow (~1500ms)
2. **Only Test 1 (no motion-v) breaks the pattern** - all hovers become consistently fast
3. **Test 3 (no GlassEffect) partially helps** - Hover 4 drops from 1618ms to 924ms
4. **All other tests maintain the slow pattern**

---

## FPS Stability Analysis

### FPS Over Time (6 measurements per test)

| Test | Measurement Points | Stability |
|------|--------------------|-----------|
| **Baseline** | [37, 44, 15, 15, 15, 31] | **Unstable, drops to 15** ❌ |
| **Test 1** | [69, 69, 69, 69, 85] | **Very stable 69-85** ✅ |
| **Test 2** | [63, 63, 60, 78, 78, 60] | **Stable 60-78** ✅ |
| **Test 3** | [63, 63, 67, 67, 67, 60] | **Very stable 60-67** ✅ |
| **Test 4** | [63, 63, 60, 73, 73, 63] | **Stable 60-73** ✅ |
| **Test 5** | [40, 49, 20, 20, 20, 53] | **Unstable, drops to 20** ❌ |

### Observations:
- Baseline shows severe FPS drops (15 FPS for 3 consecutive measurements)
- Test 1 achieves highest and most stable FPS
- Tests 2-4 all improve FPS stability significantly
- Test 5 (no ResizeObserver) actually makes FPS WORSE

---

## Performance Impact Summary

### Total Time Improvement
```
Baseline: 23.70s (100%)
  ├─ Test 1: 11.60s (-51%) ✅ BEST
  ├─ Test 4: 18.71s (-21%) ✅
  ├─ Test 2: 19.20s (-19%) ✅
  ├─ Test 5: 20.35s (-14%)
  └─ Test 3: 22.36s (-6%)
```

### Individual Hover Latency
```
Baseline: 818ms avg (100%)
  ├─ Test 1: 41ms (-95%) ✅ BEST
  ├─ Test 3: 617ms (-25%) ✅
  ├─ Test 2: 763ms (-7%)
  ├─ Test 4: 764ms (-7%)
  └─ Test 5: 809ms (-1%)
```

### FPS Average
```
Baseline: 26.17 FPS (100%)
  ├─ Test 1: 72.20 FPS (+176%) ✅ BEST
  ├─ Test 2: 67.00 FPS (+156%) ✅
  ├─ Test 4: 65.83 FPS (+152%) ✅
  ├─ Test 3: 64.50 FPS (+147%) ✅
  └─ Test 5: 33.67 FPS (+29%)
```

---

## Component Contribution Analysis

### Impact on Hover Latency (818ms → target)

| Component | Removed In | Result | Impact |
|-----------|-----------|--------|--------|
| **motion-v** | Test 1 | 41ms | **-95% ✅ CRITICAL** |
| **GlassEffect** | Test 3 | 617ms | **-25% ✅ SIGNIFICANT** |
| **v-mask-element** | Test 2 | 763ms | -7% (minor) |
| **GeFilter** | Test 4 | 764ms | -7% (minor) |
| **ResizeObserver** | Test 5 | 809ms | -1% (negligible) |

### FPS Impact

| Component | FPS Improvement |
|-----------|----------------|
| **motion-v** | +176% ✅ |
| **v-mask-element** | +156% ✅ |
| **GeFilter** | +152% ✅ |
| **GlassEffect** | +147% ✅ |
| **ResizeObserver** | +29% |

---

## Visual Performance Notes

**User Report:** Tests 2 & 3 feel significantly better visually, despite similar metrics

### Possible Explanations:

1. **Frame consistency** matters more than average FPS
   - Test 2 & 3 have more stable FPS (60-78 range)
   - Baseline has wild swings (15-44 range)

2. **Hover response time** varies:
   - Even with similar averages, the *distribution* of delays matters
   - 50% fast + 50% slow feels better than consistent medium

3. **Visual artifacts:**
   - GlassEffect removal (Test 3) may eliminate visual "hitches" during transitions
   - v-mask-element removal (Test 2) may reduce background sync artifacts

---

## Anomalies & Interesting Findings

### 1. Test 3 (No GlassEffect) - Random Pattern Slower
- hover-random increased from 6,178ms to 7,514ms (+22%)
- Possible cause: Different rendering path without glass effects
- Needs investigation

### 2. Test 5 (No ResizeObserver) - Performance Degradation
- FPS drops to 20 (worse than baseline 15)
- Hover latency unchanged
- Hypothesis: Layout calculations become more expensive without batched updates

### 3. Alternating Hover Pattern (Fast-Slow-Fast-Slow)
- Appears in ALL tests except Test 1
- Consistent timing: ~50ms / ~1500ms / ~50ms / ~1500ms
- Suggests **animation/transition state machine issue** in motion-v
- Possible causes:
  - First hover triggers animation state change
  - Second hover waits for previous animation to complete
  - Pattern repeats for subsequent hovers

---

## Technical Data

### Test Configuration
- **Browser:** WebKit (Safari engine via Playwright)
- **Viewport:** 1600x900
- **CPU Throttling:** 1x (no throttling)
- **Headless:** No (visible window)
- **Interaction Rounds:** 1
- **Total Interactions per Test:** 29
- **Patterns Tested:** 6 (sequential hover, activate, zigzag, deactivate, rapid toggle, random hover)

### Measurement Points
FPS measured 6 times per test:
1. After Pattern 1 (sequential hovers)
2. After Pattern 2 (activate all)
3. After Pattern 3 (zigzag hovers)
4. After Pattern 4 (deactivate reverse)
5. After Pattern 5 (rapid toggle)
6. After Pattern 6 (random hovers)

---

## Raw Data Files

All raw results saved to: `/tests/e2e/results/`

- `interaction-performance-2025-10-05T15-33-13-641Z.json` - Baseline
- `interaction-performance-2025-10-05T15-38-03-579Z.json` - Test 1
- `interaction-performance-2025-10-05T15-38-57-357Z.json` - Test 2
- `interaction-performance-2025-10-05T15-39-55-611Z.json` - Test 3
- `interaction-performance-2025-10-05T15-42-52-363Z.json` - Test 4
- `interaction-performance-2025-10-05T15-43-52-502Z.json` - Test 5
