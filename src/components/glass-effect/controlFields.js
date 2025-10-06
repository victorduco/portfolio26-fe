const FIELD_BLUEPRINTS = {
  displacementScale: { label: "Displacement Scale", attrs: { min: 10, max: 120, step: 1 } },
  displacementCurvature: { label: "Displacement Curvature", attrs: { min: 0.5, max: 3.0, step: 0.1 } },
  glassBlur: { label: "Glass Blur", attrs: { min: 8, max: 40, step: 1 } },
  glassSaturation: { label: "Glass Saturation", attrs: { min: 0, max: 400, step: 5 } },
  glassBrightness: { label: "Glass Brightness", attrs: { min: 0, max: 500, step: 1 } },
  glassContrast: { label: "Glass Contrast", attrs: { min: 0, max: 500, step: 1 } },
  shadowDepth: { label: "Shadow Depth", attrs: { min: 0.1, max: 0.8, step: 0.01 } },
  highlightReflection: { label: "Highlight Reflection", attrs: { min: 0, max: 1, step: 0.01 } },
};

const SECTION_LAYOUT = [
  { title: "Displacement", keys: ["displacementScale", "displacementCurvature"] },
  { title: "Glass Material", keys: ["glassBlur", "glassSaturation", "glassBrightness", "glassContrast"] },
  { title: "Effects", keys: ["shadowDepth"] },
  { title: "Highlight", keys: ["highlightReflection"] },
];

export function createControlSections(overrides = {}) {
  return SECTION_LAYOUT.map(({ title, keys }) => ({
    title,
    fields: keys.map((key) => {
      const base = FIELD_BLUEPRINTS[key];
      const override = overrides[key] || {};
      return {
        key,
        label: override.label || base.label,
        attrs: { ...base.attrs, ...(override.attrs || {}) },
        numberAttrs: { ...base.attrs, ...(override.numberAttrs || override.attrs || {}) },
      };
    }),
  }));
}
