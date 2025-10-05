#!/usr/bin/env node

/**
 * Main test runner
 * Usage: node tests/e2e/run.js [scenario] [options]
 */

import { testResizePerformance } from './scenarios/resize-performance.js';

const args = process.argv.slice(2);
const scenario = args[0] || 'resize-performance';
const comment = args.find(arg => arg.startsWith('--comment='))?.replace('--comment=', '') || '';
const headless = args.includes('--headless');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║              Performance Testing Suite                        ║
╚════════════════════════════════════════════════════════════════╝
`);

async function run() {
  switch (scenario) {
    case 'resize-performance':
      await testResizePerformance({
        url: 'http://localhost:5173',
        resizeCount: 20,
        resizeSteps: 5,
        headless,
        comment
      });
      break;

    default:
      console.error(`❌ Unknown scenario: ${scenario}`);
      console.log('\nAvailable scenarios:');
      console.log('  - resize-performance');
      process.exit(1);
  }
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
