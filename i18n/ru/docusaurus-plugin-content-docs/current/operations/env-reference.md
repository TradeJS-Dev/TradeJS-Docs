---
title: Справочник переменных окружения
---

TradeJS читает следующие переменные окружения для приложения, инфраструктуры
и необязательных сервисов.

## Приложение

- `APP_URL` — публичный URL приложения.
- `HOST` / `PORT` — адрес и порт запуска.
- `NODE_ENV` — `development` или `production`.
- `NEXTAUTH_SECRET` — обязательный секрет для сессий входа.
- `NEXTAUTH_URL` — публичный URL для обратных вызовов авторизации.

## Пользовательские настройки в Redis

TradeJS также хранит настройки конкретного счёта в Redis-записи пользователя
(`users:index:<user>`):

- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`
- `AI_API_KEY`
- `AI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

В веб-интерфейсе эти значения находятся в панели настроек счёта. Она открывается
кнопкой с шестерёнкой в левом боковом меню.

## Сервисы данных

- `REDIS_HOST`, `REDIS_PORT`
- `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
- `ML_GRPC_ADDRESS` (адрес сервиса ML-инференса)

## Фоновая обработка сигналов и поток свечей

- `SIGNALS_PARALLEL` — число символов, одновременно обрабатываемых для сигналов. По умолчанию `4`.
- `SIGNALS_DAEMON_SETTLE_DELAY_MS` — задержка после границы свечи. По умолчанию `5000` мс.
- `SIGNALS_DAEMON_MAX_LIVE_BARS` — предел числа последовательных свечей до пересборки состояния детектора.
- `SIGNALS_DAEMON_HEAP_MB` — ограничение кучи для фонового процесса в стандартной точке входа контейнера.
- `SIGNALS_KLINE_WS_ENABLED` — поток свечей Bybit для фонового процесса. Значение `0` оставляет только REST.
- `SIGNALS_KLINE_WS_WAIT_MS` — время ожидания подтверждённого закрытия свечи по WebSocket до повтора через REST.
- `MARKET_WS_HOST`, `MARKET_WS_PORT` — адрес и порт WebSocket-шлюза свечей для панели мониторинга.
- `MARKET_WS_HEAP_MB` — ограничение кучи шлюза в стандартной точке входа контейнера.

## Контекст крупных участников Hyperliquid

- `HYPERLIQUID_WHALE_CONTEXT_ENABLED` — разрешить учёт крупных участников в текущем режиме исполнения.
- `HYPERLIQUID_WHALE_BACKFILL_ENABLED` — разрешить автоматическую дозагрузку из сети. По умолчанию отключена.
- `HYPERLIQUID_WHALE_MIN_COVERAGE_PCT` — минимальное покрытие к моменту сигнала.
- `HYPERLIQUID_WHALE_CONCURRENCY` — число параллельных запросов при восстановлении истории.
- `HYPERLIQUID_WHALE_RATE_LIMIT_WEIGHT` — доля бюджета частоты запросов.
- `HYPERLIQUID_WHALE_CONTEXT_STAGE_TIMEOUT_MS` — предел времени для этапа рыночного контекста.
- `HYPERLIQUID_WS_URL` — необязательный адрес публичного потока.

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
- В рабочей среде получайте секреты из системы управления секретами.
- Для локального запуска выполните `npx @tradejs/cli infra-init` один раз, затем `npx @tradejs/cli infra-up`.
- Перед рабочим запуском проверяйте окружение через `npx @tradejs/cli doctor`.
- Ключи API и токены конкретного пользователя храните через панель настроек счёта, а не в общем
  секрете `.env` для всех операторов.
- `AI_API_*` и `TG_*` — поля записи пользователя, а не переменные окружения приложения. Храните их в Redis-записи
  пользователя.

## Владение репозиториями

В официальной схеме самостоятельного размещения базовые настройки без секретов хранятся в
`TradeJS-Project/deploy/runtime.env`. У каждой группы секретов GitHub Actions есть
один канонический владелец:

| Имя | Канонический владелец | Правило миграции |
| --- | --- | --- |
| `NPM_TOKEN` | каждый публикующий npm-пакеты репозиторий или один секрет организации, ограниченный этим набором | Не переносите в Project или Deploy. |
| `DEPLOY_REPOSITORY_TOKEN` | секрет репозитория `TradeJS-Project` | Токен разрешает только неизменяемую передачу в `TradeJS-Deploy`. |
| `SSH_HOST`, `SSH_USER`, `SSH_KEY` | секреты репозитория `TradeJS-Deploy` или секреты организации, доступные только Deploy | Уберите доступ к серверу из TradeJS, Project, Site и Docs. |
| `GIT_SSH_PRIVATE_KEY`, `AGENT_GITHUB_TOKEN` | секреты репозитория `TradeJS-Deploy` | Эти учётные данные принадлежат исследовательскому агенту на сервере. |
| `NEXTAUTH_SECRET`, `PG_PASSWORD`, `REDISINSIGHT_HTPASSWD`, `COINALYZE_API_KEY` | секреты репозитория `TradeJS-Deploy` | Deploy передаёт значения в окружение. Для `PG_PASSWORD` нет запасного чтения из старого `.env` сервера. |
| `RELEASE_DEPLOY_KEY` | нигде | Удалите: стабильный выпуск TradeJS использует `GITHUB_TOKEN`, ограниченный текущим процессом GitHub Actions. |

GitHub создаёт `GITHUB_TOKEN` для каждого запуска GitHub Actions. Этот токен нельзя копировать между
репозиториями. Текущие процессы не используют `${{ vars.* }}`. Локальные секреты для исследований
остаются в `TradeJS-Project/.env`, а закрытые стратегии устанавливаются с отдельным токеном реестра, который
имеет только право чтения.
