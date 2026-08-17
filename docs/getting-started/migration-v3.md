---
title: Migrate to TradeJS 3
---

TradeJS 3 makes package boundaries explicit. The standard `create-tradejs`
project shape is unchanged, but custom integrations may need import updates.
Keep engine packages on the same compatible major version during the migration.

## Standalone strategy packages

The aggregate `@tradejs/strategies` package was removed. `@tradejs/base` now
depends on the complete catalog of independent `@tradejs/strategy-*` packages.
No temporary re-export exists: remove direct aggregate imports and use the
specific strategy package or the runtime registry.

TrendLine and ReverseTrendLine share `@tradejs/strategy-trend-line`; all other
public strategy packages map one-to-one to their source repositories.
Strategy-neutral helpers live under explicit `@tradejs/strategy-kit/*`
subpaths. See [Repository and package ownership](../advanced/repository-ownership).

## Browser-safe AI configuration

AI endpoint, language, and model normalization moved from the server-only infra
package into browser-safe core subpaths:

```diff
- import { normalizeAiEndpoint } from '@tradejs/infra/aiEndpoints';
+ import { normalizeAiEndpoint } from '@tradejs/core/aiEndpoints';

- import { normalizeAiResponseLanguage } from '@tradejs/infra/aiLanguages';
+ import { normalizeAiResponseLanguage } from '@tradejs/core/aiLanguages';

- import { normalizeAiModel } from '@tradejs/infra/aiModels';
+ import { normalizeAiModel } from '@tradejs/core/aiModels';
```

`@tradejs/infra/userSettings` now returns stored values. Normalize them in the
runtime or UI composition layer through the matching `@tradejs/core/*` helper.

## Focused Timescale imports

The aggregate `@tradejs/infra/timescale` entrypoint was removed. Import the
narrowest adapter needed by the calling module:

```diff
- import { getCandlesRange, upsertCandles } from '@tradejs/infra/timescale';
+ import { getCandlesRange, upsertCandles } from '@tradejs/infra/timescale/candles';
```

Available Timescale subpaths are:

- `@tradejs/infra/timescale/client`
- `@tradejs/infra/timescale/candles`
- `@tradejs/infra/timescale/derivatives`
- `@tradejs/infra/timescale/spread`
- `@tradejs/infra/timescale/marketContext`
- `@tradejs/infra/timescale/hyperliquidWhales`

## Test connector

The runtime-backed `Test` connector is no longer exported by
`@tradejs/connectors`. Backtest integrations that construct it directly should
use:

```ts
import { createTestConnector } from '@tradejs/node/backtest';
```

This keeps the public connector plugin package independent from Node runtime
code. Normal `npx @tradejs/cli backtest` usage does not require a manual test
connector.

## Strategy registry initialization

`ensureAiStrategyPluginsLoaded` was removed from `@tradejs/node/ai`. A custom
Node composition root that uses strategy-aware AI adapters should initialize
the shared registry explicitly:

```ts
import { ensureStrategyPluginsLoaded } from '@tradejs/node/registry';

await ensureStrategyPluginsLoaded(process.cwd());
```

The TradeJS CLI and app already perform this initialization.

## Verification

After updating imports:

```bash
npm install
npm run build
npx @tradejs/cli doctor --skip-ml
```

Also search your code for root and source-deep imports. `@tradejs/core`,
`@tradejs/node`, and `@tradejs/infra` expose subpaths only; imports such as
`@tradejs/core/src/*` are not public API.
