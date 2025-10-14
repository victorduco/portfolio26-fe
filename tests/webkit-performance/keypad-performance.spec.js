import { test, expect } from "@playwright/test";
import { setupPerformanceTracking } from "./utils/performance-tracker.js";
import { analyzeMetrics } from "./utils/metrics-analyzer.js";
import {
  setupDetailedProfiling,
  analyzeDetailedMetrics,
} from "./utils/detailed-profiler.js";
import {
  setupConsoleProfiling,
  analyzeConsoleProfiling,
  generateConsoleProfilingReport,
} from "./utils/console-profiler.js";
import { exec } from "child_process";

const BASE_URL =
  (process.env.PLAYWRIGHT_BASE_URL &&
    process.env.PLAYWRIGHT_BASE_URL.replace(/\/$/, "")) ||
  "http://localhost:5175";

const LONG_TASK_THRESHOLD_MS = Number(
  process.env.PLAYWRIGHT_LONG_TASK_THRESHOLD_MS || 120
);
const FRAME_GAP_THRESHOLD_MS = Number(
  process.env.PLAYWRIGHT_FRAME_GAP_THRESHOLD_MS || 50
);
const DIGIT_SEQUENCES = [
  [5, 4, 5],
  [6, 5, 4],
  [5, 4, 6],
  [4, 6, 5],
  [5, 6, 4],
];
const CHECK_CODE_ROUTE = "**/api/check-code";

function generateRunInfo(metrics, analysis, detailedAnalysis) {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });

  const lines = [`## Run - ${date} ${time}`, ""];

  lines.push("### Configuration");
  lines.push("- **Browser:** WebKit (Safari)");
  lines.push("- **Viewport:** 1920x980");
  lines.push("- **Window Position:** 0,25");
  lines.push("- **SlowMo:** 70ms");
  lines.push("- **Sequences:** 5 cycles of 3 digits + Clear");
  lines.push("- **Mouse:** Chaotic zigzag pattern");
  lines.push("- **Focus:** Center buttons 5,4,6 (no corners/zero)");
  lines.push("");

  lines.push("### Results");
  lines.push(`- **Frame drops:** ${analysis.frameDrops.droppedFrames}`);
  lines.push(`- **Frame gaps ≥50ms:** ${analysis.frameDrops.overThreshold}`);
  lines.push(
    `- **Total stall:** ${analysis.frameDrops.totalStall.toFixed(1)}ms`
  );
  lines.push(
    `- **Worst gap:** ${analysis.frameDrops.worst?.gap.toFixed(
      1
    )}ms @ ${analysis.frameDrops.worst?.timestamp.toFixed(0)}ms`
  );
  lines.push(`- **FCP:** ${analysis.paint.firstContentfulPaint?.toFixed(0)}ms`);
  lines.push(
    `- **CLS:** ${analysis.layoutShifts.cumulativeLayoutShift.toFixed(3)}`
  );
  lines.push("");

  if (analysis.criticalIssues.length > 0) {
    lines.push("### Critical Issues");
    analysis.criticalIssues.forEach((issue) => {
      lines.push(`- ⚠️ ${issue}`);
    });
    lines.push("");
  }

  if (detailedAnalysis.bottlenecks.length > 0) {
    lines.push("### Bottlenecks");
    detailedAnalysis.bottlenecks.slice(0, 5).forEach((b, i) => {
      lines.push(`${i + 1}. **[${b.severity.toUpperCase()}]** ${b.type}`);
      if (b.avgGap) lines.push(`   - Avg gap: ${b.avgGap}ms`);
      if (b.count) lines.push(`   - Count: ${b.count}`);
    });
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  return lines.join("\n");
}

