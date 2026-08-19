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

- `signals` runs every Git-declared active scope once unless explicit scope flags narrow it.
- `signals-daemon` keeps bounded detector state across sequential closed candles and rebuilds safely after gaps or config changes.
- runtime identity includes connector, universe, account/deployment, symbol, interval, strategy, and its explicit version/config.
- Bybit closed candles can arrive through a persistent WebSocket with REST recovery; the dashboard has a separate market WebSocket gateway.
- signal/evaluation persistence happens before optional screenshots.
- production config is read only from the immutable Project image; Redis is used for accounts, optional pause overrides, heartbeats, signals, evaluations, and trades.

The app exposes the committed strategy config read-only, strategy analytics,
drawdown, orders, and pause/resume. Research evidence may be produced locally
or in CI, but the server and UI do not require it or show an evidence status.

Related:

- [Signals](../runtime/execution/signals)
- [Runtime parity](../runtime/backtesting/runtime-parity)
- [Debugging live mode](../strategies/operations/debug-live)
