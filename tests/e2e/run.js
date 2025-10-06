#!/usr/bin/env node

/**
 * Main test runner
 * Usage: node tests/e2e/run.js [scenario] [options]
 */

import { testResizePerformance } from './scenarios/resize-performance.js';
import { testInteractionPerformance } from './scenarios/interaction-performance.js';
import { testFilterAreaPerformance } from './scenarios/filter-area-performance.js';

const args = process.argv.slice(2);
const scenario = args[0] || 'resize-performance';
const comment = args.find(arg => arg.startsWith('--comment='))?.replace('--comment=', '') || '';
const headless = args.includes('--headless');
const cpuThrottling = parseInt(args.find(arg => arg.startsWith('--cpu='))?.replace('--cpu=', '') || '1');
const browserType = args.find(arg => arg.startsWith('--browser='))?.replace('--browser=', '') || 'chromium';

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
        comment,
        cpuThrottling
      });
      break;

    case 'interaction-performance':
      await testInteractionPerformance({
        url: 'http://localhost:5173',
        interactionRounds: 1,
        headless,
        comment,
        cpuThrottling,
        browserType
      });
      break;

    case 'filter-area-performance':
      await testFilterAreaPerformance({
        url: 'http://localhost:5173',
        headless,
        comment,
        cpuThrottling,
        browserType
      });
      break;

    default:
      console.error(`❌ Unknown scenario: ${scenario}`);
      console.log('\nAvailable scenarios:');
      console.log('  - resize-performance');
      console.log('  - interaction-performance');
      console.log('  - filter-area-performance');
      process.exit(1);
  }
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
