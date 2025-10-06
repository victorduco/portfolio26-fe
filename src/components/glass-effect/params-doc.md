# Glass Effect Parameters Documentation

## List of parameters and default values

| Parameter             | Description                      | Default | Range     |
| --------------------- | -------------------------------- | ------- | --------- |
| displacementMap       | Path to displacement map file    | ""      | string    |
| displacementScale     | Liquid glass distortion strength | 65      | 10 - 120  |
| displacementCurvature | Surface curvature                | 1.8     | 0.5 - 3.0 |
| glassBlur             | Backdrop blur                    | 25      | 8 - 40    |
| glassSaturation       | Material saturation              | 185     | 0 - 400   |
| glassBrightness       | Glass brightness                 | 60      | 0 - 500   |
| glassContrast         | Glass contrast                   | 120     | 0 - 500   |
| shadowDepth           | Shadow depth                     | 0.4     | 0.1 - 0.8 |
| highlightReflection   | Surface reflection intensity     | 0.45    | 0 - 1.0   |

## Usage

Parameters can be passed in the `userOptions` prop of the `GlassEffect` component:

```vue
<GlassEffect
  :user-options="{
    displacementMap: '/src/assets/distmaps/my-map.png',
    displacementScale: 80,
    displacementCurvature: 2.0,
    glassBlur: 30,
    glassSaturation: 200,
    glassBrightness: 70,
    glassContrast: 130,
    shadowDepth: 0.5,
    highlightReflection: 0.6,
  }"
/>
```

If a parameter is not specified, the default value is used.

## Description

- All parameters control the visual properties of the glass effect.
- Changing values allows you to achieve different visual styles.
- For most parameters, values close to the default are recommended for a realistic effect.
- The `displacementMap` parameter is required and should point to a valid PNG displacement map file.

---

This document is maintained automatically. To add new parameters, update the table and description.
