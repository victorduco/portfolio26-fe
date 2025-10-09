# План адаптивного дизайна для проекта p26

## Общая стратегия

**Политика:** Mobile-first
**Поддержка:** ≥360px (все что меньше — не поддерживается)
**Брейкпоинты:** 360px (xs), 600px (sm), 900px (md), 1200px (lg), 1600px (xl), 1920px (xxl)

---

## Фаза 1: Инфраструктура и токены (Foundation)

### 1.1 Создание системы дизайн-токенов

**Файл:** `src/styles/tokens.css`

**Содержание:**

```css
:root {
  /* Spacing (модуль 4px) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Gutters */
  --container-gutter: 16px;

  /* Interactive zones */
  --tap-min: 44px;

  /* Container max-width */
  --container-max: 100%;

  /* Typography base */
  --fs-body: clamp(14px, 1.8vw, 16px);
  --lh-body: 1.7;
}

/* sm: ≥600px */
@media (min-width: 600px) {
  :root {
    --container-gutter: 20px;
    --container-max: min(90vw, 680px);
    --lh-body: 1.65;
  }
}

/* md: ≥900px */
@media (min-width: 900px) {
  :root {
    --container-gutter: 24px;
    --container-max: min(92vw, 960px);
    --lh-body: 1.6;
  }
}

/* lg: ≥1200px */
@media (min-width: 1200px) {
  :root {
    --container-gutter: 28px;
    --container-max: min(92vw, 1140px);
    --lh-body: 1.5;
  }
}

/* xl: ≥1600px */
@media (min-width: 1600px) {
  :root {
    --container-gutter: 32px;
    --container-max: min(92vw, 1280px);
  }
}

/* xxl: ≥1920px */
@media (min-width: 1920px) {
  :root {
    --container-gutter: 36px;
    --container-max: min(80vw, 1440px);
  }
}
```

**Задачи:**
- ✅ Создать файл `src/styles/tokens.css`
- ✅ Импортировать в `src/style.css`: `@import './styles/tokens.css';`
- ✅ Определить все spacing переменные
- ✅ Настроить gutters для каждого брейкпоинта
- ✅ Настроить container max-width для каждого брейкпоинта

---

### 1.2 Обновление типографической системы

**Файл:** `src/styles/typography.css`

**Изменения:**

```css
:root {
  /* Typography scale с clamp */
  --font-size-h1: clamp(28px, 5vw, 64px);
  --font-size-h2: clamp(24px, 4vw, 48px);
  --font-size-h3: clamp(20px, 3vw, 32px);
  --font-size-h4: clamp(18px, 2.5vw, 24px);
  --font-size-h5: clamp(16px, 2vw, 20px);
  --font-size-h6: clamp(14px, 1.8vw, 18px);

  /* Line-heights */
  --line-height-tight: 1.15;
  --line-height-snug: 1.25;
  --line-height-relaxed: 1.45;
}

/* Body текст */
p, .body-text {
  font-size: clamp(14px, 1.8vw, 16px);
  line-height: var(--lh-body);
  max-width: 70ch; /* Ограничение длины строки */
}

/* Интерактивный текст (кнопки, ссылки) */
button, a, .interactive-text {
  font-size: clamp(14px, 1.6vw, 18px);
  line-height: 1.2;
}

/* Заголовки с adaptive line-height */
@media (min-width: 900px) {
  :root {
    --line-height-relaxed: 1.5;
  }
}

@media (min-width: 1200px) {
  :root {
    --line-height-relaxed: 1.55;
  }
}
```

**Задачи:**
- ✅ Обновить все CSS-переменные для шрифтов на clamp()
- ✅ Добавить адаптивные line-height через media queries
- ✅ Добавить max-width: 70ch для текстовых блоков
- ✅ Обеспечить переносы заголовков на 2 строки на мобильных

---

### 1.3 Создание CSS-утилит и миксинов

**Файл:** `src/styles/utilities.css`

**Содержание:**

```css
/* Container queries utilities */
.u-container {
  container-type: inline-size;
  padding: var(--space-6);
}

/* Safe areas */
.u-safe-bottom {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* Grid utilities */
.u-grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--container-gutter);
}

/* Flex utilities */
.u-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.u-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

/* Text utilities */
.u-text-center-mobile {
  text-align: left;
}

@media (max-width: 899px) {
  .u-text-center-mobile {
    text-align: center;
  }
}

/* Touch targets */
.u-tap-target {
  min-width: var(--tap-min);
  min-height: var(--tap-min);
}
```

**Задачи:**
- ✅ Создать файл `src/styles/utilities.css`
- ✅ Добавить container queries утилиты
- ✅ Добавить safe-area утилиты
- ✅ Добавить grid/flex утилиты
- ✅ Импортировать в `src/style.css`

---

## Фаза 2: Keypad (Экран разблокировки)

