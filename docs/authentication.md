# Authentication System Documen2. **routes/api.js** - API endpoints:

- `POST /api/check-code` - проверка кода доступа
- `GET /api/whoami` - проверка текущей авторизацииon

## Обзор

Система авторизации защищает все страницы приложения, кроме страницы входа (`/gate`). Использует красивый компонент Keypad для ввода кода доступа.

## Компоненты

### Frontend

1. **GateApp.vue** - Главный компонент страницы авторизации

   - Использует компонент `Keypad`
   - Обрабатывает успешную авторизацию

2. **Keypad.vue** - Компонент ввода кода

   - Красивая анимированная клавиатура
   - Интеграция с backend API
   - Обработка ошибок и rate limiting
   - Поддержка клавиатуры (цифры, Backspace)

3. **KeypadButton.vue** - Кнопка клавиатуры
   - Эффект glass с использованием GlassEffect
   - Анимации hover/pressed
   - Адаптивность (desktop/mobile/landscape)

### Backend

Находится в папке `backend/`:

1. **server.js** - Express сервер
2. **middleware/authGate.js** - Middleware для проверки авторизации
3. **routes/api.js** - API endpoints:
   - `POST /api/check-code` - проверка кода доступа
   - `POST /api/logout` - выход
   - `GET /api/whoami` - проверка текущей авторизации
4. **utils/cookie.js** - Работа с httpOnly cookies
5. **utils/config.js** - Конфигурация из .env

## Как это работает

### Процесс авторизации

1. Пользователь заходит на защищенную страницу (например, `/`)
2. `authGate` middleware проверяет наличие валидной cookie
3. Если cookie нет или невалидна → редирект на `/gate?next=/`
4. Пользователь вводит 4-значный код в Keypad
5. Frontend отправляет `POST /api/check-code` с кодом
6. Backend проверяет код и устанавливает httpOnly cookie
7. Успешно → редирект на оригинальный URL из параметра `next`

### Безопасность

- **httpOnly cookies** - защита от XSS
- **HMAC подпись** - защита от подделки cookie
- **Версионирование** - инвалидация старых cookie
- **Rate limiting** - защита от brute force (10 попыток / 15 минут)
- **Helmet.js** - security headers
- **Публичные пути** - только gate и его ассеты доступны без авторизации

## Конфигурация

### Backend (.env)

```env
# Коды доступа (минимум 4 символа)
ACCESS_CODE_1=1234
ACCESS_CODE_2=5678
ACCESS_CODE_3=9999

# Cookie настройки
COOKIE_NAME=auth
COOKIE_TTL_MS=3600000         # 1 час
COOKIE_SECURE=false           # true в production
SESSION_SECRET=your-secret    # Обязательно изменить в production!

# Версия авторизации
AUTH_VERSION=1

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000   # 15 минут
RATE_LIMIT_MAX_ATTEMPTS=10    # Максимум попыток

# Сервер
NODE_ENV=development
PORT=3000
```

### Frontend (vite.config.js)

