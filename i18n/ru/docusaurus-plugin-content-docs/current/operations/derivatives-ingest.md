---
title: Загрузка деривативов и спреда
---

TradeJS умеет загружать рыночные features по деривативам и spread в TimescaleDB.

Основные скрипты:

- `npx @tradejs/cli derivatives:ingest`
- `npx @tradejs/cli derivatives:ingest:coinalyze:all`
- `npx @tradejs/cli hyperliquid:whale-ingest`
- `npx @tradejs/cli hyperliquid:whale-backfill`

Источники:

- `@tradejs/cli`
- `@tradejs/connectors`
- `@tradejs/infra`

## 1. Ingest через provider

Команда:

```bash
npx @tradejs/cli derivatives:ingest --provider coinalyze --symbols BTCUSDT,ETHUSDT --intervals 15m,1h --days 120
```

Поддерживаемые providers:

- `coinalyze` -> строки деривативов
- `binance_coinbase_spread` -> строки spread

Полезные флаги:

- `--symbols`
- `--intervals` (`15m`, `1h`)
- `--days`
- `--batchDays`

## 2. Режим Coinalyze-All

Команда:

```bash
npx @tradejs/cli derivatives:ingest:coinalyze:all --user root --days 120 --intervals 15m,1h
```

Поведение:

- загружает тикеры через ByBit connector (`getTickers`)
- матчится к рынкам Coinalyze
- тянет open interest, funding, liquidations
- объединяет и upsert-ит в Timescale

Полезные флаги:

- `--tickers`, `--exclude`, `--tickersLimit`, `--chunk`
- `--exchangePriority`
- `--symbolBatchSize`
- `--requestDelayMs`, `--requestTimeoutMs`

## 3. Hyperliquid whale context

Запустите long-running public stream:

```bash
npx @tradejs/cli hyperliquid:whale-ingest
```

Он классифицирует executions tracked wallets относительно position snapshots,
строит one-minute flow/coverage buckets и пишет их в Timescale. В production
управляйте процессом через supervisor.

Backfill explicit historical window:

```bash
npx @tradejs/cli hyperliquid:whale-backfill --days 1
npx @tradejs/cli hyperliquid:whale-backfill --from 2026-08-01T00:00:00Z --to 2026-08-02T00:00:00Z
```

`--cacheOnly` запрещает network recovery при missing coverage. Automatic
context preparation по умолчанию не делает backfill; включайте
`HYPERLIQUID_WHALE_BACKFILL_ENABLED` только осознанно. Context и recovery также
настраиваются через `HYPERLIQUID_WHALE_CONTEXT_ENABLED`,
`HYPERLIQUID_WHALE_MIN_COVERAGE_PCT`, `HYPERLIQUID_WHALE_CONCURRENCY` и
`HYPERLIQUID_WHALE_RATE_LIMIT_WEIGHT`.

[HyperliquidConsensus](../strategies/reference/hyperliquid-consensus) требует
этот signal-time context.

## 4. Таблицы БД

Ingest пишет в:

- `derivatives_market`
- `market_spread`
- `hyperliquid_whale_trade_events`
- `hyperliquid_whale_flow`
- `hyperliquid_whale_wallet_coverage`
- `hyperliquid_whale_coverage_1m`

Bootstrap схемы и upsert логика:

- `@tradejs/infra`

## 5. Обязательные env

Для Coinalyze provider:

- `COINALYZE_API_KEY`
- опционально: `COINALYZE_BASE_URL`, `COINALYZE_MAX_RETRIES`

## 6. Операционные заметки

- Для локального запуска выполните `npx @tradejs/cli infra-init` один раз, затем `npx @tradejs/cli infra-up`.
- Перед ingest убедитесь, что PostgreSQL/Timescale доступен.
- Начинайте с короткого lookback и малого списка символов.
- Держите `batchDays` умеренным, чтобы снизить API/rate-limit нагрузку.
- Сохраняйте вместе с данными реестр крупных участников и отпечаток набора
  инструментов. После изменения отслеживаемого набора создавайте отдельный ряд
  контекста и не сравнивайте его как продолжение прежней выборки.
