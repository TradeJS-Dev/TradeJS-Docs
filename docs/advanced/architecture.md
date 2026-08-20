---
title: Architecture
---

TradeJS is split into public packages with clear boundaries.

## Packages

- `@tradejs/core`: browser-safe config, authoring API, indicators, figures, math, time, and helpers
- `@tradejs/node`: Node-only runtime, backtests, Pine strategy loading, registries, and strategy execution helpers
- `@tradejs/types`: shared TypeScript contracts
- `@tradejs/infra`: Redis, Timescale, ML, logging, and IO adapters
- `@tradejs/strategy-*`: independently versioned strategy plugins
- `@tradejs/strategy-kit/*`: browser-safe neutral strategy helpers
- `@tradejs/indicators`: built-in indicator plugin catalog
- `@tradejs/connectors`: built-in connector and market data provider catalog
- `@tradejs/base`: default preset wiring built-ins
- `@tradejs/cli`: operational commands
- `@tradejs/app`: installable Next.js UI

## Import Policy

Use public subpaths:

- `@tradejs/core/config`
- `@tradejs/core/indicators`
- `@tradejs/core/math`
- `@tradejs/core/aiModels`
- `@tradejs/node/strategies`
- `@tradejs/node/registry`
- `@tradejs/node/backtest`
- `@tradejs/infra/redis`
- `@tradejs/infra/timescale/candles`
- `@tradejs/types`

`@tradejs/core`, `@tradejs/node`, and `@tradejs/infra` are subpath-only
packages. Never rely on their roots or on `@tradejs/*/src/*`. Keep
`@tradejs/node` and `@tradejs/infra` out of browser/client bundles.

Deep dives: [repository ownership](./repository-ownership) and
[Core API](../api/framework).
