// Get all Adobe Fonts from Typekit API
import https from 'https';
import fs from 'fs';

const PER_PAGE = 100;
const OUTPUT_FILE = 'adobe-fonts-list.json';

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const url = `https://typekit.com/api/v1/json/libraries/full?per_page=${PER_PAGE}&page=${page}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function getAllFonts() {
  console.log('Fetching Adobe Fonts from Typekit API...\n');

  // Get first page to know total pages
  const firstPage = await fetchPage(1);
  const totalPages = firstPage.library.pagination.page_count;
  const totalFonts = firstPage.library.pagination.count;

  console.log(`Total fonts: ${totalFonts}`);
  console.log(`Total pages: ${totalPages}\n`);

  let allFonts = [...firstPage.library.families];

  // Fetch remaining pages
  for (let page = 2; page <= totalPages; page++) {
    process.stdout.write(`\rFetching page ${page}/${totalPages}...`);
    const pageData = await fetchPage(page);
    allFonts = allFonts.concat(pageData.library.families);
    await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
  }

  console.log('\n\nDone! Saving to file...');

  // Save to JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ fonts: allFonts, count: allFonts.length }, null, 2));

  // Generate config for test script
  console.log('\nFor test-fonts.mjs (requires Adobe Fonts project):\n');
  console.log('const FONTS_TO_TEST = [');

  allFonts.slice(0, 10).forEach(font => {
    const name = font.name.replace(/\s+/g, '-');
    console.log(`  { name: '${name}', value: '"${font.name}", sans-serif', adobeFontId: '${font.id}' },`);
  });

  console.log('  // ... and', allFonts.length - 10, 'more fonts');
  console.log('];\n');

  console.log(`✓ Saved ${allFonts.length} fonts to ${OUTPUT_FILE}`);
}

getAllFonts().catch(console.error);
