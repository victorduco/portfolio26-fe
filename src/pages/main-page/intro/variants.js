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
  stiffness: 70, // унифицированная жёсткость для всех свойств
  damping: 15, // небольшое затухание для плавности
  mass: 1.5, // инерция побольше для реализма
};

export const marginSpring = {
  type: "spring",
  stiffness: 70, // та же жёсткость что и основная пружина
  damping: 15,
  mass: 1.5,
};

export const textShadowSpring = {
  type: "spring",
  stiffness: 70,
  damping: 15,
  mass: 1.5,
  delay: 0.1, // 100ms задержка
};

// Helper to get responsive size multipliers based on viewport
const getResponsiveSizes = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;

  // Mobile: base 80px
  if (width < 600) {
    return {
      default: "80px",
      hover: "280px", // 3.5x
      active: "400px", // 5x
      hoverTopOffset: "-100px",
      activeTopOffsetEven: "-200px",
      activeTopOffsetOdd: "-400px",
    };
  }

  // Tablet: base 100px
  if (width < 900) {
    return {
      default: "100px",
      hover: "340px", // 3.4x
      active: "500px", // 5x
      hoverTopOffset: "-125px",
      activeTopOffsetEven: "-250px",
      activeTopOffsetOdd: "-500px",
    };
  }

  // Desktop: base 120px (original)
  return {
    default: "120px",
    hover: "400px",
    active: "600px",
    hoverTopOffset: "-150px",
    activeTopOffsetEven: "-300px",
    activeTopOffsetOdd: "-600px",
  };
};

// Helper to get grid position based on viewport and index
const getGridPosition = (index) => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;

  // Mobile (<900px): 2x2 grid
  if (width < 900) {
    const row = Math.floor(index / 2) + 1; // 0,1 -> row 1; 2,3 -> row 2
    const col = (index % 2) + 1; // 0,2 -> col 1; 1,3 -> col 2
    return { gridColumn: col, gridRow: row };
  }

  // Desktop (≥900px): статичные позиции для всех состояний
  const gridCol = index * 2 + 1; // 1, 3, 5, 7
  const gridRow = index % 2 === 0 ? 1 : 2; // четные всегда в row 1, нечетные всегда в row 2

  return { gridColumn: gridCol, gridRow };
};

// main box
export const boxVariants = {
  default: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    const sizes = getResponsiveSizes();
    const position = getGridPosition(index);

    return {
      "--element-side-size": sizes.default,
      gridColumn: position.gridColumn,
      gridRow: position.gridRow,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      rotate: 0,
      scale: 1,
      "--border-color": "#ffffff10",
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0),
    };
  },
  hover: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    const sizes = getResponsiveSizes();
    const position = getGridPosition(index);

    return {
      "--element-side-size": sizes.hover,
      gridColumn: position.gridColumn,
      gridRow: position.gridRow,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      rotate: 15,
      scale: 1,
      "--border-color": getBorderColorWithAlpha(index, 0.1),
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0.2),
    };
  },
  active: ({ index, additionalMargin }) => {
    const baseMargin = -50;
    const sizes = getResponsiveSizes();
    const position = getGridPosition(index);
    // Сходятся к центру + поднимаем всю группу выше
    // Четные: опускаются к центру, но с общим сдвигом вверх
    // Нечетные: поднимаются к центру, с еще большим сдвигом вверх
    const y = index % 2 === 0 ? "0%" : "-100%";

    return {
      "--element-side-size": sizes.active,
      gridColumn: position.gridColumn,
      gridRow: position.gridRow,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      y, // поднимаем всю группу вверх
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

// Объединенные варианты для контента (одна иконка для всех состояний)
export const squareContentVariants = {
  icon: {
    default: (_index) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      color: "#7c7c7c",
      "--text-glow-color": "rgba(255,255,255,0)",
      "--text-shadow-offset": "0px",
    }),
    hover: (index) => {
      return {
        opacity: 1,
        scale: 2.9,
        rotate: -15,
        "--text-glow-color": getColorWithAlpha(index, 0.4),
        "--text-shadow-offset": "20px",
        color: getColorWithAlpha(index, 1),
      };
    },
    active: (_index) => ({
      opacity: 0,
      scale: 0.8,
      rotate: 0,
      color: "rgba(255,255,255,0)",
      "--text-glow-color": "rgba(255,255,255,0)",
      "--text-shadow-offset": "0px",
    }),
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
