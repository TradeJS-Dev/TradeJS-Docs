---
sidebar_label: Registration and Backtest
title: Register, Backtest, and Validate a Pine Strategy
description: 'Add the Pine strategy entrypoint, adapters, manifest, plugin registration, backtest grid, and validation commands.'
---

This is chapter 4 of the [Pine strategy walkthrough](./pine-strategy-step-by-step). It exposes the completed runtime bridge as a strategy package and validates it through the normal TradeJS workflow.

## 6. Add Strategy Runtime Entrypoint (`strategy.ts`)

```ts
import { createStrategyRuntime } from '@tradejs/node/strategies';
import {
  AdaptiveMomentumRibbonConfig,
  config as DEFAULT_CONFIG,
} from './config';
import { createAdaptiveMomentumRibbonCore } from './core';
import { adaptiveMomentumRibbonManifest } from './manifest';

export const AdaptiveMomentumRibbonStrategyCreator =
  createStrategyRuntime<AdaptiveMomentumRibbonConfig>({
    strategyName: 'AdaptiveMomentumRibbon',
    defaults: DEFAULT_CONFIG as AdaptiveMomentumRibbonConfig,
    createCore: createAdaptiveMomentumRibbonCore,
    manifest: adaptiveMomentumRibbonManifest,
    strategyDirectory: __dirname,
  });
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
  name: 'AdaptiveMomentumRibbon',
  aiAdapter: adaptiveMomentumRibbonAiAdapter,
  mlAdapter: adaptiveMomentumRibbonMlAdapter,
};
```

### `index.ts`

```ts
export { AdaptiveMomentumRibbonStrategyCreator } from './strategy';
export { adaptiveMomentumRibbonManifest } from './manifest';
```

## 8. Register via Plugin + `tradejs.config.ts`

Create plugin entry (for example, in `src/plugins/adaptiveMomentumRibbon.plugin.ts`):

```ts
import { defineStrategyPlugin } from '@tradejs/core/config';
import { adaptiveMomentumRibbonManifest } from './AdaptiveMomentumRibbon/manifest';
import { AdaptiveMomentumRibbonStrategyCreator } from './AdaptiveMomentumRibbon/strategy';

export const strategyEntries = [
  {
    manifest: adaptiveMomentumRibbonManifest,
    creator: AdaptiveMomentumRibbonStrategyCreator,
  },
];

export default defineStrategyPlugin({ strategyEntries });
```

Then include this plugin in root `tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/adaptiveMomentumRibbon.plugin.ts'],
  runtime: {
    deployments: {
      production: {
        connectorName: 'bybit',
        accountId: 'bybit-main',
        strategies: {
          AdaptiveMomentumRibbon: {
            enabled: true,
            config: {
              INTERVAL: '15',
              UNIVERSE: 'crypto',
              BACKTEST_PRICE_MODE: 'mid',
              AMR_MOMENTUM_PERIOD: 20,
              AMR_BUTTERWORTH_SMOOTHING: 3,
              AMR_WAIT_CLOSE: true,
              AMR_SHOW_INVALIDATION_LEVELS: true,
              AMR_SHOW_KELTNER_CHANNEL: true,
              AMR_KC_LENGTH: 20,
              AMR_KC_MA_TYPE: 'EMA',
              AMR_ATR_LENGTH: 14,
              AMR_ATR_MULTIPLIER: 2,
              AMR_EXIT_ON_INVALIDATION: true,
              AMR_LOOKBACK_BARS: 400,
              AMR_LINE_PLOTS: [
                'kcMidline',
                'kcUpper',
                'kcLower',
                'invalidationLevel',
              ],
              LONG: { enable: true, direction: 'LONG', TP: 2, SL: 1 },
              SHORT: { enable: true, direction: 'SHORT', TP: 2, SL: 1 },
              AI_ENABLED: false,
              ML_ENABLED: false,
              ML_THRESHOLD: 0.1,
              MIN_AI_QUALITY: 3,
            },
          },
        },
      },
    },
  },
});
```

After that, `AdaptiveMomentumRibbon` is available to runtime/backtests as a standard plugin strategy.

`tradejs.config.ts` is the source of live strategy settings. Pin its package
and lockfile with the configuration; TradeJS derives the runtime identifiers
from the verified composition. Redis retains the trading account and optional
pause override only.

## 9. Backtest Grid Config

```bash
redis-cli JSON.SET users:root:backtests:configs:AdaptiveMomentumRibbon:amr-default '$' '{
  "ENV": ["BACKTEST"],
  "INTERVAL": ["15"],
  "MAKE_ORDERS": [true],
  "BACKTEST_PRICE_MODE": ["mid"],
  "AMR_MOMENTUM_PERIOD": [20],
  "AMR_BUTTERWORTH_SMOOTHING": [3],
  "AMR_WAIT_CLOSE": [true],
  "AMR_SHOW_INVALIDATION_LEVELS": [true],
  "AMR_SHOW_KELTNER_CHANNEL": [true],
  "AMR_KC_LENGTH": [20],
  "AMR_KC_MA_TYPE": ["EMA"],
  "AMR_ATR_LENGTH": [14],
  "AMR_ATR_MULTIPLIER": [2],
  "AMR_EXIT_ON_INVALIDATION": [true],
  "AMR_LOOKBACK_BARS": [400],
  "AMR_LINE_PLOTS": [["kcMidline", "kcUpper", "kcLower", "invalidationLevel"]],
  "LONG": [{"enable": true, "direction": "LONG", "TP": 2, "SL": 1}],
  "SHORT": [{"enable": true, "direction": "SHORT", "TP": 2, "SL": 1}],
  "AI_ENABLED": [false],
  "ML_ENABLED": [false],
  "ML_THRESHOLD": [0.1],
  "MIN_AI_QUALITY": [3]
}'
```

Important: backtest config key must start with strategy name (`AdaptiveMomentumRibbon:*`).

## 10. Run and Validate

Backtest:

```bash
npx @tradejs/cli backtest --user root --config AdaptiveMomentumRibbon:amr-default --connector bybit --tests 200 --parallel 4
```

Signals:

```bash
npx @tradejs/cli signals --user root --cacheOnly
```

In app (`/routes/backtest`) verify:

- AMR entry/exit events
- Pine-derived figures (`kcMidline`, `kcUpper`, `kcLower`, `invalidationLevel`)

**Previous:** [Run Pine and return strategy decisions](./pine-strategy-runtime-decisions). Return to the [walkthrough overview](./pine-strategy-step-by-step).
