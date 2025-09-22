export const spring = { type: "spring", stiffness: 20, damping: 4, mass: 0.1 };

export const introVariants = {
  spring,
  boxVariants: {
    default: {
      width: 120,
      height: 120,
      marginLeft: 0,
      marginRight: 0,
      y: 0,
      transition: spring,
    },
    hover: {
      width: 300,
      height: 300,
      marginLeft: 10,
      marginRight: 10,
      y: "-30%",
      transition: spring,
    },
    active: (i) => ({
      width: 600,
      height: 600,
      marginLeft: -100,
      marginRight: 0,
      y: i % 2 === 0 ? "-25%" : "-115%",
      transition: spring,
    }),
  },
  squareBgVariants: {
    default: () => ({
      rotate: 0,
      scale: 1,
      background: "#2A2A2A",
    }),
    hover: (index) => {
      const colorMap = [
        {
          hoverStart: "#000000",
          hoverEnd: "#215C82",
        },
        {
          hoverStart: "#000000",
          hoverEnd: "#822139",
        },
        {
          hoverStart: "#000000",
          hoverEnd: "#218268",
        },
        {
          hoverStart: "#000000",
          hoverEnd: "#528221",
        },
      ];
      const c = colorMap[index] || colorMap[0];
      return {
        rotate: 45,
        scale: 1,
        background: `linear-gradient(135deg, ${c.hoverStart}80, ${c.hoverEnd}80)`,
      };
    },
    active: (index) => {
      const colorMap = [
        {
          activeStart: "#1C64FF",
          activeEnd: "#2AB6FF",
        },
        {
          activeStart: "#FF6F9F",
          activeEnd: "#FFBED7",
        },
        {
          activeStart: "#16F2C7",
          activeEnd: "#5CFFE3",
        },
        {
          activeStart: "#FFE676",
          activeEnd: "#FFF7B8",
        },
      ];
      const c = colorMap[index] || colorMap[0];
      return {
        rotate: 45,
        scale: 1,
        background: `linear-gradient(135deg, ${c.activeStart}, ${c.activeEnd})`,
      };
    },
  },
  squareContentNumVariants: {
    default: {
      opacity: 0,
      "--glow-color": "rgba(255,255,255,0)",
      color: "rgba(255,255,255,0.7)",
    },
    hover: (index) => {
      const colorMap = [
        "rgba(28,100,255,0.9)",
        "rgba(255,111,159,0.9)",
        "rgba(22,242,199,0.9)",
        "rgba(255,230,118,0.9)",
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
      color: "rgba(255,255,255,0.7)",
    },
  },
  squareContentBulletVariants: {
    default: { opacity: 1 },
    hover: { opacity: 0 },
    active: { opacity: 0 },
  },
  squareHighlightVariants: {
    default: {
      opacity: 0,
      scale: 20,
      x: "-50%",
      y: "-50%",
    },
    hover: {
      opacity: 1,
      scale: 1.05,
      x: "-50%",
      y: "-50%",
    },
    active: {
      opacity: 1,
      scale: 1.1,
      x: "-50%",
      y: "-50%",
    },
  },
  glassIntensityVariants: {
    default: { intensity: 0 },
    hover: { intensity: 0 },
    active: { intensity: 1.0 },
  },
};

export const boxVariants = introVariants.boxVariants;
export const squareBgVariants = introVariants.squareBgVariants;
export const squareContentVariants = {
  default: { opacity: 1 },
  hover: { opacity: 1 },
  active: { opacity: 1 },
};
export const squareHighlightVariants = introVariants.squareHighlightVariants;
export const squareContentNumVariants = introVariants.squareContentNumVariants;
export const squareContentBulletVariants =
  introVariants.squareContentBulletVariants;
export const glassIntensityVariants = introVariants.glassIntensityVariants;
