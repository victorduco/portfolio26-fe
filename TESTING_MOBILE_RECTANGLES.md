# Тестирование Intro Rectangles Mobile

## Как тестировать

1. Открой http://localhost:5174/ в браузере
2. Открой DevTools (F12 или Cmd+Option+I)
3. Включи режим устройства (Device Mode / Responsive Design Mode)
4. Прокрути вниз к секции Intro (с квадратами)

## Что проверять

### На ≤600px (xs, sm - два наименьших брейкпоинта)

**Ожидаемое поведение:**

- ✅ Клик на rectangle → открывается fullscreen модалка
- ✅ Модалка занимает весь экран (position: fixed)
- ✅ Кнопка закрытия (крестик) видна внизу
- ✅ Клик на backdrop (вне контента) → закрывается
- ✅ Клик на кнопку закрытия → закрывается
- ✅ Клик на другой rectangle → текущий закрывается, новый открывается
- ✅ Остальные rectangles НЕ сдвигаются при открытии
- ✅ Hover эффект отключен

**Экраны для теста:**

- 360px (iPhone SE)
- 375px (iPhone 12/13/14)
- 390px (iPhone 14 Pro)
- 414px (iPhone 14 Plus)
- 600px (граница)

### На 601-899px (md - мобильный)

**Ожидаемое поведение:**

- ✅ Rectangles увеличиваются при клике
- ✅ Кнопка закрытия видна
- ✅ НЕ fullscreen (как раньше)
- ✅ Hover отключен

### На ≥900px (desktop)

**Ожидаемое поведение:**

- ✅ Hover эффект работает
- ✅ Active с поворотом на 45°
- ✅ Rectangles сдвигаются влево
- ✅ Кнопка закрытия НЕ видна
- ✅ Работает как раньше

## Проверка через Console

Открой консоль браузера и выполни:

```javascript
// Проверить текущее состояние
console.log({
  width: window.innerWidth,
  isSmallest: window.innerWidth <= 600,
  isMobile: window.innerWidth <= 899,
});

// Посмотреть CSS переменные (если есть активный rectangle)
const el = document.querySelector(".intro-square--smallest-active");
if (el) {
  console.log("Active smallest rectangle found:", el);
  console.log("Computed styles:", getComputedStyle(el));
}

// Проверить IntroRectangleActive
const active = document.querySelector(".intro-active-diamond--smallest");
if (active) {
  console.log("Active diamond found:", active);
  console.log("Position:", getComputedStyle(active).position);
  console.log("Width:", getComputedStyle(active).width);
  console.log("Height:", getComputedStyle(active).height);
}

// Проверить кнопку закрытия
const closeBtn = document.querySelector(".intro-active-close");
if (closeBtn) {
  console.log("Close button found:", closeBtn);
  console.log("Display:", getComputedStyle(closeBtn).display);
}
```

## Возможные проблемы

### Проблема: Кнопка закрытия не видна

**Решение:** Убедись что ширина экрана ≤899px

### Проблема: Rectangles сдвигаются на маленьких экранах

**Решение:** Проверь что `isSmallestBreakpoints` prop передается корректно

### Проблема: Fullscreen не работает на ≤600px

**Решение:** Проверь медиа-запрос в CSS `@media (max-width: 600px)`

### Проблема: Логика не применяется

**Решение:**

1. Перезагрузи страницу (Cmd/Ctrl + Shift + R)
2. Очисти кеш браузера
3. Проверь что dev server запущен на правильном порту
4. Посмотри консоль на ошибки

## Debug Vue Component

```javascript
// В консоли браузера найди Vue instance
const app = document.querySelector("#app").__vueParentComponent;

// Посмотри props IntroRectangle
const introRect = document.querySelector(".intro-square").__vueParentComponent;
console.log({
  isMobileLayout: introRect.props.isMobileLayout,
  isSmallestBreakpoints: introRect.props.isSmallestBreakpoints,
  activeMobileIndex: introRect.props.activeMobileIndex,
  isActive: introRect.setupState.isActive,
});
```

## Live Reload

Если изменения не применяются:

1. Сохрани файл (Cmd/Ctrl + S)
2. Подожди HMR (Hot Module Reload) в консоли Vite
3. Если не помогает - hard refresh (Cmd/Ctrl + Shift + R)
