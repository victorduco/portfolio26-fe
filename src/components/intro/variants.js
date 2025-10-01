// Color mappings for different states
const COLOR_MAP = [
  { r: 28, g: 100, b: 255 },
  { r: 255, g: 111, b: 159 },
  { r: 22, g: 242, b: 199 },
  { r: 255, g: 230, b: 118 },
];

const getColorWithAlpha = (index, alpha) => {
  const color = COLOR_MAP[index] || COLOR_MAP[0];
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
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
      background: "transparent",
      border: "0px solid #333333",
    };
  },
  hover: ({ index, additionalMargin }) => {
    const baseMargin = 0;
    return {
      "--element-side-size": "220px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      marginTop: "-55px",
      rotate: 45,
      scale: 1,
      backgroundColor: getColorWithAlpha(index, 0),
      border: "0px solid #333333",
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
      backgroundColor: getColorWithAlpha(index, 0),
      border: "0px solid #333333",
    };
  },
};

export const contentWrapVariants = {
  default: {
    opacity: 0,
    scale: 20,
    x: "-50%",
    y: "-50%",
  },
  hover: {
    opacity: 1,
    scale: 1,
    x: "-50%",
    y: "-50%",
  },
  active: {
    opacity: 1,
    scale: 1,
    x: "-50%",
    y: "-50%",
  },
};

export const squareContentNumVariants = {
  default: {
    opacity: 0,
    "--glow-color": "rgba(255,255,255,0)",
    color: "rgba(255,255,255,0)",
  },
  hover: (index) => {
    const color = getColorWithAlpha(index, 0);
    return {
      opacity: 1,
      "--glow-color": color,
      color: color,
    };
  },
  active: {
    opacity: 0,
    "--glow-color": "rgba(255,255,255,0)",
    color: "rgba(255,255,255,0)",
  },
};

export const squareContentBulletVariants = {
  default: { opacity: 1 },
  hover: { opacity: 0 },
  active: { opacity: 0 },
};

export const glassIntensityVariants = {
  default: { intensity: 1 },
  hover: { intensity: 1 },
  active: { intensity: 1 },
};
