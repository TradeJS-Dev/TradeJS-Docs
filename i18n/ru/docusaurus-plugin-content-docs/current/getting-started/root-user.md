---
title: Настройка пользователя root
---

В CLI по умолчанию используется `--user root`, поэтому проще всего начать с корректно настроенного `root`-аккаунта.

## 1. Создать или обновить root

```bash
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

Что делает команда:

- хеширует пароль через `bcrypt`
- записывает пользователя в Redis-ключ `users:index:root`
- автоматически создает persistent token для `root`, если его нет
- хранит account-level настройки в той же Redis-записи пользователя

## 2. Проверить пользователя в Redis

```bash
redis-cli JSON.GET users:index:root
```

В ответе должны быть как минимум:

- `userName`
- `passwordHash`
- `updatedAt`
- `token` (для `root`)

После сохранения настроек в UI в этой же записи могут появиться:

- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

## 3. Войти в приложение

1. Откройте страницу входа вашего TradeJS-приложения (или API-клиент).
2. Войдите под `root` и указанным паролем.
3. Откройте drawer настроек аккаунта через иконку шестеренки в левом сайдбаре.
4. Настройте нужные параметры для этого пользователя:
   - Bybit API key/secret
   - смену пароля
   - persistent token для passwordless auth
   - OpenAI API key/endpoint
   - Telegram bot token/chat id
5. Для API-only сценариев используйте persistent token из Redis или из drawer настроек аккаунта.

## 4. Смена пароля или токена

Смена пароля:

```bash
npx @tradejs/cli user-add -u root -p 'NewStrongPassword456!'
```

Явно задать токен:

```bash
npx @tradejs/cli user-add -u root -p 'NewStrongPassword456!' -t 'my-static-token'
```

Примечания:

- Пароль и токен также можно менять из drawer настроек аккаунта после входа.
- Секреты хранятся в Redis на уровне пользователя и в UI показываются в замаскированном виде.
