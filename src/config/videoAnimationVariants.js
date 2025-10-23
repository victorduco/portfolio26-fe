/**
 * Animation variants for video player controls
 * Used with motion-v for smooth animations
 */

export const buttonVariants = {
  default: {
    rotate: 45,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  hover: {
    rotate: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
};

export const buttonTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};

export const iconVariants = {
  default: {
    rotate: -45,
  },
  hover: {
    rotate: 0,
  },
};

export const iconTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};
