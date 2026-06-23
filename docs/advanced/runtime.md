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

## Recent Runtime Work

Recent source commits improved:

- runtime strategy config drawer in the app
- runtime strategy analytics and strategy card metrics
- replay/runtime comparison tolerance
- execution slippage telemetry and calibration
- runtime evidence reports
- AI/ML gate diagnostics

Related:

- [Signals](../runtime/execution/signals)
- [Runtime parity](../runtime/backtesting/runtime-parity)
- [Debugging live mode](../strategies/operations/debug-live)
