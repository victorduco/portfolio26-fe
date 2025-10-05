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
    console.error('❌ Недостаточно результатов для сравнения.');
    console.log('   Запусти хотя бы 2 теста: npm run test:perf');
    process.exit(1);
  }

  const [resultB, resultA] = results; // newest first
  const comparison = compareResults(resultA, resultB);

  if (format === 'json') {
    console.log(JSON.stringify(comparison, null, 2));
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
  console.error('❌ Comparison failed:', err);
  process.exit(1);
});
