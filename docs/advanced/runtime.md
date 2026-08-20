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

## Execution Model

- `signals` evaluates every enabled setup once unless command-line filters narrow the run.
- `signals-daemon` keeps only recent deterministic calculation state and rebuilds it safely after gaps or configuration changes.
- each calculation is identified by its connector, market universe, account,
  deployment, symbol, interval, strategy version, configuration, and symbol selection.
- strategy-level `selection.tickers` overrides the deployment ticker list; active-position symbols remain managed after selection changes.
- the daemon reloads project settings and pause controls every cycle, so an
  affected strategy rebuilds without restarting the process.
- Bybit closed candles can arrive through a persistent WebSocket with REST recovery; the dashboard has a separate market WebSocket gateway.
- signal/evaluation persistence happens before optional screenshots.
- live strategy settings are read from `tradejs.config.ts`; Redis stores
  accounts, optional pause state, heartbeats, signals, evaluations, and trades.

The app displays the version-controlled strategy configuration read-only, strategy analytics,
drawdown, orders, and pause/resume. Research evidence may be produced locally
or in CI, but the server and UI do not require it or show an evidence status.

Related:

- [How live signals work](../runtime/execution/signals)
- [Validate live decisions with replay](../runtime/backtesting/replay-evidence)
- [Compare live and replayed entries](../runtime/backtesting/runtime-parity)
- [Debugging live mode](../strategies/operations/debug-live)
