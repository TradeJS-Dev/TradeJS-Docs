---
sidebar_label: Регистрация и бэктест
title: Регистрация, бэктест и проверка Pine-стратегии
description: 'Добавьте entrypoint, adapters, manifest, регистрацию plugin, backtest grid и команды проверки Pine-стратегии.'
---

Подключите код из предыдущих шагов как пакет стратегии и проверьте его на
исторических данных.

## 6. Установите библиотеку проверки настроек

Выполните в папке проекта:

```bash
npm install --save-exact @tradejs/strategy-kit
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

## 8. Регистрируйте через plugin + `tradejs.config.ts`

Создайте plugin entry (например, в `src/plugins/adaptiveMomentumRibbon.plugin.ts`):

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

Добавьте плагин в `tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/adaptiveMomentumRibbon.plugin.ts'],
});
```

Имя `ExamplePineRibbon` позволяет тестировать пример рядом со стратегией `AdaptiveMomentumRibbon` из стандартного набора.

## 9. Backtest grid config

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli JSON.SET \
  users:root:backtests:configs:ExamplePineRibbon:quickstart '$' \
  '{"INTERVAL":["15"]}' NX
```

Важно: имя backtest-конфига должно начинаться со стратегии (`ExamplePineRibbon:*`).

## 10. Запуск и проверка

Бэктест:

```bash
npm run backtest -- --config ExamplePineRibbon:quickstart --connector binance \
  --tickers BTCUSDT --timeframe 15 --days 7 --tests 1 --parallel 1
```

В UI (`/routes/backtest`) проверьте:

- события входа/выхода AMR
- Pine-figures (`kcMidline`, `kcUpper`, `kcLower`, `invalidationLevel`)

**Назад:** [запустите Pine и верните решение стратегии](./pine-strategy-runtime-decisions). Вернуться к [обзору руководства](./pine-strategy-step-by-step).
