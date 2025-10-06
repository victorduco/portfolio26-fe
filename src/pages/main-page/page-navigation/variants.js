// Spring конфигурация для текста
export const spring = {
  type: "spring",
  stiffness: 114,
  damping: 13,
  mass: 1.5,
};

// Пружинка для ромбиков (чуть заметнее качается)
export const smoothTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};

export const opacityTween = {
  type: "tween",
  duration: 0.2,
  ease: "easeOut",
};

export const backgroundTween = {
  type: "tween",
  duration: 0.3,
  ease: "easeInOut",
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
  introGreen: {
    rotate: 0,
    backgroundColor: "#00FFBC",
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
    color: "rgba(255, 255, 255, 0.9)",
  },
  hover: {
    opacity: 1,
    color: "rgba(255, 255, 255, 0.9)",
  },
  active: {
    opacity: 1,
    color: "rgba(255, 255, 255, 0.9)",
  },
  introGreen: {
    opacity: 1,
    color: "#00FFBC",
  },
  introFadeOut: {
    opacity: 0,
    color: "#00FFBC",
  },
  introHighlight: {
    opacity: 1,
    color: "rgba(255, 255, 255, 0.9)",
  },
};
