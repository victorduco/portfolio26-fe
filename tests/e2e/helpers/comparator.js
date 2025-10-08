import fs from 'fs';
import path from 'path';

const writeLine = (text = '') => process.stdout.write(`${text}\n`);

/**
 * Compare two test results
 */
export function compareResults(resultA, resultB) {
  const comparison = {
    testA: {
      name: resultA.testName,
      timestamp: resultA.timestamp,
      comment: resultA.comment
    },
    testB: {
      name: resultB.testName,
      timestamp: resultB.timestamp,
      comment: resultB.comment
    },
    diff: {}
  };

  // Compare total time
  if (resultA.results.totalTime && resultB.results.totalTime) {
    const diff = resultB.results.totalTime.ms - resultA.results.totalTime.ms;
    const percent = ((diff / resultA.results.totalTime.ms) * 100);

    comparison.diff.totalTime = {
      before: resultA.results.totalTime.ms,
      after: resultB.results.totalTime.ms,
      diff,
      percent: percent.toFixed(2),
      improved: diff < 0
    };
  }

  // Compare resize metrics
  if (resultA.results.resize && resultB.results.resize) {
    const diffAvg = resultB.results.resize.avgDuration - resultA.results.resize.avgDuration;
    const percentAvg = ((diffAvg / resultA.results.resize.avgDuration) * 100);

    comparison.diff.resize = {
      avgDuration: {
        before: resultA.results.resize.avgDuration,
        after: resultB.results.resize.avgDuration,
        diff: diffAvg,
        percent: percentAvg.toFixed(2),
        improved: diffAvg < 0
      },
      minDuration: {
        before: resultA.results.resize.minDuration,
        after: resultB.results.resize.minDuration,
        diff: resultB.results.resize.minDuration - resultA.results.resize.minDuration
      },
      maxDuration: {
        before: resultA.results.resize.maxDuration,
        after: resultB.results.resize.maxDuration,
        diff: resultB.results.resize.maxDuration - resultA.results.resize.maxDuration
      }
    };
  }

  // Compare FPS (только если значения значимые)
  if (resultA.results.fps && resultB.results.fps) {
    const fpsA = resultA.results.fps.avg;
    const fpsB = resultB.results.fps.avg;

    // Только если хотя бы одно значение > 5 (иначе тест был слишком быстрым)
    if (fpsA > 5 || fpsB > 5) {
      const diffFPS = fpsB - fpsA;
      const percentFPS = fpsA !== 0 ? ((diffFPS / fpsA) * 100) : 0;

      comparison.diff.fps = {
        avg: {
          before: fpsA,
          after: fpsB,
          diff: diffFPS,
          percent: percentFPS.toFixed(2),
          improved: diffFPS > 0
        },
        min: {
          before: resultA.results.fps.min,
          after: resultB.results.fps.min,
          diff: resultB.results.fps.min - resultA.results.fps.min
        },
        max: {
          before: resultA.results.fps.max,
          after: resultB.results.fps.max,
          diff: resultB.results.fps.max - resultA.results.fps.max
        }
      };
    }
  }

  // Compare memory
  if (resultA.results.memory && resultB.results.memory) {
    const diffMem = resultB.results.memory.used - resultA.results.memory.used;
    const percentMem = ((diffMem / resultA.results.memory.used) * 100);

    comparison.diff.memory = {
      used: {
        before: resultA.results.memory.used,
        after: resultB.results.memory.used,
        diff: diffMem,
        percent: percentMem.toFixed(2),
        improved: diffMem < 0
      }
    };
  }

  // Overall verdict
  comparison.verdict = determineVerdict(comparison.diff);

  return comparison;
}

/**
 * Determine overall verdict
 */
function determineVerdict(diff) {
  const improvements = [];
  const regressions = [];

  if (diff.totalTime) {
    if (diff.totalTime.improved) {
      improvements.push('Общее время');
    } else if (Math.abs(diff.totalTime.percent) > 20) {
      regressions.push('Общее время');
    }
  }

  if (diff.resize?.avgDuration) {
    if (diff.resize.avgDuration.improved) {
      improvements.push('Время ресайза');
    } else if (Math.abs(diff.resize.avgDuration.percent) > 20) {
      regressions.push('Время ресайза');
    }
  }

  if (diff.fps?.avg) {
    // Игнорируем FPS если одно из значений близко к 0 (тест был слишком быстрым)
    if (diff.fps.avg.before > 5 && diff.fps.avg.after > 5) {
      if (diff.fps.avg.improved) {
        improvements.push('FPS');
      } else if (Math.abs(diff.fps.avg.percent) > 20) {
        regressions.push('FPS');
      }
    }
  }

  if (diff.memory?.used) {
    if (diff.memory.used.improved) {
      improvements.push('Память');
    } else if (Math.abs(diff.memory.used.percent) > 20) {
      regressions.push('Память');
    }
  }

  if (regressions.length > 0) {
    return {
      status: 'regression',
      message: `⚠️  Регрессия: ${regressions.join(', ')}`,
      improvements,
      regressions
    };
  } else if (improvements.length > 0) {
    return {
      status: 'improvement',
      message: `✅ Улучшение: ${improvements.join(', ')}`,
      improvements,
      regressions
    };
  } else {
    return {
      status: 'neutral',
      message: '➡️  Без значительных изменений',
      improvements,
      regressions
    };
  }
}

