const prefersReducedMotion = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const spring = prefersReducedMotion
  ? { duration: 0 }
  : { type: "spring", stiffness: 300, damping: 20 };

const base = { color: "#ffffff", rotate: -45 };
export const numberVariants = {
  default: { ...base, opacity: 0.8 },
  hover: { ...base, opacity: 1 },
  pressed: { ...base, opacity: 1 },
};
