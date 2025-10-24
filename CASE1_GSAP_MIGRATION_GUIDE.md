# Case1.vue: Motion-v → GSAP Migration Guide

Юзай mcp по всем вопросам gsap-master: npx bruzethegreat-gsap-master-mcp-server@latest - ✓ Connected

Работу вести надо в src/pages/main-page/cases/Case1.vue - он уже пустой готов

## ⚠️ КРИТИЧЕСКИ ВАЖНО: Философия миграции

### 🚫 НЕ КОПИРУЙ КОД ИЗ СТАРОГО ФАЙЛА

Бекап `Case1.motionv.vue` - **ТОЛЬКО СПРАВОЧНИК ЗНАЧЕНИЙ** (позиции, размеры, цвета).
**Пиши ВСЕ с нуля GSAP-нативным способом.**
**НЕ переноси старую логику 1 в 1** - это разные подходы к анимациям.

### 🎯 Фиксированное позиционирование = ТОЛЬКО pin: true

**ЗАПРЕЩЕНО использовать CSS `position: fixed`**.
ScrollTrigger с `pin: true` делает это автоматически и правильно.

**УДАЛЯЙ из CSS и логики:**

- `position: fixed` в .animation-stage-wrapper
- Классы `.normal-flow`, `.not-initialized`
- Логику переключения fixed ↔ absolute (isNormalFlow)
- Manual positioning через CSS transform

**Pin сам управляет всем этим - это GSAP way.**

---

## Архитектура решения

### Что есть сейчас (Motion-v)

- 8 стадий анимации при скролле через 600vh
- 4 элемента: text container, mask, line (превращается в кнопку → видео), open story button
- IntersectionObserver для видимости секции
- Реактивные стейты для каждого элемента
- **Manual fixed positioning через CSS** ❌

### Что делаем (GSAP + ScrollTrigger)

- Один мастер Timeline со всеми анимациями
- ScrollTrigger с scrub привязывает timeline к скроллу
- **Pin держит wrapper на экране** - никакого CSS fixed ✅
- Убираем всю реактивность - GSAP управляет стейтом
- Убираем stage-based логику - timeline + progress вместо этого

---

## Шаг 1: Подготовка

### 1.1 Бекап и структура

- Бекап уже есть: `Case1.motionv.vue` - **ТОЛЬКО ДЛЯ СПРАВКИ**
- Работаем в `Case1.vue` - пишем GSAP код с нуля
- GSAP уже установлен (3.13.0 в package.json)

### 1.2 Импорты

Удалить:

```
import { motion, useScroll, useTransform } from "motion-v"
```

Добавить:

```
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
```

Зарегистрировать плагин в onMounted (до создания анимаций)

### 1.3 Очистить template

Заменить все `<motion.div>` на обычные `<div>`
Удалить все пропсы: `:animate`, `:transition`
Оставить `ref`, `class`, `style` атрибуты

---

## Шаг 2: Создать Timeline структуру

### 2.1 Refs для элементов

Создать refs для всех анимируемых элементов:

- `lineRef` - линия/кнопка/видео контейнер
- `textRef` - текстовый контейнер
- `maskRef` - маска
- `buttonContentRef` - содержимое кнопки (Play Reel)
- `openStoryRef` - кнопка Open Story
- `containerRef` - уже есть

### 2.2 Refs для GSAP

```
const mainTimeline = ref(null)
const scrollTriggerInstance = ref(null)
```

---

## Шаг 3: Построить мастер Timeline

### 3.1 Структура в onMounted

После того как DOM готов, создать timeline с привязкой к ScrollTrigger:

```
Timeline создается с конфигом:
scrollTrigger: {
  trigger: containerRef.value,
  start: "top top",
  end: "bottom bottom",
  scrub: 1,
  pin: ".animation-stage-wrapper",
  pinSpacing: false
}
```

### 3.2 Маппинг стадий на Timeline

**Используй case1-animation-stages.js ТОЛЬКО для значений** (размеры, позиции, цвета).
**НЕ копируй функции getActiveStage, getElementState** - это Motion-v логика.

Стадии → позиции на timeline (пиши GSAP-нативно):

**Stage 0 (0.00-0.01): Circle appear**

- line: opacity 0→1, scale 0→1, size 6×6px, borderRadius 3px

**Stage 1 (0.01-0.05): Horizontal grow**

- line: width 6px→100px, height 6px

**Stage 2 (0.05-0.10): Full width**

- line: width 100px→50vw

**Stage 3 (0.10-0.20): Line down, text up**

- line: y 0→55px
- text: y -50%→-150px, opacity 0→1
- mask: y 0→55px

**Stage 4 (0.20-0.35): Transform to button**

- line: height 6px→96px, borderRadius 3px→48px, bg blue→white, border появляется
- buttonContent: opacity 0→1

**Stage 6 (0.35-0.50): Expand to video**

- line: width 50vw→min(1200px,85vw), height 96px→min(780px,55.26vw), y 55px→-50%, borderRadius 48px→26px, border color blue→gray
- text: opacity 1→0
- buttonContent: opacity 1→0

**Stage 7 (0.50-0.70): Open Story appears**

- openStory: height 0→60px, opacity 0→1, с задержкой 0.75s

**Stage 8 (0.70-1.00): Stay in final state**

- Все остается как есть

### 3.3 Добавление анимаций в Timeline

Использовать `.to()` для каждого изменения с position параметром:

- Позиция = startProgress стадии
- Duration считается как (endProgress - startProgress)
- Ease: "power2.inOut" (соответствует [0.4, 0, 0.2, 1])

Для одновременных анимаций (например text + mask в stage 3) - использовать одинаковую позицию

