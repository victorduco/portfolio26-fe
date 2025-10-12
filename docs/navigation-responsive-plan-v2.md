# Navigation Mobile - План реализации

**Статус:** 🔴 Не начато  
**Дата:** 2025-10-11

---

## Целевое поведение

**Desktop (≥900px):** текущее поведение без изменений

**Mobile (<900px):**

- Кнопка-иконка (бургер/меню) в верхнем правом углу
- При нажатии → выпадающий dropdown overlay с вертикальным списком опций
- Опции: тот же контент (текст + иконка), увеличенные размеры для тапа (44px min height)
- При выборе → закрывается и скроллит к секции
- Overlay поверх всего (z-index: 9999)

---

## План реализации

### Шаг 1: useMediaQuery composable

**Файл:** `src/composables/useMediaQuery.js`

```js
// Добавить breakpoint для navigation (900px - граница из дизайн-системы)
export const NAVIGATION_MOBILE = "(max-width: 899px)";
```

---

### Шаг 2: PageNavigation.vue - добавить mobile состояние

**Логика:**

1. Импортировать `useMediaQuery` и константу `NAVIGATION_MOBILE`
2. Добавить `const isMobile = useMediaQuery(NAVIGATION_MOBILE)`
3. Добавить `const isMenuOpen = ref(false)`
4. Функция `toggleMenu()` для открытия/закрытия меню
5. Обновить `handleNavigate` - на mobile должен закрывать меню после навигации
6. **Отключить intro animation на mobile**: `enableIntroAnimation` должен быть `false` если `isMobile.value === true`

**Template структура:**

```vue
<template>
  <!-- Desktop версия (текущая) -->
  <nav v-if="!isMobile" class="page-navigation">
    <NavigationItem ... />
  </nav>

  <!-- Mobile версия -->
  <div v-else class="page-navigation-mobile">
    <!-- Кнопка-иконка -->
    <button
      class="menu-toggle"
      @click="toggleMenu"
      aria-label="Navigation menu"
      :aria-expanded="isMenuOpen"
    >
      <img src="@/assets/icons/menu.svg" alt="" />
    </button>

    <!-- Dropdown overlay -->
    <Transition name="dropdown">
      <div
        v-if="isMenuOpen"
        class="menu-overlay"
        @click.self="toggleMenu"
        @keydown.escape="toggleMenu"
      >
        <nav class="menu-dropdown">
          <NavigationItem
            v-for="(section, index) in sections"
            :key="section.id"
            :label="section.label"
            :section-id="section.id"
            :is-active="activeSection === section.id"
            :icon="section.icon"
            :mobile-mode="true"
            @navigate="handleMobileNavigate"
          />
        </nav>
      </div>
    </Transition>
  </div>
</template>
```

**Функции:**

```js
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function handleMobileNavigate(sectionId) {
  isMenuOpen.value = false; // закрываем меню
  handleNavigate(sectionId); // существующая логика скролла
}

// В onMounted - отключить intro на mobile
onMounted(() => {
  setupIntersectionObserver();

  const shouldRunIntro = props.enableIntroAnimation && !isMobile.value;

  if (shouldRunIntro) {
    setTimeout(() => {
      startIntroAnimation();
    }, 250);
  } else {
    // Без анимации
    introHighlightIndex.value = -1;
    introGreenIndex.value = -1;
    introFadeOutIndex.value = -1;
    activeSection.value = props.sections[0]?.id || "";
    introFinished.value = true;

    setTimeout(() => {
      emit("animationComplete");
    }, 0);
  }
});
```

---

### Шаг 3: NavigationItem.vue - mobile режим

**Добавить prop:**

```js
mobileMode: {
  type: Boolean,
  default: false
}
```

**Изменения в template:**

- В mobile режиме label всегда видимый (не через hover)
- Не применяем intro анимацию в mobile режиме

**Изменения в стилях:**

