---
title: Derivatives and Spread Ingest
---

TradeJS can ingest derivatives and spread market features into TimescaleDB.

Main scripts:

- `npx @tradejs/cli derivatives:ingest`
- `npx @tradejs/cli derivatives:ingest:coinalyze:all`
- `npx @tradejs/cli hyperliquid:whale-ingest`
- `npx @tradejs/cli hyperliquid:whale-backfill`

Sources:

- `@tradejs/cli`
- `@tradejs/connectors`
- `@tradejs/infra`

## 1. Provider-Based Ingest

Command:

```bash
npx @tradejs/cli derivatives:ingest --provider coinalyze --symbols BTCUSDT,ETHUSDT --intervals 15m,1h --days 120
```

Supported providers:

- `coinalyze` -> derivatives rows
- `binance_coinbase_spread` -> spread rows

Useful flags:

- `--symbols`
- `--intervals` (`15m`, `1h`)
- `--days`
- `--batchDays`

## 2. Coinalyze-All Mode

Command:

```bash
npx @tradejs/cli derivatives:ingest:coinalyze:all --user root --days 120 --intervals 15m,1h
```

Behavior:

- loads tickers through ByBit connector (`getTickers` logic)
- matches to Coinalyze markets
- fetches open interest, funding, liquidations
- merges and upserts to Timescale

Useful flags:

- `--tickers`, `--exclude`, `--tickersLimit`, `--chunk`
- `--exchangePriority`
- `--symbolBatchSize`
- `--requestDelayMs`, `--requestTimeoutMs`

## 3. Hyperliquid whale context

Start the long-running public stream:

```bash
npx @tradejs/cli hyperliquid:whale-ingest
```

It classifies tracked-wallet executions against position snapshots, builds
one-minute flow/coverage buckets, and writes them to Timescale. Stop the process
with `SIGINT`/`SIGTERM`; supervise it in production.

Backfill an explicit historical window:

```bash
npx @tradejs/cli hyperliquid:whale-backfill --days 1
npx @tradejs/cli hyperliquid:whale-backfill --from 2026-08-01T00:00:00Z --to 2026-08-02T00:00:00Z
```

`--cacheOnly` refuses network recovery when coverage is missing. Automatic
context preparation does not backfill by default; enable
`HYPERLIQUID_WHALE_BACKFILL_ENABLED` only when that network behavior is
intentional. `HYPERLIQUID_WHALE_CONTEXT_ENABLED`,
`HYPERLIQUID_WHALE_MIN_COVERAGE_PCT`,
`HYPERLIQUID_WHALE_CONCURRENCY`, and
`HYPERLIQUID_WHALE_RATE_LIMIT_WEIGHT` control context use and recovery.

The [HyperliquidConsensus strategy](../strategies/reference/hyperliquid-consensus)
requires this signal-time context.

## 4. DB Tables

Ingest writes to:

- `derivatives_market`
- `market_spread`
- `hyperliquid_whale_trade_events`
- `hyperliquid_whale_flow`
- `hyperliquid_whale_wallet_coverage`
- `hyperliquid_whale_coverage_1m`

Schema bootstrap and upsert logic:

- `@tradejs/infra`

## 5. Required Env

For Coinalyze provider:

- `COINALYZE_API_KEY`
- optional: `COINALYZE_BASE_URL`, `COINALYZE_MAX_RETRIES`

## 6. Operational Notes

- For local setup, run `npx @tradejs/cli infra-init` once, then `npx @tradejs/cli infra-up`.
- Ensure PostgreSQL/Timescale is running before ingest.
- Begin with short lookback and small symbol set.
- Keep `batchDays` moderate to reduce API/rate-limit pressure.
- Treat whale registry and universe fingerprints as data lineage; changing the tracked set creates a distinct context series.
