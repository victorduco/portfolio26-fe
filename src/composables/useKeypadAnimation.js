/**
 * Composable for keypad animation state management
 */
import { forceReflow } from './useKeypadBackground.js';
import { ANIMATION_DELAYS } from '@/constants/keypadConstants.js';

/**
 * Resets animation states to initial
 */
export const resetAnimationState = (animationState, bgNumbersState, keypadGridState = null) => {
  animationState.value = "initial";
  bgNumbersState.value = "initial";
  if (keypadGridState) {
    keypadGridState.value = "initial";
  }
};

/**
 * Creates a delay promise
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Animates fade sequence with success/fail color and optional unlock
 * Consolidates the complex animation logic
 */
export const animateFadeSequence = async ({
  animationState,
  bgNumbersState,
  keypadGridState,
  isResetting,
  enteredDigits,
  colorState,
  shouldUnlock,
  onUnlock,
}) => {
  animationState.value = colorState;
  await delay(ANIMATION_DELAYS.COLOR_OVERLAY);

  bgNumbersState.value = "fadeOut";
  await delay(ANIMATION_DELAYS.FADE_OUT);

  if (shouldUnlock) {
    await delay(ANIMATION_DELAYS.UNLOCK);
    onUnlock();
  } else {
    animationState.value = "initial";
    await delay(ANIMATION_DELAYS.RESET_START);

    isResetting.value = true;
    enteredDigits.value = [];
    await delay(ANIMATION_DELAYS.CLEAR_DIGITS);

    forceReflow();
    await delay(ANIMATION_DELAYS.REFLOW);

    resetAnimationState(animationState, bgNumbersState, keypadGridState);

    await delay(ANIMATION_DELAYS.REFLOW);
    isResetting.value = false;
    await delay(ANIMATION_DELAYS.REFLOW);
  }
};
