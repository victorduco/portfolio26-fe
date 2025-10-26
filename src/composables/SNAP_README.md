# Lenis Snap Configuration Guide

Централизованная система управления snap точками и зонами для плавного скролла.

## 📁 Структура

- **[snapConfig.js](./snapConfig.js)** - Конфигурация всех snap точек и зон
- **[useLenis.js](./useLenis.js)** - Логика Lenis + интеграция с GSAP

---

## 🎯 Быстрый старт

### 1. Базовая настройка snap точек

Редактируйте `snapConfig.js`:

```js
// Глобальные настройки snap
global: {
  type: "proximity",         // mandatory, proximity, lock
  distanceThreshold: "50%",  // Зона срабатывания
  debounce: 200,            // Задержка перед snap (ms)
}
```

### 2. Добавить секцию для snap

```js
anchors: [
  {
    id: "intro",           // ID элемента в DOM
    align: "start",        // start, center, end, ['start', 'end']
    enabled: true,         // Включить/выключить
  },
]
```

### 3. Создать зону без snap

```js
noSnapZones: [
  {
    name: "Case1 middle animation",
    elementId: "case1",
    startPercent: 0.1,  // Начало зоны (10% от высоты элемента)
    endPercent: 0.9,    // Конец зоны (90% от высоты элемента)
    enabled: true,
  },
]
```

---

## 📋 Типы snap точек

### 1. **Anchors** - Основные секции

Snap к началу/концу/центру элемента:

```js
{
  id: "case1",
  align: ["start", "end"],  // Snap и к началу, и к концу
  enabled: true,
}
```

**Варианты `align`:**
- `"start"` - snap к началу элемента
- `"center"` - snap к центру элемента
- `"end"` - snap к концу элемента
- `["start", "end"]` - snap и к началу, и к концу (2 точки)

### 2. **No-Snap Zones** - Зоны без snap

Отключить snap в определённой области элемента:

```js
{
  name: "Case2 GSAP animation zone",
  elementId: "case2",
  startPercent: 0.15,  // 15% от верха элемента
  endPercent: 0.85,    // 85% от верха элемента
  enabled: true,
}
```

**Зачем нужно:** Позволяет GSAP ScrollTrigger работать свободно внутри элемента.

### 3. **Progress Snaps** - Snap по прогрессу GSAP анимации

Snap к конкретному моменту в GSAP timeline:

```js
{
  name: "Case1 - line fully expanded",
  elementId: "case1",
  scrollTriggerId: "TL1",  // ID ScrollTrigger из GSAP
  progress: 0.5,           // 50% анимации
  enabled: true,           // Включить для активации
}
```

**Как использовать:**

1. В GSAP анимации добавьте ID:
```js
// case1-gsap-animations.js
const tl1 = gsap.timeline({
  scrollTrigger: {
    id: "TL1",  // ← Этот ID
    trigger: section1,
    // ...
  }
})
```

2. В snapConfig.js укажите этот ID и progress
3. Включите `enabled: true`
4. Вызовите `registerProgressSnaps()` ПОСЛЕ инициализации GSAP

### 4. **Trigger Snaps** - Snap по позициям ScrollTrigger

Snap к конкретным маркерам ScrollTrigger:

```js
{
  name: "Case1 - Pin start",
  elementId: "case1",
  triggerType: "start",      // start, center, end
  align: "top top",          // ScrollTrigger синтаксис
  enabled: false,
}
```

---

## 🔧 Адаптивность

### Разные настройки для разных экранов

```js
responsiveZones: {
  mobile: {
    noSnapZones: [
      {
        elementId: "case1",
        startPercent: 0.05,  // Меньше зона на мобильных
        endPercent: 0.95,
      }
    ]
  },
  desktop: {
    noSnapZones: [
      {
        elementId: "case1",
        startPercent: 0.15,  // Больше зона на десктопе
        endPercent: 0.85,
      }
    ]
  }
}
```

Автоматически применяется в зависимости от ширины экрана:
- **mobile**: < 768px
- **tablet**: 768px - 1024px
- **desktop**: > 1024px

---

## 🚀 Использование в коде

### В MainPage.vue (или другом компоненте)

