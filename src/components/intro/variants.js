// TODO Понять приоритет между стилями стекла и теми что тут

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
      background: "#2A2A2A",
      border: "0px solid #333333",
    };
  },
  hover: ({ index, additionalMargin }) => {
    const colorMap = [
      "rgba(33, 92, 130, 0)",
      "rgba(130, 33, 57, 0)",
      "rgba(33, 130, 104, 0)",
      "rgba(82, 130, 33, 0)",
    ];
    const color = colorMap[index] || colorMap[0];
    const baseMargin = 0;
    return {
      "--element-side-size": "220px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      marginTop: "-55px",
      rotate: 45,
      scale: 1,
      backgroundColor: color,
      border: "0px solid #333333",
    };
  },
  active: ({ index, additionalMargin }) => {
    // const colorMap = [
    //   "rgba(28, 100, 255, 1)",
    //   "rgba(255, 111, 159, 1)",
    //   "rgba(22, 242, 199, 1)",
    //   "rgba(255, 230, 118, 1)",
    // ];

    const colorMap = [
      "rgba(28, 100, 255, 0)",
      "rgba(255, 111, 159, 0)",
      "rgba(22, 242, 199, 0)",
      "rgba(255, 230, 118, 0)",
    ];
    const color = colorMap[index] || colorMap[0];
    const baseMargin = -50;
    return {
      "--element-side-size": "600px",
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      y: index % 2 === 0 ? "-25%" : "-115%",
      rotate: 45,
      scale: 1,
      backgroundColor: color,
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
    const colorMap = [
      "rgba(28,100,255,0)",
      "rgba(255,111,159,0)",
      "rgba(22,242,199,0)",
      "rgba(255,230,118,0)",
    ];
    const color = colorMap[index] || colorMap[0];
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