### 2.1 Keypad.vue - основной контейнер

**Файл:** `src/components/keypad/Keypad.vue`

**Текущее состояние:**
- Grid gap: 80px (фиксированный)
- Padding: 40px (фиксированный)
- Background-digit font-size: 700px (фиксированный)

**Целевое состояние (по брейкпоинтам):**

| Брейкпоинт | Grid gap | Padding | Background digit |
|------------|----------|---------|------------------|
| xs (360-599) | 32px | 24px | clamp(280px, 50vw, 400px) |
| sm (600-899) | 48px | 32px | clamp(400px, 45vw, 550px) |
| md (900-1199) | 64px | 36px | clamp(550px, 40vw, 650px) |
| lg+ (≥1200) | 80px | 40px | clamp(650px, 35vw, 700px) |

**Изменения в коде:**

```vue
<style scoped>
.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 32px;  /* xs базовое */
  padding: 24px;  /* xs базовое */
  position: relative;
  z-index: 10;
}

@media (min-width: 600px) {
  .keypad-grid {
    gap: 48px;
    padding: 32px;
  }
}

@media (min-width: 900px) {
  .keypad-grid {
    gap: 64px;
    padding: 36px;
  }
}

@media (min-width: 1200px) {
  .keypad-grid {
    gap: 80px;
    padding: 40px;
  }
}

.background-digit {
  font-size: clamp(280px, 50vw, 700px);
  font-weight: 400;
  line-height: 1;
  opacity: 1;
  user-select: none;
  margin: 0 -30px;
  transition: color 0.5s ease;
}

@media (min-width: 600px) {
  .background-digit {
    margin: 0 -50px;
  }
}

@media (min-width: 900px) {
  .background-digit {
    margin: 0 -70px;
  }
}
</style>
```

**Задачи:**
- ✅ Заменить фиксированный gap на адаптивный с media queries
- ✅ Заменить фиксированный padding на адаптивный
- ✅ Заменить font-size на clamp() для .background-digit
- ✅ Протестировать на всех брейкпоинтах
- ✅ Убедиться что кейпад остается центрированным

---

### 2.2 KeypadButton.vue - кнопки

**Файл:** `src/components/keypad/KeypadButton.vue`

**Текущее состояние:**
- Width/Height: 110px (фиксированный)
- Border-radius: 28px (фиксированный)
- Font-size: 30px (фиксированный)

**Целевое состояние:**

| Брейкпоинт | Size | Border-radius | Font-size |
|------------|------|---------------|-----------|
| xs (360-599) | 72px | 18px | 22px |
| sm (600-899) | 80px | 20px | 24px |
| md (900-1199) | 88px | 22px | 26px |
| lg+ (≥1200) | 110px | 28px | 30px |

**Изменения в коде:**

```vue
<style scoped>
.keypad-button-wrapper {
  position: relative;
  width: 72px;  /* xs базовое */
  height: 72px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  overflow: hidden;
  transform: rotate(45deg);
  border: 1px solid #ffffff09;
}

@media (min-width: 600px) {
  .keypad-button-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 20px;
  }
}

@media (min-width: 900px) {
  .keypad-button-wrapper {
    width: 88px;
    height: 88px;
    border-radius: 22px;
  }
}

@media (min-width: 1200px) {
  .keypad-button-wrapper {
    width: 110px;
    height: 110px;
    border-radius: 28px;
  }
}

.keypad-number {
  font-size: 22px;  /* xs базовое */
  /* остальные стили */
}

@media (min-width: 600px) {
  .keypad-number {
    font-size: 24px;
  }
}

@media (min-width: 900px) {
  .keypad-number {
    font-size: 26px;
  }
}

@media (min-width: 1200px) {
  .keypad-number {
    font-size: 30px;
  }
}
</style>
```

**Задачи:**
- ✅ Добавить адаптивные размеры кнопок
- ✅ Добавить адаптивный border-radius
- ✅ Добавить адаптивный font-size для чисел
- ✅ Убедиться что touch target ≥44px на всех экранах
- ✅ Протестировать hover/pressed состояния

---

## Фаза 3: MainPage - Intro секция

### 3.1 Intro.vue - Hero + Rectangles

**Файл:** `src/pages/main-page/intro/Intro.vue`

**Текущее состояние:**
- Padding-inline: clamp(32px, 12vw, 120px)
- Padding-block: clamp(48px, 12vh, 96px)
- Grid rectangles: 4 колонки × 5 рядов
- Gap: 80px (фиксированный)

**Целевое состояние:**

| Брейкпоинт | Layout | Grid | Gap | Title align |
|------------|--------|------|-----|-------------|
| xs (360-599) | 2×2 | 2 col × 2 row | 32px | center |
| sm (600-899) | 2×2 | 2 col × 2 row | 40px | center |
| md (900-1199) | 4 col (80%) | 4 col × 5 row | 60px | left |
| lg+ (≥1200) | 4 col (100%) | 4 col × 5 row | 80px | left |

