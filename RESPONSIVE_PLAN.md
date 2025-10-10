# План адаптивной доработки p26

**Версия:** 3.0 | **Дата:** 2025-10-09 | **Стратегия:** Mobile-first | **Поддержка:** ≥360px

---

## 0. Контекст и ограничения

### Текущее состояние
- ✅ Typography частично использует `clamp()` ([typography.css](src/styles/typography.css))
- ✅ Некоторые компоненты имеют единичные `@media (max-width: 768px)` query
- ❌ Нет системы токенов (spacing, containers, gutters)
- ❌ Нет utilities.css
- ❌ 16 файлов используют `100vw/100vh` → риск горизонтального скролла
- ❌ Фиксированные `px` значения во всех компонентах (Keypad: 110px, gap: 80px; Intro: 120px, gap: 80px)

### Критические ограничения (НЕ ТРОГАТЬ)
- **[GeBackground.vue:76-84](src/components/glass-effect/GeBackground.vue)** — resize listener ВЫКЛЮЧЕН (деградация +468%)
- **[maskElement.js](src/directives/mask-element/maskElement.js)** — ResizeObserver критичен для glass-effect
- **Performance testing** — обязателен после каждой фазы (`npm run test:perf`, `npm run test:compare`)

### Брейкпоинты
```
360px (xs) → 600px (sm) → 900px (md) → 1200px (lg) → 1600px (xl) → 1920px (xxl)
```

---

## 1. Пайплайн работы

**Для каждой фазы:**
```bash
# 1. Реализация изменений
# 2. Локальная проверка
npm run dev

# 3. Проверка сборки
npm run build

# 4. Performance baseline/сравнение
npm run test:perf -- --comment="Phase X completed"
npm run test:compare  # Сравнить с предыдущим

# 5. E2E на трех viewport'ах
npm run test:e2e  # 1280x800 (default)

# 6. Ручная проверка: 360, 768, 1280, 1920px
```

**Критерии деградации:**
- ✅ Good: <100ms avg resize, >30 FPS, <20% degradation
- ⚠️  Warning: 100-500ms, 15-30 FPS, 20-100% degradation
- 🚨 Critical: >500ms, <15 FPS, >100% degradation → откат изменений

---

## 2. Фаза 1: Foundation (1 день)

### 2.1 Создать систему токенов

**Файл:** `src/styles/tokens.css`

```css
:root {
  /* Spacing (4px module) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 80px;

  /* Gutters (adaptive) */
  --gutter: 16px;

  /* Container max-width */
  --container-max: 100%;

  /* Touch targets */
  --tap-min: 44px;

  /* Typography base (для body текста) */
  --fs-body: clamp(14px, 1.6vw, 16px);
  --lh-body: 1.7;
}

@media (min-width: 600px) {
  :root {
    --gutter: 24px;
    --container-max: min(90vw, 680px);
    --lh-body: 1.65;
  }
}

@media (min-width: 900px) {
  :root {
    --gutter: 32px;
    --container-max: min(92vw, 960px);
    --lh-body: 1.6;
  }
}

@media (min-width: 1200px) {
  :root {
    --gutter: 40px;
    --container-max: min(92vw, 1140px);
    --lh-body: 1.5;
  }
}

@media (min-width: 1600px) {
  :root {
    --gutter: 48px;
    --container-max: min(92vw, 1280px);
  }
}

@media (min-width: 1920px) {
  :root {
    --gutter: 60px;
    --container-max: min(80vw, 1440px);
  }
}
```

**Задачи:**
- [ ] Создать `src/styles/tokens.css`
- [ ] Импортировать в `src/style.css` (первой строкой): `@import './styles/tokens.css';`
- [ ] Обновить [typography.css](src/styles/typography.css): добавить `--lh-body` использование
- [ ] Убрать `width: 100%` из `#app` в [style.css](src/style.css), оставить только `min-height: 100vh`

**Acceptance:**
- Токены доступны во всех компонентах
- Нет горизонтального скролла на 360px и 1920px
- `npm run build` успешен

---

### 2.2 Создать utilities

**Файл:** `src/styles/utilities.css`

