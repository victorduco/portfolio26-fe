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

// Helper to get responsive size multipliers based on viewport
const getResponsiveSizes = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;

  // Mobile: base 80px
  if (width < 600) {
    return {
      default: "80px",
      hover: "280px",  // 3.5x
      active: "400px", // 5x
      hoverTopOffset: "-100px",
      activeTopOffsetEven: "-200px",
      activeTopOffsetOdd: "-400px"
    };
  }

  // Tablet: base 100px
  if (width < 900) {
    return {
      default: "100px",
      hover: "340px",  // 3.4x
      active: "500px", // 5x
      hoverTopOffset: "-125px",
      activeTopOffsetEven: "-250px",
      activeTopOffsetOdd: "-500px"
    };
  }

  // Desktop: base 120px (original)
  return {
    default: "120px",
    hover: "400px",
    active: "600px",
    hoverTopOffset: "-150px",
    activeTopOffsetEven: "-300px",
    activeTopOffsetOdd: "-600px"
  };
};

// Helper to get grid position based on viewport and index
const getGridPosition = (index) => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;

  // Mobile (<900px): 2x2 grid
  if (width < 900) {
    const row = Math.floor(index / 2) + 1; // 0,1 -> row 1; 2,3 -> row 2
    const col = (index % 2) + 1; // 0,2 -> col 1; 1,3 -> col 2
    return { gridColumn: col, gridRow: row };
  }

  // Desktop (≥900px): 4x1 horizontal with gap columns
  const gridCol = index * 2 + 1; // 1, 3, 5, 7
  return { gridColumn: gridCol, gridRow: 1 };
};

// main box
export const boxVariants = {
  default: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    const sizes = getResponsiveSizes();
    const position = getGridPosition(index);

    return {
      "--element-side-size": sizes.default,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      gridColumn: position.gridColumn,
      gridRow: position.gridRow,
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
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      gridColumn: position.gridColumn,
      gridRow: position.gridRow,
      marginTop: sizes.hoverTopOffset,
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
    const topOffset = index % 2 === 0 ? sizes.activeTopOffsetEven : sizes.activeTopOffsetOdd;

    return {
      "--element-side-size": sizes.active,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      marginTop: topOffset,
      gridColumn: position.gridColumn,
      gridRow: position.gridRow,
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
    default: (_index) => ({
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
    active: (_index) => ({
      opacity: 0,
      color: "rgba(255,255,255,0)",
      "--glow-color": "rgba(255,255,255,0)",
      "--text-glow-color": "rgba(255,255,255,0)",
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