**Изменения в коде:**

```vue
<style scoped>
.intro-hero {
  padding-block: clamp(40px, 10vh, 96px);
  padding-inline-start: clamp(24px, 8vw, 120px);
  padding-inline-end: clamp(16px, 4vw, 48px);
  text-align: left;
}

@media (max-width: 899px) {
  .intro-hero {
    text-align: center;
  }
}

.intro-hero__title {
  max-width: 100%;
}

@media (min-width: 900px) {
  .intro-hero__title {
    max-width: 1000px;
  }
}

.intro-list {
  /* xs/sm: 2×2 grid */
  display: grid;
  grid-template-columns: repeat(2, fit-content(100px));
  grid-template-rows: repeat(2, 1fr);
  gap: 32px;
}

@media (min-width: 600px) {
  .intro-list {
    gap: 40px;
  }
}

@media (min-width: 900px) {
  .intro-list {
    /* md+: 4×5 grid */
    grid-template-columns: repeat(4, fit-content(100px));
    grid-template-rows: repeat(5, 1fr);
    gap: 60px;
  }
}

@media (min-width: 1200px) {
  .intro-list {
    gap: 80px;
  }
}
</style>
```

**Задачи:**
- ✅ Адаптировать padding для hero секции
- ✅ Переключить grid с 4×5 на 2×2 для мобильных
- ✅ Центрировать текст на sm/xs
- ✅ Адаптировать gap между rectangles
- ✅ Обеспечить правильное позиционирование с anchor positioning

**Дополнительная логика (JS):**
- На sm/xs: ограничить количество одновременно открытых rectangles до 1
- При открытии нового — закрывать предыдущий

---

### 3.2 IntroRectangle.vue - интерактивные ромбы

**Файл:** `src/pages/main-page/intro/IntroRectangle.vue`

**Текущее состояние:**
- `--element-side-size: 120px` (фиксированный)
- Border-radius: 28px (фиксированный)
- Font-size: 70px (фиксированный)

**Целевое состояние:**

| Брейкпоинт | Size | Border-radius | Font-size (number) |
|------------|------|---------------|--------------------|
| xs (360-599) | 80px | 20px | 50px |
| sm (600-899) | 90px | 20px | 55px |
| md (900-1199) | 100px | 24px | 60px |
| lg+ (≥1200) | 120px | 28px | 70px |

**Изменения в коде:**

```vue
<style scoped>
.intro-square {
  --element-side-size: 80px;  /* xs базовое */
  border-radius: 20px;
  /* остальные стили */
}

@media (min-width: 600px) {
  .intro-square {
    --element-side-size: 90px;
  }
}

@media (min-width: 900px) {
  .intro-square {
    --element-side-size: 100px;
    border-radius: 24px;
  }
}

@media (min-width: 1200px) {
  .intro-square {
    --element-side-size: 120px;
    border-radius: 28px;
  }
}

.intro-content-number {
  font-size: 50px;  /* xs базовое */
}

@media (min-width: 600px) {
  .intro-content-number {
    font-size: 55px;
  }
}

@media (min-width: 900px) {
  .intro-content-number {
    font-size: 60px;
  }
}

@media (min-width: 1200px) {
  .intro-content-number {
    font-size: 70px;
  }
}
</style>
```

**Дополнительная логика (JS):**

```vue
<script setup>
import { computed, ref, watch, inject } from 'vue';

// Inject viewport size для определения режима
const isMobile = inject('isMobile', ref(false));

const emit = defineEmits(['activeChange', 'requestClose']);

function toggleState() {
  isHovered.value = false;

  // На мобильных: при открытии - запрашиваем закрытие других
  if (isMobile.value && !isActive.value) {
    emit('requestClose', props.index);
  }

  isActive.value = !isActive.value;
  emit('activeChange', isActive.value);
}
</script>
```

**Задачи:**
- ✅ Адаптировать размер ромбов
- ✅ Адаптировать border-radius
- ✅ Адаптировать font-size для чисел
- ✅ Добавить логику закрытия других ромбов на мобильных
- ✅ Убедиться что touch target ≥44px

---

## Фаза 4: Page Navigation (Навигация)

### 4.1 PageNavigation.vue - Desktop версия

**Файл:** `src/components/page-navigation/PageNavigation.vue`

**Текущее состояние:**
- Fixed right: 48px, top: 50%
- Вертикальная колонка
- Только одна версия для всех экранов

**Целевое состояние:**

| Брейкпоинт | Режим | Position |
|------------|-------|----------|
| xs (360-599) | Кнопка + overlay menu | Fixed top-right |
| sm (600-899) | Кнопка + overlay menu | Fixed top-right |
| md (900-1199) | Панель справа (уменьшенная) | right: 32px |
| lg+ (≥1200) | Панель справа (полная) | right: 48px |