test.describe("WebKit Keypad Performance Analysis", () => {
  test("analyzes performance during unlock flow", async ({
    page,
  }, testInfo) => {
    await setupPerformanceTracking(page);
    await setupDetailedProfiling(page);
    const consoleProfiling = await setupConsoleProfiling(page);

    // Activate browser window on macOS
    exec(
      'osascript -e \'tell application "System Events" to set frontmost of first process whose name contains "Playwright" to true\''
    );
    await page.waitForTimeout(500);

    const fulfillCheckCode = async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ok: true }),
      });
    };

    await page.route(CHECK_CODE_ROUTE, fulfillCheckCode);

    try {
      await test.step("load page and wait for keypad", async () => {
        console.log(
          `\n📋 DIGIT_SEQUENCES: ${JSON.stringify(DIGIT_SEQUENCES)}\n`
        );

        await page.goto(`${BASE_URL}/gate?next=/`, {
          waitUntil: "domcontentloaded",
        });
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(350);

        const keypadButtons = page.locator(".keypad-button-hover-wrapper");
        await expect(keypadButtons).toHaveCount(10, { timeout: 15_000 });

        await page.evaluate(() =>
          window.__perfMetrics?.markInteraction?.("page-ready")
        );

        await page.evaluate(() =>
          window.__detailedMetrics?.takeMemorySnapshot?.("page-ready")
        );
      });

      await test.step("enter keypad sequences with clear", async () => {
        const keypadButtons = page.locator(".keypad-button-hover-wrapper");
        const clearButton = page.locator(".keypad-clear-button");

        // Start from center of viewport
        const viewportCenter = await page.evaluate(() => ({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }));

        let lastX = viewportCenter.x;
        let lastY = viewportCenter.y;

        await page.mouse.move(lastX, lastY);

        for (let cycle = 0; cycle < DIGIT_SEQUENCES.length; cycle++) {
          const digits = DIGIT_SEQUENCES[cycle];

          console.log(`\n🔵 Starting cycle ${cycle + 1}: ${digits.join(", ")}`);

          await page.evaluate(
            ({ cycleNum }) =>
              window.__perfMetrics?.markInteraction?.(
                `cycle-${cycleNum}-start`
              ),
            { cycleNum: cycle + 1 }
          );

          for (const digit of digits) {
            const index = digit === 0 ? 9 : digit - 1;

            console.log(`  → Hovering button ${digit} (index ${index})`);

            const box = await keypadButtons.nth(index).boundingBox();
            if (!box) continue;

            const targetX = box.x + box.width / 2;
            const targetY = box.y + box.height / 2;

            // Smooth mouse movement
            await page.evaluate(
              ({ value }) =>
                window.__perfMetrics?.markInteraction?.(
                  `before-hover-${value}`
                ),
              { value: digit }
            );

            const steps = 25;
            for (let step = 0; step <= steps; step++) {
              const progress = step / steps;
              // Хаотичное движение с зигзагами
              const zigzagX = Math.sin(step * 1.5) * 40;
              const zigzagY = Math.cos(step * 1.2) * 15;
              const randomJitterX = (Math.random() - 0.5) * 50;
              const randomJitterY = (Math.random() - 0.5) * 20;
              const x =
                lastX + (targetX - lastX) * progress + zigzagX + randomJitterX;
              const y =
                lastY + (targetY - lastY) * progress + zigzagY + randomJitterY;
              await page.mouse.move(x, y);
              await page.waitForTimeout(1);
            }

            lastX = targetX;
            lastY = targetY;

            await page.waitForTimeout(100);

            // Click with profiling
            await page.evaluate(
              ({ value }) => {
                window.__perfMetrics?.markInteraction?.(
                  `before-click-${value}`
                );
                window.__profile?.start(`button-${value}-click`);
              },
              { value: digit }
            );

            await page.mouse.click(targetX, targetY);

            // Wait for visual feedback
            await page.waitForTimeout(50);

            await page.evaluate(
              ({ value }) => {
                window.__profile?.end(`button-${value}-click`);
                window.__profile?.mark(`button-${value}-rendered`);
                window.__perfMetrics?.markInteraction?.(`after-click-${value}`);
                window.__detailedMetrics?.takeMemorySnapshot?.(
                  `after-click-${value}`
                );
              },
              { value: digit }
            );

            await page.waitForTimeout(70);
          }

          // Click Clear button
          await page.evaluate(
            ({ cycleNum }) => {
              window.__perfMetrics?.markInteraction?.(
                `cycle-${cycleNum}-before-clear`
              );
              window.__profile?.start(`clear-cycle-${cycleNum}`);
            },
            { cycleNum: cycle + 1 }
          );

          const clearBox = await clearButton.boundingBox();
          if (clearBox) {
            const clearX = clearBox.x + clearBox.width / 2;
            const clearY = clearBox.y + clearBox.height / 2;

            const steps = 20;
            for (let step = 0; step <= steps; step++) {
              const progress = step / steps;
              const zigzagX = Math.sin(step * 1.8) * 35;
              const zigzagY = Math.cos(step * 1.5) * 12;
              const randomJitterX = (Math.random() - 0.5) * 40;
              const randomJitterY = (Math.random() - 0.5) * 15;
              const x =
                lastX + (clearX - lastX) * progress + zigzagX + randomJitterX;
              const y =
                lastY + (clearY - lastY) * progress + zigzagY + randomJitterY;
              await page.mouse.move(x, y);
              await page.waitForTimeout(1);
            }

            await page.mouse.click(clearX, clearY);
            lastX = clearX;
            lastY = clearY;
          }

          await page.waitForTimeout(50);

          await page.evaluate(
            ({ cycleNum }) => {
              window.__profile?.end(`clear-cycle-${cycleNum}`);
              window.__profile?.mark(`cycle-${cycleNum}-cleared`);
              window.__perfMetrics?.markInteraction?.(
                `cycle-${cycleNum}-after-clear`
              );
            },
            { cycleNum: cycle + 1 }
          );

          await page.waitForTimeout(170);
        }
      });

      await page.evaluate(() =>
        window.__perfMetrics?.markInteraction?.("test-completed")
      );

      await page.evaluate(() =>
        window.__detailedMetrics?.takeMemorySnapshot?.("test-end")
      );
      await page.waitForTimeout(350);

      const metrics = await page.evaluate(() => {
        const snapshot = window.__perfMetrics || {};
        return {
          longTasks: Array.isArray(snapshot.longTasks)
            ? snapshot.longTasks
            : [],
          eventTimings: Array.isArray(snapshot.eventTimings)
            ? snapshot.eventTimings
            : [],
          rafGaps: Array.isArray(snapshot.rafGaps) ? snapshot.rafGaps : [],
          logs: Array.isArray(snapshot.logs) ? snapshot.logs : [],
          paintTimings: Array.isArray(snapshot.paintTimings)
            ? snapshot.paintTimings
            : [],
          layoutShifts: Array.isArray(snapshot.layoutShifts)
            ? snapshot.layoutShifts
            : [],
        };
      });

      const detailedMetrics = await page.evaluate(() => {
        const detailed = window.__detailedMetrics || {};
        return {
          renderOperations: detailed.renderOperations || [],
          domMutations: detailed.domMutations || [],
          memorySnapshots: detailed.memorySnapshots || [],
          networkActivity: detailed.networkActivity || [],
        };
      });

      const profileData = await page.evaluate(() => {
        const profile = window.__profileData || {};
        return {
          timings: profile.timings || {},
          marks: profile.marks || {},
          measures: profile.measures || [],
          operations: profile.operations || [],
        };
      });

      const analysis = analyzeMetrics(
        metrics,
        LONG_TASK_THRESHOLD_MS,
        FRAME_GAP_THRESHOLD_MS
      );

      const detailedAnalysis = analyzeDetailedMetrics(metrics, detailedMetrics);

      const consoleMessages = consoleProfiling.getConsoleMessages();
      const consoleAnalysis = analyzeConsoleProfiling(
        profileData,
        consoleMessages
      );
      const consoleReport = generateConsoleProfilingReport(consoleAnalysis);

      console.log("\n" + analysis.summaryText);
      console.log("\n" + detailedAnalysis.detailedReport);
      console.log("\n" + consoleReport);

      await testInfo.attach("performance-summary.md", {
        body: analysis.summaryText,
        contentType: "text/markdown",
      });

      await testInfo.attach("performance-metrics.json", {
        body: JSON.stringify(metrics, null, 2),
        contentType: "application/json",
      });

      await testInfo.attach("performance-analysis.json", {
        body: JSON.stringify(analysis, null, 2),
        contentType: "application/json",
      });

      await testInfo.attach("detailed-profiling.md", {
        body: detailedAnalysis.detailedReport,
        contentType: "text/markdown",
      });

      await testInfo.attach("detailed-metrics.json", {
        body: JSON.stringify(detailedMetrics, null, 2),
        contentType: "application/json",
      });

      await testInfo.attach("recommendations.json", {
        body: JSON.stringify(detailedAnalysis.recommendations, null, 2),
        contentType: "application/json",
      });

      await testInfo.attach("console-profiling.md", {
        body: consoleReport,
        contentType: "text/markdown",
      });

      await testInfo.attach("console-profile-data.json", {
        body: JSON.stringify({ profileData, consoleAnalysis }, null, 2),
        contentType: "application/json",
      });

      // Save run info to runs.md
      const runInfo = generateRunInfo(metrics, analysis, detailedAnalysis);
      await testInfo.attach("run-info.md", {
        body: runInfo,
        contentType: "text/markdown",
      });

      if (analysis.criticalIssues.length > 0) {
        console.warn(
          `\n⚠️  Critical performance issues detected:\n${analysis.criticalIssues.join(
            "\n"
          )}`
        );
      }
    } finally {
      try {
        await page.unroute(CHECK_CODE_ROUTE, fulfillCheckCode);
      } catch (e) {
        // Page might be closed
      }
    }
  });
});
