# Keypad Overlay Mask Implementation

## Overview

Success/fail overlay now uses the same PNG background as a mask, displaying solid colors through the digit shapes.

## Implementation Details

### Approach: CSS mask-image

- Uses existing PNG backgrounds as masks
- No additional files needed
- Clean CSS solution
- High performance

### Colors

- **Success**: `#00FFBC` (green from palette)
- **Fail**: `#FF83A2` (pink from palette)

### Changes Made

#### 1. Keypad.vue - Background & Mask Setup

**Watch for enteredDigits** (lines 88-134):

- Sets `--global-keypad-bg` for base layer
- Sets `--global-keypad-mask` for overlay (same PNG)

#### 2. Keypad.vue - Overlay Color Management

**New watch for animationState** (lines 136-146):

- `'success'` → sets `--overlay-color: #00FFBC`
- `'fail'` → sets `--overlay-color: #FF83A2`
- `'initial'` → sets `--overlay-color: transparent`

#### 3. Keypad.vue - Overlay CSS

**Updated `.background-numbers-overlay`** (lines 399-412):

```css
.background-numbers-overlay {
  z-index: 2;
  /* PNG as mask */
  mask-image: var(--global-keypad-mask);
  -webkit-mask-image: var(--global-keypad-mask);
  mask-size: 150%;
  mask-position: center center;
  mask-repeat: no-repeat;
  /* Solid color shows through mask */
  background-color: var(--overlay-color, transparent);
  /* Smooth transitions */
  opacity: 0;
  transition: opacity 0.5s ease, background-color 0.5s ease;
}
```

## Animation Flow

### Show Overlay (Success/Fail)

1. User enters 4 digits
2. Code is checked with backend
3. `animationState` changes to `'success'` or `'fail'`
4. Watch updates `--overlay-color` (green or pink)
5. Class `.is-visible` added (when `animationState !== 'initial'`)
6. Overlay smoothly transitions: `opacity: 0 → 1` (0.5s)
7. Color appears only through PNG mask (digit shapes)

### Hide Overlay (Reset)

**Critical Order** (to prevent flashing):

1. Set `animationState = 'initial'` (removes `.is-visible` class)
2. Overlay transitions: `opacity: 1 → 0` (0.5s)
3. **Wait 500ms** for transition to complete
4. Clear `enteredDigits = []` (this removes the mask)
5. Reset other states

This order ensures the overlay is fully hidden before the mask is removed, preventing pink/green color from flashing across the entire screen.

## Browser Support

- Modern browsers: `mask-image`
- Safari/WebKit: `-webkit-mask-image` prefix added
