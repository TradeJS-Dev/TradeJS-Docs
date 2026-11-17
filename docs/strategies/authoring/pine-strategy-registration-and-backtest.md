---
sidebar_label: Registration and Backtest
title: Register, Backtest, and Validate a Pine Strategy
description: 'Add the Pine strategy entrypoint, adapters, manifest, plugin registration, backtest grid, and validation commands.'
---

Register the code from the earlier steps as a strategy package, then test it on
historical data.

## 6. Install the configuration helper

Run this from the project folder:

```bash
npm install --save-exact @tradejs/strategy-kit
```

## 7. Add Adapters + Manifest + Public Exports

### `adapters/ai.ts`

```ts
import { mapAiRuntimeFromConfig } from '@tradejs/core/strategies';
import { AdaptiveMomentumRibbonConfig } from '../config';
import { StrategyAiAdapter } from '@tradejs/types';

export const adaptiveMomentumRibbonAiAdapter: StrategyAiAdapter = {
  mapEntryRuntimeFromConfig: (config) =>
    mapAiRuntimeFromConfig(
      config as Pick<
        AdaptiveMomentumRibbonConfig,
        'AI_ENABLED' | 'MIN_AI_QUALITY'
      >,
    ),
};
```

### `adapters/ml.ts`

```ts
import { mapMlRuntimeFromConfig } from '@tradejs/core/strategies';
import { AdaptiveMomentumRibbonConfig } from '../config';
import { StrategyMlAdapter } from '@tradejs/types';

export const adaptiveMomentumRibbonMlAdapter: StrategyMlAdapter = {
  mapEntryRuntimeFromConfig: (config) =>
    mapMlRuntimeFromConfig(
      config as Pick<
        AdaptiveMomentumRibbonConfig,
        'ML_ENABLED' | 'ML_THRESHOLD'
      >,
    ),
};
```

### `manifest.ts`

```ts
import { adaptiveMomentumRibbonAiAdapter } from './adapters/ai';
import { adaptiveMomentumRibbonMlAdapter } from './adapters/ml';
import { StrategyManifest } from '@tradejs/types';

export const adaptiveMomentumRibbonManifest: StrategyManifest = {
  name: 'ExamplePineRibbon',
  aiAdapter: adaptiveMomentumRibbonAiAdapter,
  mlAdapter: adaptiveMomentumRibbonMlAdapter,
};
```

### `index.ts`

```ts
export { createAdaptiveMomentumRibbonCore } from './core';
export { adaptiveMomentumRibbonManifest } from './manifest';
```

## 8. Register via Plugin + `tradejs.config.ts`

Create plugin entry (for example, in `src/plugins/adaptiveMomentumRibbon.plugin.ts`):

```ts
import { defineStrategyPlugin } from '@tradejs/core/config';
import { createStrategyConfigParser } from '@tradejs/strategy-kit/config';
import { config } from '../strategies/AdaptiveMomentumRibbon/config';
import { adaptiveMomentumRibbonManifest } from '../strategies/AdaptiveMomentumRibbon/manifest';
import { createAdaptiveMomentumRibbonCore } from '../strategies/AdaptiveMomentumRibbon/core';

export const strategyEntries = [
  {
    manifest: adaptiveMomentumRibbonManifest,
    defaults: config,
    parseConfig: createStrategyConfigParser({
      strategyName: adaptiveMomentumRibbonManifest.name,
      defaults: config,
    }),
    createCore: createAdaptiveMomentumRibbonCore,
  },
];

export default defineStrategyPlugin({ strategyEntries });
```

Add the plugin to `tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/adaptiveMomentumRibbon.plugin.ts'],
});
```

`ExamplePineRibbon` lets you test the example alongside the built-in `AdaptiveMomentumRibbon` strategy.

## 9. Backtest Grid Config

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli JSON.SET \
  users:root:backtests:configs:ExamplePineRibbon:quickstart '$' \
  '{"INTERVAL":["15"]}' NX
```

Important: backtest config key must start with strategy name (`ExamplePineRibbon:*`).

## 10. Run and Validate

Backtest:

```bash
npm run backtest -- --config ExamplePineRibbon:quickstart --connector binance \
  --tickers BTCUSDT --timeframe 15 --days 7 --tests 1 --parallel 1
```

In app (`/routes/backtest`) verify:

- AMR entry/exit events
- Pine-derived figures (`kcMidline`, `kcUpper`, `kcLower`, `invalidationLevel`)

**Previous:** [Run Pine and return strategy decisions](./pine-strategy-runtime-decisions). Return to the [walkthrough overview](./pine-strategy-step-by-step).
