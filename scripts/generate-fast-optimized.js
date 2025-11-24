#!/usr/bin/env node
// Fast Optimized Keypad Background Generator - pre-renders digit glyphs, composites them with content hashes

import sharp from "sharp";
import cliProgress from "cli-progress";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/keypad-backgrounds");
const SHARP_DIR = path.join(OUTPUT_DIR, "sharp");
const GLYPHS_DIR = path.join(OUTPUT_DIR, ".glyphs/sharp");

const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const [IMG_W, IMG_H, DIG_W, DIG_H, DIG_SP] = [3840, 2160, 700, 1300, -50];
const FORCE = process.argv.includes("--force");
const SINGLE_ONLY = process.argv.includes("--single-digits");

const manifest = {};
const stats = { glyphs: 0, generated: 0, skipped: 0, totalSize: 0, start: Date.now() };

const exists = (p) => fs.access(p).then(() => true).catch(() => false);
const fmtSize = (b) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";
const hash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 8);

const digitSVG = (d, c) => `<svg viewBox="0 -100 1000 1800" width="${DIG_W}" height="${DIG_H}" xmlns="http://www.w3.org/2000/svg"><text x="510" y="900" font-size="1650" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" text-anchor="middle" dominant-baseline="central" fill="${c}">${d}</text></svg>`;

async function generateGlyphs() {
  console.log("\n📐 Generating digit glyphs...");
  await fs.mkdir(GLYPHS_DIR, { recursive: true });

  const tasks = [];
  for (let d = 0; d <= 9; d++) {
    for (let c = 0; c < 4; c++) {
      const p = path.join(GLYPHS_DIR, `${d}_${c}.png`);
      if (!FORCE && await exists(p)) continue;
      tasks.push({ d, c, p, color: COLORS[c] });
    }
  }

  if (!tasks.length) return console.log("✅ All glyphs exist (use --force to regenerate)");

  console.log(`Generating ${tasks.length} glyphs...`);
  await Promise.all(tasks.map(async ({ d, color, p }) => {
    await sharp(Buffer.from(digitSVG(d, color))).png({ quality: 80, compressionLevel: 9 }).toFile(p);
    stats.glyphs++;
  }));
  console.log(`✅ Generated ${stats.glyphs} glyphs`);
}

function getCombinations() {
  if (SINGLE_ONLY) return [...Array(10)].map((_, i) => String(i));
  return [
    ...[...Array(10)].map((_, i) => String(i)),
    ...[...Array(100)].map((_, i) => String(i).padStart(2, "0")),
    ...[...Array(1000)].map((_, i) => String(i).padStart(3, "0")),
    ...[...Array(10000)].map((_, i) => String(i).padStart(4, "0")),
  ];
}

async function composeBackground(code, bar) {
  const digits = [...code].map(Number);
  const totalW = DIG_W * digits.length + DIG_SP * (digits.length - 1);
  const [xOff, yOff] = [(IMG_W - totalW) / 2, (IMG_H - DIG_H) / 2];

  const composites = digits.map((d, i) => ({
    input: path.join(GLYPHS_DIR, `${d}_${i % 4}.png`),
    left: Math.round(xOff + i * (DIG_W + DIG_SP)),
    top: Math.round(yOff),
  }));

  const buffer = await sharp({ create: { width: IMG_W, height: IMG_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites).png({ quality: 80, compressionLevel: 9 }).toBuffer();

  const filename = `${code}.${hash(buffer)}.png`;
  const filepath = path.join(SHARP_DIR, filename);

  if (!FORCE && await exists(filepath)) {
    stats.skipped++;
  } else {
    await fs.writeFile(filepath, buffer);
    stats.generated++;
    stats.totalSize += buffer.length;
  }
  manifest[code] = filename;
  bar.increment();
}

async function composeBackgrounds() {
  console.log("\n🎨 Composing backgrounds...");
  await fs.mkdir(SHARP_DIR, { recursive: true });

  const combos = getCombinations();
  const bar = new cliProgress.SingleBar({ format: "Progress |{bar}| {percentage}% | {value}/{total}", barCompleteChar: "\u2588", barIncompleteChar: "\u2591", hideCursor: true });
  bar.start(combos.length, 0);

  for (let i = 0; i < combos.length; i += 100) {
    await Promise.all(combos.slice(i, i + 100).map((c) => composeBackground(c, bar)));
  }

  bar.stop();
  console.log(`✅ Generated ${stats.generated} backgrounds\n⏭️  Skipped ${stats.skipped} existing files`);
}

async function main() {
  console.log(`🚀 Fast Optimized Keypad Background Generator\n\nOutput: ${OUTPUT_DIR}\nMode: ${SINGLE_ONLY ? "Single digits (0-9)" : "All (0-9999)"}\nForce: ${FORCE}\n`);

  await generateGlyphs();
  await composeBackgrounds();

  await fs.writeFile(path.join(OUTPUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n📋 Manifest saved`);

  const dur = ((Date.now() - stats.start) / 1000).toFixed(1);
  const avg = stats.generated > 0 ? stats.totalSize / stats.generated : 0;
  console.log(`\n✅ Complete!\n\nStatistics:\n  Glyphs: ${stats.glyphs}\n  Generated: ${stats.generated}\n  Skipped: ${stats.skipped}\n  Manifest: ${Object.keys(manifest).length}\n  Total: ${fmtSize(stats.totalSize)}\n  Avg: ${fmtSize(avg)}\n  Duration: ${dur}s\n  Speed: ${(stats.generated / parseFloat(dur)).toFixed(1)} img/s`);
}

main().catch(console.error);
