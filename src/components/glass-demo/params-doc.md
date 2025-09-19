# Apple Liquid Glass Parameters Documentation

## List of parameters and default values

| Parameter           | Description                      | Default | Range     |
| ------------------- | -------------------------------- | ------- | --------- |
| displacementScale   | Liquid glass distortion strength | 65      | 10 - 120  |
| aberrationIntensity | Chromatic aberration intensity   | 2.8     | 0 - 8     |
| aberrationIntensity | Chromatic aberration intensity   | 2.8     | 0 - 8     |
| surfaceCurvature    | Surface curvature                | 1.8     | 0.5 - 3.0 |
| surfaceCurvature    | Surface curvature                | 1.8     | 0.5 - 3.0 |
| glassBlur           | Backdrop blur                    | 25      | 8 - 40    |
| glassSaturation     | Material saturation              | 185     | 120 - 280 |
| refractionDepth     | Refraction depth                 | 2.0     | 0.8 - 2.5 |
| surfaceReflection   | Surface reflection intensity     | 0.45    | 0.1 - 0.8 |
| highlightIntensity  | Highlight intensity              | 0.75    | 0.1 - 1.0 |
| highlightSpread     | Highlight spread                 | 1.1     | 0.5 - 1.5 |
| highlightHue        | Highlight hue                    | 210     | 180 - 240 |
| shadowDepth         | Shadow depth                     | 0.4     | 0.1 - 0.8 |
| glassBrightness     | Glass brightness                 | 115     | 80 - 140  |
| glassContrast       | Glass contrast                   | 118     | 80 - 140  |
| glassTintHue        | Glass tint hue                   | 210     | 180 - 240 |
| glassTintOpacity    | Glass tint opacity               | 0.38    | 0.1 - 0.6 |
| noiseStrength       | Noise strength                   | 0.22    | 0 - 0.5   |
| parallaxIntensity   | Parallax intensity               | 0.4     | 0 - 0.8   |

## Usage

Parameters can be passed when initializing the `useGlassDemo` hook:

```js
const {
  // ...
} = useGlassDemo({
  displacementScale: 80, // example
  aberrationIntensity: 3.5,
  surfaceCurvature: 2.0,
  // other parameters
});
```

If a parameter is not specified, the default value is used.

## Description

- All parameters control the visual properties of the liquid glass effect.
- Changing values allows you to achieve different visual styles.
- For most parameters, values close to the default are recommended for a realistic effect.

---

This document is maintained automatically. To add new parameters, update the table and description.
