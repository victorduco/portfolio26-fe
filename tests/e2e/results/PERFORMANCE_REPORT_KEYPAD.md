# Performance Report (Keypad Focus)

Короткий рабочий отчёт по исследованию производительности Keypad.

Полный архивный отчёт: tests/e2e/results/PERFORMANCE_REPORT_ARCHIVE.md

---

## Стартовое состояние

- Keypad: GlassEffect ON, v-mask-element ON, hover-distortion ON, GeBackground (observeChanges=true).
- Базовые наблюдения:
  - Выключение GlassEffect даёт ощутимый прирост отзывчивости.
  - Выключение hover-distortion лаг не убирает.
  - GeBackground с observeChanges=false лаг не убирает.
  - Без v-mask-element лаг пропадает (эффект схож с отключением GlassEffect).
- Предположение: узкое место в связке GlassEffect ↔ mask-element.

---

## Эксперимент 1

**Действие:** Отключили MutationObserver в mask-element.

**Результат:** Лаг остаётся. Хм, неясно — MutationObserver не ключевой.

---

## Эксперимент 2

**Действие:** Отключили MutationObserver и ResizeObserver в mask-element.

**Результат:** Лаг остаётся. Оба наблюдателя возвращены в baseline.

---

## Эксперимент 3

**Действие:** Отключили window scroll listener в GeFilter (updateMaskRect).

**Результат:** Лаг остаётся. Scroll listener возвращён.

---

## Эксперимент 4

**Действие:** Отключили window resize listener в GeFilter.

**Результат:** Лаг остаётся. Resize listener возвращён.

---

## Эксперимент 5

**Действие:** Отключили ResizeObserver в GeFilter (наблюдает ближайший .mask-element).

**Результат:** Лаг остаётся. Текущая конфигурация: scroll/resize активны, ResizeObserver в GeFilter выключен.

---

## Эксперимент 6

**Действие:** Полностью отключили GlassEffect в KeypadButton (вместо компонента — статический `div.keypad-button-glass`).

**Результат:** Лаги ушли. Важно: чтобы фон синхронизировался, на заменяющий `div` вернули `v-mask-element` (иначе bg-sync пропадает).

---

## Эксперимент 7

**Действие:** Вернули GlassEffect в KeypadButton, но внутри GlassEffect отключили компонент `GeFilter` (оставили GeCard/GeNoise/GeLight).

**Результат:** Проверяем, остаётся ли плавность без GeFilter при активном GlassEffect.

---

## Что дальше

- [ ] Зафиксировать метрики interaction-performance для двух режимов: без GlassEffect (эксп.6) и с GlassEffect без GeFilter (эксп.7).
- [ ] Подумать о перманентном флаге для включения/выключения GeFilter на проде.
- [ ] Добавить временный флаг для полного отключения GeBackground и сравнить влияние.
- [ ] Снять профилировку (Performance в DevTools) на сценарии ввода/hover.
