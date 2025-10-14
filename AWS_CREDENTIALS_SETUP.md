# AWS Credentials Setup Guide

AWS CLI установлен! ✅  
jq установлен! ✅

Теперь нужно настроить AWS credentials.

## Шаг 1: Создай IAM пользователя в AWS Console

1. **Зайди в AWS Console:** https://console.aws.amazon.com/
2. **Перейди в IAM:** Services → IAM → Users
3. **Создай пользователя:**

   - Нажми "Add users"
   - Username: `cdn-uploader`
   - Access type: ✅ Access key - Programmatic access
   - Нажми "Next"

4. **Настрой permissions:**

   - Выбери "Attach policies directly"
   - Найди и добавь временно: `AdministratorAccess` (для начальной настройки)
   - **После создания инфраструктуры** замени на минимальные права (см. ниже)
   - Нажми "Next" → "Create user"

5. **Сохрани credentials:**
   - **Access Key ID** - скопируй
   - **Secret Access Key** - скопируй (показывается только один раз!)

## Шаг 2: Настрой AWS CLI профиль

Запусти в терминале:

```bash
aws configure --profile cdn-uploader
```

Введи:

- **AWS Access Key ID:** [вставь Access Key ID]
- **AWS Secret Access Key:** [вставь Secret Access Key]
- **Default region name:** `us-east-1`
- **Default output format:** `json`

## Шаг 3: Проверь настройку

```bash
# Проверь профиль
aws configure list --profile cdn-uploader

# Проверь доступ
aws sts get-caller-identity --profile cdn-uploader
```

Должен вернуть твой Account ID.

## Шаг 4: Запусти setup CDN

```bash
npm run cdn:setup
```

---

## Минимальные права (после создания инфраструктуры)

После того как инфраструктура создана, замени `AdministratorAccess` на custom policy:

### S3 Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::portfolio26-keypad-backgrounds"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::portfolio26-keypad-backgrounds/*"
    }
  ]
}
```

### CloudFront Policy (опционально)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListDistributions"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## Безопасность

✅ **Никогда не коммить credentials в git!**

- `.env.local` уже в `.gitignore`
- AWS credentials хранятся в `~/.aws/credentials`

✅ **Используй минимальные права** после создания инфраструктуры

✅ **Ротация ключей:** обновляй Access Keys раз в 90 дней

---

## Troubleshooting

**"InvalidClientTokenId"**

- Проверь правильность Access Key ID
- Перезапусти `aws configure --profile cdn-uploader`

**"Access Denied"**

- Проверь что пользователь имеет нужные permissions
- Проверь что используешь правильный профиль: `--profile cdn-uploader`

**"No credentials"**

- Убедись что профиль настроен: `aws configure list --profile cdn-uploader`

---

## После настройки credentials

Запусти полный setup:

```bash
npm run cdn:setup
```

Скрипт автоматически:

1. ✅ Создаст S3 bucket
2. ✅ Настроит CORS и security
3. ✅ Создаст CloudFront distribution
4. ✅ Настроит Origin Access Control
5. ✅ Обновит bucket policy
6. ✅ Сохранит конфигурацию в `.env.local`

Время: ~2-3 минуты + 10-15 минут на деплой CloudFront
