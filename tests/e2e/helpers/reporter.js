import fs from 'fs';
import path from 'path';

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

  console.log(`\n💾 Results saved to: ${filepath}`);
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
  console.log('\n📊 СТАТИСТИКА:');
  console.log('─'.repeat(50));

  if (results.resize) {
    console.log(`Среднее время ресайза: ${results.resize.avgDuration}ms`);
  }

  if (results.fps) {
    console.log(`Средний FPS: ${results.fps.avg}`);
    console.log(`Min/Max FPS: ${results.fps.min}/${results.fps.max}`);
  }

  if (results.memory) {
    console.log(`Память: ${results.memory.used}MB / ${results.memory.total}MB`);
  }

  console.log('─'.repeat(50));
}
