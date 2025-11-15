// Check if user prefers reduced motion
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

// Анимация для цифр после завершения ввода
// Создаем варианты для каждого цвета
export const createDigitVariants = (color) => ({
  initial: {
    color: color,
  },
  success: {
    color: "#00FFBC", // зеленый цвет из палитры
  },
});

export const digitTransition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.3 };

// Анимация fade out для клавиатуры
export const keypadGridVariants = {
  initial: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
};

export const keypadGridTransition = prefersReducedMotion
  ? { duration: 0 }
  : {
      type: "tween",
      duration: 0.5,
      ease: "easeOut",
    };

// Анимация fade out для цифр (после клавиатуры)
export const backgroundNumbersVariants = {
  initial: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
};

export const backgroundNumbersTransition = prefersReducedMotion
  ? { duration: 0 }
  : {
      type: "tween",
      duration: 0.25,
      ease: "easeOut",
    };