```css
/* Container */
.u-container {
  width: 100%;
  max-width: var(--container-max);
  padding-inline: var(--gutter);
  margin-inline: auto;
  box-sizing: border-box;
}

/* Stack (vertical flex) */
.u-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.u-stack-lg { gap: var(--space-lg); }
.u-stack-xl { gap: var(--space-xl); }

/* Cluster (horizontal flex wrap) */
.u-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

/* Grid auto-fit */
.u-grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--gutter);
}

/* Safe areas */
.u-safe-bottom {
  padding-bottom: max(var(--space-md), env(safe-area-inset-bottom));
}

/* Visibility */
.u-hide-sm { display: none; }
@media (min-width: 600px) { .u-hide-sm { display: block; } }

.u-show-sm { display: block; }
@media (min-width: 600px) { .u-show-sm { display: none; } }

/* Screen reader only */
.u-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Задачи:**
- [ ] Создать `src/styles/utilities.css`
- [ ] Импортировать в `src/style.css`: `@import './styles/utilities.css';`

**Acceptance:**
- Классы работают во всех компонентах
- `npm run build` успешен

---

## 3. Фаза 2: Keypad (1,5 дня)

### 3.1 Keypad.vue — основной контейнер

**Файл:** [src/components/keypad/Keypad.vue](src/components/keypad/Keypad.vue)

**Текущие проблемы:**
- `.keypad-container`: `width: 100vw` → горизонтальный скролл
- `.keypad-grid`: фиксированный `gap: 80px`, `padding: 40px`
- `.background-digit`: фиксированный `font-size: 700px`

**Изменения:**

```css
.keypad-container {
  width: 100%;  /* было 100vw */
  height: 100vh;
  /* остальное без изменений */
}

.background-numbers {
  width: 100%;  /* было 100vw */
  /* остальное без изменений */
}

.background-digit {
  font-size: clamp(280px, 50vw, 700px);  /* было 700px */
  margin: 0 clamp(-10px, -2vw, -30px);   /* было -30px */
  /* остальное без изменений */
}

.keypad-grid {
  gap: clamp(32px, 8vw, 80px);  /* было 80px */
  padding: clamp(24px, 4vw, 40px);  /* было 40px */
  /* остальное без изменений */
}

.keypad-clear-button {
  bottom: max(32px, env(safe-area-inset-bottom) + 16px);  /* было 32px */
  /* остальное без изменений */
}
```

**Задачи:**
- [ ] Заменить `100vw` на `100%` в `.keypad-container` и `.background-numbers`
- [ ] Применить `clamp()` для `gap`, `padding`, `font-size`
- [ ] Добавить safe-area для `.keypad-clear-button`

---

### 3.2 KeypadButton.vue — кнопки

**Файл:** [src/components/keypad/KeypadButton.vue](src/components/keypad/KeypadButton.vue)

**Текущие значения:**
- `width/height: 110px` (фиксированный)
- `border-radius: 28px` (фиксированный)
- `font-size: 30px` (фиксированный)

**Целевые значения:**

| Breakpoint | Size | Border-radius | Font |
|------------|------|---------------|------|
| xs (360-599) | 72px | 18px | 24px |
| sm (600-899) | 88px | 22px | 26px |
| md+ (≥900) | 110px | 28px | 30px |

**Изменения:**

```css
.keypad-button-wrapper {
  width: clamp(72px, 18vw, 110px);
  height: clamp(72px, 18vw, 110px);
  border-radius: clamp(18px, 4.5vw, 28px);
  /* остальное без изменений */
}