/**
 * Find last N test results
 */
export function findLastResults(testName, count = 2) {
  const resultsDir = path.join(process.cwd(), 'tests/e2e/results');

  if (!fs.existsSync(resultsDir)) {
    return [];
  }

  const files = fs.readdirSync(resultsDir)
    .filter(f => f.startsWith(testName) && f.endsWith('.json') && !f.includes('analysis'))
    .sort()
    .reverse()
    .slice(0, count);

  return files.map(file => {
    const filePath = path.join(resultsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  });
}

/**
 * Print comparison to console
 */
export function printComparison(comparison) {
  writeLine();
  writeLine('═'.repeat(80));
  writeLine('                           СРАВНЕНИЕ РЕЗУЛЬТАТОВ');
  writeLine('═'.repeat(80));

  writeLine();
  writeLine('📋 ТЕСТЫ:');
  writeLine('─'.repeat(80));
  writeLine(`  A: ${comparison.testA.comment || 'Без комментария'}`);
  writeLine(`     ${new Date(comparison.testA.timestamp).toLocaleString()}`);
  writeLine(`  B: ${comparison.testB.comment || 'Без комментария'}`);
  writeLine(`     ${new Date(comparison.testB.timestamp).toLocaleString()}`);

  const { diff } = comparison;

  // Total time
  if (diff.totalTime) {
    writeLine();
    writeLine('⏱️  ОБЩЕЕ ВРЕМЯ:');
    writeLine('─'.repeat(80));
    writeLine(`  Было:    ${(diff.totalTime.before / 1000).toFixed(2)}s`);
    writeLine(`  Стало:   ${(diff.totalTime.after / 1000).toFixed(2)}s`);
    const icon = diff.totalTime.improved ? '✅' : '⚠️';
    const sign = diff.totalTime.diff > 0 ? '+' : '';
    writeLine(`  Разница: ${icon} ${sign}${(diff.totalTime.diff / 1000).toFixed(2)}s (${sign}${diff.totalTime.percent}%)`);
  }

  // Resize
  if (diff.resize) {
    writeLine();
    writeLine('📏 СРЕДНЕЕ ВРЕМЯ РЕСАЙЗА:');
    writeLine('─'.repeat(80));
    writeLine(`  Было:    ${diff.resize.avgDuration.before.toFixed(2)}ms`);
    writeLine(`  Стало:   ${diff.resize.avgDuration.after.toFixed(2)}ms`);
    const icon = diff.resize.avgDuration.improved ? '✅' : '⚠️';
    const sign = diff.resize.avgDuration.diff > 0 ? '+' : '';
    writeLine(`  Разница: ${icon} ${sign}${diff.resize.avgDuration.diff.toFixed(2)}ms (${sign}${diff.resize.avgDuration.percent}%)`);

    writeLine();
    writeLine(`  Min: ${diff.resize.minDuration.before}ms → ${diff.resize.minDuration.after}ms (${diff.resize.minDuration.diff > 0 ? '+' : ''}${diff.resize.minDuration.diff}ms)`);
    writeLine(`  Max: ${diff.resize.maxDuration.before}ms → ${diff.resize.maxDuration.after}ms (${diff.resize.maxDuration.diff > 0 ? '+' : ''}${diff.resize.maxDuration.diff}ms)`);
  }

  // FPS
  if (diff.fps && (diff.fps.avg.before > 0 || diff.fps.avg.after > 0)) {
    writeLine();
    writeLine('🎮 FPS:');
    writeLine('─'.repeat(80));
    writeLine(`  Было:    ${diff.fps.avg.before.toFixed(2)}`);
    writeLine(`  Стало:   ${diff.fps.avg.after.toFixed(2)}`);
    if (diff.fps.avg.before > 0) {
      const icon = diff.fps.avg.improved ? '✅' : '⚠️';
      const sign = diff.fps.avg.diff > 0 ? '+' : '';
      writeLine(`  Разница: ${icon} ${sign}${diff.fps.avg.diff.toFixed(2)} (${sign}${diff.fps.avg.percent}%)`);
    }
  }

  // Memory
  if (diff.memory) {
    writeLine();
    writeLine('💾 ПАМЯТЬ:');
    writeLine('─'.repeat(80));
    writeLine(`  Было:    ${diff.memory.used.before}MB`);
    writeLine(`  Стало:   ${diff.memory.used.after}MB`);
    const icon = diff.memory.used.improved ? '✅' : '⚠️';
    const sign = diff.memory.used.diff > 0 ? '+' : '';
    writeLine(`  Разница: ${icon} ${sign}${diff.memory.used.diff}MB (${sign}${diff.memory.used.percent}%)`);
  }

  // Verdict
  writeLine();
  writeLine('💡 ВЫВОД:');
  writeLine('─'.repeat(80));
  writeLine(`  ${comparison.verdict.message}`);

  if (comparison.verdict.improvements.length > 0) {
    writeLine(`  ✅ Улучшения: ${comparison.verdict.improvements.join(', ')}`);
  }
  if (comparison.verdict.regressions.length > 0) {
    writeLine(`  ⚠️  Регрессии: ${comparison.verdict.regressions.join(', ')}`);
  }

  writeLine();
  writeLine('═'.repeat(80));
  writeLine();
}
