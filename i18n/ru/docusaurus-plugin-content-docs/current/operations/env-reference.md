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
- `AI_API_KEY`
- `AI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

В web UI этими значениями управляет drawer настроек аккаунта, который открывается через шестеренку в левом сайдбаре.

## Сервисы данных

- `REDIS_HOST`, `REDIS_PORT`
- `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
- `ML_GRPC_ADDRESS` (для runtime-инференса)

## Signals daemon и streaming

- `SIGNALS_PARALLEL` — concurrent symbol evaluations, default `4`.
- `SIGNALS_DAEMON_SETTLE_DELAY_MS` — delay после candle boundary, default `5000`.
- `SIGNALS_DAEMON_MAX_LIVE_BARS` — bounded sequential bars до detector-state rebuild.
- `SIGNALS_DAEMON_HEAP_MB` — heap cap daemon в supplied container entrypoint.
- `SIGNALS_KLINE_WS_ENABLED` — Bybit daemon kline stream; `0` включает REST-only.
- `SIGNALS_KLINE_WS_WAIT_MS` — ожидание confirmed WebSocket closes до REST recovery.
- `MARKET_WS_HOST`, `MARKET_WS_PORT` — binding dashboard candle gateway.
- `MARKET_WS_HEAP_MB` — heap cap gateway в supplied container entrypoint.

## Hyperliquid whale context

- `HYPERLIQUID_WHALE_CONTEXT_ENABLED` — разрешить whale context для runtime mode.
- `HYPERLIQUID_WHALE_BACKFILL_ENABLED` — разрешить automatic network backfill; default off.
- `HYPERLIQUID_WHALE_MIN_COVERAGE_PCT` — minimum signal-time coverage.
- `HYPERLIQUID_WHALE_CONCURRENCY` — historical recovery concurrency.
- `HYPERLIQUID_WHALE_RATE_LIMIT_WEIGHT` — request-rate budget weight.
- `HYPERLIQUID_WHALE_CONTEXT_STAGE_TIMEOUT_MS` — market-context stage timeout.
- `HYPERLIQUID_WS_URL` — optional public stream endpoint override.

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
- `AI_API_*` и `TG_*` являются полями user record, а не app environment variables; храните их в Redis-записи пользователя.

## Владение репозиториями

В официальной self-hosted схеме secret-free application defaults коммитятся в
`TradeJS-Project/deploy/runtime.env`. `PG_PASSWORD`, auth secrets, API
credentials, SSH keys и server-only values инжектируются из `TradeJS-Deploy`
или аналогичного secret manager. npm publishing credentials принадлежат только
source repositories пакетов; для установки private стратегий проект использует
отдельный read-only registry token.