**Изменения в коде:**

```vue
<template>
  <!-- Desktop: панель справа -->
  <nav
    v-if="!isMobile"
    class="page-navigation"
    aria-label="Page sections navigation"
  >
    <NavigationItem
      v-for="(section, index) in sections"
      :key="section.id"
      :label="section.label"
      :section-id="section.id"
      :is-active="activeSection === section.id"
    />
  </nav>

  <!-- Mobile: кнопка + overlay -->
  <div v-else class="page-navigation-mobile">
    <button
      class="nav-toggle"
      @click="isMenuOpen = !isMenuOpen"
      :aria-expanded="isMenuOpen"
      aria-label="Toggle navigation menu"
    >
      <svg v-if="!isMenuOpen" width="24" height="24" viewBox="0 0 24 24">
        <!-- Hamburger icon -->
        <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" />
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24">
        <!-- Close icon -->
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" />
      </svg>
    </button>

    <!-- Overlay menu -->
    <Teleport to="body">
      <Transition name="menu-fade">
        <div
          v-if="isMenuOpen"
          class="nav-overlay"
          @click="isMenuOpen = false"
        >
          <nav
            class="nav-overlay-menu"
            @click.stop
            aria-label="Page sections navigation"
          >
            <NavigationItem
              v-for="(section, index) in sections"
              :key="section.id"
              :label="section.label"
              :section-id="section.id"
              :is-active="activeSection === section.id"
              :mobile="true"
              @navigate="handleMobileNavigate"
            />
          </nav>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const isMobile = ref(false);
const isMenuOpen = ref(false);

function updateMobileState() {
  isMobile.value = window.innerWidth < 900;
}

function handleMobileNavigate(sectionId) {
  handleNavigate(sectionId);
  isMenuOpen.value = false;  // Закрываем меню после навигации
}

onMounted(() => {
  updateMobileState();
  window.addEventListener('resize', updateMobileState);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileState);
});
</script>

<style scoped>
/* Desktop navigation */
.page-navigation {
  position: fixed;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 1000;
  padding: 24px 0;
}

@media (min-width: 1200px) {
  .page-navigation {
    right: 48px;
  }
}

/* Mobile navigation */
.page-navigation-mobile {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1001;
}

.nav-toggle {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-toggle:hover {
  background: rgba(23, 23, 23, 0.95);
  border-color: rgba(255, 255, 255, 0.2);
}

.nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.nav-overlay-menu {
  background: #171717;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 24px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Transitions */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>
```

**Задачи:**
- ✅ Создать мобильную версию с кнопкой
- ✅ Добавить overlay menu с анимацией
- ✅ Использовать Teleport для overlay
- ✅ Добавить auto-close при навигации
- ✅ Адаптировать desktop версию (right padding)
- ✅ Обеспечить accessibility (aria-labels, keyboard navigation)

---

## Фаза 5: Cases Section (Секции кейсов)

### 5.1 CaseItem.vue

**Файл:** `src/pages/main-page/cases/CaseItem.vue`

**Текущее состояние:**
- Flex-direction: column (всегда)
- Padding: 2vh 10vw
- Gap: clamp(16px, 2vh, 24px)

**Целевое состояние:**

| Брейкпоинт | Layout | Padding | Button position |
|------------|--------|---------|-----------------|
| xs (360-599) | Column | 2vh 4vw | Under text |
| sm (600-899) | Column | 2vh 6vw | Under text |
| md (900-1199) | Column (centered) | 2vh 8vw | Right of title |
| lg-xl (≥1200) | Column | 2vh 10vw | Right of title |
| xxl (≥1920) | Column (max-width) | 2vh auto | Right of title |

**Изменения в коде:**