.keypad-number {
  font-size: clamp(24px, 6vw, 30px);
  /* остальное без изменений */
}
```

**Задачи:**
- [ ] Применить `clamp()` для размеров кнопки
- [ ] Применить `clamp()` для `border-radius` и `font-size`
- [ ] Добавить `:focus-visible` стиль (ring outline)

**Acceptance:**
- На 360px: кнопки ≥72px (≥tap-min 44px) ✅
- На 1920px: кнопки 110px
- Нет горизонтального скролла
- E2E `npm run test:interaction` проходит
- Performance: деградация <20%

---

### 3.3 Motion-v варианты для mobile

**Файл:** [src/components/keypad/variants.js](src/components/keypad/variants.js)

**Задачи:**
- [ ] Проверить длительность анимаций (если >300ms на mobile → сократить на 30-50%)
- [ ] Добавить поддержку `prefers-reduced-motion` (установить `duration: 0`)

---

## 4. Фаза 3: Intro Section (2 дня)

### 4.1 Intro.vue — Hero + Rectangles

**Файл:** [src/pages/main-page/intro/Intro.vue](src/pages/main-page/intro/Intro.vue)

**Текущие проблемы:**
- `.intro-hero`: `width: 100vw` → горизонтальный скролл
- `.intro-list`: фиксированный `gap: 80px`, grid `4 col × 5 row` всегда
- Media query только для `768px` (не mobile-first)

**Целевое поведение:**

| Breakpoint | Grid | Gap | Text align |
|------------|------|-----|------------|
| xs-sm (<900) | 2×2 | 40px | center |
| md+ (≥900) | 4×5 | 80px | left |

**Изменения:**

```css
.intro-hero {
  width: 100%;  /* было 100vw */
  height: 100vh;
  padding-block: clamp(40px, 10vh, 96px);
  padding-inline-start: clamp(24px, 8vw, 120px);
  padding-inline-end: clamp(16px, 4vw, 48px);
  /* остальное */
}

.intro-list {
  /* Base (xs-sm): 2×2 grid */
  grid-template-columns: repeat(2, fit-content(100px));
  grid-template-rows: repeat(2, 1fr);
  gap: clamp(32px, 8vw, 60px);
  max-width: 100%;  /* было 110vw */
  max-height: 100%;  /* было 110vh */
  /* остальное */
}

@media (min-width: 900px) {
  .intro-list {
    /* md+: 4×5 grid */
    grid-template-columns: repeat(4, fit-content(100px));
    grid-template-rows: repeat(5, 1fr);
    gap: 80px;
  }
}

/* Удалить старый @media (max-width: 768px) блок */
```

**Задачи:**
- [ ] Заменить `100vw` на `100%`
- [ ] Изменить grid на mobile-first подход (2×2 → 4×5)
- [ ] Убрать `max-width: 110vw`, `max-height: 110vh` (причина overflow)
- [ ] Применить `clamp()` для padding
- [ ] Удалить старый media query для 768px

---

### 4.2 IntroRectangle.vue

**Файл:** [src/pages/main-page/intro/IntroRectangle.vue](src/pages/main-page/intro/IntroRectangle.vue)

**Текущие значения:**
- `--element-side-size: 120px` (фиксированный)
- `border-radius: 28px` (фиксированный)
- `font-size: 70px` для числа (фиксированный)

**Целевые значения:**

| Breakpoint | Size | Border-radius | Font |
|------------|------|---------------|------|
| xs-sm (<600) | 80px | 20px | 48px |
| sm-md (600-899) | 100px | 24px | 60px |
| md+ (≥900) | 120px | 28px | 70px |

**Изменения:**

```css
.intro-square {
  --element-side-size: clamp(80px, 20vw, 120px);
  border-radius: clamp(20px, 5vw, 28px);
  /* остальное */
}

