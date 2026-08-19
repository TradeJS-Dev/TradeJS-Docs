---
title: Redis Data Model
---

Redis is used as an operational storage layer for server state and transient
artifacts. Production deployment and strategy config live in
`tradejs.config.ts`, not Redis.

## Main Key Families

- Users: `users:index:<user>`
- Trading accounts: `users:<user>:trading-accounts:<accountId>`
- Optional manual entry pauses: `users:<user>:runtime:controls`
- Deployment heartbeat: `users:<user>:runtime:deployments:<deployment>:heartbeat`
- Runtime control audit events: `users:<user>:runtime:strategy-control-events:*`
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

An absent `runtime:controls` key is valid and means “follow Git enabled.” Pause
creates an override; resume removes it and deletes an empty document. Runtime
does not read `users:<user>:strategies:*`, Redis deployment documents, releases,
or per-symbol result overlays as production config.

## Operational Rules

- Never flush Redis in production without a scope.
- Prefer scoped cleanup commands (`npx @tradejs/cli clean-redis` with area).
- Treat Redis as live runtime dependency; monitor availability and latency.

## Debug Tips

- Start with key patterns used by the failing feature.
- Compare expected symbol/user namespace with real keys.
- If signals are missing, verify the image-owned declaration and package
  manifest, the trading-account binding, optional controls, heartbeat, and
  signal/evaluation keys.
