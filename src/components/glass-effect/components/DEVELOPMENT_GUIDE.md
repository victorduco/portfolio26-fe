# Glass Effect - Миграция на новую архитектуру

## Задача

Перенести функциональность из старого монолитного `GlassEffect.vue` в новую модульную архитектуру с отдельными компонентами для каждого слоя.

## Расположение файлов

- **Старый проект:** `/src/components/glass-effect/GlassEffect.vue` + вспомогательные файлы
- **Новый проект:** `/src/components/glass-effect/components/` - временная папка с новыми компонентами, в будущем будет перенесено вместо старого проекта

## Ожидаемый результат

После завершения всех этапов разработки новый `GlassEffect.vue` должен работать идентично старому, но с улучшенной архитектурой и лучшей поддерживаемостью кода.

## Что нужно доделать

### Этап 1. Сделать энд ту энд с одним слоем

- **GlassEffectDefaults.js** - перенести и адаптировать логику из `effect-options.js`
- Имплементировать GeLight - на основе стаорого компонента и описания туду в файле
- Проверить работу основного файла
- Добавить компонент в переименовать пропсы 1. **glassConfig → userOptions** (переименование пропа)
- Убедиться что новый компонент с одним слоем GeLight работает идентично старому по стилям

### Этап 2. Добавление 3 других слоев

**Базируясь на опыте Этапа 1, учесть следующее:**

#### 2.1. Паттерн именования переменных
- Использовать префикс компонента: `highlight*`, `noise*`, `outline*` (НЕ legacy названия)
- В `GlassEffectDefaults.js` добавить параметры с правильными префиксами
- В деструктуризации `GlassEffect.vue` использовать shorthand синтаксис
- В самих компонентах маппить на legacy API для `layer-*.js` функций

#### 2.2. Структура для каждого компонента
**GeHighlight.vue:**
```javascript
// В GlassEffectDefaults.js добавить:
highlightReflection: 0.45, // surfaceReflection в новой архитектуре

// В GlassEffect.vue:
const { highlightReflection } = opts;
<GeHighlight :options="{ highlightReflection }" :intensity />
```

**GeNoise.vue:**
```javascript
// В GlassEffectDefaults.js добавить:
noiseStrength: 0.22,
noiseRefractionDepth: 2.0, // refractionDepth в новой архитектуре

// В GlassEffect.vue:
const { noiseStrength, noiseRefractionDepth } = opts;
<GeNoise :options="{ noiseStrength, noiseRefractionDepth }" :intensity />
```

**GeOutline.vue:**
```javascript
// В GlassEffectDefaults.js добавить:
outlineIntensity: 0.4, // shadowDepth в новой архитектуре
outlineGlassTintHue: 210, // glassTintHue в новой архитектуре

// В GlassEffect.vue:
const { outlineIntensity, outlineGlassTintHue, surfaceReflection, shadowDepth } = opts;
<GeOutline :options="{ outlineIntensity, outlineGlassTintHue, surfaceReflection, shadowDepth }" :intensity />
```

#### 2.3. Обязательные файлы для реализации
- Изучить `layer-highlight.js` для GeHighlight
- Изучить `layer-noise.js` для GeNoise
- Изучить `layer-outline.js` + логику `liquid-glass__card` из старого GlassEffect.vue для GeOutline

#### 2.4. CSS классы - ИЗОЛИРОВАННЫЕ В КОМПОНЕНТАХ
- Каждый компонент содержит свои стили в `<style scoped>`
- `.glass-highlight` в GeHighlight.vue (аналогично `.glass-light` в GeLight.vue)
- `.glass-noise` в GeNoise.vue
- `.glass-outline` в GeOutline.vue
- НЕ добавлять в общий `/index.css` - каждый компонент самодостаточен
- Базовые стили: `position: absolute, inset: 0, pointer-events: none, border-radius: inherit`

#### 2.5. Тестирование поэтапно
- После каждого компонента раскомментировать в `GlassEffect.vue`
- Обновить `IntroRectangle.vue` glassConfig добавив параметры для тестируемого слоя
- Проверить визуальную идентичность со старым компонентом

### Этап 3. Сделать реализацию GeFilter

- TBD
- **GeFilter.vue** - объединить логику SVG фильтра + DOM source клонирования
- Проверить корректность всех остальных компонентов
  Смотреть как работают:
- `SvgFilter.vue` - для GeFilter
- DOM source логика в старом `GlassEffect.vue` - для GeFilter
- `effect-options.js` - для GlassEffectDefaults.js
- Все `layer-*.js` файлы - для соответствующих Ge\* компонентов