```vue
<style scoped>
.case-item {
  background: #171717;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 2vh 4vw;  /* xs базовое */
  margin: auto;
  text-align: left;
  gap: clamp(16px, 2vh, 24px);
  max-height: 100dvh;
  width: 100%;
}

@media (min-width: 600px) {
  .case-item {
    padding: 2vh 6vw;
  }
}

@media (min-width: 900px) {
  .case-item {
    padding: 2vh 8vw;
    text-align: center;  /* Центрирование на md */
  }
}

@media (min-width: 1200px) {
  .case-item {
    padding: 2vh 10vw;
    text-align: left;  /* Возврат к left на lg+ */
  }
}

@media (min-width: 1920px) {
  .case-item {
    max-width: 1440px;
    padding: 2vh 0;
  }
}

.case-heading {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

@media (max-width: 899px) {
  .case-heading {
    align-items: center;  /* Центрирование на мобильных */
  }
}

.case-heading-top {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(16px, 4vw, 40px);
  flex-direction: column;  /* Column на мобильных */
}

@media (min-width: 900px) {
  .case-heading-top {
    flex-direction: row;  /* Row на десктопе */
    align-items: center;
  }
}

.case-title {
  margin: 0;
  text-align: left;
  max-width: 100%;
  font-size: clamp(20px, 4vw, 32px);  /* Адаптивный размер */
}

@media (min-width: 900px) {
  .case-title {
    max-width: 560px;
  }
}

@media (max-width: 899px) {
  .case-title {
    text-align: center;
  }
}

.case-subtitle {
  margin: 0;
  font-size: clamp(14px, 1.6vw, 16px);
  text-align: left;
  max-width: 100%;
}

@media (min-width: 900px) {
  .case-subtitle {
    max-width: 480px;
  }
}

@media (max-width: 899px) {
  .case-subtitle {
    text-align: center;
  }
}

.video-wrapper {
  padding: clamp(8px, 1.4vw, 12px);
  border-radius: clamp(12px, 2vw, 20px);
  width: 100%;
  aspect-ratio: 1662 / 1080;
}

.replay-button {
  width: clamp(48px, 12vw, 80px);
  height: clamp(48px, 12vw, 80px);
}

.replay-button svg {
  width: clamp(24px, 6vw, 40px);
  height: clamp(24px, 6vw, 40px);
}
</style>
```

**Задачи:**
- ✅ Адаптировать padding для всех брейкпоинтов
- ✅ Переключить layout кнопки (column на мобильных)
- ✅ Центрировать текст на sm/xs
- ✅ Адаптировать font-size заголовков
- ✅ Адаптировать video-wrapper и replay-button
- ✅ Добавить max-width для xxl экранов

---

## Фаза 6: Case Page (Страница кейса)

### 6.1 CasePage.vue

**Файл:** `src/pages/case-page/CasePage.vue`

**Текущее состояние:**
- `.case-page-back`: top: 48px, left: 48px
- Media query только для 768px

**Целевое состояние:**

| Брейкпоинт | Top | Left |
|------------|-----|------|
| xs (360-599) | 16px | 16px |
| sm (600-899) | 24px | 24px |
| md (900-1199) | 32px | 32px |
| lg+ (≥1200) | 48px | 48px |

**Изменения в коде:**

```vue
<style scoped>
.case-page-back {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
}

@media (min-width: 600px) {
  .case-page-back {
    top: 24px;
    left: 24px;
  }
}

@media (min-width: 900px) {
  .case-page-back {
    top: 32px;
    left: 32px;
  }
}

@media (min-width: 1200px) {
  .case-page-back {
    top: 48px;
    left: 48px;
  }
}
</style>
```

**Задачи:**
- ✅ Обновить positioning для всех брейкпоинтов
- ✅ Удалить старый media query для 768px

---

### 6.2 Process.vue (и аналогичные секции)

**Файл:** `src/pages/case1-page/case1/Process.vue`

**Текущее состояние:**
- Padding: 80px 48px 48px
- Max-width: 900px (фиксированный)
- Одна media query для 768px

**Целевое состояние:**

| Брейкпоинт | Padding | Max-width | Text align |
|------------|---------|-----------|------------|
| xs (360-599) | 48px 16px 24px | 100% | left |
| sm (600-899) | 60px 24px 32px | 100% | left |
| md (900-1199) | 72px 32px 40px | 680px | center |
| lg (1200-1599) | 80px 48px 48px | 960px | left |
| xl+ (≥1600) | 96px 60px 60px | 1140px | left |

**Изменения в коде:**

```vue
<style scoped>
.case1-process {
  width: 100vw;
  min-height: 100vh;
  background: #171717;
  padding: 48px 16px 24px;  /* xs базовое */
  padding-bottom: max(24px, env(safe-area-inset-bottom));  /* Safe area */
}

@media (min-width: 600px) {
  .case1-process {
    padding: 60px 24px 32px;
    padding-bottom: max(32px, env(safe-area-inset-bottom));
  }
}

@media (min-width: 900px) {
  .case1-process {
    padding: 72px 32px 40px;
    padding-bottom: max(40px, env(safe-area-inset-bottom));
  }
}

@media (min-width: 1200px) {
  .case1-process {
    padding: 80px 48px 48px;
    padding-bottom: max(48px, env(safe-area-inset-bottom));
  }
}

@media (min-width: 1600px) {
  .case1-process {
    padding: 96px 60px 60px;
    padding-bottom: max(60px, env(safe-area-inset-bottom));
  }
}

.markdown-content {
  max-width: 100%;
  margin: 0 auto;
  color: #ffffff;
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

@media (min-width: 1600px) {
  .markdown-content {
    max-width: 1140px;
  }
}

/* Typography адаптация */
.markdown-content :deep(h1) {
  font-size: clamp(28px, 6vw, 48px);
  margin-bottom: clamp(24px, 4vh, 32px);
}

.markdown-content :deep(h2) {
  font-size: clamp(22px, 4vw, 32px);
  margin-top: clamp(32px, 6vh, 48px);
  margin-bottom: clamp(16px, 3vh, 24px);
}

.markdown-content :deep(h3) {
  font-size: clamp(18px, 3vw, 24px);
  margin-top: clamp(24px, 4vh, 32px);
  margin-bottom: clamp(12px, 2vh, 16px);
}

.markdown-content :deep(p) {
  font-size: clamp(14px, 1.6vw, 16px);
  line-height: var(--lh-body);
  margin-bottom: clamp(12px, 2vh, 16px);
  max-width: 70ch;  /* Ограничение длины строки */
}

.markdown-content :deep(li) {
  font-size: clamp(14px, 1.6vw, 16px);
  line-height: var(--lh-body);
}
</style>
```

