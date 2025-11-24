const prefersReducedMotion = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const createTransition = (duration, ease) => prefersReducedMotion
  ? { duration: 0 }
  : { type: "tween", duration, ease };

export const createDigitVariants = (color) => ({
  initial: { color },
  success: { color: "#00FFBC" },
});

export const digitTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.3 };

const fadeVariants = { initial: { opacity: 1 }, fadeOut: { opacity: 0 } };

export const keypadGridVariants = fadeVariants;
export const keypadGridTransition = createTransition(0.5, "easeOut");

export const backgroundNumbersVariants = fadeVariants;
export const backgroundNumbersTransition = createTransition(0.25, "easeOut");