.intro-content-number {
  font-size: clamp(48px, 12vw, 70px);
  /* остальное */
}
```

**Задачи:**
- [ ] Применить `clamp()` для `--element-side-size`
- [ ] Применить `clamp()` для `border-radius` и `font-size`
- [ ] Проверить margin анимации (не используют ли фиксированные `px` из [variants.js](src/pages/main-page/intro/variants.js))

**Acceptance:**
- На 360px: rectangles 80×80px (≥tap-min) ✅
- На 1920px: rectangles 120×120px
- Grid 2×2 на mobile, 4×5 на desktop
- Нет горизонтального скролла
- Performance: деградация <20%

---

## 5. Фаза 4: Navigation (1 день)

### 5.1 PageNavigation.vue

**Файл:** [src/components/page-navigation/PageNavigation.vue](src/components/page-navigation/PageNavigation.vue)

**Текущее состояние:**
- Всегда fixed справа (`right: 48px`)
- Одна версия для всех экранов
- Media query только для `768px` (right: 24px)

**Целевое поведение:**

| Breakpoint | Position | Right |
|------------|----------|-------|
| xs-sm (<900) | Sticky bottom bar | N/A |
| md+ (≥900) | Fixed right | clamp(32px, 4vw, 48px) |

**Изменения:**

**Mobile (sticky bottom bar):**
```css
@media (max-width: 899px) {
  .page-navigation {
    position: sticky;
    bottom: 0;
    left: 0;
    right: auto;
    top: auto;
    transform: none;
    flex-direction: row;
    width: 100%;
    padding: var(--space-md);
    padding-bottom: max(var(--space-md), env(safe-area-inset-bottom));
    gap: var(--space-sm);
    overflow-x: auto;
    background: rgba(23, 23, 23, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

**Desktop:**
```css
@media (min-width: 900px) {
  .page-navigation {
    right: clamp(32px, 4vw, 48px);
    /* остальное без изменений */
  }
}
```

**Задачи:**
- [ ] Реализовать sticky bottom bar для mobile (<900px)
- [ ] Добавить safe-area padding для bottom bar
- [ ] Обновить desktop positioning с `clamp()`
- [ ] Убрать старый media query для 768px
- [ ] Обеспечить `:focus-visible` и keyboard navigation

**Acceptance:**
- На 360-899px: navigation внизу экрана (sticky)
- На 900px+: navigation справа (fixed)
- Lighthouse Accessibility ≥90
- Клавиатурная навигация работает

---

## 6. Фаза 5: Cases Section (1 день)

### 6.1 CaseItem.vue

**Файл:** [src/pages/main-page/cases/CaseItem.vue](src/pages/main-page/cases/CaseItem.vue)

**Текущие проблемы:**
- `padding: 2vh 10vw` → на узких экранах мало места
- Фиксированные `max-width` для заголовков
- `.replay-button`: `clamp(60px, 10vw, 80px)` → на 360px может быть <44px

**Целевые значения:**

| Breakpoint | Padding-inline | Text align |
|------------|----------------|------------|
| xs (<600) | 4vw | center |
| sm (600-899) | 6vw | center |
| md+ (≥900) | 10vw | left |

**Изменения:**

```css
.case-item {
  padding: 2vh clamp(16px, 4vw, 10vw);
  padding-bottom: max(2vh, env(safe-area-inset-bottom));
  /* остальное */
}

@media (max-width: 899px) {
  .case-heading,
  .case-title,
  .case-subtitle {
    text-align: center;
  }

  .case-heading-top {
    flex-direction: column;
    align-items: center;
  }
}

.case-title {
  font-size: clamp(20px, 4vw, 32px);
  max-width: 100%;
}

@media (min-width: 900px) {
  .case-title {
    max-width: 560px;
  }
}

.replay-button {
  width: clamp(48px, 10vw, 80px);  /* было 60px */
  height: clamp(48px, 10vw, 80px);
  /* остальное */
}

.replay-button svg {
  width: clamp(24px, 5vw, 40px);
  height: clamp(24px, 5vw, 40px);
}
```

**Задачи:**
- [ ] Адаптировать `padding` с `clamp()`
- [ ] Центрировать текст на mobile (<900px)
- [ ] Убедиться `.replay-button` ≥48px на всех экранах
- [ ] Добавить safe-area padding
- [ ] Применить `clamp()` для заголовков

**Acceptance:**
- На 360px: текст центрирован, replay button ≥48px
- На 900px+: текст слева, layout стабилен
- Нет горизонтального скролла

---

## 7. Фаза 6: Case Pages (2 дня)

### 7.1 CasePage.vue и все case*-page компоненты

**Файлы:**
- [src/pages/case-page/CasePage.vue](src/pages/case-page/CasePage.vue)
- [src/pages/case1-page/case1/Process.vue](src/pages/case1-page/case1/Process.vue) (и аналогичные: Task, Results, Summary для case1/2/3)

**Текущие проблемы:**
- Все используют `width: 100vw` → горизонтальный скролл
- Фиксированные `padding` значения
- Media query только для `768px`

**Изменения (применить ко ВСЕМ case page файлам):**

```css
/* Например, Process.vue, Task.vue, Results.vue */
.case1-process {  /* или .case1-task, .case1-results и т.д. */
  width: 100%;  /* было 100vw */
  padding: clamp(48px, 8vh, 96px) clamp(16px, 4vw, 60px) clamp(24px, 4vh, 60px);
  padding-bottom: max(clamp(24px, 4vh, 60px), env(safe-area-inset-bottom));
  /* остальное */
}

.markdown-content {
  max-width: 100%;
}

@media (min-width: 900px) {
  .markdown-content {
    max-width: 680px;
  }
}

@media (min-width: 1200px) {
  .markdown-content {
    max-width: 960px;
  }
}

/* Deep selectors для типографики */
.markdown-content :deep(h1) {
  font-size: clamp(28px, 6vw, 48px);
}

.markdown-content :deep(h2) {
  font-size: clamp(22px, 4vw, 32px);
}

.markdown-content :deep(p) {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  max-width: 70ch;
}
```

**Задачи:**
- [ ] Заменить `100vw` на `100%` во всех case page компонентах
- [ ] Применить `clamp()` для padding
- [ ] Добавить safe-area padding
- [ ] Адаптировать `max-width` для контента по брейкпоинтам
- [ ] Обновить типографику через `:deep()` селекторы
- [ ] Убрать старые media queries для 768px

**Acceptance:**
- Все case pages без горизонтального скролла на 360-1920px
- Контент ограничен `max-width` на больших экранах
- Typography адаптивна

---

### 7.2 CasePage.vue — back button

**Файл:** [src/pages/case-page/CasePage.vue](src/pages/case-page/CasePage.vue)

**Изменения:**

```css
.case-page-back {
  top: clamp(16px, 2vw, 48px);
  left: clamp(16px, 2vw, 48px);
  /* остальное */
}
```

**Задачи:**
- [ ] Применить `clamp()` для `top` и `left`
- [ ] Убрать media query для 768px

---

## 8. Фаза 7: Final Polish (0,5 дня)

### 8.1 Typography финализация

**Файл:** [src/styles/typography.css](src/styles/typography.css)

**Задачи:**
- [ ] Обновить `p` на использование `var(--fs-body)` и `var(--lh-body)`
- [ ] Добавить `max-width: 70ch` для параграфов
- [ ] Убедиться что `.body1` использует `clamp()`: `clamp(20px, 3vw, 32px)`

**Изменения:**

```css
p {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  max-width: 70ch;
  /* остальное */
}

.body1 {
  font-size: clamp(20px, 3vw, 32px);
  /* остальное */
}
```

---

### 8.2 Focus states и accessibility

**Задачи:**
- [ ] Добавить `:focus-visible` ко всем интерактивным элементам (кнопки, ссылки, navigation items)
- [ ] Проверить `aria-label` на всех кнопках без текста
- [ ] Убедиться что все touch targets ≥44×44px

**Global focus style (добавить в `style.css`):**

```css
*:focus-visible {
  outline: 2px solid rgba(39, 169, 255, 0.8);
  outline-offset: 4px;
  border-radius: 4px;
}
```

---

## 9. Фаза 8: Testing & Documentation (0,5 дня)

### 9.1 E2E тестирование

**Задачи:**
- [ ] Обновить [tests/e2e/scenarios/interaction-performance.js](tests/e2e/scenarios/interaction-performance.js) для работы с mobile layout
- [ ] Запустить полный e2e на трех viewport'ах: 360, 768, 1280
- [ ] Убедиться что все сценарии проходят без ошибок

**Команды:**
```bash
# Keypad interaction (критичный)
npm run test:interaction -- --comment="Final responsive check"

# Resize performance (не должна быть деградации)
npm run test:perf -- --comment="Final responsive check"
npm run test:compare  # Сравнить с baseline
```

---

### 9.2 Ручное тестирование

**Чек-лист:**
- [ ] 360px (iPhone SE): нет горизонтального скролла, tap targets ≥44px
- [ ] 768px (iPad): layout корректен, navigation sticky внизу
- [ ] 1280px (MacBook): navigation справа, intro grid 4×5
- [ ] 1920px (Desktop): контент ограничен max-width, нет растягивания

**Устройства/браузеры:**
- [ ] iOS Safari (реальное устройство или симулятор) — проверить safe areas
- [ ] Android Chrome
- [ ] Desktop Chrome/Firefox

---

### 9.3 Документация

**Задачи:**
- [ ] Обновить [CLAUDE.md](CLAUDE.md): добавить секцию "Responsive Design System"
- [ ] Создать краткую таблицу токенов и брейкпоинтов в CLAUDE.md
- [ ] Добавить примеры использования utilities классов

**Пример для CLAUDE.md:**

```markdown
## Responsive Design System

**Breakpoints:** 360 (xs), 600 (sm), 900 (md), 1200 (lg), 1600 (xl), 1920 (xxl)

**Tokens:** [src/styles/tokens.css](src/styles/tokens.css)
- Spacing: `--space-xs` to `--space-4xl`
- Gutters: `--gutter` (adaptive per breakpoint)
- Container: `--container-max` (adaptive per breakpoint)

**Utilities:** [src/styles/utilities.css](src/styles/utilities.css)
- `.u-container` — adaptive container with gutters
- `.u-stack` — vertical flex layout
- `.u-safe-bottom` — safe area padding

**Performance constraints:**
- After ANY responsive changes: `npm run test:perf && npm run test:compare`
- Target: <20% degradation vs baseline
```

---

## 10. Критерии приемки (Definition of Done)

### Функциональность
- ✅ Все компоненты адаптированы для 360-1920px
- ✅ Нет горизонтального скролла на всех брейкпоинтах
- ✅ Touch targets ≥44×44px
- ✅ Navigation: sticky bottom на mobile, fixed right на desktop
- ✅ Intro grid: 2×2 на mobile, 4×5 на desktop

### Performance
- ✅ Performance degradation <20% vs baseline
- ✅ `npm run test:perf` проходит
- ✅ `npm run test:interaction` проходит
- ✅ FPS >30 на всех viewport'ах

### Accessibility
- ✅ Lighthouse Accessibility ≥90
- ✅ `:focus-visible` на всех интерактивах
- ✅ Клавиатурная навигация работает
- ✅ `aria-label` на всех кнопках без текста

### Code Quality
- ✅ Используются токены из `tokens.css`
- ✅ Нет дублирующихся CSS правил (используются utilities)
- ✅ Mobile-first подход (base styles + `@media (min-width:)`)
- ✅ Нет `100vw/100vh` за исключением обоснованных случаев

### Documentation
- ✅ CLAUDE.md обновлен с responsive системой
- ✅ Все новые токены и utilities задокументированы
- ✅ Чек-лист тестирования актуален

---

## 11. Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Performance деградация от обилия `clamp()` | Средняя | Высокое | Профилировать после каждой фазы, откат при >20% |
| Motion-v анимации ломаются на mobile | Средняя | Среднее | Короткие тайминги, `prefers-reduced-motion` |
| Safe areas конфликтуют с positioning | Средняя | Среднее | Тестировать на iOS до слияния |
| Container queries не поддерживаются | Низкая | Низкое | Использовать только для progressive enhancement, fallback на media queries |

---

## 12. Оценка времени

| Фаза | Время | Описание |
|------|-------|----------|
| 1. Foundation | 1 день | Токены + utilities |
| 2. Keypad | 1.5 дня | Layout + buttons + variants |
| 3. Intro | 2 дня | Hero + rectangles + grid |
| 4. Navigation | 1 день | Mobile bottom bar + desktop |
| 5. Cases | 1 день | CaseItem адаптация |
| 6. Case Pages | 2 дня | Все case page компоненты |
| 7. Final Polish | 0.5 дня | Typography + focus + a11y |
| 8. Testing & Docs | 0.5 дня | E2E + ручное + документация |
| **Итого** | **9.5 дней** | ~2 недели с запасом |

---

## 13. Контрольные точки

- **После Фазы 1:** Ревью токенов (блокирует остальные фазы)
- **После Фазы 2:** Демо Keypad на 360/1280px
- **После Фазы 4:** Демо Navigation на mobile/desktop
- **После Фазы 6:** Регресс всех case pages
- **Финал:** Общий демо + утверждение документации

---

## Приложение: Полезные команды

```bash
# Development
npm run dev

# Performance testing
npm run test:perf -- --comment="Description"
npm run test:compare

# E2E
npm run test:e2e
npm run test:interaction

# Build
npm run build

# Найти все 100vw/100vh
rg -g '*.vue' -e '100vh|100vw' src/

# Найти фиксированные px (для рефакторинга)
rg -g '*.vue' -e '\d+px' src/components/keypad/
```

---

**Последнее обновление:** 2025-10-09 | **Версия:** 3.0
