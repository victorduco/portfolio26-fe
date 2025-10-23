// Animation variants for AI Play floating diamonds

export const spring = {
  type: "spring",
  stiffness: 60,
  damping: 20,
  mass: 1.8,
};

// Create spring variants with different speeds
// Multiplier range: 1.0 to 1.4 (slower)
export function createSpring(multiplier = 1.0) {
  return {
    type: "spring",
    stiffness: 60 / multiplier,
    damping: 20,
    mass: 1.8 * multiplier,
  };
}

// Variants for floating diamond containers
export const diamondVariants = {
  default: {
    scale: 1,
    zIndex: 1,
  },
  groupHover: {
    scale: 1.2,
    zIndex: 5,
  },
  active: {
    scale: 1.3,
    zIndex: 100,
  },
};

// Variants for diamond background shape
export const diamondShapeVariants = {
  default: {
    opacity: 0,
  },
  groupHover: {
    opacity: 0.9,
  },
  active: {
    opacity: 0,
  },
};

// Variants for plant icons
export const iconVariants = {
  default: {
    opacity: 1,
    scale: 1,
  },
  groupHover: {
    opacity: 1,
    scale: 1,
  },
  active: {
    opacity: 1,
    scale: 1,
  },
};
