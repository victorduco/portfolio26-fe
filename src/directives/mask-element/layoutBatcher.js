/**
 * LayoutBatcher - централизованный менеджер для устранения layout thrashing
 *
 * Проблема: Множественные вызовы getBoundingClientRect() и setProperty()
 * создают layout thrashing (read → write → read → write)
 *
 * Решение: Batching - все reads в одной фазе, все writes в другой
 * READ фаза → WRITE фаза в одном requestAnimationFrame
 */

class LayoutBatcher {
  constructor() {
    this.tasks = [];
    this.rafId = null;
  }

  /**
   * Запланировать операцию read-write (синхронная регистрация обеих фаз)
   * @param {Function} readFn - функция для чтения layout
   * @param {Function} writeFn - функция для записи DOM (получает результат readFn)
   */
  scheduleTask(readFn, writeFn) {
    this.tasks.push({ readFn, writeFn });
    this.scheduleBatch();
  }

  /**
   * Запланировать пакетную обработку в RAF
   */
  scheduleBatch() {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      this.executeBatch();
    });
  }

  /**
   * Выполнить все задачи: сначала reads, потом writes
   */
  executeBatch() {
    if (this.tasks.length === 0) {
      this.rafId = null;
      return;
    }

    const batchSize = this.tasks.length;
    const startTime = performance.now();

    // ФАЗА 1: Все чтения layout (getBoundingClientRect, getComputedStyle)
    const readResults = [];
    for (const task of this.tasks) {
      try {
        const result = task.readFn();
        readResults.push(result);
      } catch (error) {
        console.error('LayoutBatcher read error:', error);
        readResults.push(null);
      }
    }

    const readTime = performance.now() - startTime;

    // ФАЗА 2: Все записи DOM/CSS (setProperty, style changes)
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];
      if (task.writeFn) {
        try {
          task.writeFn(readResults[i]);
        } catch (error) {
          console.error('LayoutBatcher write error:', error);
        }
      }
    }

    const totalTime = performance.now() - startTime;

    // Log только если батч большой и медленный
    if (batchSize > 1 && totalTime > 16) {
      console.log(`[LayoutBatcher] Batched ${batchSize} tasks in ${totalTime.toFixed(1)}ms (reads: ${readTime.toFixed(1)}ms)`);
    }

    // Очистка
    this.tasks = [];
    this.rafId = null;
  }

  /**
   * Отменить запланированный batch
   */
  cancel() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.tasks = [];
  }
}

// Singleton instance
export const layoutBatcher = new LayoutBatcher();
