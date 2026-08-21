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
`TradeJS-Project/deploy/runtime.env`. У каждой группы GitHub Actions secrets есть
один канонический владелец:

| Имя | Канонический владелец | Правило миграции |
| --- | --- | --- |
| `NPM_TOKEN` | каждый публикующий npm source repository или один organization secret, ограниченный этим набором | Не переносите в Project или Deploy. |
| `DEPLOY_REPOSITORY_TOKEN` | repository secret в `TradeJS-Project` | Token разрешает только неизменяемую передачу в `TradeJS-Deploy`. |
| `SSH_HOST`, `SSH_USER`, `SSH_KEY` | repository secrets в `TradeJS-Deploy` или organization secrets, доступные только Deploy | Уберите server access из TradeJS, Project, Site и Docs. |
| `GIT_SSH_PRIVATE_KEY`, `AGENT_GITHUB_TOKEN` | repository secrets в `TradeJS-Deploy` | Эти credentials принадлежат server-side research agent. |
| `NEXTAUTH_SECRET`, `PG_PASSWORD`, `REDISINSIGHT_HTPASSWD`, `COINALYZE_API_KEY` | repository secrets в `TradeJS-Deploy` | Deploy инжектирует значения; fallback на старый server `.env` для `PG_PASSWORD` отсутствует. |
| `RELEASE_DEPLOY_KEY` | нигде | Удалите: stable release в TradeJS использует workflow-scoped `GITHUB_TOKEN`. |

`GITHUB_TOKEN` создаётся GitHub для каждого workflow run; его нельзя копировать
между репозиториями. Текущие workflows не используют `${{ vars.* }}`. Локальные
research secrets остаются в `TradeJS-Project/.env`, а private стратегии
устанавливаются с отдельным read-only registry token.
