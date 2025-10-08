import { chromium, webkit, firefox } from '@playwright/test';
import { setupPerformanceTracking, getPerformanceMetrics, calculateStats } from '../helpers/performance.js';
import { saveResults, appendToLog } from '../helpers/reporter.js';
import { analyzeResults, saveAnalysis } from '../helpers/analyzer.js';

const writeLine = (text = '') => process.stdout.write(`${text}\n`);

/**
 * Test SVG filter area performance
 *
 * Flow:
 * 1. Input 3 digits on keypad (1-5-1) with hovers between inputs
 * 2. Measure performance for 5 filter area configurations:
 *    - 100% (baseline)
 *    - 75%
 *    - 50%
 *    - 25%
 *    - 0% (disabled)
 */
export async function testFilterAreaPerformance({
  url = 'http://localhost:5173',
  headless = false,
  comment = '',
  cpuThrottling = 1,
  browserType = 'chromium'
} = {}) {
  const testStartTime = Date.now();

  // Select browser
  const browsers = { chromium, webkit, firefox };
  const browserEngine = browsers[browserType] || chromium;

  writeLine(`🌐 Browser: ${browserType}`);
  writeLine();
  const browser = await browserEngine.launch({
    headless,
    ...(browserType === 'webkit' && !headless ? {
      args: ['--auto-open-devtools-for-tabs']
    } : {})
  });

  // Filter area configurations (from full to disabled)
  // Each config has corresponding digits to input
  const filterConfigs = [
    { name: '0% (disabled)', percent: 0, displayNone: true, digits: ['0', '0', '0'] },
    { name: '25%', percent: 25, displayNone: false, digits: ['2', '5', '0'] },
    { name: '50%', percent: 50, displayNone: false, digits: ['5', '0', '0'] },
    { name: '75%', percent: 75, displayNone: false, digits: ['7', '5', '0'] },
    { name: '100% (baseline)', percent: 100, displayNone: false, digits: ['1', '0', '0'] }
  ];

  const configResults = [];

  // Create single page for all configs
  const page = await browser.newPage();

  // Bring window to front for WebKit BEFORE any operations
  if (browserType === 'webkit' && !headless) {
    await page.bringToFront();

    if (process.platform === 'darwin') {
      const { execSync } = await import('child_process');
      try {
        execSync(`osascript -e 'tell application "System Events" to set frontmost of first process whose name contains "Playwright" to true'`, { timeout: 2000 });
      } catch (err) {
        writeLine('⚠️  Could not activate window via AppleScript (non-critical)');
      }
      await page.waitForTimeout(300);
    }
  }

  try {
    // Enable CPU throttling if specified
    if (cpuThrottling > 1) {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottling });
    }

    // Set viewport BEFORE goto
    const viewportSize = browserType === 'webkit' && !headless
      ? { width: 1600, height: 900 }
      : { width: 1280, height: 800 };
    await page.setViewportSize(viewportSize);

    for (const config of filterConfigs) {
      writeLine();
      writeLine('═'.repeat(80));
      writeLine(`Testing filter area: ${config.name}`);
      writeLine('═'.repeat(80));
      writeLine();

      // Reload page for fresh state
      await page.goto(url);

      // Set window position to top-left (0,0) for WebKit
      if (browserType === 'webkit' && !headless && process.platform === 'darwin') {
        const { execSync } = await import('child_process');
        try {
          execSync(`osascript -e 'tell application "System Events" to tell process "Playwright" to set position of window 1 to {0, 0}'`, { timeout: 2000 });
        } catch (err) {
          writeLine('⚠️  Could not set window position (non-critical)');
        }
        await page.waitForTimeout(300);
      }

      // Apply filter area modification BEFORE any interaction
      if (config.displayNone) {
        writeLine('🔧 Disabling SVG filter (display: none)...');
        writeLine();
        await page.evaluate(() => {
          const filterSvgs = document.querySelectorAll('.glass-filter__svg');
          filterSvgs.forEach(svg => {
            svg.style.display = 'none';
          });
        });
      } else if (config.percent < 100) {
        writeLine(`🔧 Adjusting filter area to ${config.percent}%...`);
        writeLine();
        await page.evaluate((percent) => {
          const filters = document.querySelectorAll('filter');
          filters.forEach(filter => {
            const feImage = filter.querySelector('feImage');
            if (feImage) {
              const currentWidth = parseFloat(feImage.getAttribute('width')) || 100;
              const currentHeight = parseFloat(feImage.getAttribute('height')) || 100;

              const newWidth = currentWidth * (percent / 100);
              const newHeight = currentHeight * (percent / 100);

              feImage.setAttribute('width', newWidth);
              feImage.setAttribute('height', newHeight);
            }
          });
        }, config.percent);
      }

      // Setup performance tracking
      await setupPerformanceTracking(page);

      writeLine('🖱️  Тест: цифра → ховеры → цифра → ховеры → цифра → ховеры');
      writeLine();

      const interactionMetrics = [];
      const fpsMetrics = [];

      // Get all keypad buttons
      const buttons = await page.locator('.keypad-button-hover-wrapper').all();
      writeLine(`📦 Найдено кнопок: ${buttons.length}`);
      writeLine();

      // Helper function for smooth mouse movement
      const smoothMove = async (fromX, fromY, toX, toY, steps = 30, stepDelay = 15) => {
        for (let step = 0; step <= steps; step++) {
          const progress = step / steps;
          const x = fromX + (toX - fromX) * progress;
          const y = fromY + (toY - fromY) * progress;
          await page.mouse.move(x, y);
          await page.waitForTimeout(stepDelay);
        }
      };

      let lastX = 0;
      let lastY = 0;

      // DIGIT 1: Click first digit
      const digit1 = config.digits[0];
      writeLine(`  📌 Цифра 1: Клик на кнопку "${digit1}" (процент: ${config.percent}%)...`);
      const button1Box = await page.locator(`.keypad-button-hover-wrapper:has-text("${digit1}")`).boundingBox();
      if (button1Box) {
        await smoothMove(lastX, lastY, button1Box.x + button1Box.width / 2, button1Box.y + button1Box.height / 2);
        await page.mouse.click(button1Box.x + button1Box.width / 2, button1Box.y + button1Box.height / 2);
        lastX = button1Box.x + button1Box.width / 2;
        lastY = button1Box.y + button1Box.height / 2;
        await page.waitForTimeout(300);
      }

      // HOVERS 1: Horizontal (left-right)
      writeLine('  🖱️  Ховеры 1: Горизонтальное движение (лево-право)...');
      const horizontalPattern = [1, 2, 3, 2, 1, 0]; // Движение по горизонтали
      const hoverStartTime1 = Date.now();
      for (const index of horizontalPattern) {
        if (index < buttons.length) {
          const box = await buttons[index].boundingBox();
          if (box) {
            await smoothMove(lastX, lastY, box.x + box.width / 2, box.y + box.height / 2);
            lastX = box.x + box.width / 2;
            lastY = box.y + box.height / 2;
            await page.waitForTimeout(500);
          }
        }
      }
      const hoverDuration1 = Date.now() - hoverStartTime1;
      writeLine(`    ⏱️  Длительность: ${hoverDuration1}ms`);
      writeLine();
      interactionMetrics.push({ type: 'hover-horizontal', duration: hoverDuration1 });

      // DIGIT 2: Click second digit
      const digit2 = config.digits[1];
      writeLine(`  📌 Цифра 2: Клик на кнопку "${digit2}"...`);
      const button2Box = await page.locator(`.keypad-button-hover-wrapper:has-text("${digit2}")`).boundingBox();
      if (button2Box) {
        await smoothMove(lastX, lastY, button2Box.x + button2Box.width / 2, button2Box.y + button2Box.height / 2);
        await page.mouse.click(button2Box.x + button2Box.width / 2, button2Box.y + button2Box.height / 2);
        lastX = button2Box.x + button2Box.width / 2;
        lastY = button2Box.y + button2Box.height / 2;
        await page.waitForTimeout(300);
      }

      // HOVERS 2: Diagonal (top-left to bottom-right)
      writeLine('  🖱️  Ховеры 2: Диагональ (верх-лево → низ-право)...');
      const diagonalPattern1 = [1, 5, 9]; // Диагональ
      const hoverStartTime2 = Date.now();
      for (const index of diagonalPattern1) {
        if (index < buttons.length) {
          const box = await buttons[index].boundingBox();
          if (box) {
            await smoothMove(lastX, lastY, box.x + box.width / 2, box.y + box.height / 2);
            lastX = box.x + box.width / 2;
            lastY = box.y + box.height / 2;
            await page.waitForTimeout(600);
          }
        }
      }
      const hoverDuration2 = Date.now() - hoverStartTime2;
      writeLine(`    ⏱️  Длительность: ${hoverDuration2}ms`);
      writeLine();
      interactionMetrics.push({ type: 'hover-diagonal1', duration: hoverDuration2 });

      // DIGIT 3: Click third digit
      const digit3 = config.digits[2];
      writeLine(`  📌 Цифра 3: Клик на кнопку "${digit3}"...`);
      const button3Box = await page.locator(`.keypad-button-hover-wrapper:has-text("${digit3}")`).boundingBox();
      if (button3Box) {
        await smoothMove(lastX, lastY, button3Box.x + button3Box.width / 2, button3Box.y + button3Box.height / 2);
        await page.mouse.click(button3Box.x + button3Box.width / 2, button3Box.y + button3Box.height / 2);
        lastX = button3Box.x + button3Box.width / 2;
        lastY = button3Box.y + button3Box.height / 2;
        await page.waitForTimeout(300);
      }

      // HOVERS 3: Diagonal (top-right to bottom-left) + Vertical
      writeLine('  🖱️  Ховеры 3: Диагональ (верх-право → низ-лево) + Вертикаль...');
      const diagonalPattern2 = [3, 5, 7, 4, 1]; // Диагональ обратная + вертикаль
      const hoverStartTime3 = Date.now();
      for (const index of diagonalPattern2) {
        if (index < buttons.length) {
          const box = await buttons[index].boundingBox();
          if (box) {
            await smoothMove(lastX, lastY, box.x + box.width / 2, box.y + box.height / 2);
            lastX = box.x + box.width / 2;
            lastY = box.y + box.height / 2;
            await page.waitForTimeout(600);
          }
        }
      }
      const hoverDuration3 = Date.now() - hoverStartTime3;
      writeLine(`    ⏱️  Длительность: ${hoverDuration3}ms`);
      writeLine();
      interactionMetrics.push({ type: 'hover-diagonal2-vertical', duration: hoverDuration3 });

      // Measure FPS
      let perfMetrics = await getPerformanceMetrics(page);
      if (perfMetrics.fps > 0) fpsMetrics.push(perfMetrics.fps);

      writeLine('✅ Тест завершен (3 цифры + 3 серии ховеров)');
      writeLine();

      // Get final metrics
      const finalMetrics = await getPerformanceMetrics(page);

      // Calculate statistics
      const allHoverMetrics = interactionMetrics;
      const totalDuration = allHoverMetrics.reduce((sum, m) => sum + m.duration, 0);
      const avgDuration = totalDuration / allHoverMetrics.length;

      const fpsStats = fpsMetrics.length > 0
        ? calculateStats(fpsMetrics.map(fps => ({ fps })))
        : { avg: 0, min: 0, max: 0 };

      const configResult = {
        config: {
          name: config.name,
          percent: config.percent,
          displayNone: config.displayNone
        },
        hovers: {
          avg: avgDuration,
          totalDuration: totalDuration,
          count: allHoverMetrics.length,
          details: allHoverMetrics
        },
        fps: {
          avg: fpsStats.avg,
          min: fpsStats.min,
          max: fpsStats.max,
          history: fpsMetrics
        },
        memory: finalMetrics.memory ? {
          used: finalMetrics.memory.usedJSHeapSize,
          total: finalMetrics.memory.totalJSHeapSize,
          limit: finalMetrics.memory.jsHeapSizeLimit
        } : null
      };

      configResults.push(configResult);

      // Print config summary
      writeLine('📊 РЕЗУЛЬТАТЫ ДЛЯ КОНФИГУРАЦИИ:');
      writeLine('─'.repeat(80));
      writeLine(`  Ховеры (среднее):    ${avgDuration.toFixed(2)}ms`);
      writeLine(`  Средний FPS:         ${fpsStats.avg.toFixed(2)}`);
      if (configResult.memory) {
        const usedMB = Math.round(configResult.memory.used / 1024 / 1024);
        writeLine(`  Память:              ${usedMB}MB`);
      }
      writeLine();

      // Wait before next config (so you can see the result)
      if (filterConfigs.indexOf(config) < filterConfigs.length - 1) {
        writeLine('⏳ Waiting 3 seconds before next configuration...');
        writeLine();
        await page.waitForTimeout(3000);
      }
    }

  // Calculate test totals
  const testEndTime = Date.now();
  const totalTestTime = testEndTime - testStartTime;

  const results = {
    config: {
      url,
      comment,
      cpuThrottling,
      browserType
    },
    totalTime: {
      ms: totalTestTime,
      seconds: (totalTestTime / 1000).toFixed(2)
    },
    configurations: configResults
  };

  // Print comparison table
  writeLine();
  writeLine('═'.repeat(80));
  writeLine('                    СРАВНЕНИЕ КОНФИГУРАЦИЙ ФИЛЬТРА');
  writeLine('═'.repeat(80));
  writeLine();
  writeLine('Config          | Hovers (avg) | FPS (avg) | Memory (MB)');
  writeLine('─'.repeat(80));

  configResults.forEach(result => {
    const memoryMB = result.memory
      ? Math.round(result.memory.used / 1024 / 1024).toString().padEnd(11)
      : 'N/A'.padEnd(11);

    writeLine(
      `${result.config.name.padEnd(15)} | ` +
      `${result.hovers.avg.toFixed(2).padStart(12)}ms | ` +
      `${result.fps.avg.toFixed(2).padStart(9)} | ` +
      `${memoryMB}`
    );
  });

  writeLine();
  writeLine('═'.repeat(80));
  writeLine();

  // Find performance threshold
  const baseline = configResults.find(r => r.config.percent === 100);
  if (baseline) {
    writeLine('🎯 АНАЛИЗ ПОРОГА ПРОИЗВОДИТЕЛЬНОСТИ:');
    writeLine('─'.repeat(80));

    configResults.forEach(result => {
      if (result.config.percent < 100) {
        const hoverDiff = ((result.hovers.avg - baseline.hovers.avg) / baseline.hovers.avg * 100);
        const fpsDiff = ((result.fps.avg - baseline.fps.avg) / baseline.fps.avg * 100);

        const hoverSymbol = hoverDiff < 0 ? '✅' : hoverDiff > 10 ? '🚨' : '⚠️';
        const fpsSymbol = fpsDiff > 0 ? '✅' : fpsDiff < -10 ? '🚨' : '⚠️';

        writeLine();
        writeLine(`${result.config.name}:`);
        writeLine(`  ${hoverSymbol} Ховеры: ${hoverDiff > 0 ? '+' : ''}${hoverDiff.toFixed(1)}% от baseline`);
        writeLine(`  ${fpsSymbol} FPS:    ${fpsDiff > 0 ? '+' : ''}${fpsDiff.toFixed(1)}% от baseline`);
      }
    });
    writeLine();
  }

  // Save results and analysis
  saveResults('filter-area-performance', results, comment);

  const analysis = analyzeResults(results);
  saveAnalysis('filter-area-performance', analysis);

  // Append to log
  const summary = configResults.map(r =>
    `[${r.config.name}] Hovers: ${r.hovers.avg.toFixed(2)}ms | FPS: ${r.fps.avg.toFixed(2)}`
  ).join('\n');

  appendToLog('filter-area-performance', `
Конфигураций: ${configResults.length}
${summary}
Комментарий: ${comment || 'N/A'}
  `.trim());

  return results;

  } finally {
    await page.close();
    await browser.close();
  }
}
