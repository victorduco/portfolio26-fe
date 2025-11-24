// LayoutBatcher - batched read/write to prevent layout thrashing
class LayoutBatcher {
  constructor() {
    this.tasks = [];
    this.rafId = null;
  }

  scheduleTask(readFn, writeFn) {
    this.tasks.push({ readFn, writeFn });
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => this.executeBatch());
  }

  executeBatch() {
    if (!this.tasks.length) {
      this.rafId = null;
      return;
    }
    const readResults = this.tasks.map((t) => t.readFn?.() ?? null);
    this.tasks.forEach((t, i) => t.writeFn?.(readResults[i]));
    this.tasks = [];
    this.rafId = null;
  }

  cancel() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.tasks = [];
  }
}

export const layoutBatcher = new LayoutBatcher();
