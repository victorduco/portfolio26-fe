// Spring конфигурация для текста
export const spring = {
  type: "spring",
  stiffness: 114,
  damping: 13,
  mass: 1.5,
};

// Плавная анимация для ромбиков без overshoot
export const smoothTransition = {
  type: "tween",
  duration: 0.25,
  ease: "easeInOut",
};

// Варианты для элемента навигации
export const navItemVariants = {
  default: {
    rotate: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  hover: {
    rotate: 45,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  pressed: {
    rotate: 45,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  active: {
    rotate: 45,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
};

// Варианты для текстовой метки
export const labelVariants = {
  default: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
  },
  active: {
    opacity: 1,
  },
};
