export interface Vec2 {
  x: number;
  y: number;
}

export interface ShaderOptions {
  width: number;
  height: number;
  cornerRadius?: number;
  rectWidth?: number;
  rectHeight?: number;
  distortionStart?: number;
  distortionEnd?: number;
  distortionOffset?: number;
  scalingStart?: number;
  scalingEnd?: number;
  centerOffsetX?: number;
  centerOffsetY?: number;
  edgeSoftness?: number;
}

export class ShaderDisplacementGenerator {
  private static readonly CANVAS_DPI = 2;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(private options: ShaderOptions) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = options.width * ShaderDisplacementGenerator.CANVAS_DPI;
    this.canvas.height = options.height * ShaderDisplacementGenerator.CANVAS_DPI;
    this.canvas.style.display = "none";

    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Could not get 2D context");
    this.context = context;
  }

  updateShader(): string {
    const dpi = ShaderDisplacementGenerator.CANVAS_DPI;
    const w = this.options.width * dpi;
    const h = this.options.height * dpi;

    let maxScale = 0;
    const rawValues: number[] = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pos = this.getFragment({ x: x / w, y: y / h });
        const dx = pos.x * w - x;
        const dy = pos.y * h - y;
        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        rawValues.push(dx, dy);
      }
    }

    maxScale = maxScale > 0 ? Math.max(maxScale, 1) : 1;

    const imageData = this.context.createImageData(w, h);
    const data = imageData.data;

    const edgeSoftness = this.options.edgeSoftness ?? 2;
    let rawIndex = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const edgeFactor = Math.min(1, Math.min(x, y, w - x - 1, h - y - 1) / edgeSoftness);
        const smoothedDx = rawValues[rawIndex++] * edgeFactor;
        const smoothedDy = rawValues[rawIndex++] * edgeFactor;
        const r = Math.max(0, Math.min(255, (smoothedDx / maxScale + 0.5) * 255));
        const g = Math.max(0, Math.min(255, (smoothedDy / maxScale + 0.5) * 255));

        const pi = (y * w + x) * 4;
        data[pi] = r;
        data[pi + 1] = g;
        data[pi + 2] = g;
        data[pi + 3] = 255;
      }
    }

    this.context.putImageData(imageData, 0, 0);

    return this.canvas.toDataURL();
  }

  private smoothStep(a: number, b: number, t: number): number {
    const clamped = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return clamped * clamped * (3 - 2 * clamped);
  }

  private roundedRectSDF(x: number, y: number, width: number, height: number, radius: number): number {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return Math.min(Math.max(qx, qy), 0) + Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) - radius;
  }

  private getFragment(uv: Vec2): Vec2 {
    const o = this.options;
    const centerX = 0.5 + (o.centerOffsetX ?? 0);
    const centerY = 0.5 + (o.centerOffsetY ?? 0);
    const ix = uv.x - centerX;
    const iy = uv.y - centerY;
    const rectW = o.rectWidth ?? 0;
    const rectH = o.rectHeight ?? 0;
    const distanceToEdge = this.roundedRectSDF(ix, iy, rectW, rectH, o.cornerRadius ?? 0.2);
    const displacement = this.smoothStep(o.distortionStart ?? 0.3, o.distortionEnd ?? 0, distanceToEdge - (o.distortionOffset ?? 0.15));
    const scaled = this.smoothStep(o.scalingStart ?? 0, o.scalingEnd ?? 1, displacement);
    return { x: ix * scaled + centerX, y: iy * scaled + centerY };
  }

  destroy(): void {
    this.canvas.remove();
  }
}
