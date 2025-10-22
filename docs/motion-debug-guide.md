# Motion Debug Guide

Руководство по использованию `useMotionDebug` для отладки Motion анимаций и скролл-эффектов.

## Установка

Композабл уже создан в `src/composables/useMotionDebug.js`.

## Основное использование

### 1. Базовое логирование с автоматическим отслеживанием

```javascript
import { useMotionDebug } from '@/composables/useMotionDebug.js';
import { useScroll, useTransform } from 'motion-v';

// Настройка Motion
const { scrollYProgress } = useScroll({ target: containerRef });
const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

// Включить логирование
const { logEvent, logValue } = useMotionDebug({
  componentName: 'MyComponent',
  enabled: true,
  scrollProgress: scrollYProgress,
  motionValues: {
    scale,
    opacity,
  },
  throttle: 100, // Логировать максимум раз в 100ms
});
```

### 2. Логирование событий

```javascript
// Логировать произвольные события
logEvent('🎬 Video Started');
logEvent('✨ Animation Complete', { duration: 2000 });
```

### 3. Логирование значений вручную

```javascript
// Логировать конкретные значения
logValue('Current Scale', scale.value);
logValue('Mouse Position', { x: mouseX, y: mouseY });
```

## Утилиты

### logTransforms - Группированный вывод трансформаций

```javascript
import { logTransforms } from '@/composables/useMotionDebug.js';

// Вывести все трансформации одной группой
logTransforms('MyComponent', {
  scale: scaleValue.value,
  opacity: opacityValue.value,
  x: xValue.value,
});
```

### createScrollLogger - Детальное логирование скролла

```javascript
import { createScrollLogger } from '@/composables/useMotionDebug.js';

const { scrollYProgress, scrollVelocity } = useScroll({ target: containerRef });

// Создать детальный логгер скролла
createScrollLogger('MyComponent', {
  scrollProgress: scrollYProgress,
  scrollVelocity,
});
```

Это выводит:
- Процент прогресса скролла
- Направление (⬇️ Down / ⬆️ Up)
- Скорость скролла
- Точное значение прогресса

## Что логируется автоматически

При использовании `useMotionDebug` с `scrollProgress` и `motionValues`:

1. **🚀 Component Mounted** - При монтировании компонента
2. **Scroll Progress** - Прогресс скролла в реальном времени (с throttling)
3. **Motion Values** - Все переданные motion values (с throttling)

## Консольный вывод

Все логи используют цветное форматирование:

- 🔵 **Голубой** - Имя компонента
- 🟡 **Золотой** - События
- 🟢 **Зеленый** - Значения
- 🟣 **Розовый** - Скролл прогресс
- 🟠 **Оранжевый** - Трансформации

## Примеры использования

### Пример 1: Отладка скролл-анимации

```javascript
import { useMotionDebug, logTransforms } from '@/composables/useMotionDebug.js';

const { scrollYProgress } = useScroll({ target: containerRef });
const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

const { logEvent } = useMotionDebug({
  componentName: 'ScrollAnimation',
  scrollProgress: scrollYProgress,
  motionValues: { scale },
});

function handleAnimationComplete() {
  logEvent('✅ Animation Complete');
  logTransforms('ScrollAnimation', {
    finalScale: scale.value,
    scrollProgress: scrollYProgress.value,
  });
}
```

### Пример 2: Отладка Intersection Observer

```javascript
const { logEvent } = useMotionDebug({
  componentName: 'IntersectionComponent',
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    logEvent('👁️ Intersection Change', {
      isIntersecting: entry.isIntersecting,
      intersectionRatio: entry.intersectionRatio,
    });
  });
});
```

### Пример 3: Включение/выключение логирования

```javascript
// В production отключить
const isDev = import.meta.env.DEV;

const { logEvent } = useMotionDebug({
  componentName: 'MyComponent',
  enabled: isDev,
  // ... остальные опции
});
```

## Настройки throttling

По умолчанию логирование throttled до 100ms. Вы можете настроить это:

```javascript
useMotionDebug({
  throttle: 200, // Логировать максимум раз в 200ms
});
```

Для событий (logEvent) throttling не применяется.

## Советы по отладке

1. **Используйте фильтры консоли** - Фильтруйте по имени компонента, например `[Case1ScrollLayout]`
2. **Throttle для производительности** - Увеличьте throttle если логов слишком много
3. **Отключайте в production** - Используйте `enabled: import.meta.env.DEV`
4. **Группируйте трансформации** - Используйте `logTransforms` для вывода нескольких значений сразу

## Что логируется в Case1ScrollLayout

В компоненте Case1ScrollLayout логируются:

- ⚙️ Component Setup Started
- 📜 Scroll Container Found/Not Found
- 👁️ Intersection Change (с деталями)
- 📹 Section Enter - Video Play
- 🚪 Section Leave - Video Pause
- 🔗 Story Link Clicked
- Transform Values (scale, opacity, scrollYProgress)
- 🧹 Component Unmounting

Откройте консоль браузера и скроллите до секции Case1, чтобы увидеть все логи в действии!