**Задачи:**
- ✅ Адаптировать padding для всех брейкпоинтов
- ✅ Добавить safe-area-inset-bottom
- ✅ Адаптировать max-width контента
- ✅ Обновить типографику на clamp()
- ✅ Добавить max-width: 70ch для параграфов
- ✅ Применить аналогичные изменения к Task.vue, Results.vue, Summary.vue

---

## Фаза 7: Typography global refinement

### 7.1 Финальная адаптация типографики

**Файл:** `src/styles/typography.css`

**Полный обновленный код:**

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");

:root {
  --font-family-base: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Adaptive font sizes */
  --font-size-h1: clamp(28px, 5vw, 64px);
  --font-size-h2: clamp(24px, 4vw, 48px);
  --font-size-h3: clamp(20px, 3vw, 32px);
  --font-size-h4: clamp(18px, 2.5vw, 24px);
  --font-size-h5: clamp(16px, 2vw, 20px);
  --font-size-h6: clamp(14px, 1.8vw, 18px);

  /* Line-heights (адаптируются через tokens.css) */
  --line-height-tight: 1.15;
  --line-height-snug: 1.25;
  --line-height-relaxed: 1.45;
}

/* Заголовки */
h1, .h1 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0;
}

h2, .h2 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h2);
  line-height: var(--line-height-snug);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0;
}

h3, .h3 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-h3);
  line-height: var(--line-height-snug);
  color: var(--color-text-primary);
  margin: 0;
}

h4, .h4 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-h4);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  margin: 0;
}

h5, .h5 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-h5);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  margin: 0;
}

h6, .h6 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-h6);
  line-height: var(--line-height-relaxed);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Body текст */
p {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: clamp(14px, 1.6vw, 16px);
  line-height: var(--lh-body);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 70ch;
}

.body1 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: clamp(20px, 3vw, 32px);
  line-height: 1.45;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Адаптация line-height для больших экранов */
@media (min-width: 900px) {
  :root {
    --line-height-relaxed: 1.5;
  }
}

