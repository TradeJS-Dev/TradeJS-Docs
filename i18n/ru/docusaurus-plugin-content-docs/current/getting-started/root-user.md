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
- хранит account-level настройки в той же Redis-записи пользователя

## 2. Проверить пользователя в Redis

```bash
redis-cli JSON.GET users:index:root
```

В ответе должны быть как минимум:

- `userName`
- `passwordHash`
- `updatedAt`

После сохранения настроек в UI в этой же записи могут появиться:

- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`
- `AI_API_KEY`
- `AI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

## 3. Войти в приложение

1. Откройте страницу входа вашего TradeJS-приложения (или API-клиент).
2. Войдите под `root` и указанным паролем.
3. Откройте drawer настроек аккаунта через иконку шестеренки в левом сайдбаре.
4. Настройте нужные параметры для этого пользователя:
   - Bybit API key/secret
   - смену пароля
   - API key/endpoint AI-провайдера
   - Telegram bot token/chat id

## 4. Смена пароля

Смена пароля:

```bash
npx @tradejs/cli user-add -u root -p 'NewStrongPassword456!'
```

Примечания:

- Пароль также можно менять из drawer настроек аккаунта после входа.
- Секреты хранятся в Redis на уровне пользователя и в UI показываются в замаскированном виде.
- Legacy-поле `token` удаляется текущим account-settings API и не принимается командой `user-add`.
