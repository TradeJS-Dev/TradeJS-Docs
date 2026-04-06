---
title: Справочник переменных окружения
---

На этой странице собраны основные переменные окружения по группам.

## Приложение

- `APP_URL` — публичный URL приложения.
- `HOST` / `PORT` — адрес и порт запуска.
- `NODE_ENV` — `development` или `production`.
- `NEXTAUTH_SECRET` — обязательный секрет для auth-сессий.
- `NEXTAUTH_URL` — публичный URL для auth callback.

## Пользовательские настройки в Redis

TradeJS также хранит account-specific настройки в Redis-записи пользователя (`users:index:<user>`):

- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`
- `token`
- `OPENAI_API_KEY`
- `OPENAI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

В web UI этими значениями управляет drawer настроек аккаунта, который открывается через шестеренку в левом сайдбаре.

## Сервисы данных

- `REDIS_HOST`, `REDIS_PORT`
- `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
- `ML_GRPC_ADDRESS` (для runtime-инференса)

## Обучение ML

- `ML_TRAIN_RECENT_DAYS`
- `ML_TRAIN_TEST_DAYS`
- `ML_TRAIN_WALK_FORWARD_FOLDS`
- `ML_TRAIN_FEATURE_PROFILE` (`all` или `robust`)
- `ML_TRAIN_FEATURE_SET` (`legacy` или `enriched`)
- `ML_TRAIN_ENSEMBLE`
- `ML_TRAIN_ENSEMBLE_MEMBERS`

## Практические рекомендации

- Не храните секреты в репозитории.
- Для продакшена используйте secret manager.
- Для локального запуска выполните `npx @tradejs/cli infra-init` один раз, затем `npx @tradejs/cli infra-up`.
- Перед live-запуском проверяйте окружение через `npx @tradejs/cli doctor`.
- Для user-scoped API keys и токенов предпочитайте drawer настроек аккаунта вместо одного общего `.env` секрета на всех операторов.
- `OPENAI_*` и `TG_*` больше не являются app environment variables; храните их в Redis-записи пользователя.
