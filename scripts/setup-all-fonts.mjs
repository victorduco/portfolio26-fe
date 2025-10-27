#!/usr/bin/env node
/**
 * Setup script to add all Adobe fonts to the new project gsg2cxp
 *
 * This script:
 * 1. Fetches Adobe Font IDs from font pages
 * 2. Adds all Adobe fonts to the project
 * 3. Publishes the project
 * 4. Outputs the font configuration for FontSwitcher.vue
 */

import https from 'https';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ADOBE_API_TOKEN = '01c487c410f58d24edd08cda2440d4be022ca3cd';
const ADOBE_PROJECT_ID = 'gsg2cxp'; // New project ID
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// All fonts from the directory (ignoring + prefix)
const ALL_FONTS = [
  // Google Fonts
  { name: 'Albert Sans', provider: 'google', slug: 'Albert+Sans' },
  { name: 'Andika', provider: 'google', slug: 'Andika' },
  { name: 'Average Sans', provider: 'google', slug: 'Average+Sans' },
  { name: 'Be Vietnam Pro', provider: 'google', slug: 'Be+Vietnam+Pro' },
  { name: 'Biryani', provider: 'google', slug: 'Biryani' },
  { name: 'Cabin', provider: 'google', slug: 'Cabin' },
  { name: 'Carlito', provider: 'google', slug: 'Carlito' },
  { name: 'Commissioner', provider: 'google', slug: 'Commissioner' },
  { name: 'Figtree', provider: 'google', slug: 'Figtree' },
  { name: 'Gantari', provider: 'google', slug: 'Gantari' },
  { name: 'Hanken Grotesk', provider: 'google', slug: 'Hanken+Grotesk' },
  { name: 'Hind Mysuru', provider: 'google', slug: 'Hind+Mysuru' },
  { name: 'Instrument Sans', provider: 'google', slug: 'Instrument+Sans' },
  { name: 'Jaldi', provider: 'google', slug: 'Jaldi' },
  { name: 'Khula', provider: 'google', slug: 'Khula' },
  { name: 'Kumbh Sans', provider: 'google', slug: 'Kumbh+Sans' },
  { name: 'League Spartan', provider: 'google', slug: 'League+Spartan' },
  { name: 'Merriweather Sans', provider: 'google', slug: 'Merriweather+Sans' },
  { name: 'Mukta Mahee', provider: 'google', slug: 'Mukta+Mahee' },
  { name: 'Mukta', provider: 'google', slug: 'Mukta' },
  { name: 'Mulish', provider: 'google', slug: 'Mulish' },
  { name: 'Nokora', provider: 'google', slug: 'Nokora' },
  { name: 'Noto Sans Display', provider: 'google', slug: 'Noto+Sans+Display' },
  { name: 'Noto Sans', provider: 'google', slug: 'Noto+Sans' },
  { name: 'PT Sans Caption', provider: 'google', slug: 'PT+Sans+Caption' },
  { name: 'Sarabun', provider: 'google', slug: 'Sarabun' },
  { name: 'Sarala', provider: 'google', slug: 'Sarala' },
  { name: 'Teachers', provider: 'google', slug: 'Teachers' },
  { name: 'Tenor Sans', provider: 'google', slug: 'Tenor+Sans' },
  { name: 'Urbanist', provider: 'google', slug: 'Urbanist' },
  { name: 'Yantramanav', provider: 'google', slug: 'Yantramanav' },

  // Adobe Fonts
  { name: 'Adapter PE Variable', provider: 'adobe', slug: 'adapter-pe-variable', url: 'https://fonts.adobe.com/fonts/adapter-pe-variable' },
  { name: 'Avenir', provider: 'adobe', slug: 'avenir', url: 'https://fonts.adobe.com/fonts/avenir' },
  { name: 'Avenir Next', provider: 'adobe', slug: 'avenir-next', url: 'https://fonts.adobe.com/fonts/avenir-next' },
  { name: 'Brisbane', provider: 'adobe', slug: 'brisbane', url: 'https://fonts.adobe.com/fonts/brisbane' },
  { name: 'Darkmode CC', provider: 'adobe', slug: 'darkmode-cc', url: 'https://fonts.adobe.com/fonts/darkmode-cc' },
  { name: 'DM Sans', provider: 'adobe', slug: 'dm-sans', url: 'https://fonts.adobe.com/fonts/dm-sans' },
  { name: 'Guyot Sans', provider: 'adobe', slug: 'guyot-sans', url: 'https://fonts.adobe.com/fonts/guyot-sans' },
  { name: 'Hanken Grotesk', provider: 'adobe', slug: 'hanken-grotesk', url: 'https://fonts.adobe.com/fonts/hanken-grotesk' },
  { name: 'Highgate Variable', provider: 'adobe', slug: 'highgate-variable', url: 'https://fonts.adobe.com/fonts/highgate-variable' },
  { name: 'Hind Mysuru', provider: 'adobe', slug: 'hind-mysuru', url: 'https://fonts.adobe.com/fonts/hind-mysuru' },
  { name: 'Hind Vadodara', provider: 'adobe', slug: 'hind-vadodara', url: 'https://fonts.adobe.com/fonts/hind-vadodara' },
  { name: 'Indivisible Variable', provider: 'adobe', slug: 'indivisible-variable', url: 'https://fonts.adobe.com/fonts/indivisible-variable' },
  { name: 'Instrument Sans Variable', provider: 'adobe', slug: 'instrument-sans-variable', url: 'https://fonts.adobe.com/fonts/instrument-sans-variable' },
  { name: 'Ivyepic Variable', provider: 'adobe', slug: 'ivyepic-variable', url: 'https://fonts.adobe.com/fonts/ivyepic-variable' },
  { name: 'K2D', provider: 'adobe', slug: 'k2d', url: 'https://fonts.adobe.com/fonts/k2d' },
  { name: 'Koddiud Ongothic', provider: 'adobe', slug: 'koddiud-ongothic', url: 'https://fonts.adobe.com/fonts/koddiud-ongothic' },
  { name: 'Mulish Variable', provider: 'adobe', slug: 'mulish-variable', url: 'https://fonts.adobe.com/fonts/mulish-variable' },
  { name: 'MVB Salis', provider: 'adobe', slug: 'mvb-salis', url: 'https://fonts.adobe.com/fonts/mvb-salis' },
  { name: 'Myriad Variable', provider: 'adobe', slug: 'myriad-variable', url: 'https://fonts.adobe.com/fonts/myriad-variable' },
  { name: 'Neue Frutiger World', provider: 'adobe', slug: 'neue-frutiger-world', url: 'https://fonts.adobe.com/fonts/neue-frutiger-world' },
  { name: 'Neulis Sans', provider: 'adobe', slug: 'neulis-sans', url: 'https://fonts.adobe.com/fonts/neulis-sans' },
  { name: 'New Hero', provider: 'adobe', slug: 'new-hero', url: 'https://fonts.adobe.com/fonts/new-hero' },
  { name: 'Nexus Sans', provider: 'adobe', slug: 'nexus-sans', url: 'https://fonts.adobe.com/fonts/nexus-sans' },
  { name: 'Polymath', provider: 'adobe', slug: 'polymath', url: 'https://fonts.adobe.com/fonts/polymath' },
  { name: 'Proxima Nova Devanagari', provider: 'adobe', slug: 'proxima-nova-devanagari', url: 'https://fonts.adobe.com/fonts/proxima-nova-devanagari' },
  { name: 'Pureunjeonnam', provider: 'adobe', slug: 'pureunjeonnam', url: 'https://fonts.adobe.com/fonts/pureunjeonnam' },
  { name: 'Sarvatrik Latin Variable', provider: 'adobe', slug: 'sarvatrik-latin-variable', url: 'https://fonts.adobe.com/fonts/sarvatrik-latin-variable' },
];

