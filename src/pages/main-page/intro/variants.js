import { ref, onMounted, onUnmounted, computed } from "vue";

const COLOR_MAP = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const BORDER_COLOR_MAP = ["#9cd7ffff", "#FF83A2", "#00FFBC", "#FFFF78"];
const HOVER_ROTATION_MAP = [8, 20, 12, 24];
const HOVER_Y_OFFSET_MAP = [-8, 12, -15, 18];

const hexToRgba = (hex, alpha) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const colorAlpha = (map, i, a) => hexToRgba(map[i] || map[0], a);
const getColorWithAlpha = (i, a) => colorAlpha(COLOR_MAP, i, a);
const getBorderColorWithAlpha = (i, a) => colorAlpha(BORDER_COLOR_MAP, i, a);

const getAdaptiveBaseMargin = () => {
  if (typeof window === "undefined") return -45;
  const vw = window.innerWidth;
  if (vw <= 1200) return -32;
  if (vw >= 1920) return -45;
  return -32 - ((vw - 1200) / 720) * 13;
};

const BASE_SPRING = { type: "spring", stiffness: 70, damping: 15, mass: 1.5 };
export const spring = BASE_SPRING;
export const marginSpring = BASE_SPRING;
export const textShadowSpring = { ...BASE_SPRING, delay: 0.1 };

const getResponsiveSizes = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;
  const height = typeof window !== "undefined" ? window.innerHeight : 900;
  const calcOffsets = (oddMult) => ({
    activeTopOffsetEven: `${Math.min(-50, Math.max(-150, height * -0.1))}px`,
    activeTopOffsetOdd: `${Math.min(-300, Math.max(-700, height * oddMult))}px`,
  });

  const base = { default: "120px", hover: "400px", hoverTopOffset: "-150px" };
  if (width >= 900 && width <= 1400) {
    return { ...base, active: `${Math.min(600, Math.max(350, width * 0.4))}px`, ...calcOffsets(-0.5) };
  }
  return { ...base, active: "600px", ...calcOffsets(-0.6) };
};

export const useResponsiveSizes = () => {
  const sizes = ref(getResponsiveSizes());
  const updateSizes = () => { sizes.value = getResponsiveSizes(); };
  onMounted(() => window.addEventListener("resize", updateSizes));
  onUnmounted(() => window.removeEventListener("resize", updateSizes));
  return sizes;
};

const baseBoxState = (index, size, glow = 0) => ({
  "--element-side-size": size,
  rotate: 0,
  scale: 1,
  "--border-color": "#ffffff10",
  "--border-gradient": "transparent",
  "--glow-color": getBorderColorWithAlpha(index, glow),
  "--border-radius": "26px",
});

const createBoxVariants = (sizes) => ({
  default: ({ index, additionalMargin, isMobileLayout, isSmallestBreakpoints }) => {
    const base = baseBoxState(index, sizes.default);
    if (isSmallestBreakpoints) return { ...base, marginLeft: "0px", marginRight: "0px", y: 0, opacity: 0, zIndex: 5 };
    if (isMobileLayout) return { ...base, marginLeft: "0px", marginRight: "0px", y: 0, opacity: 1, zIndex: 5 };
    return { ...base, marginLeft: `${additionalMargin}px`, marginRight: "0px", opacity: 1, zIndex: 5 };
  },

  hover: ({ index, additionalMargin, isMobileLayout, isSmallestBreakpoints }) => {
    const base = baseBoxState(index, sizes.default, 0.1);
    if (isSmallestBreakpoints) return { ...base, marginLeft: "0px", marginRight: "0px", y: 0, zIndex: 5 };
    if (isMobileLayout) return { ...base, marginLeft: "0px", marginRight: "0px", y: 0, zIndex: 10, "--border-color": getBorderColorWithAlpha(index, 0) };

    const yOffset = -(parseInt(sizes.hover) - parseInt(sizes.default)) / 2 + (HOVER_Y_OFFSET_MAP[index] || 0);
    return {
      ...baseBoxState(index, sizes.hover, 0.2),
      marginLeft: `${additionalMargin}px`,
      marginRight: "0px",
      y: `${yOffset}px`,
      rotate: HOVER_ROTATION_MAP[index] || 15,
      zIndex: 10000,
      "--border-color": getBorderColorWithAlpha(index, 0.1),
      "--border-radius": "45px",
    };
  },

  active: ({ index, additionalMargin, isMobileLayout, isSmallestBreakpoints }) => {
    const activeBase = (size, glow) => ({ ...baseBoxState(index, size, glow), zIndex: 10000, "--border-color": getBorderColorWithAlpha(index, 0) });
    if (isSmallestBreakpoints) return { ...activeBase(sizes.default, 0.1), marginLeft: "0px", marginRight: "0px", y: 0 };
    if (isMobileLayout) return { ...activeBase(sizes.active, 0.1), marginLeft: "0px", marginRight: "0px", y: 0 };

    const baseMargin = getAdaptiveBaseMargin();
    return {
      ...activeBase(sizes.active, 0),
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      y: index % 2 === 0 ? sizes.activeTopOffsetEven : sizes.activeTopOffsetOdd,
      rotate: 45,
    };
  },
});

export const useBoxVariants = () => {
  const sizes = useResponsiveSizes();
  return computed(() => createBoxVariants(sizes.value));
};

export const contentWrapVariants = { default: {}, hover: {}, active: {} };

export const squareContentVariants = {
  icon: {
    default: () => ({
      opacity: 1, scale: 1, rotate: 0, color: "#DDDDDD",
      "--text-glow-color": "rgba(255,255,255,0)", "--text-shadow-offset": "70px", "--text-shadow-blur": "100px",
    }),
    hover: (index) => ({
      opacity: 1, scale: 2.9, rotate: -(HOVER_ROTATION_MAP[index] || 45),
      color: getColorWithAlpha(index, 1), "--text-glow-color": getColorWithAlpha(index, 0.08),
      "--text-shadow-offset": "0px", "--text-shadow-blur": "10px",
    }),
    active: () => ({
      opacity: 0, scale: 0.8, rotate: 0, color: "rgba(255,255,255,0)",
      "--text-glow-color": "rgba(255,255,255,0)", "--text-shadow-offset": "0px", "--text-shadow-blur": "0px",
    }),
  },
};

export const activeDiamondVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  active: (index) => ({ opacity: 1, scale: 1, backgroundColor: COLOR_MAP[index] || COLOR_MAP[0] }),
};

export const activeContentVariants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -45, x: 0, y: 0 },
  active: { opacity: 1, scale: 1, rotate: -45, x: 0, y: 0 },
};

export const wrapperVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
export const wrapperTransition = { type: "tween", duration: 1.2, ease: [0.4, 0, 0.2, 1] };
export const inactiveTransition = { type: "spring", stiffness: 70, damping: 18, mass: 1.2 };
export const ICON_CLASSES = ["icon-d", "icon-a", "icon-c", "icon-b"];
