// Spring конфигурация для текста
export const spring = {
  type: "spring",
  stiffness: 114,
  damping: 13,
  mass: 1.5,
};

// Легкая пружинка для ромбиков
export const smoothTransition = {
  type: "spring",
  stiffness: 250,
  damping: 15,
  mass: 1,
};

// Варианты для элемента навигации
export const navItemVariants = {
  default: {
    rotate: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    opacity: 1,
  },
  hover: {
    rotate: 45,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    opacity: 1,
  },
  pressed: {
    rotate: 45,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    opacity: 1,
  },
  active: {
    rotate: 45,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    opacity: 1,
  },
  introHighlight: {
    rotate: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    opacity: 1,
  },
  hidden: {
    opacity: 0,
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
  introHighlight: {
    opacity: 1,
  },
};
