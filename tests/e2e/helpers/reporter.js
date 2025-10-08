import fs from 'fs';
import path from 'path';

const writeLine = (text = '') => process.stdout.write(`${text}\n`);

/**
 * Save test results to JSON file
 */
export function saveResults(testName, results, comment = '') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${testName}-${timestamp}.json`;
  const filepath = path.join(process.cwd(), 'tests/e2e/results', filename);

  const data = {
    testName,
    timestamp: new Date().toISOString(),
    comment,
    results
  };

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

  writeLine();
  writeLine(`💾 Results saved to: ${filepath}`);
  return filepath;
}

/**
 * Append to results log
 */
export function appendToLog(testName, summary) {
  const logPath = path.join(process.cwd(), 'tests/e2e/results', 'test-log.txt');

  const timestamp = new Date().toISOString();
  const logEntry = `
${'='.repeat(80)}
[${timestamp}] ${testName}
${'-'.repeat(80)}
${summary}
${'='.repeat(80)}

`;

  fs.appendFileSync(logPath, logEntry);
}

/**
 * Print summary to console
 */
export function printSummary(results) {
  writeLine();
  writeLine('📊 СТАТИСТИКА:');
  writeLine('─'.repeat(50));

  if (results.resize) {
    writeLine(`Среднее время ресайза: ${results.resize.avgDuration}ms`);
  }

  if (results.fps) {
    writeLine(`Средний FPS: ${results.fps.avg}`);
    writeLine(`Min/Max FPS: ${results.fps.min}/${results.fps.max}`);
  }

  if (results.memory) {
    writeLine(`Память: ${results.memory.used}MB / ${results.memory.total}MB`);
  }

  writeLine('─'.repeat(50));
}