```css
/* Mobile версия */
.nav-item-wrapper.mobile {
  width: 100%;
  justify-content: flex-start;
  padding: var(--space-md) var(--space-lg); /* используем токены */
  min-height: var(--tap-min, 44px); /* минимум для touch target */
  gap: var(--space-sm);
}

.mobile .nav-item-label {
  opacity: 1;
  position: static;
  font-size: 16px; /* увеличенный для mobile */
}

.mobile .nav-item {
  order: -1; /* индикатор слева от текста */
  width: 12px;
  height: 12px;
}

.mobile .nav-item-icon {
  width: 20px;
  height: 20px;
}

/* Touch feedback на mobile */
.mobile.nav-item-wrapper:active {
  background: rgba(255, 255, 255, 0.05);
}

/* Focus state для accessibility */
.nav-item-wrapper:focus-visible {
  outline: 2px solid rgba(39, 169, 255, 0.8);
  outline-offset: 4px;
  border-radius: 4px;
}
```

**Условие в computed/methods:**

```js
function getAnimationState() {
  if (props.mobileMode) {
    // Упрощенная логика для mobile
    if (isPressed.value) return "pressed";
    if (props.isActive) return "active";
    return "default";
  }
  // Существующая логика для desktop
  // ...
}
```

---

### Шаг 4: Стили PageNavigation.vue

**Mobile кнопка:**

```css
.page-navigation-mobile {
  position: fixed;
  top: var(--space-lg); /* используем токены */
  right: var(--space-lg);
  z-index: 100; /* высокий z-index для кнопки */
}

.menu-toggle {
  width: var(--tap-min, 44px); /* минимум для touch target */
  height: var(--tap-min, 44px);
  border-radius: 8px;
  background: rgba(20, 20, 20, 0.9); /* без backdrop-filter */
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease; /* быстрый transition */
}

.menu-toggle:hover {
  background: rgba(20, 20, 20, 1);
  border-color: rgba(255, 255, 255, 0.2);
}

.menu-toggle:focus-visible {
  outline: 2px solid rgba(39, 169, 255, 0.8);
  outline-offset: 4px;
}

.menu-toggle img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}
```

**Overlay + dropdown:**

```css
.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999; /* максимальный z-index для overlay */
  display: flex;
  justify-content: flex-end;
  padding: 80px var(--space-lg) var(--space-lg);
  padding-bottom: max(
    var(--space-lg),
    env(safe-area-inset-bottom)
  ); /* iOS safe area */
}

.menu-dropdown {
  background: rgba(20, 20, 20, 0.95); /* без backdrop-filter */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--space-sm) 0;
  max-width: 280px;
  width: 100%;
  max-height: 100dvh; /* используем dvh вместо vh */
  max-height: calc(100dvh - 120px);
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

**Transitions:**

```css
/* Быстрые transitions для mobile (0.2s) */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}

