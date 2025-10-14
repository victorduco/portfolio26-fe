#!/usr/bin/env node

/**
 * CDN Setup Verification Script
 *
 * Checks that CDN infrastructure and backgrounds are properly configured
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [];
let hasErrors = false;

function check(name, condition, successMsg, errorMsg, isWarning = false) {
  if (condition) {
    checks.push({ name, status: "✅", message: successMsg });
  } else {
    checks.push({ name, status: isWarning ? "⚠️" : "❌", message: errorMsg });
    if (!isWarning) hasErrors = true;
  }
}

console.log("🔍 CDN Setup Verification\n");

// Check 1: Manifest exists
const manifestPath = path.join(
  __dirname,
  "../public/keypad-backgrounds/manifest.json"
);
const manifestExists = fs.existsSync(manifestPath);
check(
  "Manifest",
  manifestExists,
  "manifest.json found",
  "manifest.json not found. Run: npm run generate:backgrounds"
);

// Check 2: Manifest content
if (manifestExists) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const entries = Object.keys(manifest).length;

    check(
      "Manifest entries",
      entries >= 10,
      `${entries.toLocaleString()} entries found`,
      `Only ${entries} entries. Expected 11,110. Run: npm run generate:backgrounds`,
      entries === 10 // Warning if placeholder manifest
    );

    // Check sample entry format
    const sampleKey = Object.keys(manifest)[0];
    const sampleValue = manifest[sampleKey];
    const hasHash = sampleValue.includes(".");

    check(
      "Filename format",
      hasHash,
      `Content-hashed filenames detected (e.g., ${sampleValue})`,
      `Filenames missing hashes. Run: npm run generate:backgrounds:force`
    );
  } catch (error) {
    check(
      "Manifest content",
      false,
      "",
      `Invalid JSON in manifest: ${error.message}`
    );
  }
}

// Check 3: Sample background files exist
const backgroundsDir = path.join(
  __dirname,
  "../public/keypad-backgrounds/sharp"
);
const backgroundsExist = fs.existsSync(backgroundsDir);

check(
  "Backgrounds directory",
  backgroundsExist,
  "sharp/ directory exists",
  "sharp/ directory not found",
  true
);

if (backgroundsExist) {
  const files = fs
    .readdirSync(backgroundsDir)
    .filter((f) => f.endsWith(".png"));
  check(
    "Background files",
    files.length > 0,
    `${files.length.toLocaleString()} PNG files found`,
    "No PNG files found. Run: npm run generate:backgrounds",
    files.length < 100
  );
}

// Check 4: .env.example exists
const envExamplePath = path.join(__dirname, "../.env.example");
check(
  "Environment template",
  fs.existsSync(envExamplePath),
  ".env.example found",
  ".env.example missing"
);

// Check 5: .env configuration (optional)
const envPath = path.join(__dirname, "../.env");
const envLocalPath = path.join(__dirname, "../.env.local");
const hasEnvConfig = fs.existsSync(envPath) || fs.existsSync(envLocalPath);

if (hasEnvConfig) {
  const envFile = fs.existsSync(envPath) ? envPath : envLocalPath;
  const envContent = fs.readFileSync(envFile, "utf-8");
  const hasCdnUrl = envContent.includes("VITE_CDN_BASE_URL");

  check(
    "CDN configuration",
    hasCdnUrl,
    "VITE_CDN_BASE_URL configured in .env",
    "VITE_CDN_BASE_URL not set (OK for dev)",
    true
  );

  if (hasCdnUrl) {
    const cdnUrlMatch = envContent.match(/VITE_CDN_BASE_URL=(.+)/);
    if (cdnUrlMatch && cdnUrlMatch[1] && cdnUrlMatch[1].trim() !== "") {
      const cdnUrl = cdnUrlMatch[1].trim();
      check(
        "CDN URL format",
        cdnUrl.startsWith("https://") && cdnUrl.includes("cloudfront"),
        `CDN URL: ${cdnUrl}`,
        `CDN URL may be incorrect: ${cdnUrl}`,
        true
      );
    }
  }
} else {
  checks.push({
    name: "Environment config",
    status: "ℹ️",
    message: "No .env file (using defaults - OK for dev)",
  });
}

// Check 6: AWS CLI (optional)
import { execSync } from "child_process";
try {
  const awsVersion = execSync("aws --version 2>&1", {
    encoding: "utf-8",
  }).trim();
  checks.push({
    name: "AWS CLI",
    status: "✅",
    message: `Installed: ${awsVersion.split("\n")[0]}`,
  });

  // Check AWS profile
  try {
    const profile = execSync("aws configure list --profile cdn-uploader 2>&1", {
      encoding: "utf-8",
    });
    if (profile.includes("access_key")) {
      checks.push({
        name: "AWS Profile",
        status: "✅",
        message: "cdn-uploader profile configured",
      });
    }
  } catch (error) {
    checks.push({
      name: "AWS Profile",
      status: "⚠️",
      message: "cdn-uploader profile not found (OK if not uploading)",
    });
  }
} catch (error) {
  checks.push({
    name: "AWS CLI",
    status: "ℹ️",
    message: "Not installed (needed for S3 upload)",
  });
}

// Check 7: npm scripts exist
const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

check(
  "npm script: cdn:sync",
  !!packageJson.scripts["cdn:sync"],
  "cdn:sync script found",
  "cdn:sync script missing"
);

check(
  "npm script: generate:backgrounds",
  !!packageJson.scripts["generate:backgrounds"],
  "generate:backgrounds script found",
  "generate:backgrounds script missing"
);

// Print results
console.log("Results:\n");
checks.forEach(({ name, status, message }) => {
  console.log(`${status} ${name.padEnd(25)} ${message}`);
});

console.log("\n" + "─".repeat(70) + "\n");

if (hasErrors) {
  console.log("❌ Setup incomplete. Please fix errors above.\n");
  console.log("Quick fixes:");
  console.log("  • Run: npm run generate:backgrounds");
  console.log("  • See: docs/cdn-setup.md");
  process.exit(1);
} else {
  console.log("✅ Setup looks good!\n");

  const totalFiles = manifestExists
    ? Object.keys(JSON.parse(fs.readFileSync(manifestPath, "utf-8"))).length
    : 0;

  if (totalFiles < 100) {
    console.log("⚠️  Warning: Limited backgrounds generated (dev mode)");
    console.log("   For full production setup:");
    console.log("   1. npm run generate:backgrounds");
    console.log("   2. npm run cdn:sync");
    console.log("   3. npm run cdn:sync:manifest\n");
  } else {
    console.log("Next steps:");
    console.log(
      "  • Upload to S3: npm run cdn:sync && npm run cdn:sync:manifest"
    );
    console.log(
      "  • Configure Heroku: heroku config:set VITE_CDN_BASE_URL=..."
    );
    console.log("  • Deploy: git push heroku main\n");
  }

  console.log("See docs/deployment-checklist.md for full workflow.\n");
}
