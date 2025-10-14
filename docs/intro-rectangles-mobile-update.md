# Intro Rectangles - Адаптивное поведение для маленьких экранов

## Обзор изменений

Реализовано специальное fullscreen модальное поведение для intro rectangles на двух наименьших брейкпоинтах (xs: 360px и sm: 600px).

## Ключевые особенности

### Два наименьших брейкпоинта (≤600px)

1. **Fullscreen режим**

   - Rectangle открывается на весь экран (fixed positioning)
   - Остальные rectangles остаются на месте (не сдвигаются)
   - Hover эффект отключен

2. **Интерактивность**

   - Клик на rectangle → открывается fullscreen
   - Клик на backdrop (вне контента) → закрывается
   - Кнопка закрытия (крестик) внизу экрана
   - Клик на другой rectangle → текущий закрывается, новый открывается

3. **Только один активный**
   - Может быть открыт только один rectangle одновременно
   - При открытии нового, предыдущий автоматически закрывается

## Технические детали

### 1. Новый медиа-запрос

```javascript
// src/composables/useMediaQuery.js
export const INTRO_MOBILE_FULLSCREEN = "(max-width: 600px)";
```

### 2. Обновленные компоненты

#### Intro.vue

- Добавлен `isSmallestBreakpoints` composable
- Передается в `IntroRectangle` как prop
- Обновлена логика `handleClickOutside` для поддержки маленьких экранов

#### IntroRectangle.vue

- Новый prop: `isSmallestBreakpoints`
- Обновлена логика `isActive`, `animationState`, `toggleState`
- Отключен hover на маленьких экранах
- Margin сдвиги отключены на маленьких экранах
- CSS классы для маленьких экранов: `.intro-square--smallest`

#### IntroRectangleActive.vue

- Новый prop: `isSmallestBreakpoints`
- Кнопка закрытия показывается на маленьких экранах
- Backdrop click работает на маленьких экранах
- Fullscreen стили через CSS

#### variants.js

- Все варианты (`default`, `hover`, `active`) обновлены
- На маленьких экранах:
  - `hover` = `default` (нет эффекта)
  - `active` = fullscreen без трансформаций
  - Отключены сдвиги (margins, y, rotate)

### 3. CSS изменения

**IntroRectangle.vue:**

```css
@media (max-width: 600px) {
  .intro-square--smallest.is-intro-visible:hover {
    z-index: 5; /* Отключаем hover z-index */
  }

  .intro-square--smallest-active {
    position: relative;
  }
}
```

**IntroRectangleActive.vue:**

```css
@media (max-width: 600px) {
  .intro-active-diamond--smallest {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    z-index: 10010;
  }

  .intro-active-content--smallest {
    padding: 32px 20px 64px;
    max-width: 100%;
  }

  .intro-active-close {
    width: 56px;
    height: 56px;
    bottom: max(32px, env(safe-area-inset-bottom));
  }
}
```

## Поведение на разных брейкпоинтах

| Брейкпоинт      | Поведение        | Hover              | Active          | Close Button |
| --------------- | ---------------- | ------------------ | --------------- | ------------ |
| ≤600px (xs, sm) | Fullscreen modal | ❌ Отключен        | ✅ Fullscreen   | ✅ Виден     |
| 601-899px (md)  | Mobile layout    | ❌ Отключен        | ✅ Увеличение   | ✅ Виден     |
| ≥900px          | Desktop          | ✅ Масштабирование | ✅ Поворот+рост | ❌ Скрыт     |

## Важно!

- **Изоляция логики**: Вся новая логика применяется ТОЛЬКО на двух наименьших брейкпоинтах
- **Не влияет на desktop**: Остальные брейкпоинты работают как прежде
- **Один активный**: Только один rectangle может быть открыт одновременно
- **Не сдвигает другие**: Активация rectangle не влияет на положение остальных

## Тестирование

Проверить на экранах:

- 360px (iPhone SE)
- 375px (iPhone 12/13/14)
- 390px (iPhone 14 Pro)
- 414px (iPhone 14 Plus)
- 600px (граница)

### Чек-лист

- [ ] Клик открывает fullscreen
- [ ] Клик на backdrop закрывает
- [ ] Кнопка закрытия работает
- [ ] Клик на другой закрывает текущий и открывает новый
- [ ] Другие rectangles не сдвигаются
- [ ] На 601px+ работает по-старому