.dropdown-enter-active .menu-dropdown,
.dropdown-leave-active .menu-dropdown {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dropdown-enter-from .menu-dropdown {
  transform: translateY(-16px);
  opacity: 0;
}

.dropdown-leave-to .menu-dropdown {
  transform: translateY(-16px);
  opacity: 0;
}

/* Поддержка prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active,
  .dropdown-enter-active .menu-dropdown,
  .dropdown-leave-active .menu-dropdown {
    transition-duration: 0.01ms;
  }

  .dropdown-enter-from .menu-dropdown,
  .dropdown-leave-to .menu-dropdown {
    transform: none;
  }
}
```

---

### Шаг 5: Иконка меню

**Создать:** `src/assets/icons/menu.svg`

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
```

---

### Шаг 6: Обновить useMediaQuery.js

**Добавить экспорт константы:**

```js
export const NAVIGATION_MOBILE = "(max-width: 899px)";
```

---

## Тестирование

### Функциональность:

1. ✅ При resize на 900px происходит переключение между desktop/mobile
2. ✅ Кнопка меню отображается вверху справа на mobile
3. ✅ При клике на кнопку открывается dropdown
4. ✅ При клике вне dropdown закрывается
5. ✅ При нажатии Escape dropdown закрывается
6. ✅ При выборе пункта меню скролл работает
7. ✅ После скролла меню автоматически закрывается
8. ✅ Active состояние корректно отображается
9. ✅ Intro animation НЕ запускается на mobile

### UI/UX:

1. ✅ Touch targets минимум 44px (используется `--tap-min`)
2. ✅ Dropdown поверх всего контента (z-index: 9999)
3. ✅ Кнопка меню с высоким z-index (100)
4. ✅ Анимация открытия/закрытия плавная (0.2s)
5. ✅ Текст читаемый, иконки видимые
6. ✅ Без backdrop-filter (проблемы на iOS)
7. ✅ Safe area inset для iOS учтен
8. ✅ Используются CSS токены (`--space-*`)

### Accessibility:

1. ✅ `aria-label="Navigation menu"` на кнопке
2. ✅ `aria-expanded` меняется при открытии/закрытии
3. ✅ `@keydown.escape` закрывает меню
4. ✅ `:focus-visible` стили присутствуют
5. ✅ Keyboard navigation работает
6. ✅ `prefers-reduced-motion` поддерживается

### Responsive:

1. ✅ 320px - минимальная ширина
2. ✅ 899px - граница mobile/desktop (не 768px!)
3. ✅ iPad портрет (768px) - mobile версия
4. ✅ iPad landscape (1024px) - desktop версия
5. ✅ Используется `100dvh` вместо `100vh`

### Performance:

1. ✅ После изменений: `npm run test:perf`
2. ✅ Деградация <20% от baseline

---

## Изменяемые файлы

1. ✏️ `src/composables/useMediaQuery.js` - добавить `NAVIGATION_MOBILE`
2. ✏️ `src/components/page-navigation/PageNavigation.vue` - mobile логика + стили
3. ✏️ `src/components/page-navigation/NavigationItem.vue` - prop `mobileMode` + стили
4. ➕ `src/assets/icons/menu.svg` - иконка меню

---

## Критерии приемки

### Функциональность:

- ✅ Desktop версия (≥900px) работает без изменений
- ✅ Mobile версия (<900px) показывает кнопку меню вверху справа
- ✅ Dropdown появляется поверх всего контента (z-index: 9999)
- ✅ Вертикальный список опций с touch targets ≥44px
- ✅ При выборе опции меню закрывается и скроллит к секции
- ✅ При клике вне меню / Escape оно закрывается
- ✅ Active состояние отображается корректно
- ✅ Intro анимация НЕ запускается на mobile

### Стили и токены:

- ✅ Используются CSS токены (`--space-*`, `--tap-min`)
- ✅ Breakpoint 900px (не 768px!)
- ✅ НЕТ backdrop-filter (проблемы на iOS)
- ✅ Safe area inset для iOS (`env(safe-area-inset-bottom)`)
- ✅ Используется `100dvh` вместо `100vh`
- ✅ Transitions 0.2s (быстрые для mobile)
- ✅ `prefers-reduced-motion` поддерживается

### Accessibility:

- ✅ `aria-label="Navigation menu"` на кнопке
- ✅ `aria-expanded` атрибут
- ✅ `:focus-visible` стили
- ✅ Keyboard navigation (Tab, Escape)

### Performance:

- ✅ `npm run test:perf` проходит
- ✅ Деградация <20% от baseline

---

## Время выполнения

**Оценка:** 2-3 часа

- Шаг 1-2: 30 минут (константа + логика PageNavigation)
- Шаг 3: 30 минут (mobile режим NavigationItem)
- Шаг 4-5: 45 минут (стили + иконка)
- Шаг 6: 15 минут (тестирование + fixes)
- Буфер: 30 минут (непредвиденное)