Прокси настроен для проксирования запросов к backend в dev режиме:

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:3000',
    '/media': 'http://localhost:3000'
  }
}
```

## Запуск в разработке

### Вариант 1: Полный запуск (рекомендуется)

```bash
npm run dev:full
```

Запустит одновременно:

- Frontend (Vite) на http://localhost:5173 (или другой порт)
- Backend (Express) на http://localhost:3000

### Вариант 2: Раздельный запуск

Терминал 1 - Backend:

```bash
npm run dev:backend
# или
cd backend && npm run dev
```

Терминал 2 - Frontend:

```bash
npm run dev
```

## Тестирование

1. Откройте http://localhost:5173 (или порт из вывода)
2. Должен произойти редирект на `/gate?next=/`
3. Введите один из кодов доступа (1234, 5678, или 9999)
4. После успешной авторизации → редирект на главную страницу

## Коды доступа по умолчанию

В development режиме (из `backend/.env`):

- **1234**
- **5678**
- **9999**

⚠️ **Важно**: Перед деплоем в production обязательно измените коды доступа!

## API Endpoints

### POST /api/check-code

Проверка кода доступа.

**Request:**

```json
{
  "code": "1234"
}
```

**Response (успех):**

```json
{
  "ok": true
}
```

**Response (ошибка):**

```json
{
  "ok": false,
  "error": "Invalid code"
}
```

**Response (rate limit):**

```json
{
  "ok": false,
  "error": "Too many attempts. Please try again later."
}
```

### GET /api/whoami

Проверка текущей авторизации.

**Response (авторизован):**

```json
{
  "ok": true
}
```

**Response (не авторизован):**

```json
{
  "ok": false
}
```

## Deployment (Production)

### Heroku

1. Установите переменные окружения:

```bash
heroku config:set ACCESS_CODE_1=your-secure-code
heroku config:set ACCESS_CODE_2=another-code
heroku config:set ACCESS_CODE_3=third-code
heroku config:set SESSION_SECRET=your-very-long-random-secret
heroku config:set COOKIE_SECURE=true
heroku config:set AUTH_VERSION=1
heroku config:set NODE_ENV=production
```

2. Deploy:

```bash
git push heroku main
```

### Другие платформы

Убедитесь, что:

1. Все переменные окружения из `.env.example` установлены
2. `COOKIE_SECURE=true` в production
3. `SESSION_SECRET` - уникальный и надежный
4. `NODE_ENV=production`
5. Сервер слушает на правильном порту (переменная `PORT`)

## Troubleshooting

### Network error при авторизации

**Проблема**: "Network error. Please try again."

**Решения**:

1. Убедитесь, что backend запущен на порту 3000
2. Проверьте прокси в `vite.config.js`
3. Проверьте консоль браузера на CORS ошибки

### Cookie не устанавливается

**Проблема**: Успешная авторизация, но редирект не происходит

**Решения**:

1. Проверьте `COOKIE_SECURE` в `.env` (должно быть `false` в dev)
2. Убедитесь, что используете http://localhost (не 127.0.0.1)
3. Проверьте консоль браузера → Application → Cookies

### Rate limit сразу после запуска

**Проблема**: "Too many attempts" сразу после старта

**Решения**:

1. Перезапустите backend сервер
2. Увеличьте `RATE_LIMIT_MAX_ATTEMPTS` в `.env`
3. Уменьшите `RATE_LIMIT_WINDOW_MS` для быстрого сброса

### Редирект зацикливается

**Проблема**: Бесконечный редирект между `/` и `/gate`

**Решения**:

1. Проверьте, что gate assets правильно загружены (смотрите логи сервера)
2. Убедитесь, что `dist/gate.html` существует
3. Проверьте `backend/src/utils/manifest.js`

## Структура файлов

```
/Users/vitya/Repos/p26/
├── src/
│   ├── GateApp.vue           # Главный компонент авторизации
│   ├── gate.js               # Entry point для gate.html
│   └── components/
│       └── keypad/
│           ├── Keypad.vue              # Основной keypad с backend интеграцией
│           ├── KeypadButton.vue        # Кнопка клавиатуры
│           ├── variants.js             # Анимации
│           └── glassEffectConfig.js    # Конфиг glass эффекта
├── backend/
│   ├── .env                  # Конфигурация (не в git!)
│   ├── .env.example          # Пример конфигурации
│   ├── package.json
│   └── src/
│       ├── server.js         # Express сервер
│       ├── middleware/
│       │   ├── authGate.js   # Auth middleware
│       │   └── logger.js     # Логирование
│       ├── routes/
│       │   ├── api.js        # API endpoints
│       │   └── media.js      # Protected media
│       └── utils/
│           ├── config.js     # Загрузка .env
│           ├── cookie.js     # Работа с cookies
│           └── manifest.js   # Загрузка gate assets
├── gate.html                 # HTML для страницы авторизации
├── vite.config.js            # Vite конфиг с прокси
└── package.json              # Скрипты для запуска
```

## Дополнительные возможности

### Изменение кодов доступа

В development:

```bash
# Отредактируйте backend/.env
ACCESS_CODE_1=новый_код
```

В production (Heroku):

```bash
heroku config:set ACCESS_CODE_1=новый_код
```

### Инвалидация всех сессий

Измените `AUTH_VERSION`:

```bash
heroku config:set AUTH_VERSION=2
```

Все старые cookie станут невалидными.

### Добавление новых публичных путей

Отредактируйте `backend/src/middleware/authGate.js`:

```javascript
const PUBLIC_PATHS = [
  "/gate",
  "/api/check-code",
  "/api/logout",
  "/api/whoami",
  "/health",
  "/your-new-path", // Добавьте здесь
];
```

## Логирование

Backend логирует в `backend/logs/`:

- `valid_codes.log` - успешные авторизации
- `invalid_codes.log` - неудачные попытки
- Консоль сервера - все события

Формат:

```
[2025-10-13T14:50:09.369Z] event: server_start, data: {"port":3000,"env":"development"}
```
