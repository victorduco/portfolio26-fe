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

    // ФАЗА 1: Все чтения layout (getBoundingClientRect, getComputedStyle)
    const readResults = [];
    for (const task of this.tasks) {
      try {
        const result = task.readFn();
        readResults.push(result);
      } catch (error) {
        readResults.push(null);
      }
    }

    // ФАЗА 2: Все записи DOM/CSS (setProperty, style changes)
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];
      if (task.writeFn) {
        try {
          task.writeFn(readResults[i]);
        } catch (error) {
          // Ignore write errors to keep batching resilient
        }
      }
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
