---
title: Architecture
---

TradeJS is split into public packages with clear boundaries.

## Packages

- `@tradejs/core`: browser-safe config, authoring API, indicators, figures, math, time, and helpers
- `@tradejs/node`: Node-only runtime, backtests, Pine strategy loading, registries, and strategy execution helpers
- `@tradejs/types`: shared TypeScript contracts
- `@tradejs/infra`: Redis, Timescale, ML, logging, and IO adapters
- `@tradejs/strategies`: built-in strategy plugin catalog
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
- `@tradejs/node/strategies`
- `@tradejs/node/backtest`
- `@tradejs/infra/redis`
- `@tradejs/types`

Avoid package root imports where a package intentionally exposes only subpaths, and never rely on `@tradejs/*/src/*`.

Deep dive: [Core API](../api/framework).
