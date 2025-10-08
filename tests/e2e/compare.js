#!/usr/bin/env node

/**
 * Compare last two test results
 * Usage: node tests/e2e/compare.js [--format=json]
 */

import { findLastResults, compareResults, printComparison } from './helpers/comparator.js';

const args = process.argv.slice(2);
const format = args.find(arg => arg.startsWith('--format='))?.replace('--format=', '') || 'console';

async function run() {
  const results = findLastResults('resize-performance', 2);

  if (results.length < 2) {
    process.stderr.write('❌ Недостаточно результатов для сравнения.\n');
    process.stdout.write('   Запусти хотя бы 2 теста: npm run test:perf\n');
    process.exit(1);
  }

  const [resultB, resultA] = results; // newest first
  const comparison = compareResults(resultA, resultB);

  if (format === 'json') {
    process.stdout.write(`${JSON.stringify(comparison, null, 2)}\n`);
  } else {
    printComparison(comparison);
  }

  // Exit code based on verdict
  if (comparison.verdict.status === 'regression') {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch(err => {
  process.stderr.write(`❌ Comparison failed: ${err instanceof Error ? err.stack || err.message : String(err)}\n`);
  process.exit(1);
});
