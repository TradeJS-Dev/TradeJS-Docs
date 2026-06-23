---
title: Архитектура
---

TradeJS разделен на публичные пакеты:

- `@tradejs/core` - browser-safe config, authoring API, indicators, figures, math, time;
- `@tradejs/node` - Node runtime, backtests, Pine loading, registries;
- `@tradejs/types` - общие контракты;
- `@tradejs/infra` - Redis, Timescale, ML, logging, IO;
- `@tradejs/strategies` - built-in strategy catalog;
- `@tradejs/indicators` - built-in indicator catalog;
- `@tradejs/connectors` - connector and market data catalog;
- `@tradejs/base` - default preset;
- `@tradejs/cli` - operational commands;
- `@tradejs/app` - installable Next.js UI.

Используйте public subpaths: `@tradejs/core/config`, `@tradejs/core/indicators`, `@tradejs/node/strategies`, `@tradejs/infra/redis`, `@tradejs/types`.

Не используйте `@tradejs/*/src/*`.
