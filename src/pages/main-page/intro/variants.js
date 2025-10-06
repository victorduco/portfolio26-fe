// Color mappings for different states
const COLOR_MAP = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];

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
export const boxVariants = {
  default: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    return {
      "--element-side-size": "120px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      y: 0,
      rotate: 0,
      scale: 1,
      border: "1px solid #222",
    };
  },
  hover: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    return {
      "--element-side-size": "400px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      marginTop: "-150px",
      rotate: 15,
      scale: 1,
      border: "1px solid #222222",
    };
  },
  active: ({ index, additionalMargin }) => {
    const baseMargin = -50;
    return {
      "--element-side-size": "600px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      y: index % 2 === 0 ? "-25%" : "-115%",
      rotate: 45,
      scale: 1,
      border: "2px solid #333333",
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
    default: (index) => ({
      opacity: 0,
      scale: 1,
      color: "rgba(255,255,255,0)",
      "--glow-color": getColorWithAlpha(index, 0),
    }),
    hover: (index) => {
      const color = getColorWithAlpha(index, 1);
      return {
        opacity: 1,
        rotate: -15,
        "--glow-color": color,
        color: color,
      };
    },
    active: (index) => ({
      opacity: 0,
      color: "rgba(255,255,255,0)",
      "--glow-color": getColorWithAlpha(index, 0),
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
