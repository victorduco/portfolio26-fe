export const spring = { type: "spring", stiffness: 114, damping: 13, mass: 1.5 };
export const smoothTransition = { type: "spring", stiffness: 320, damping: 11, mass: 1.2 };
export const opacityTween = { type: "tween", duration: 0.2, ease: "easeOut" };
export const backgroundTween = { type: "tween", duration: 0.3, ease: "easeInOut" };

const WHITE_09 = "rgba(255, 255, 255, 0.9)";
const WHITE_03 = "rgba(255, 255, 255, 0.3)";
const WHITE_01 = "rgba(255, 255, 255, 0.1)";
const GREEN = "#00FFBC";
const rotated = { rotate: 45, opacity: 1 };
const flat = { rotate: 0, opacity: 1 };

export const navItemVariants = {
  default: { ...flat, backgroundColor: WHITE_01 },
  hover: { ...rotated, backgroundColor: WHITE_03 },
  pressed: { ...rotated, backgroundColor: WHITE_03 },
  active: { ...rotated, backgroundColor: WHITE_09 },
  introGreen: { ...flat, backgroundColor: GREEN },
  introHighlight: { ...flat, backgroundColor: WHITE_01 },
  hidden: { opacity: 0 },
};

const visible = { opacity: 1, color: WHITE_09 };

export const labelVariants = {
  default: { opacity: 0, color: WHITE_09 },
  hover: visible,
  active: visible,
  introGreen: { opacity: 1, color: GREEN },
  introFadeOut: { opacity: 0, color: GREEN },
  introHighlight: visible,
};
