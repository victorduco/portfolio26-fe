# Apple Liquid Glass Parameters Documentation

## List of parameters and default values

| Parameter           | Description                      | Default | Range     |
| ------------------- | -------------------------------- | ------- | --------- |
| displacementScale   | Liquid glass distortion strength | 65      | 10 - 120  |
| surfaceCurvature    | Surface curvature                | 1.8     | 0.5 - 3.0 |
| glassBlur           | Backdrop blur                    | 25      | 8 - 40    |
| glassSaturation     | Material saturation              | 185     | 120 - 280 |
| refractionDepth     | Refraction depth                 | 2.0     | 0.8 - 2.5 |
| surfaceReflection   | Surface reflection intensity     | 0.45    | 0.1 - 0.8 |
| shadowDepth         | Shadow depth                     | 0.4     | 0.1 - 0.8 |
| shaderCornerRadius  | Shader corner radius             | 0.2     | 0 - 0.5   |
| backgroundImageUrl  | Background image URL             | default | string    |

## Shader Parameters

### Distortion Object
| Parameter           | Description                      | Default | Range     |
| ------------------- | -------------------------------- | ------- | --------- |
| distortion.start    | Distortion start position        | 0.3     | 0 - 1.0   |
| distortion.end      | Distortion end position          | 0       | 0 - 1.0   |
| distortion.offset   | Distortion offset                | 0.15    | 0 - 0.5   |

### Scaling Object
| Parameter           | Description                      | Default | Range     |
| ------------------- | -------------------------------- | ------- | --------- |
| scaling.start       | Scaling start position           | 0       | 0 - 1.0   |
| scaling.end         | Scaling end position             | 1       | 0 - 1.0   |

## Internal Parameters (not configurable)
| Parameter           | Description                      | Default |
| ------------------- | -------------------------------- | ------- |
| highlightIntensity  | Highlight intensity              | 0.68    |
| highlightSpread     | Highlight spread                 | 1.05    |
| highlightHue        | Highlight hue                    | 210     |
| glassBrightness     | Glass brightness                 | 110     |
| glassContrast       | Glass contrast                   | 112     |
| glassTintHue        | Glass tint hue                   | 210     |
| glassTintOpacity    | Glass tint opacity               | 0.32    |
| noiseStrength       | Noise strength                   | 0.18    |

## Usage

Parameters can be passed when initializing the `useGlassDemo` hook:

```js
const {
  // ...
} = useGlassDemo({
  displacementScale: 80, // example
  surfaceCurvature: 2.0,
  glassBlur: 30,
  shaderCornerRadius: 0.3,
  distortion: {
    start: 0.4,
    end: 0.1,
    offset: 0.2,
  },
  scaling: {
    start: 0.1,
    end: 0.9,
  },
  backgroundImageUrl: '/path/to/image.jpg',
});
```

### Legacy Support

Old shader parameter format is still supported for backward compatibility:

```js
useGlassDemo({
  shaderDistortionStart: 0.4,  // equivalent to distortion.start
  shaderDistortionEnd: 0.1,    // equivalent to distortion.end
  shaderDistortionOffset: 0.2, // equivalent to distortion.offset
  shaderScalingStart: 0.1,     // equivalent to scaling.start
  shaderScalingEnd: 0.9,       // equivalent to scaling.end
});
```

If a parameter is not specified, the default value is used.

## Description

- All parameters control the visual properties of the liquid glass effect.
- Changing values allows you to achieve different visual styles.
- For most parameters, values close to the default are recommended for a realistic effect.

---

This document is maintained automatically. To add new parameters, update the table and description.
