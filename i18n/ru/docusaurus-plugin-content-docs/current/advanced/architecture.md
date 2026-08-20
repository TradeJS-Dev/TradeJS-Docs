---
title: Архитектура
---

TradeJS разделен на публичные пакеты:

- `@tradejs/core` - browser-safe config, authoring API, indicators, figures, math, time;
- `@tradejs/node` - Node runtime, backtests, Pine strategy loading, registries;
- `@tradejs/types` - общие контракты;
- `@tradejs/infra` - Redis, Timescale, ML, logging, IO;
- `@tradejs/strategy-*` - независимо версионируемые strategy plugins;
- `@tradejs/strategy-kit/*` - browser-safe нейтральные strategy helpers;
- `@tradejs/indicators` - built-in indicator catalog;
- `@tradejs/connectors` - connector and market data catalog;
- `@tradejs/base` - default preset;
- `@tradejs/cli` - operational commands;
- `@tradejs/app` - installable Next.js UI.

Используйте public subpaths: `@tradejs/core/config`,
`@tradejs/core/indicators`, `@tradejs/core/aiModels`,
`@tradejs/node/strategies`, `@tradejs/node/registry`,
`@tradejs/infra/redis`, `@tradejs/infra/timescale/candles`, `@tradejs/types`.

`@tradejs/core`, `@tradejs/node` и `@tradejs/infra` — subpath-only пакеты.
Не используйте их root imports и `@tradejs/*/src/*`. Не добавляйте
`@tradejs/node` или `@tradejs/infra` в browser/client bundle.

Подробнее: [владение репозиториями](./repository-ownership) и
[Core API](../api/framework).
