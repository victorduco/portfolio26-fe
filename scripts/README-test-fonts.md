# Font Testing Script

Автоматизированный скрипт для тестирования разных шрифтов на keypad и главной странице.

## Что делает скрипт

1. Сохраняет оригинальный `typography.css`
2. Для каждого шрифта из списка:
   - Обновляет `--font-family-base` в `typography.css`
   - Запускает Playwright браузер в инкогнито режиме
   - Делает скриншот keypad (главная страница, неавторизован)
   - Вводит код `1234`
   - Ждет появления intro секции с анимацией
   - Делает скриншот intro с закрытыми ректанглами
   - Кликает на первый ректангл и ждет анимацию
   - Делает скриншот intro с открытым ректанглом
   - Сохраняет 3 скриншота в папку `font-test-screenshots/{название-шрифта}/`
3. Восстанавливает оригинальный `typography.css`

## Использование

### 1. Запустить dev сервер
```bash
npm run dev
```

### 2. В новом терминале запустить тест
```bash
npm run test:fonts
```

## Результаты

Скриншоты сохраняются по типам (для удобного сравнения):
```
font-test-screenshots/
├── 01-keypad/
│   ├── Inter.png
│   ├── SF-Pro.png
│   ├── Helvetica.png
│   ├── Roboto.png
│   └── Open-Sans.png
├── 02-intro/
│   ├── Inter.png
│   ├── SF-Pro.png
│   ├── Helvetica.png
│   ├── Roboto.png
│   └── Open-Sans.png
└── 03-intro-opened/
    ├── Inter.png
    ├── SF-Pro.png
    ├── Helvetica.png
    ├── Roboto.png
    └── Open-Sans.png
```

Такая структура позволяет легко сравнивать один и тот же экран с разными шрифтами.

## Настройка списка шрифтов

Отредактируйте массив `FONTS_TO_TEST` в `scripts/test-fonts.mjs`:

```javascript
const FONTS_TO_TEST = [
  { name: 'Inter', value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { name: 'Your-Font', value: '"Your Font", fallback, sans-serif' },
];
```

## Параметры

- **Viewport**: 1920x1080 (desktop)
- **Browser**: Chromium (headless)
- **Delays**: Настроены для стабильных скриншотов

## Требования

- Dev сервер должен быть запущен на `http://localhost:5173`
- Playwright должен быть установлен (`npx playwright install`)
