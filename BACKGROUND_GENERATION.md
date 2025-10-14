# Генерация Фонов Keypad

## Быстрый Старт

### 1. Подготовка
```bash
# Убедись что VITE_USE_PREGENERATED_BACKGROUNDS=false в .env
sed -i '' 's/VITE_USE_PREGENERATED_BACKGROUNDS=true/VITE_USE_PREGENERATED_BACKGROUNDS=false/' .env
```

### 2. Генерация
```bash
# Тест (первые 10 картинок)
npm run generate:backgrounds:test

# Все 10,000 картинок (~45-60 минут)
npm run generate:backgrounds

# Принудительная регенерация
npm run generate:backgrounds:force
```

### 3. Использование
```bash
# Включи pregenerated mode
sed -i '' 's/VITE_USE_PREGENERATED_BACKGROUNDS=false/VITE_USE_PREGENERATED_BACKGROUNDS=true/' .env

# Перезапусти dev server
npm run dev
```

## Как Это Работает

Скрипт генерации:
1. Запускает твой Vue app в headless браузере
2. Открывает страницу `/gate` (где находится Keypad)
3. Эмулирует нажатия клавиш (0-9) для каждой комбинации
4. Ждёт пока GeBackground сгенерирует фон через toPng
5. Забирает готовый data URL из CSS переменной `--global-keypad-bg`
6. Сохраняет как PNG файл

**Результат: 100% pixel-perfect совпадение с runtime!**

## Troubleshooting

**Проблема:** Пустые/маленькие файлы (< 10KB)
**Решение:** Убедись что `VITE_USE_PREGENERATED_BACKGROUNDS=false` и перезапусти dev server

**Проблема:** "Background element not found"
**Решение:** Проверь что элемент `#keypad-bg-export` существует на `/gate` странице

**Проблема:** Медленная генерация
**Решение:** Это нормально, ~2-3 секунды на изображение (10,000 файлов = 45-60 минут)
