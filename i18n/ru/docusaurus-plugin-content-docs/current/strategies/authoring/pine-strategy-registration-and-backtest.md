---
sidebar_label: Регистрация и бэктест
title: Регистрация, бэктест и проверка Pine-стратегии
description: 'Добавьте entrypoint, adapters, manifest, регистрацию plugin, backtest grid и команды проверки Pine-стратегии.'
---

Это глава 4 [пошагового руководства по Pine-стратегии](./pine-strategy-step-by-step). Здесь готовый runtime-мост публикуется как пакет стратегии и проверяется стандартным workflow TradeJS.

## 6. Добавьте runtime entrypoint стратегии (`strategy.ts`)

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

## 7. Добавьте adapters + manifest + публичные экспорты

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

## 8. Регистрируйте через plugin + `tradejs.config.ts`

Создайте plugin entry (например, в `src/plugins/adaptiveMomentumRibbon.plugin.ts`):

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

Далее подключите этот plugin в корневом `tradejs.config.ts`:

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

После этого `AdaptiveMomentumRibbon` доступна runtime/backtest как обычная plugin-стратегия.

`tradejs.config.ts` — источник настроек реальной торговли. Зафиксируйте пакет
стратегии и lock-файл вместе с конфигурацией; TradeJS сам вычислит
идентификаторы среды исполнения из проверенной сборки. Redis хранит только
торговый счёт и временную паузу.

## 9. Backtest grid config

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

Важно: имя backtest-конфига должно начинаться со стратегии (`AdaptiveMomentumRibbon:*`).

## 10. Запуск и проверка

Бэктест:

```bash
npx @tradejs/cli backtest --user root --config AdaptiveMomentumRibbon:amr-default --connector bybit --tests 200 --parallel 4
```

Сигналы:

```bash
npx @tradejs/cli signals --user root --cacheOnly
```

В UI (`/routes/backtest`) проверьте:

- события входа/выхода AMR
- Pine-figures (`kcMidline`, `kcUpper`, `kcLower`, `invalidationLevel`)

**Назад:** [запустите Pine и верните решение стратегии](./pine-strategy-runtime-decisions). Вернуться к [обзору руководства](./pine-strategy-step-by-step).
