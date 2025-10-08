import fs from 'fs';
import path from 'path';

const writeLine = (text = '') => process.stdout.write(`${text}\n`);

/**
 * Analyze test results and generate detailed report
 */
export function analyzeResults(results) {
  const analysis = {
    summary: {},
    details: {},
    timeline: [],
    recommendations: []
  };

  // Resize metrics analysis
  if (results.resize) {
    const durations = results.resize.details?.map(d => d.duration) || [];

    analysis.summary.resize = {
      avg: results.resize.avgDuration,
      min: results.resize.minDuration || Math.min(...durations),
      max: results.resize.maxDuration || Math.max(...durations),
      median: calculateMedian(durations),
      std: calculateStdDev(durations),
      total: durations.reduce((a, b) => a + b, 0)
    };

    // Detect performance degradation
    if (results.resize.details) {
      const firstHalf = durations.slice(0, Math.floor(durations.length / 2));
      const secondHalf = durations.slice(Math.floor(durations.length / 2));
      const firstAvg = average(firstHalf);
      const secondAvg = average(secondHalf);

      analysis.details.degradation = {
        firstHalfAvg: firstAvg,
        secondHalfAvg: secondAvg,
        degradationPercent: ((secondAvg - firstAvg) / firstAvg * 100).toFixed(2),
        isDegrading: secondAvg > firstAvg * 1.2 // 20% slower
      };
    }
  }

  // FPS metrics analysis
  if (results.fps) {
    analysis.summary.fps = {
      avg: results.fps.avg,
      min: results.fps.min,
      max: results.fps.max,
      median: calculateMedian(results.fps.history || []),
      std: calculateStdDev(results.fps.history || [])
    };

    // FPS health check
    const avgFps = results.fps.avg;
    if (avgFps >= 60) {
      analysis.details.fpsHealth = 'Excellent (60+ FPS)';
    } else if (avgFps >= 30) {
      analysis.details.fpsHealth = 'Good (30-60 FPS)';
    } else if (avgFps >= 15) {
      analysis.details.fpsHealth = 'Poor (15-30 FPS)';
    } else {
      analysis.details.fpsHealth = 'Critical (<15 FPS)';
    }
  }

  // Memory metrics
  if (results.memory) {
    analysis.summary.memory = {
      used: results.memory.used,
      total: results.memory.total,
      usagePercent: ((results.memory.used / results.memory.total) * 100).toFixed(2),
      available: results.memory.total - results.memory.used
    };

    if (results.memory.used / results.memory.total > 0.9) {
      analysis.recommendations.push('⚠️  Высокое использование памяти (>90%)');
    }
  }

  // Build timeline
  if (results.resize?.details) {
    let currentTime = 0;
    analysis.timeline = results.resize.details.map((resize, i) => {
      const entry = {
        second: (currentTime / 1000).toFixed(2),
        iteration: resize.iteration,
        fps: resize.fps || 'N/A',
        duration: resize.duration,
        size: `${resize.to.width}x${resize.to.height}`
      };
      currentTime += resize.duration;
      return entry;
    });
  }

  // Performance recommendations
  if (analysis.summary.fps?.avg < 30) {
    analysis.recommendations.push('🐌 Средний FPS ниже 30 - оптимизируйте рендеринг');
  }

  if (analysis.details.degradation?.isDegrading) {
    analysis.recommendations.push('📉 Обнаружена деградация производительности - возможна утечка памяти или накопление событий');
  }

  if (analysis.summary.resize?.max > analysis.summary.resize?.avg * 3) {
    analysis.recommendations.push('⚡ Большой разброс времени ресайза - проверьте стабильность');
  }

  return analysis;
}

/**
 * Print detailed analysis report
 */