// ============================================================================
// Adobe Font ID Fetcher
// ============================================================================

async function fetchAdobeFontId(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // Try to find web_id in the HTML
        const webIdMatch = data.match(/"web_id"\s*:\s*"([^"]+)"/);
        if (webIdMatch) {
          resolve(webIdMatch[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

// ============================================================================
// Adobe Fonts API Functions
// ============================================================================

function addFontToAdobeProject(fontId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'typekit.com',
      port: 443,
      path: `/api/v1/json/kits/${ADOBE_PROJECT_ID}/families/${fontId}`,
      method: 'POST',
      headers: {
        'X-Typekit-Token': ADOBE_API_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ success: true, fontId });
        } else {
          resolve({ success: false, fontId, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

function publishAdobeProject() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'typekit.com',
      port: 443,
      path: `/api/v1/json/kits/${ADOBE_PROJECT_ID}/publish`,
      method: 'POST',
      headers: {
        'X-Typekit-Token': ADOBE_API_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

function getAdobeProjectFonts() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'typekit.com',
      port: 443,
      path: `/api/v1/json/kits/${ADOBE_PROJECT_ID}`,
      method: 'GET',
      headers: {
        'X-Typekit-Token': ADOBE_API_TOKEN,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.kit.families || []);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🚀 Adobe Fonts Setup Script');
  console.log('================================\n');
  console.log(`Project ID: ${ADOBE_PROJECT_ID}\n`);

  const adobeFonts = ALL_FONTS.filter(f => f.provider === 'adobe');
  console.log(`Total Adobe fonts to add: ${adobeFonts.length}\n`);

  // Step 1: Fetch IDs for all Adobe fonts
  console.log('📝 Step 1: Fetching font IDs...\n');
  const failedFonts = [];

  for (const font of adobeFonts) {
    console.log(`  ⏳ ${font.name}...`);
    const id = await fetchAdobeFontId(font.url);

    if (id) {
      font.id = id;
      console.log(`     ✓ ID: ${id}`);
    } else {
      console.log(`     ✗ Could not fetch ID`);
      failedFonts.push(font.name);
    }

    await wait(500); // Rate limit
  }

  if (failedFonts.length > 0) {
    console.error(`\n❌ Failed to fetch IDs for ${failedFonts.length} font(s):`);
    failedFonts.forEach(name => console.error(`   - ${name}`));
    console.error('\nContinuing with fonts that have IDs...\n');
  }

  const fontsWithIds = adobeFonts.filter(f => f.id);
  console.log(`\n✅ Successfully fetched ${fontsWithIds.length} font IDs\n`);

  // Step 2: Add fonts to project
  console.log('📦 Step 2: Adding fonts to Adobe project...\n');

  let added = 0;
  let failed = 0;
  const BATCH_SIZE = 10;
  const DELAY = 1000;

  for (let i = 0; i < fontsWithIds.length; i += BATCH_SIZE) {
    const batch = fontsWithIds.slice(i, i + BATCH_SIZE);
    const promises = batch.map(font => addFontToAdobeProject(font.id));
    const results = await Promise.all(promises);

    results.forEach((result, idx) => {
      if (result.success) {
        added++;
        console.log(`  ✓ [${added}/${fontsWithIds.length}] ${batch[idx].name}`);
      } else {
        failed++;
        console.log(`  ✗ [${added}/${fontsWithIds.length}] ${batch[idx].name} - Status: ${result.status}`);
      }
    });

    if (i + BATCH_SIZE < fontsWithIds.length) {
      await wait(DELAY);
    }
  }

  console.log(`\n  Summary: Added: ${added}, Failed: ${failed}\n`);

  // Step 3: Publish project
  console.log('🚀 Step 3: Publishing Adobe project...\n');
  const publishResult = await publishAdobeProject();
  console.log(`  Publish status: ${publishResult.status}`);

  if (publishResult.status === 200 || publishResult.status === 201) {
    console.log('  ✓ Project published successfully!\n');
  } else {
    console.error('  ✗ Failed to publish project\n');
  }

  // Wait for CDN to propagate
  console.log('⏳ Waiting for Adobe CDN to update...');
  await wait(5000);
  console.log('   ✓ Done!\n');

  // Step 4: Get final list of fonts with CSS names
  console.log('📋 Step 4: Fetching CSS names from project...\n');
  const projectFonts = await getAdobeProjectFonts();

  // Map CSS names to our fonts
  fontsWithIds.forEach(font => {
    const projectFont = projectFonts.find(pf => pf.id === font.id);
    if (projectFont && projectFont.css_names && projectFont.css_names[0]) {
      font.cssName = projectFont.css_names[0];
      console.log(`  ✓ ${font.name}: "${font.cssName}"`);
    }
  });

  // Step 5: Output configuration for FontSwitcher.vue
  console.log('\n================================');
  console.log('✅ Setup complete!\n');
  console.log('📝 Font configuration for FontSwitcher.vue:\n');

  const googleFonts = ALL_FONTS.filter(f => f.provider === 'google');

  console.log('const fonts = [');

  // Add current zedou font
  console.log('  { label: "Zedou (Current)", value: "zedou", provider: "current", preview: "zedou" },');

  // Add Google fonts
  googleFonts.forEach(font => {
    console.log(`  { label: "${font.name}", value: "${font.slug}", provider: "google", preview: "${font.name}, sans-serif" },`);
  });

  // Add Adobe fonts
  fontsWithIds
    .filter(f => f.cssName)
    .forEach(font => {
      console.log(`  { label: "${font.name}", value: "${font.id}", provider: "adobe", cssName: "${font.cssName}", preview: "${font.cssName}, sans-serif" },`);
    });

  console.log('];');
  console.log('\n================================');
}

main().catch(console.error);