```js
import { useLenis } from '@/composables/useLenis.js'

const { registerSnapPoints, registerProgressSnaps } = useLenis()

onMounted(() => {
  // 1. Зарегистрировать основные anchor точки
  registerSnapPoints()

  // 2. (Опционально) Зарегистрировать progress snaps
  // ВАЖНО: вызывать ПОСЛЕ инициализации GSAP анимаций
  nextTick(() => {
    registerProgressSnaps()
  })
})
```

### Динамическое управление

```js
import { useLenis } from '@/composables/useLenis.js'

const { start, stop, scrollTo } = useLenis()

// Отключить snap
stop()

// Включить snap
start()

// Скроллить к элементу
scrollTo('#case2', { duration: 1.5 })
```

---

## 📊 Примеры конфигураций

### Пример 1: Строгий snap везде

```js
global: {
  type: "mandatory",  // Всегда снапит
  debounce: 50,       // Быстрый snap
}
```

### Пример 2: Мягкий snap с большими зонами

```js
global: {
  type: "proximity",
  distanceThreshold: "80%",  // Большая зона
  debounce: 400,             // Медленный snap
}
```

### Пример 3: Snap только к началу кейсов

```js
anchors: [
  { id: "case1", align: "start", enabled: true },
  { id: "case2", align: "start", enabled: true },
  { id: "case3", align: "start", enabled: true },
]
```

### Пример 4: Полная свобода внутри кейсов

```js
noSnapZones: [
  {
    elementId: "case1",
    startPercent: 0.05,  // Snap только на краях (5% и 95%)
    endPercent: 0.95,
    enabled: true,
  }
]
```

---

## 🐛 Отладка

### Логи в консоли

После загрузки страницы смотрите консоль браузера:

```
✅ Snap: intro (start)
✅ Snap: case1 (start, end)
✅ Snap: case2 (start, end)
🚫 No-snap zones: Case1 middle animation, Case2 middle animation
🎯 Total snap points: 6 | No-snap zones: 3
```

### Включить progress snaps

В `snapConfig.js` измените `enabled: false` → `enabled: true`:

```js
progressSnaps: [
  {
    name: "Case1 - line expanded",
    scrollTriggerId: "TL1",
    progress: 0.5,
    enabled: true,  // ← Включить
  }
]
```

Затем в компоненте:

```js
onMounted(() => {
  registerSnapPoints()

  // Подождать пока GSAP инициализируется
  nextTick(() => {
    registerProgressSnaps()
  })
})
```

---

## ⚙️ Параметры

### Global Settings

| Параметр | Тип | Значения | Описание |
|----------|-----|----------|----------|
| `type` | string | `mandatory`, `proximity`, `lock` | Тип snap поведения |
| `distanceThreshold` | string/number | `"50%"`, `300` | Зона срабатывания snap |
| `debounce` | number | `0-1000` | Задержка перед snap (ms) |

### Anchor Settings

| Параметр | Тип | Значения | Описание |
|----------|-----|----------|----------|
| `id` | string | `"case1"` | ID элемента в DOM |
| `align` | string/array | `"start"`, `["start", "end"]` | Позиция snap точки |
| `enabled` | boolean | `true`, `false` | Включить/выключить |

### No-Snap Zone Settings

| Параметр | Тип | Значения | Описание |
|----------|-----|----------|----------|
| `elementId` | string | `"case1"` | ID элемента |
| `startPercent` | number | `0-1` | Начало зоны (0 = верх, 1 = низ) |
| `endPercent` | number | `0-1` | Конец зоны |
| `enabled` | boolean | `true`, `false` | Включить/выключить |

---

## 📝 Рекомендации

1. **Начните с базовых anchors** - добавьте все основные секции
2. **Настройте no-snap zones** - отключите snap внутри длинных анимаций
3. **Тестируйте на разных экранах** - используйте responsive zones
4. **Progress snaps используйте осторожно** - только для важных моментов
5. **Не перегружайте snap точками** - лучше меньше, но качественнее

---

## 🔗 Связанные файлы

- [snapConfig.js](./snapConfig.js) - Конфигурация
- [useLenis.js](./useLenis.js) - Логика
- [MainPage.vue](../pages/main-page/MainPage.vue) - Использование
- [case1-gsap-animations.js](../pages/main-page/cases/case1-gsap-animations.js) - GSAP триггеры
