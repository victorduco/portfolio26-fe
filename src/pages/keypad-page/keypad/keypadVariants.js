// Check if user prefers reduced motion
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

export const spring = prefersReducedMotion
  ? { duration: 0 }
  : {
      type: "spring",
      stiffness: 300,
      damping: 20,
    };

export const numberVariants = {
  default: {
    color: "#ffffff",
    opacity: 0.8,
    rotate: -45,
  },
  hover: {
    color: "#ffffff",
    opacity: 1,
    rotate: -45,
  },
  pressed: {
    color: "#ffffff",
    opacity: 1,
    rotate: -45,
  },
};
