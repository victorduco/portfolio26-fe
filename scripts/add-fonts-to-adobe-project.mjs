// Add all Adobe Fonts to your Web Project
import https from 'https';
import fs from 'fs';

const API_TOKEN = '01c487c410f58d24edd08cda2440d4be022ca3cd';
const PROJECT_ID = 'nme2qkx';

// Load fonts list
const fontsData = JSON.parse(fs.readFileSync('adobe-fonts-list.json', 'utf-8'));
const fonts = fontsData.fonts;

console.log(`Adding ${fonts.length} Adobe Fonts to project ${PROJECT_ID}...\n`);

function addFontToProject(fontId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'typekit.com',
      port: 443,
      path: `/api/v1/json/kits/${PROJECT_ID}/families/${fontId}`,
      method: 'POST',
      headers: {
        'X-Typekit-Token': API_TOKEN,
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

function publishProject() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'typekit.com',
      port: 443,
      path: `/api/v1/json/kits/${PROJECT_ID}/publish`,
      method: 'POST',
      headers: {
        'X-Typekit-Token': API_TOKEN,
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

async function main() {
  let added = 0;
  let failed = 0;

  // Add fonts in batches to avoid rate limiting
  const BATCH_SIZE = 10;
  const DELAY = 1000; // 1 second between batches

  for (let i = 0; i < fonts.length; i += BATCH_SIZE) {
    const batch = fonts.slice(i, i + BATCH_SIZE);
    const promises = batch.map(font => addFontToProject(font.id));

    const results = await Promise.all(promises);

    results.forEach((result, idx) => {
      if (result.success) {
        added++;
        console.log(`✓ [${added}/${fonts.length}] ${batch[idx].name}`);
      } else {
        failed++;
        console.log(`✗ [${added}/${fonts.length}] ${batch[idx].name} - Status: ${result.status}`);
      }
    });

    // Wait between batches
    if (i + BATCH_SIZE < fonts.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }

  console.log(`\n\nAdded: ${added}`);
  console.log(`Failed: ${failed}`);

  // Publish the project
  console.log('\nPublishing project...');
  const publishResult = await publishProject();
  console.log(`Publish status: ${publishResult.status}`);

  console.log('\n✓ Done! Your project is ready.');
  console.log(`Embed code: <link rel="stylesheet" href="https://use.typekit.net/${PROJECT_ID}.css">`);
}

main().catch(console.error);
