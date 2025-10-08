import { chromium, webkit, firefox } from '@playwright/test';
import { setupPerformanceTracking, getPerformanceMetrics, calculateStats } from '../helpers/performance.js';
import { saveResults, appendToLog } from '../helpers/reporter.js';
import { analyzeResults, saveAnalysis } from '../helpers/analyzer.js';

const writeLine = (text = '') => process.stdout.write(`${text}\n`);

/**
 * Test UI interaction performance (hardcore stress test)
 *
 * Flow:
 * 1. Input 5938 on keypad
 * 2. Wait for main page animation
 * 3. Intense interaction with rectangles:
 *    - Hover all rectangles multiple times
 *    - Click to activate/deactivate in patterns
 *    - Rapid hover movements between rectangles
 *    - All combinations of active states
 */
export async function testInteractionPerformance({
  url = 'http://localhost:5173',
  interactionRounds = 1,
  headless = false,
  comment = '',
  cpuThrottling = 1,
  browserType = 'chromium' // chromium, webkit, firefox
} = {}) {
  const testStartTime = Date.now();

  // Select browser
  const browsers = { chromium, webkit, firefox };
  const browserEngine = browsers[browserType] || chromium;

  writeLine(`🌐 Browser: ${browserType}`);
  writeLine();
  const browser = await browserEngine.launch({
    headless,
    // Force window to front on macOS
    ...(browserType === 'webkit' && !headless ? {
      args: ['--auto-open-devtools-for-tabs']
    } : {})
  });
  const page = await browser.newPage();

  // Bring window to front for WebKit
  if (browserType === 'webkit' && !headless) {
    await page.bringToFront();

    // Force activate window using AppleScript on macOS
    if (process.platform === 'darwin') {
      const { execSync } = await import('child_process');
      try {
        // Activate the frontmost Playwright/WebKit window
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
      writeLine(`⚙️  CPU throttling enabled: ${cpuThrottling}x slowdown`);
      writeLine();
    }

    // Initial viewport BEFORE goto - larger for WebKit, standard for others
    const viewportSize = browserType === 'webkit' && !headless
      ? { width: 1600, height: 900 }
      : { width: 1280, height: 800 };
    await page.setViewportSize(viewportSize);

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

    writeLine('⌨️  Вводим 4 цифры на кейпаде для разблокировки...');

    // Клики по кнопкам кейпада (нужно 4 клика для разблокировки)
    // Используем код: 1, 5, 1, 5
    // Кликаем по обертке кнопки, ищем по тексту внутри
    await page.locator('.keypad-button-hover-wrapper:has-text("1")').click();
    await page.locator('.keypad-button-hover-wrapper:has-text("5")').click();
    await page.locator('.keypad-button-hover-wrapper:has-text("1")').click();
    await page.locator('.keypad-button-hover-wrapper:has-text("5")').click();

    writeLine('✅ Код введен: 1 5 1 5 (разблокировано)');
    writeLine();

    // Ждем загрузки главной страницы и появления прямоугольников
    writeLine('⏳ Ожидание загрузки главной страницы...');
    await page.waitForTimeout(3000); // Ждем анимацию появления

    // Ждем пока прямоугольники появятся
    writeLine('⏳ Ожидание появления прямоугольников...');
    await page.waitForSelector('.intro-square', { timeout: 10000 });
    await page.waitForTimeout(1000); // Дополнительное время на анимацию

    // Setup performance tracking
    await setupPerformanceTracking(page);

    writeLine(`🎮 Начинаем ${interactionRounds} раундов интенсивного взаимодействия...`);
    writeLine();

    const interactionMetrics = [];
    const fpsMetrics = [];

    // Get rectangle positions
    const rectangles = await page.locator('.intro-square').all();
    const rectCount = rectangles.length;
    writeLine(`📦 Найдено прямоугольников: ${rectCount}`);
    writeLine();

    if (rectCount === 0) {
      throw new Error('No rectangles found! Check if main page loaded correctly.');
    }

    // Скроллим к первому прямоугольнику и блокируем дальнейший скролл
    writeLine('📍 Скроллим к прямоугольникам и блокируем скролл...');
    writeLine();
    await rectangles[0].scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Блокируем скролл страницы
    await page.evaluate(() => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    });

    let totalInteractions = 0;

    for (let round = 0; round < interactionRounds; round++) {
      writeLine();
      writeLine(`🔄 Раунд ${round + 1}/${interactionRounds}`);

      // Pattern 1: Hover каждый прямоугольник по порядку
      writeLine('  Pattern 1: Sequential hovers...');
      const hoverStartTime = Date.now();
      const hoverTimings = [];
      for (let i = 0; i < rectCount; i++) {
        const start = Date.now();
        await rectangles[i].hover();
        const elapsed = Date.now() - start;
        hoverTimings.push(elapsed);
        writeLine(`    Hover ${i+1}: ${elapsed}ms`);
        await page.waitForTimeout(25);
      }
      const hoverDuration = Date.now() - hoverStartTime;
      const avgHover = (hoverTimings.reduce((a,b) => a+b, 0) / hoverTimings.length).toFixed(2);
      writeLine(`    ⏱️  Среднее hover: ${avgHover}ms, Min: ${Math.min(...hoverTimings)}ms, Max: ${Math.max(...hoverTimings)}ms`);
      interactionMetrics.push({ type: 'hover-sequential', duration: hoverDuration, timings: hoverTimings });
      totalInteractions += rectCount;

      // Measure FPS after Pattern 1
      let perfMetrics = await getPerformanceMetrics(page);
      if (perfMetrics.fps > 0) fpsMetrics.push(perfMetrics.fps);

      // Pattern 2: Клик на каждый для активации
      writeLine('  Pattern 2: Activate all...');
      const activateStartTime = Date.now();
      for (let i = 0; i < rectCount; i++) {
        await rectangles[i].click({ force: true });
        await page.waitForTimeout(50);
      }
      const activateDuration = Date.now() - activateStartTime;
      interactionMetrics.push({ type: 'activate-all', duration: activateDuration });
      totalInteractions += rectCount;

      // Measure FPS after Pattern 2
      perfMetrics = await getPerformanceMetrics(page);
      if (perfMetrics.fps > 0) fpsMetrics.push(perfMetrics.fps);

      // Pattern 3: Быстрые зигзагообразные ховеры (стресс-тест)
      writeLine('  Pattern 3: Zigzag hovers (stress)...');
      const zigzagStartTime = Date.now();
      const zigzagPattern = [0, 3, 1, 2, 3, 0, 2, 1]; // Прыгаем между прямоугольниками
      for (const index of zigzagPattern) {
        if (index < rectCount) {
          await rectangles[index].hover();
          await page.waitForTimeout(15);
        }
      }
      const zigzagDuration = Date.now() - zigzagStartTime;
      interactionMetrics.push({ type: 'hover-zigzag', duration: zigzagDuration });
      totalInteractions += zigzagPattern.length;

      // Measure FPS after Pattern 3
      perfMetrics = await getPerformanceMetrics(page);
      if (perfMetrics.fps > 0) fpsMetrics.push(perfMetrics.fps);

      // Pattern 4: Деактивация в обратном порядке
      writeLine('  Pattern 4: Deactivate reverse...');
      const deactivateStartTime = Date.now();
      for (let i = rectCount - 1; i >= 0; i--) {
        await rectangles[i].click({ force: true });
        await page.waitForTimeout(50);
      }
      const deactivateDuration = Date.now() - deactivateStartTime;
      interactionMetrics.push({ type: 'deactivate-reverse', duration: deactivateDuration });
      totalInteractions += rectCount;

      // Measure FPS after Pattern 4
      perfMetrics = await getPerformanceMetrics(page);
      if (perfMetrics.fps > 0) fpsMetrics.push(perfMetrics.fps);

      // Pattern 5: Быстрая активация/деактивация одного и того же
      writeLine('  Pattern 5: Rapid toggle...');
      const toggleStartTime = Date.now();
      for (let i = 0; i < 3; i++) {
        await rectangles[0].click({ force: true });
        await page.waitForTimeout(25);
      }
      const toggleDuration = Date.now() - toggleStartTime;
      interactionMetrics.push({ type: 'rapid-toggle', duration: toggleDuration });
      totalInteractions += 3;

      // Measure FPS after Pattern 5
      perfMetrics = await getPerformanceMetrics(page);
      if (perfMetrics.fps > 0) fpsMetrics.push(perfMetrics.fps);

      // Pattern 6: Случайные ховеры (имитация реального пользователя)
      writeLine('  Pattern 6: Random hovers...');
      const randomStartTime = Date.now();
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * rectCount);
        await rectangles[randomIndex].hover();
        await page.waitForTimeout(Math.random() * 25 + 12);
      }
      const randomDuration = Date.now() - randomStartTime;
      interactionMetrics.push({ type: 'hover-random', duration: randomDuration });
      totalInteractions += 6;

      // Measure FPS after Pattern 6 (final for round)
      perfMetrics = await getPerformanceMetrics(page);
      if (perfMetrics.fps > 0) {
        fpsMetrics.push(perfMetrics.fps);
      }

      writeLine(`  ✅ Раунд завершен | FPS: ${perfMetrics.fps || 'N/A'}`);
    }

    writeLine();
    writeLine(`✅ ${interactionRounds} раундов завершено (${totalInteractions} взаимодействий)`);
    writeLine();

    // Get final metrics
    const finalMetrics = await getPerformanceMetrics(page);

    // Calculate statistics
    const testEndTime = Date.now();
    const totalTestTime = testEndTime - testStartTime;

    // Group metrics by type
    const metricsByType = {};
    interactionMetrics.forEach(m => {
      if (!metricsByType[m.type]) {
        metricsByType[m.type] = [];
      }
      metricsByType[m.type].push(m.duration);
    });

    const patternStats = {};
    Object.keys(metricsByType).forEach(type => {
      const durations = metricsByType[type];
      const stats = calculateStats(durations.map(d => ({ duration: d })));
      patternStats[type] = {
        avg: stats.avg,
        min: stats.min,
        max: stats.max,
        count: durations.length
      };
    });

    const allDurations = interactionMetrics.map(m => m.duration);
    const overallStats = calculateStats(allDurations.map(d => ({ duration: d })));
    const fpsStats = calculateStats(fpsMetrics.map(fps => ({ fps })));

    const results = {
      config: {
        url,
        interactionRounds,
        totalInteractions,
        comment,
        cpuThrottling
      },
      totalTime: {
        ms: totalTestTime,
        seconds: (totalTestTime / 1000).toFixed(2)
      },
      interactions: {
        total: totalInteractions,
        avgDuration: overallStats.avg,
        minDuration: overallStats.min,
        maxDuration: overallStats.max,
        patterns: patternStats,
        details: interactionMetrics
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

    // Analyze results
    const analysis = analyzeResults(results);

    // Print detailed report
    writeLine();
    writeLine('═'.repeat(80));
    writeLine('                    ДЕТАЛЬНЫЙ АНАЛИЗ ПРОИЗВОДИТЕЛЬНОСТИ ВЗАИМОДЕЙСТВИЙ');
    writeLine('═'.repeat(80));
    writeLine();
    writeLine('⏱️  ОБЩЕЕ ВРЕМЯ:');
    writeLine('─'.repeat(80));
    writeLine(`  Время теста:       ${results.totalTime.seconds}s (${results.totalTime.ms}ms)`);
    writeLine();
    writeLine('🎮 СТАТИСТИКА ВЗАИМОДЕЙСТВИЙ:');
    writeLine('─'.repeat(80));
    writeLine(`  Всего взаимодействий: ${totalInteractions}`);
    writeLine(`  Среднее время:        ${overallStats.avg.toFixed(2)}ms`);
    writeLine(`  Min/Max:              ${overallStats.min}ms / ${overallStats.max}ms`);
    writeLine();
    writeLine('📊 ПО ПАТТЕРНАМ:');
    writeLine('─'.repeat(80));
    Object.entries(patternStats).forEach(([type, stats]) => {
      const icon = type.includes('hover') ? '🖱️ ' : '👆';
      writeLine(`  ${icon} ${type.padEnd(25)} ${stats.avg.toFixed(2)}ms (${stats.count}x)`);
    });
    writeLine();
    writeLine('🎮 FPS МЕТРИКИ:');
    writeLine('─'.repeat(80));
    writeLine(`  Средний FPS:       ${fpsStats.avg.toFixed(2)}`);
    writeLine(`  Min/Max FPS:       ${fpsStats.min} / ${fpsStats.max}`);
    writeLine();
    if (results.memory) {
      const usedMB = Math.round(results.memory.used / 1024 / 1024);
      const totalMB = Math.round(results.memory.total / 1024 / 1024);
      writeLine('💾 ПАМЯТЬ:');
      writeLine('─'.repeat(80));
      writeLine(`  Использовано:      ${usedMB}MB / ${totalMB}MB`);
      writeLine(`  Процент:           ${((usedMB / totalMB) * 100).toFixed(2)}%`);
      writeLine();
    }
    writeLine('═'.repeat(80));
    writeLine();

    // Save results and analysis
    saveResults('interaction-performance', results, comment);
    saveAnalysis('interaction-performance', analysis);

    // Append to log
    const summary = `
Раунды: ${interactionRounds}
Всего взаимодействий: ${totalInteractions}
Среднее время: ${overallStats.avg.toFixed(2)}ms
Средний FPS: ${fpsStats.avg.toFixed(2)}
Память: ${results.memory ? Math.round(results.memory.used / 1024 / 1024) : 0}MB
Комментарий: ${comment || 'N/A'}
    `.trim();

    appendToLog('interaction-performance', summary);

    return results;

  } finally {
    await browser.close();
  }
}
