export const createSpring = (multiplier = 1.0) => ({
  type: "spring",
  stiffness: 60 / multiplier,
  damping: 20,
  mass: 1.8 * multiplier,
});

export const spring = createSpring();

export const diamondVariants = {
  default: { scale: 1, zIndex: 1 },
  groupHover: { scale: 1.2, zIndex: 5 },
  active: { scale: 1.3, zIndex: 100 },
};

export const diamondShapeVariants = {
  default: { opacity: 0 },
  groupHover: { opacity: 0.9 },
  active: { opacity: 0 },
};
