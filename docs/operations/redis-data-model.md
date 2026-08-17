---
title: Redis Data Model
---

Redis is used as an operational storage layer for runtime state, configs, and transient artifacts.

## Main Key Families

- Users: `users:index:<user>`
- Named user strategy configs: `users:<user>:strategies:<strategy>:<configId>`
- Promoted per-symbol strategy results: `users:<user>:strategies:<strategy>:results`
- Backtest configs: `users:<user>:backtests:configs:<config>`
- Backtest artifacts:
  `users:<user>:tests:<strategy>:<testName>:(config|stat|orders)`
- Signals and signal indexes (symbol-oriented keys)
- Runtime AI analysis: `analysis:<symbol>:<signalId>`
- Backtest worker chunks, temporary stats, and test artifacts

## TTL Strategy

TradeJS uses mixed persistence:

- some keys are short-lived (cache/test runtime),
- some keys are medium-lived (signals/history windows),
- config keys are intended to stay durable.

`config` is the conventional runtime config id; `results` is reserved for
promoted per-symbol backtest results and is not loaded as a named runtime
config.

## Operational Rules

- Never flush Redis in production without a scope.
- Prefer scoped cleanup commands (`npx @tradejs/cli clean-redis` with area).
- Treat Redis as live runtime dependency; monitor availability and latency.

## Debug Tips

- Start with key patterns used by the failing feature.
- Compare expected symbol/user namespace with real keys.
- If signals are missing, inspect both signal keys and strategy config keys.