@media (min-width: 1200px) {
  :root {
    --line-height-relaxed: 1.55;
  }
}
```

**Задачи:**
- ✅ Обновить все font-size на clamp()
- ✅ Добавить max-width: 70ch для параграфов
- ✅ Адаптировать line-height через media queries
- ✅ Обеспечить переносы заголовков на мобильных

---

## Фаза 8: Safe areas и accessibility

### 8.1 Mobile safe areas

**Элементы требующие safe-area:**
- Footer
- Fixed bottom buttons
- Keypad clear button
- Mobile navigation overlay
- Case page sections (bottom padding)

**Паттерн применения:**

```css
.element-with-bottom-padding {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.element-with-full-safe-areas {
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}
```

**Файлы для обновления:**
- `src/components/keypad/Keypad.vue` - .keypad-clear-button
- `src/components/page-navigation/PageNavigation.vue` - .nav-overlay-menu
- `src/components/app-footer/AppFooter.vue` - footer элемент
- `src/pages/case1-page/case1/Process.vue` - .case1-process

**Задачи:**
- ✅ Добавить safe-area-inset для всех bottom элементов
- ✅ Протестировать на реальных устройствах с notch
- ✅ Убедиться что контент не перекрывается системными элементами

---

### 8.2 Touch targets и accessibility

**Требования:**
- Минимальный размер touch target: 44×44pt
- Минимальный отступ между интерактивными элементами: 8px
- Все интерактивные элементы должны иметь aria-labels
- Keyboard navigation для всех интерактивных элементов

**Проверка и исправление:**

| Компонент | Текущий size | Требуемый | Статус |
|-----------|--------------|-----------|--------|
| KeypadButton (xs) | 72×72px | ≥44×44pt | ✅ OK |
| IntroRectangle (xs) | 80×80px | ≥44×44pt | ✅ OK |
| NavigationChevron | проверить | ≥44×44pt | ⚠️ Проверить |
| nav-toggle (mobile) | 48×48px | ≥44×44pt | ✅ OK |
| replay-button (xs) | 48×48px | ≥44×44pt | ✅ OK |

**Задачи:**
- ✅ Проверить все кликабельные элементы
- ✅ Добавить aria-labels где отсутствуют
- ✅ Обеспечить keyboard navigation
- ✅ Добавить focus-visible стили
- ✅ Протестировать с screen reader

---

## Фаза 9: Container Queries (прогрессивное улучшение)

### 9.1 Применение container queries для независимых компонентов

**Кандидаты для container queries:**
- CaseItem.vue - адаптация по ширине секции
- Card компоненты (если появятся)
- Modal/Dialog компоненты

**Пример для CaseItem.vue:**

```vue
<style scoped>
.case-item {
  container-type: inline-size;
  container-name: case-card;
  /* остальные стили */
}

/* Container queries вместо media queries */
@container case-card (min-width: 600px) {
  .case-heading-top {
    flex-direction: row;
  }
}

@container case-card (min-width: 900px) {
  .case-title {
    max-width: 560px;
  }
}
```

**Задачи:**
- ✅ Добавить `container-type: inline-size` для подходящих компонентов
- ✅ Заменить media queries на @container где уместно
- ✅ Обеспечить fallback для браузеров без поддержки
- ✅ Протестировать в разных браузерах

---

## Фаза 10: Testing & Performance

### 10.1 Обновление E2E тестов

**Файл:** `tests/e2e/scenarios/interaction-performance.js`

**Добавить тесты для viewport размеров:**

```javascript
const viewportSizes = [
  { width: 375, height: 667, name: 'iPhone SE' },
  { width: 390, height: 844, name: 'iPhone 13' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1024, height: 768, name: 'iPad Landscape' },
  { width: 1440, height: 900, name: 'Desktop' },
  { width: 1920, height: 1080, name: 'Large Desktop' },
];

for (const viewport of viewportSizes) {
  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height
  });

  // Run performance tests
  await runInteractionTests();
}
```

**Задачи:**
- ✅ Добавить multi-viewport тестирование
- ✅ Проверить performance на каждом брейкпоинте
- ✅ Убедиться что GeBackground не деградирует на мобильных
- ✅ Проверить touch interactions на мобильных viewport

---

### 10.2 Performance оптимизации

**Оптимизации для мобильных:**

1. **Условная загрузка эффектов:**
```javascript
// В компонентах с тяжелыми эффектами
const isMobile = window.innerWidth < 900;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const shouldUseHeavyEffects = !isMobile && !reduceMotion;
```

2. **Media queries для prefers-reduced-motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

3. **Lazy loading для мобильных:**
```vue
<template>
  <component
    :is="isMobile ? 'div' : GeBackground"
    v-bind="backgroundProps"
  />
</template>
```

**Задачи:**
- ✅ Добавить условную загрузку для тяжелых эффектов
- ✅ Реализовать prefers-reduced-motion
- ✅ Оптимизировать изображения для разных DPI
- ✅ Проверить bundle size после изменений
- ✅ Измерить FPS на мобильных устройствах

---

## Фаза 11: Документация

### 11.1 Создание RESPONSIVE.md

**Файл:** `RESPONSIVE.md`

**Содержание:**
- Обзор адаптивной системы
- Брейкпоинты и их использование
- Дизайн-токены и переменные
- Примеры использования
- Container queries guidelines
- Accessibility checklist
- Testing procedures

**Задачи:**
- ✅ Создать comprehensive документацию
- ✅ Добавить примеры кода
- ✅ Описать все брейкпоинты
- ✅ Документировать дизайн-токены

---

### 11.2 Обновление CLAUDE.md

**Файл:** `CLAUDE.md`

**Добавить секцию:**

```markdown
## Responsive Design System

### Breakpoints
- xs: 360px - Mobile small
- sm: 600px - Mobile large
- md: 900px - Tablet
- lg: 1200px - Desktop
- xl: 1600px - Large desktop
- xxl: 1920px - Extra large desktop

### Design Tokens
All design tokens are defined in `src/styles/tokens.css` and include:
- Spacing scale (--space-*)
- Container gutters (--container-gutter)
- Typography scale (--font-size-*)
- Interactive zones (--tap-min)

### Mobile-First Approach
All components use mobile-first methodology. Start with mobile styles and enhance for larger screens using min-width media queries.

