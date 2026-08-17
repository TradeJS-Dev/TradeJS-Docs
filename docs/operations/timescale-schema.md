---
title: Postgres and Timescale Schema Guide
---

TimescaleDB stores market time-series and supports historical queries used by runtime and backtests.

TradeJS 3 exposes storage by focused server-only subpaths:

- `@tradejs/infra/timescale/client`
- `@tradejs/infra/timescale/candles`
- `@tradejs/infra/timescale/derivatives`
- `@tradejs/infra/timescale/spread`
- `@tradejs/infra/timescale/marketContext`
- `@tradejs/infra/timescale/hyperliquidWhales`

There is no aggregate `@tradejs/infra/timescale` export.

## Deployment Components

- PostgreSQL/Timescale service in your environment
- schema bootstrap SQL for initial setup
- migration workflow for schema updates

Local start shortcut:

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
```

## What to Keep in Schema Design

- Use hypertables for candle-like time-series.
- Index by time and by high-cardinality dimensions (`symbol`, `interval`, provider).
- Keep ingestion idempotent where possible.

Current context storage includes candles, derivatives, venue spread, trade
flow/order-book/breadth market context, and Hyperliquid whale event, flow, and
coverage tables. Hyperliquid rows include universe and whale-registry
fingerprints so context from different tracked sets is not silently mixed.

## Query and Performance Tips

- Avoid full scans on wide windows without filters.
- Ensure `symbol + interval + time` paths are indexed.
- Watch for slow range queries used by backtest/signal APIs.

## Migrations

- Run schema changes in maintenance windows.
- Always keep rollback SQL for destructive changes.
- Version migrations and test them on staging snapshots first.
