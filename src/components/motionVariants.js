const spring = { type: "spring", stiffness: 20, damping: 4, mass: 0.1 };

export const motionVariants = {
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
      width: 150,
      height: 150,
      marginLeft: 10,
      marginRight: 10,
      transition: spring,
    },
    active: (i) => ({
      width: 600,
      height: 600,
      marginLeft: 10,
      marginRight: 10,
      y: i % 2 === 0 ? "33%" : "-33%",
      transition: spring,
    }),
  },
  squareBgVariants: {
    default: ({ slug }) => ({
      rotate: 0,
      scale: 1,
      background: "linear-gradient(145deg, #2A2A2A, #202020)",
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
    }),
    hover: ({ slug }) => {
      const colorMap = {
        one: {
          hoverStart: "#0F4CFF",
          hoverEnd: "#30A3FF",
          hoverGlow: "rgba(31, 116, 255, 0.45)",
        },
        two: {
          hoverStart: "#F2668B",
          hoverEnd: "#FF9CBD",
          hoverGlow: "rgba(255, 120, 165, 0.45)",
        },
        three: {
          hoverStart: "#00DBB6",
          hoverEnd: "#34FFDC",
          hoverGlow: "rgba(0, 206, 176, 0.45)",
        },
        four: {
          hoverStart: "#FFE066",
          hoverEnd: "#FFF199",
          hoverGlow: "rgba(255, 224, 102, 0.45)",
        },
      };
      const c = colorMap[slug] || colorMap.one;
      return {
        rotate: 45,
        scale: 1.04,
        background: `linear-gradient(135deg, ${c.hoverStart}, ${c.hoverEnd})`,
        boxShadow: `inset 0 0 90px rgba(255, 255, 255, 0.18), 0 30px 70px ${c.hoverGlow}`,
      };
    },
    active: ({ slug }) => {
      const colorMap = {
        one: {
          activeStart: "#1C64FF",
          activeEnd: "#2AB6FF",
          activeGlow: "rgba(33, 142, 255, 0.6)",
        },
        two: {
          activeStart: "#FF6F9F",
          activeEnd: "#FFBED7",
          activeGlow: "rgba(255, 146, 187, 0.6)",
        },
        three: {
          activeStart: "#16F2C7",
          activeEnd: "#5CFFE3",
          activeGlow: "rgba(45, 255, 210, 0.6)",
        },
        four: {
          activeStart: "#FFE676",
          activeEnd: "#FFF7B8",
          activeGlow: "rgba(255, 234, 135, 0.6)",
        },
      };
      const c = colorMap[slug] || colorMap.one;
      return {
        rotate: 45,
        scale: 1.08,
        background: `linear-gradient(135deg, ${c.activeStart}, ${c.activeEnd})`,
        boxShadow: `inset 0 0 120px rgba(255, 255, 255, 0.22), 0 36px 90px ${c.activeGlow}`,
      };
    },
  },
  squareContentVariants: {
    default: { rotate: 0 },
    hover: { rotate: 0 },
    active: { rotate: 0 },
  },
  squareHighlightVariants: {
    default: {
      opacity: 0,
      scale: 1,
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
};
