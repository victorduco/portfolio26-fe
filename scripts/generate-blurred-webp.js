#!/usr/bin/env node

/**
 * Генерация только блюреных WebP для цифр (аналог generate-fast-optimized.js)
 * Сохраняет только blurred webp в отдельную папку /public/keypad-backgrounds-webp/blurred
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфиг
const OUTPUT_DIR = path.join(
  __dirname,
  "../public/keypad-backgrounds-webp/blurred"
);
const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const DIGIT_COUNT = 10;
const COLOR_COUNT = COLORS.length;

await fs.mkdir(OUTPUT_DIR, { recursive: true });

function generateDigitSVG(digit, color) {
  // Минимальный SVG для цифры (можно заменить на свой)
  return `<svg width='400' height='700' xmlns='http://www.w3.org/2000/svg'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='600' fill='${color}'>${digit}</text></svg>`;
}

console.log("Generating blurred WebP digits...");

for (let digit = 0; digit < DIGIT_COUNT; digit++) {
  for (let colorIdx = 0; colorIdx < COLOR_COUNT; colorIdx++) {
    const color = COLORS[colorIdx];
    const svg = generateDigitSVG(digit, color);
    const buffer = Buffer.from(svg);
    const outPath = path.join(OUTPUT_DIR, `${digit}_${colorIdx}.webp`);

    // Генерируем блюреный webp
    const blurredWebpBuffer = await sharp(buffer)
      .blur(15)
      .modulate({ brightness: 0.9, saturation: 1.0 })
      .webp({ quality: 90 })
      .toBuffer();
    await fs.writeFile(outPath, blurredWebpBuffer);
    console.log(`✔ ${outPath}`);
  }
}

console.log("Done!");