---

## Шаг 4: Установить начальные состояния

### 4.1 Использовать gsap.set()

До создания timeline установить initial states для всех элементов.
**Значения бери из case1-animation-stages.js** (initialLineAnimation, initialTextAnimation и т.д.), **но пиши gsap.set() с нуля**:

**Line initial:**

- scale: 0, width: 6px, height: 6px, borderRadius: 50%, opacity: 0
- backgroundColor: #007AFF, x: "-50%", y: 0

**Text initial:**

- x: "-50%", y: "-50%", opacity: 0

**Mask initial:**

- x: "-50%", y: 0, width: 100vw, height: 50vh, opacity: 1, backgroundColor: #ffffff

**ButtonContent initial:**

- opacity: 0

**OpenStory initial:**

- x: "-50%", y: 520px, width: 300px, height: 0, opacity: 0

---

## Шаг 5: Управление видео

### 5.1 onUpdate callback

В ScrollTrigger конфиге добавить `onUpdate`:

- self.progress дает текущий прогресс (0-1)
- Если progress >= 0.35 (stage 6) → videoExpanded = true, play video
- Если progress < 0.35 → videoExpanded = false, pause video

### 5.2 Unpin на финальной стадии

**НЕ НУЖНО** переключать fixed/absolute через CSS.
Pin автоматически отпинит элемент когда ScrollTrigger закончится (end: "bottom bottom").
**Удали всю логику с классом `.normal-flow`** - pin сделает это сам.

---

## Шаг 6: Visibility с IntersectionObserver

### 6.1 Оставить текущую логику

IntersectionObserver остается как есть для управления wrapper visibility

### 6.2 Интеграция с GSAP

При isIntersecting = true:

- Wrapper становится visible
- ScrollTrigger.refresh() если нужно пересчитать позиции

При isIntersecting = false:

- Wrapper скрывается
- Можно остановить timeline если нужно

---

## Шаг 7: Cleanup в onUnmounted

### 7.1 Убить ScrollTrigger

```
if (scrollTriggerInstance.value) {
  scrollTriggerInstance.value.kill()
}
```

### 7.2 Убить Timeline

```
if (mainTimeline.value) {
  mainTimeline.value.kill()
}
```

### 7.3 IntersectionObserver

Уже есть корректный cleanup - оставить как есть

---

## Шаг 8: Оптимизация

### 8.1 CSS изменения

**Удалить из .animation-stage-wrapper:**

- `position: fixed` - pin заменяет
- `top: 50%; left: 50%; transform: translate(-50%, -50%)` - pin заменяет
- Класс `.normal-flow` и его стили - не нужен

**Оставить:**

- will-change: transform, opacity
- backface-visibility: hidden - добавить для GPU acceleration
- z-index, overflow, display - структурные стили

### 8.2 GSAP конфиг

В timeline или отдельных анимациях использовать:

- force3D: true (GPU acceleration)
- clearProps после завершения анимации (если нужно)

---

## Фичи GSAP которые используем

### Timeline + ScrollTrigger

- Один timeline контролирует все 8 стадий
- scrub: 1 - плавная привязка к скроллу
- Позиции на timeline соответствуют progress (0-1)

### Pin (ГЛАВНАЯ ФИЧА)

- **pin: ".animation-stage-wrapper"** - держит wrapper на экране во время анимации
- **pinSpacing: false** - не добавляем spacing (у нас уже 600vh container)
- **Полностью заменяет CSS `position: fixed`** - это GSAP way
- Pin автоматически управляет positioning - НЕ пиши CSS fixed вручную

### Easing

- power2.inOut для плавных переходов (как в Motion-v)
- Можно использовать CustomEase если нужен точный [0.4, 0, 0.2, 1]

### Labels (опционально)

Добавить labels на timeline для дебага:

- timeline.addLabel("stage0", 0)
- timeline.addLabel("stage1", 0.01)
- и т.д.

---

## Проверить после миграции

### Визуально

- [ ] Все 8 стадий анимируются плавно
- [ ] Скролл вверх (reverse) работает корректно
- [ ] Нет скачков между стадиями
- [ ] Open Story кнопка появляется с задержкой при forward scroll

### Функционально

- [ ] Видео играет на stage 6-8
- [ ] Видео останавливается при скролле назад
- [ ] Клик на Open Story сохраняет состояние видео
- [ ] Wrapper скрывается когда секция не в viewport

### Производительность

- [ ] 60fps при скролле (DevTools Performance tab)
- [ ] Нет memory leaks при переходах между страницами
- [ ] ScrollTrigger убивается в cleanup

---

## Итого

**Удаляем (НЕ КОПИРУЙ ЭТО):**

- Все motion-v импорты и компоненты
- Реактивные стейты (currentLineAnimation, currentTextAnimation, currentTransition и т.д.)
- Функции getActiveStage, getElementState, applyStageAnimations
- useScroll composable и его подписку
- Логику isNormalFlow, readyToShow, isInitialized
- CSS classes: .normal-flow, .not-initialized
- Manual fixed positioning логика

**Добавляем:**

- GSAP + ScrollTrigger импорт и регистрация
- Один мастер timeline с 8 стадиями
- ScrollTrigger с pin + scrub
- gsap.set() для initial states
- Cleanup в onUnmounted

**Оставляем:**

- IntersectionObserver логику (wrapper visibility)
- CSS стили элементов (кроме fixed positioning)
- Refs для элементов (но НЕ реактивные animation refs)
- VideoPlayer интеграцию
- case1-animation-stages.js **ТОЛЬКО как справочник значений**

**Результат:**
Проще код, лучше производительность, профессиональнее анимации, меньше реактивности.
