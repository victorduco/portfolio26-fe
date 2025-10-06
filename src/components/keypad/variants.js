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

export const digitTransition = {
  duration: 0.3,
};

// Анимация fade out для клавиатуры
export const keypadGridVariants = {
  initial: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
};

export const keypadGridTransition = {
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

export const backgroundNumbersTransition = {
  type: "tween",
  duration: 0.5,
  ease: "easeOut",
};
