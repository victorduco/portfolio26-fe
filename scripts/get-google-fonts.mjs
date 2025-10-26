// Скрипт для получения списка популярных шрифтов из Google Fonts
// Не требует API ключа - использует публичный эндпоинт

import https from 'https';
import fs from 'fs';
import path from 'path';

// Получаем топ N популярных шрифтов (0 = все шрифты)
const TOP_FONTS_COUNT = 0; // 0 means all fonts

// Публичный эндпоинт (работает без ключа, но с ограничениями)
// Альтернатива: можно парсить список с сайта fonts.google.com
const FONTS_JSON_URL = 'https://fonts.google.com/metadata/fonts';

function fetchGoogleFonts() {
  return new Promise((resolve, reject) => {
    https.get(FONTS_JSON_URL, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Google возвращает данные с префиксом для безопасности
          const jsonString = data.replace(/^\)\]\}'/, '');
          const parsed = JSON.parse(jsonString);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log('Fetching Google Fonts metadata...\n');

  try {
    const data = await fetchGoogleFonts();

    if (!data.familyMetadataList) {
      console.error('Unexpected data structure');
      return;
    }

    // Сортируем все шрифты по популярности
    const allFonts = data.familyMetadataList
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    // Берем топ N (или все если 0)
    const topFonts = TOP_FONTS_COUNT > 0
      ? allFonts.slice(0, TOP_FONTS_COUNT)
      : allFonts;

    const count = TOP_FONTS_COUNT > 0 ? TOP_FONTS_COUNT : topFonts.length;
    console.log(`${count} Google Fonts (ALL categories):\n`);
    console.log('For test-fonts.mjs:\n');

    // Форматируем для вставки в test-fonts.mjs
    const fontConfigs = topFonts.map(font => {
      const name = font.family.replace(/\s+/g, '-');
      const googleFont = font.family.replace(/\s+/g, '+') + ':wght@100..900';
      return `  { name: '${name}', value: '"${font.family}", sans-serif', googleFont: '${googleFont}' },`;
    });

    console.log('const FONTS_TO_TEST = [');
    fontConfigs.forEach(config => console.log(config));
    console.log('];\n');

    // Также выводим просто список названий
    console.log('Font names only:');
    topFonts.forEach((font, i) => {
      console.log(`${i + 1}. ${font.family}`);
    });

    // Сохраняем полный список в файл
    const outputPath = path.join(process.cwd(), 'google-fonts-list.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ topFonts, total: data.familyMetadataList.length }, null, 2),
      'utf-8'
    );

    console.log(`\n✓ Full list saved to: ${outputPath}`);
    console.log(`  Total fonts available: ${data.familyMetadataList.length}`);

  } catch (error) {
    console.error('Error fetching fonts:', error.message);
  }
}

main();
