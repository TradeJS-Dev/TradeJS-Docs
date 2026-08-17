---
title: Runtime
---

The runtime executes strategy decisions against market data.

The current runtime path is shared across backtests, replay, signals, and automation where practical. That parity matters: a strategy should not have one decision path for backtests and another for runtime unless the difference is explicit.

## Runtime Responsibilities

- load project config and plugins
- prepare market data and context
- call strategy logic on closed candles
- enrich signals with indicators, AI, and ML context
- apply runtime gates
- place or skip orders
- store signals, evaluations, orders, and diagnostics

## Current Runtime Model

- `signals` runs every discovered named config scope once unless explicit scope flags narrow it.
- `signals-daemon` keeps bounded detector state across sequential closed candles and rebuilds safely after gaps or config changes.
- runtime identity includes connector, universe, account/deployment, symbol, interval, strategy, and config id.
- Bybit closed candles can arrive through a persistent WebSocket with REST recovery; the dashboard has a separate market WebSocket gateway.
- signal/evaluation persistence happens before optional screenshots.
- runtime lineage and evidence keep logic/config identity separate from account binding and risk amount.

The app exposes named runtime config scopes, strategy analytics, drawdown and
orders, chart annotations, and immutable evidence markers when corresponding
artifacts are available.

Related:

- [Signals](../runtime/execution/signals)
- [Runtime parity](../runtime/backtesting/runtime-parity)
- [Debugging live mode](../strategies/operations/debug-live)