export function printDetailedReport(analysis, results = {}) {
  writeLine();
  writeLine('═'.repeat(80));
  writeLine('                        ДЕТАЛЬНЫЙ АНАЛИЗ ПРОИЗВОДИТЕЛЬНОСТИ');
  writeLine('═'.repeat(80));

  // Total test time
  if (results.totalTime) {
    writeLine();
    writeLine('⏱️  ОБЩЕЕ ВРЕМЯ:');
    writeLine('─'.repeat(80));
    writeLine(`  Время теста:       ${results.totalTime.seconds}s (${results.totalTime.ms}ms)`);
  }

  // Resize Summary
  if (analysis.summary.resize) {
    const r = analysis.summary.resize;
    writeLine();
    writeLine('📏 RESIZE МЕТРИКИ:');
    writeLine('─'.repeat(80));
    writeLine(`  Среднее время:     ${r.avg.toFixed(2)}ms`);
    writeLine(`  Медиана:           ${r.median.toFixed(2)}ms`);
    writeLine(`  Min/Max:           ${r.min}ms / ${r.max}ms`);
    writeLine(`  Стандартное откл:  ${r.std.toFixed(2)}ms`);
    writeLine(`  Общее время:       ${r.total}ms (${(r.total / 1000).toFixed(2)}s)`);
  }

  // Degradation analysis
  if (analysis.details.degradation) {
    const d = analysis.details.degradation;
    writeLine();
    writeLine('📊 АНАЛИЗ ДЕГРАДАЦИИ:');
    writeLine('─'.repeat(80));
    writeLine(`  Первая половина:   ${d.firstHalfAvg.toFixed(2)}ms`);
    writeLine(`  Вторая половина:   ${d.secondHalfAvg.toFixed(2)}ms`);
    writeLine(`  Изменение:         ${d.degradationPercent > 0 ? '+' : ''}${d.degradationPercent}%`);
    writeLine(`  Деградация:        ${d.isDegrading ? '⚠️  ДА' : '✅ НЕТ'}`);
  }

  // FPS Summary
  if (analysis.summary.fps) {
    const f = analysis.summary.fps;
    writeLine();
    writeLine('🎮 FPS МЕТРИКИ:');
    writeLine('─'.repeat(80));
    writeLine(`  Средний FPS:       ${f.avg.toFixed(2)}`);
    writeLine(`  Медиана FPS:       ${f.median.toFixed(2)}`);
    writeLine(`  Min/Max FPS:       ${f.min} / ${f.max}`);
    if (results.finalMetrics?.avgFrameTime) {
      writeLine(`  Среднее время кадра: ${results.finalMetrics.avgFrameTime}ms (цель: <16.67ms для 60fps)`);
    }
    writeLine(`  Стандартное откл:  ${f.std.toFixed(2)}`);
    writeLine(`  Состояние:         ${analysis.details.fpsHealth}`);
  }

  // Memory Summary
  if (analysis.summary.memory) {
    const m = analysis.summary.memory;
    writeLine();
    writeLine('💾 ПАМЯТЬ:');
    writeLine('─'.repeat(80));
    writeLine(`  Использовано:      ${m.used}MB / ${m.total}MB`);
    writeLine(`  Процент:           ${m.usagePercent}%`);
    writeLine(`  Доступно:          ${m.available}MB`);
  }

  // Long Tasks Summary
  if (results.finalMetrics?.longTasks) {
    const lt = results.finalMetrics.longTasks;
    writeLine();
    writeLine('⏳ ДОЛГИЕ ЗАДАЧИ (>50ms):');
    writeLine('─'.repeat(80));
    writeLine(`  Количество:        ${lt.count}`);
    writeLine(`  Общее время:       ${lt.totalDuration}ms`);
    if (lt.count > 0) {
      const avgDuration = (lt.totalDuration / lt.count).toFixed(2);
      writeLine(`  Среднее время:     ${avgDuration}ms`);
      writeLine(`  Состояние:         ${lt.count > 10 ? '⚠️  МНОГО' : lt.count > 5 ? '⚡ НОРМА' : '✅ ХОРОШО'}`);
    }
  }

  // Navigation Timing
  if (results.finalMetrics?.navigation) {
    const nav = results.finalMetrics.navigation;
    writeLine();
    writeLine('🚀 ВРЕМЯ ЗАГРУЗКИ:');
    writeLine('─'.repeat(80));
    if (nav.domContentLoaded) writeLine(`  DOM готов:         ${nav.domContentLoaded}ms`);
    if (nav.domInteractive) writeLine(`  DOM интерактивен:  ${nav.domInteractive}ms`);
    if (nav.loadComplete) writeLine(`  Полная загрузка:   ${nav.loadComplete}ms`);
  }

  // Timeline
  if (analysis.timeline && analysis.timeline.length > 0) {
    writeLine();
    writeLine('⏱️  ТАЙМЛАЙН:');
    writeLine('─'.repeat(80));
    writeLine('  Секунда  | Итерация | FPS  | Длительность | Размер');
    writeLine('  ' + '─'.repeat(76));

    // Show first 5, middle sample, and last 5
    const tl = analysis.timeline;
    const samples = [
      ...tl.slice(0, 5),
      ...(tl.length > 15 ? [{ second: '...', iteration: '...', fps: '...', duration: '...', size: '...' }] : []),
      ...tl.slice(-5)
    ];

    samples.forEach(entry => {
      const sec = String(entry.second).padEnd(8);
      const iter = String(entry.iteration).padEnd(8);
      const fps = String(entry.fps).padEnd(4);
      const dur = String(entry.duration + 'ms').padEnd(12);
      writeLine(`  ${sec} | ${iter} | ${fps} | ${dur} | ${entry.size}`);
    });
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    writeLine();
    writeLine('💡 РЕКОМЕНДАЦИИ:');
    writeLine('─'.repeat(80));
    analysis.recommendations.forEach(rec => {
      writeLine(`  ${rec}`);
    });
  }

  writeLine();
  writeLine('═'.repeat(80));
  writeLine();
}

/**
 * Save detailed analysis to file
 */
export function saveAnalysis(testName, analysis) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${testName}-analysis-${timestamp}.json`;
  const filepath = path.join(process.cwd(), 'tests/e2e/results', filename);

  const data = {
    testName,
    timestamp: new Date().toISOString(),
    analysis
  };

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  writeLine(`📊 Анализ сохранен: ${filepath}`);

  return filepath;
}

// Helper functions
function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calculateMedian(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateStdDev(arr) {
  if (arr.length === 0) return 0;
  const avg = average(arr);
  const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}
