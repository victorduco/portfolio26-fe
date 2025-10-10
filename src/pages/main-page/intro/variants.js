import { delay } from "motion-v";

// Color mappings for different states
const COLOR_MAP = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const BORDER_COLOR_MAP = ["#9cd7ffff", "#FF83A2", "#00FFBC", "#FFFF78"];

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getColorWithAlpha = (index, alpha) => {
  const color = COLOR_MAP[index] || COLOR_MAP[0];
  return hexToRgba(color, alpha);
};

const getBorderColorWithAlpha = (index, alpha) => {
  const color = BORDER_COLOR_MAP[index] || BORDER_COLOR_MAP[0];
  return hexToRgba(color, alpha);
};

export const spring = {
  type: "spring",
  stiffness: 57, // достаточно жёсткая пружина
  damping: 13, // небольшое затухание → несколько колебаний
  mass: 1.5, // инерция побольше для реализма
};

export const marginSpring = {
  type: "spring",
  stiffness: 100, // достаточно жёсткая пружина
  damping: 13, // небольшое затухание → несколько колебаний
  mass: 1.5, // инерция побольше для реализма
  delay: 0.1,
};

export const textShadowSpring = {
  type: "spring",
  stiffness: 100,
  damping: 13,
  mass: 1.5,
  delay: 0.2,
};

// main box
export const boxVariants = {
  default: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    // Колонки: 1, 3, 5, 7 (пропускаем четные для пустых ячеек)
    const gridCol = index * 2 + 1;
    return {
      "--element-side-size": "120px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      gridColumn: gridCol,
      gridRow: "1",
      rotate: 0,
      scale: 1,
      "--border-color": "#ffffff10",
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0),
    };
  },
  hover: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    const gridCol = index * 2 + 1;

    return {
      "--element-side-size": "400px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      gridColumn: gridCol,
      gridRow: "1",
      marginTop: "-150px",
      rotate: 15,
      scale: 1,
      "--border-color": getBorderColorWithAlpha(index, 0.1),
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0.2),
    };
  },
  active: ({ index, additionalMargin }) => {
    // Компенсация для поворота: диагональ 600px при 45° ≈ 848px
    // Четные элементы (нижние) нужно раздвинуть чтобы не наезжали на соседей
    const baseMarginLeft = index % 2 === 0 ? -80 : -50;
    const baseMarginRight = index % 2 === 0 ? -80 : -50;
    const gridCol = index * 2 + 1;
    // Четные (0,2) - нижний ряд, нечетные (1,3) - верхний ряд
    const topOffset = index % 2 === 0 ? "-300px" : "-600px";
    return {
      "--element-side-size": "600px",
      marginLeft: `${baseMarginLeft + additionalMargin}px`,
      marginRight: `${baseMarginRight}px`,
      marginTop: topOffset,
      gridColumn: gridCol,
      gridRow: index % 2 === 0 ? "2" : "1",
      rotate: 45,
      scale: 1,
      "--border-color": getBorderColorWithAlpha(index, 0),
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0),
    };
  },
};

export const contentWrapVariants = {
  default: {},
  hover: {},
  active: {},
};

// Объединенные варианты для контента (цифра и точка)
export const squareContentVariants = {
  number: {
    default: () => ({
      opacity: 0,
      scale: 1,
      color: "rgba(255,255,255,0)",
      "--glow-color": "rgba(255,255,255,0)",
      "--text-glow-color": "rgba(255,255,255,0)",
      "--text-shadow-offset": "0px",
    }),
    hover: (index) => {
      return {
        opacity: 1,
        rotate: -15,
        "--glow-color": getColorWithAlpha(index, 1),
        "--text-glow-color": getColorWithAlpha(index, 1),
        "--text-shadow-offset": "60px",
        color: getColorWithAlpha(index, 1),
      };
    },
    active: (index) => ({
      opacity: 0,
      color: "rgba(255,255,255,0)",
      "--glow-color": getColorWithAlpha(index, 0),
      "--text-glow-color": getColorWithAlpha(index, 0),
      "--text-shadow-offset": "0px",
    }),
  },
  bullet: {
    default: { opacity: 1 },
    hover: { opacity: 0 },
    active: { opacity: 0 },
  },
};

// Варианты для активного ромба
export const activeDiamondVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  active: (index) => {
    const color = COLOR_MAP[index] || COLOR_MAP[0];
    return {
      opacity: 1,
      scale: 1,
      backgroundColor: color,
    };
  },
};

// Варианты для контента внутри активного ромба
export const activeContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    rotate: -45,
  },
  active: {
    opacity: 1,
    scale: 1,
    rotate: -45,
  },
};
