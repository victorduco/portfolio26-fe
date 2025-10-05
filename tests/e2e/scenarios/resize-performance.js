import { chromium } from '@playwright/test';
import { setupPerformanceTracking, getPerformanceMetrics, calculateStats } from '../helpers/performance.js';
import { smoothResize, randomViewportSize, performTrackedResize } from '../helpers/resize.js';
import { saveResults, appendToLog, printSummary } from '../helpers/reporter.js';
import { analyzeResults, printDetailedReport, saveAnalysis } from '../helpers/analyzer.js';

/**
 * Test resize performance with keypad input
 */
export async function testResizePerformance({
  url = 'http://localhost:5173',
  resizeCount = 20,
  resizeSteps = 5,
  headless = false,
  comment = '',
  cpuThrottling = 1 // 1 = no throttling, 4 = 4x slowdown, 6 = 6x slowdown
} = {}) {
  const testStartTime = Date.now();
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();

  try {
    // Enable CPU throttling if specified
    if (cpuThrottling > 1) {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottling });
      console.log(`⚙️  CPU throttling enabled: ${cpuThrottling}x slowdown\n`);
    }

    await page.goto(url);

    // Initial setup
    let currentWidth = 1280;
    let currentHeight = 800;
    await page.setViewportSize({ width: currentWidth, height: currentHeight });

    // Input keypad code
    console.log('⌨️  Вводим 1 5 на кейпаде...');
    await page.mouse.click(449, 74);  // 1
    await page.mouse.click(640, 264); // 5
    console.log('✅ Ввели: 1 5\n');

    // Setup performance tracking
    await setupPerformanceTracking(page);

    console.log(`🎬 Начинаем ${resizeCount} плавных ресайзов...\n`);

    const resizeMetrics = [];
    const fpsMetrics = [];

    // Perform resizes
    for (let i = 0; i < resizeCount; i++) {
      const { width: targetWidth, height: targetHeight } = randomViewportSize();

      const resizeResult = await performTrackedResize(
        page,
        currentWidth,
        currentHeight,
        targetWidth,
        targetHeight,
        resizeSteps
      );

      const perfMetrics = await getPerformanceMetrics(page);

      resizeMetrics.push({
        iteration: i + 1,
        ...resizeResult,
        fps: perfMetrics.fps
      });

      if (perfMetrics.fps > 0) {
        fpsMetrics.push(perfMetrics.fps);
      }

      console.log(
        `${i + 1}/${resizeCount}: ${currentWidth}x${currentHeight} → ${targetWidth}x${targetHeight} | ` +
        `${resizeResult.duration}ms | FPS: ${perfMetrics.fps || 'N/A'}`
      );

      currentWidth = targetWidth;
      currentHeight = targetHeight;
    }

    console.log(`\n✅ ${resizeCount} ресайзов выполнено\n`);

    // Get final metrics
    const finalMetrics = await getPerformanceMetrics(page);

    // Calculate statistics
    const testEndTime = Date.now();
    const totalTestTime = testEndTime - testStartTime;

    const resizeStats = calculateStats(resizeMetrics.map(m => ({ duration: m.duration })));
    const fpsStats = calculateStats(fpsMetrics.map(fps => ({ fps })));

    const results = {
      config: {
        url,
        resizeCount,
        resizeSteps,
        comment
      },
      totalTime: {
        ms: totalTestTime,
        seconds: (totalTestTime / 1000).toFixed(2)
      },
      resize: {
        avgDuration: resizeStats.avg,
        minDuration: resizeStats.min,
        maxDuration: resizeStats.max,
        details: resizeMetrics
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
    printDetailedReport(analysis, results);

    // Save results and analysis
    const filepath = saveResults('resize-performance', results, comment);
    saveAnalysis('resize-performance', analysis);

    // Append to log
    const summary = `
Ресайзов: ${resizeCount}
Среднее время: ${resizeStats.avg}ms
Средний FPS: ${fpsStats.avg}
Память: ${results.memory?.used || 0}MB
Комментарий: ${comment || 'N/A'}
    `.trim();

    appendToLog('resize-performance', summary);

    return results;

  } finally {
    await browser.close();
  }
}
