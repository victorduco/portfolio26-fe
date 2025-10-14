#!/usr/bin/env node

/**
 * Generate single test PNG (5555.png) for testing
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../public/keypad-backgrounds");
const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];

// Image dimensions
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;
const DIGIT_WIDTH = 400;
const DIGIT_HEIGHT = 700;

/**
 * Generate composite SVG with all digits
 */
function generateCompositeSVG(digits) {
  const totalDigitsWidth = DIGIT_WIDTH * digits.length;

  const digitElements = digits
    .map((digit, index) => {
      const color = COLORS[index % COLORS.length];
      const xOffset = index * DIGIT_WIDTH;

      return `
      <g transform="translate(${xOffset}, 0)">
        <svg
          viewBox="100 -50 500 900"
          width="${DIGIT_WIDTH}"
          height="${DIGIT_HEIGHT}"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="350"
            y="400"
            font-size="825"
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
            font-weight="400"
            text-anchor="middle"
            dominant-baseline="central"
            fill="${color}"
          >
            ${digit}
          </text>
        </svg>
      </g>
    `;
    })
    .join("");

  const xOffset = (IMAGE_WIDTH - totalDigitsWidth) / 2;
  const yOffset = (IMAGE_HEIGHT - DIGIT_HEIGHT) / 2;

  return `
    <svg
      width="${IMAGE_WIDTH}"
      height="${IMAGE_HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="#171717"/>
      <g transform="translate(${xOffset}, ${yOffset})">
        ${digitElements}
      </g>
    </svg>
  `.trim();
}

async function main() {
  console.log("🎨 Generating test PNG: 5555.png");

  const digits = [5, 5, 5, 5];
  const svg = generateCompositeSVG(digits);

  const buffer = await sharp(Buffer.from(svg))
    .blur(5)
    .modulate({
      brightness: 0.9,
      saturation: 0.9,
    })
    .linear(1.0, 0)
    .png({
      quality: 80,
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toBuffer();

  const filepath = path.join(OUTPUT_DIR, "5555.png");
  await sharp(buffer).toFile(filepath);

  console.log(`✅ Created: ${filepath}`);
  console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