### Key Files
- `src/styles/tokens.css` - Design tokens
- `src/styles/typography.css` - Typography system
- `src/styles/utilities.css` - CSS utilities
- `RESPONSIVE.md` - Full responsive documentation
```

**Задачи:**
- ✅ Обновить CLAUDE.md с responsive информацией
- ✅ Добавить ссылки на ключевые файлы
- ✅ Документировать подход к адаптиву

---

## Deliverables (Итоговые результаты)

### Новые файлы:
1. ✅ `src/styles/tokens.css` - дизайн-токены
2. ✅ `src/styles/utilities.css` - CSS-утилиты
3. ✅ `RESPONSIVE.md` - документация по адаптиву
4. ✅ `RESPONSIVE_PLAN.md` - этот план (для референса)

### Обновленные файлы:

**Стили:**
- ✅ `src/styles/typography.css` - адаптивная типографика
- ✅ `src/style.css` - импорты новых файлов

**Keypad:**
- ✅ `src/components/keypad/Keypad.vue`
- ✅ `src/components/keypad/KeypadButton.vue`

**Main Page:**
- ✅ `src/pages/main-page/intro/Intro.vue`
- ✅ `src/pages/main-page/intro/IntroRectangle.vue`
- ✅ `src/pages/main-page/cases/CaseItem.vue`

**Navigation:**
- ✅ `src/components/page-navigation/PageNavigation.vue`
- ✅ `src/components/page-navigation/NavigationItem.vue`

**Case Pages:**
- ✅ `src/pages/case-page/CasePage.vue`
- ✅ `src/pages/case1-page/case1/Process.vue`
- ✅ `src/pages/case1-page/case1/Task.vue`
- ✅ `src/pages/case1-page/case1/Results.vue`
- ✅ `src/pages/case1-page/case1/Summary.vue`
- ✅ Аналогично для case2 и case3

**Tests:**
- ✅ `tests/e2e/scenarios/interaction-performance.js`
- ✅ `tests/e2e/helpers/viewport-tests.js` (новый)

**Documentation:**
- ✅ `CLAUDE.md` - обновления
- ✅ `RESPONSIVE.md` - новая документация

---

## Порядок выполнения (Рекомендуемый)

1. **Старт:** Фаза 1 (Инфраструктура) - закладываем фундамент
2. **Далее:** Фаза 2 (Keypad) - самый простой компонент для тестирования
3. **Потом:** Фаза 7 (Typography) - применяем глобально
4. **Затем:** Фаза 3 (Intro) - сложная логика с rectangles
5. **После:** Фаза 4 (Navigation) - требует новых компонентов
6. **Далее:** Фаза 5 (Cases) - множество элементов
7. **Потом:** Фаза 6 (Case Pages) - применяем паттерны
8. **Затем:** Фаза 8 (Safe areas) - финальные штрихи
9. **После:** Фаза 9 (Container queries) - прогрессивное улучшение
10. **Финал:** Фазы 10-11 (Testing + Docs) - закрепляем результат

---

## Критерии приемки

### Функциональные:
- ✅ Все компоненты адаптируются на всех брейкпоинтах (360px - 1920px+)
- ✅ Navigation переключается на mobile версию на sm/xs
- ✅ Rectangles переключаются на 2×2 grid на sm/xs
- ✅ Все touch targets ≥44×44pt
- ✅ Safe areas применены где необходимо

### Визуальные:
- ✅ Текст читаем на всех размерах экрана
- ✅ Элементы не перекрываются
- ✅ Spacing консистентен
- ✅ Typography масштабируется плавно

### Performance:
- ✅ Нет деградации производительности на мобильных
- ✅ FPS ≥30 на всех брейкпоинтах
- ✅ GeBackground работает корректно на мобильных

### Accessibility:
- ✅ Все интерактивные элементы доступны с клавиатуры
- ✅ Aria-labels присутствуют
- ✅ Screen reader навигация работает
- ✅ Focus-visible стили применены

### Testing:
- ✅ E2E тесты проходят на всех viewport размерах
- ✅ Performance тесты показывают приемлемые результаты
- ✅ Ручное тестирование на реальных устройствах

---

## Риски и митигация

| Риск | Вероятность | Воздействие | Митигация |
|------|-------------|-------------|-----------|
| GeBackground деградирует на мобильных | Высокая | Критическое | Условная загрузка, fallback |
| Container queries не поддерживаются | Средняя | Среднее | Graceful degradation, fallback на media queries |
| Слишком много брейкпоинтов | Низкая | Среднее | Использовать clamp() где возможно |
| Performance падает на слабых устройствах | Средняя | Высокое | CPU throttling тесты, оптимизация |

---

## Следующие шаги после завершения

1. **A/B тестирование** - сравнить метрики до/после
2. **User testing** - получить feedback на реальных устройствах
3. **Analytics** - отслеживать bounce rate по viewport размерам
4. **Optimization** - дальнейшая оптимизация узких мест
5. **Documentation** - поддерживать документацию актуальной

---

**Дата создания:** 2025-10-09
**Версия:** 1.0
**Статус:** Планирование завершено, готово к реализации
