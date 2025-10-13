# Production Setup - Checklist

## ✅ Статус настройки авторизации на продакшене

**Дата проверки:** 13 октября 2025

### Backend (portfolio26-be)

✅ **Heroku App:** `portfolio26-be`

- **URL:** https://portfolio26-be-c17efea7c1e6.herokuapp.com
- **Health Check:** ✅ Работает
- **API Endpoints:** ✅ Доступны

**Проверено:**

```bash
curl https://portfolio26-be-c17efea7c1e6.herokuapp.com/health
# {"status":"ok","timestamp":"2025-10-13T15:41:30.167Z","env":"production"}

curl https://portfolio26-be-c17efea7c1e6.herokuapp.com/api/whoami
# {"ok":false}

curl -X POST https://portfolio26-be-c17efea7c1e6.herokuapp.com/api/check-code \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'
# {"ok":false,"error":"Invalid code"}
```

### Frontend (portfolio26-fe)

✅ **Heroku App:** `portfolio26-fe` (СОЗДАНО)

- **URL:** https://portfolio26-fe-70528f6245b6.herokuapp.com
- **Git Remote:** ✅ Настроен

**Переменные окружения:**

```bash
VITE_API_URL=https://portfolio26-be-c17efea7c1e6.herokuapp.com
```

✅ **Проверено:**

- URL бэкенда встраивается в билд через `import.meta.env.VITE_API_URL`
- Компонент `Keypad.vue` правильно использует переменную окружения
- Fallback на localhost:3000 для development

### GitHub Actions

✅ **Deploy Workflow:** `.github/workflows/deploy.yml`

- Обновлен для использования `portfolio26-fe`
- Деплой на push в `main` ветку

### Конфигурация проекта

**Файлы:**

- ✅ `.env` - для development (localhost:3000)
- ✅ `.env.production` - для production (portfolio26-be URL)
- ✅ `Procfile` - для запуска на Heroku
- ✅ `static.json` - конфигурация serve
- ✅ `vite.config.js` - мульти-энтрипойнты (main + gate)

**Build:**

```bash
npm run build
# ✅ Успешно собирается
# ✅ URL бэкенда встроен в dist/assets/directives-*.js
```

## 🔧 Требуемые действия для полного деплоя

### 1. Установить секрет в GitHub

Убедитесь, что в GitHub репозитории настроен секрет:

```
Settings → Secrets and variables → Actions → Repository secrets
HEROKU_API_KEY = <ваш_heroku_api_key>
```

Получить API key:

```bash
heroku auth:token
```

### 2. Задеплоить фронтенд

#### Вариант A: Через GitHub Actions

```bash
git add .
git commit -m "Configure production authentication"
git push origin main
# GitHub Actions автоматически задеплоит на Heroku
```

#### Вариант B: Вручную

```bash
git push heroku dev:main
# или если на main ветке:
# git push heroku main
```

### 3. Проверить работу после деплоя

```bash
# Открыть приложение
heroku open --app portfolio26-fe

# Проверить логи
heroku logs --tail --app portfolio26-fe

# Проверить переменные
heroku config --app portfolio26-fe
```

## 📋 Проверочный список

### Предварительные проверки

- [x] Backend приложение существует и работает
- [x] Backend API endpoints доступны
- [x] Frontend приложение создано на Heroku
- [x] VITE_API_URL установлен в Heroku config
- [x] Git remote настроен правильно
- [x] Deploy workflow обновлен

### После деплоя

- [ ] Фронтенд приложение открывается
- [ ] Редирект на /gate работает (если нет cookie)
- [ ] Keypad отображается корректно
- [ ] Запрос к API бэкенда работает
- [ ] Авторизация с правильным кодом работает
- [ ] Редирект после авторизации работает
- [ ] Cookie устанавливается правильно

## 🔍 Troubleshooting

### Проблема: Network error при авторизации

**Причина:** CORS или неправильный URL бэкенда

**Решение:**

1. Проверить переменную в Heroku:
   ```bash
   heroku config:get VITE_API_URL --app portfolio26-fe
   ```
2. Проверить, что URL встроен в билд:
   ```bash
   grep -r "portfolio26-be" dist/
   ```
3. Пересобрать и задеплоить

### Проблема: Приложение не открывается

**Решение:**

1. Проверить логи:
   ```bash
   heroku logs --tail --app portfolio26-fe
   ```
2. Проверить buildpack:
   ```bash
   heroku buildpacks --app portfolio26-fe
   ```
   Должен быть: `heroku/nodejs`

### Проблема: Cookie не устанавливается

**Проверить на бэкенде:**

```bash
heroku config --app portfolio26-be | grep COOKIE_SECURE
# Должно быть: COOKIE_SECURE=true для production
```

## 📝 Дополнительная информация

### Структура авторизации

```
Пользователь → Frontend (portfolio26-fe)
                    ↓
              Keypad вводит код
                    ↓
         POST /api/check-code → Backend (portfolio26-be)
                    ↓
              Проверка кода
                    ↓
         Set-Cookie: auth (httpOnly)
                    ↓
              Редирект на /
```

### Важные URL

- **Frontend Production:** https://portfolio26-fe-70528f6245b6.herokuapp.com
- **Backend Production:** https://portfolio26-be-c17efea7c1e6.herokuapp.com
- **Backend Health:** https://portfolio26-be-c17efea7c1e6.herokuapp.com/health
- **GitHub Repo:** https://github.com/victorduco/p26

### Команды для быстрого доступа

```bash
# Открыть фронтенд
heroku open --app portfolio26-fe

# Открыть бэкенд
heroku open --app portfolio26-be

# Логи фронтенда
heroku logs --tail --app portfolio26-fe

# Логи бэкенда
heroku logs --tail --app portfolio26-be

# Деплой
git push heroku main
```

## ✅ Итоговый статус

**Все настроено для работы с авторизацией через бэкенд на продакшене!**

Осталось только:

1. Задеплоить фронтенд на Heroku
2. Проверить работу авторизации
3. При необходимости настроить коды доступа на бэкенде

---

**Следующий шаг:** Задеплойте приложение командой `git push heroku main` (или через GitHub Actions)
