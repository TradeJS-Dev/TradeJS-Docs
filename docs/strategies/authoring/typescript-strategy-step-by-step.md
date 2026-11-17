---
sidebar_label: TypeScript Strategy Step by Step
title: Build a TypeScript Trading Strategy Step by Step
description: 'Build a complete moving-average crossover strategy in TypeScript with TradeJS StrategyAPI, public package imports, configuration, registration, and tests.'
---

Build a TypeScript strategy with `StrategyAPI`, load it as a plugin, and check its
decisions in tests.

Example strategy: simple MA crossover.

Import rule for this guide:

- use public `@tradejs/core/*` subpaths for browser-safe helpers, `@tradejs/node/*` for Node runtime wiring, and `@tradejs/types` for types
- do not use non-public deep imports

[Work through this guide with an agent](../../guides/develop-with-an-agent).

## 1. Create Files

Create a folder:

- `src/strategies/SimpleMa`

Create files:

- `config.ts`
- `core.ts`
- `manifest.ts`
- `src/plugins/simpleMa.plugin.ts`

## 2. Add Strategy Config (`config.ts`)

Install the configuration helper in your project:

```bash
npm install --save-exact @tradejs/strategy-kit
```

```ts
import type { Interval, StrategyConfig } from '@tradejs/types';

export const config = {
  INTERVAL: '15' as Interval,
  MA_FAST: 21,
  MA_SLOW: 55,
  TP_PERCENT: 2,
  SL_PERCENT: 1,
  MAX_LOSS_VALUE: 10,
};

export type SimpleMaConfig = StrategyConfig & typeof config;
```

## 3. Add Core Logic (`core.ts`)

```ts
import type {
  CreateStrategyCore,
  Direction,
  IndicatorsHistorySnapshot,
} from '@tradejs/types';
import type { SimpleMaConfig } from './config';

const getCrossDirection = ({
  fastPrev,
  fastCurrent,
  slowPrev,
  slowCurrent,
}: {
  fastPrev: number;
  fastCurrent: number;
  slowPrev: number;
  slowCurrent: number;
}): Direction | null => {
  const entryLong = fastPrev <= slowPrev && fastCurrent > slowCurrent;
  const entryShort = fastPrev >= slowPrev && fastCurrent < slowCurrent;

  if (entryLong) return 'LONG';
  if (entryShort) return 'SHORT';
  return null;
};

export const createSimpleMaCore: CreateStrategyCore<
  SimpleMaConfig,
  IndicatorsHistorySnapshot | undefined
> = async ({ config, strategyApi }) => {
  return async () => {
    const { indicators } = strategyApi.getCurrentIndicatorsContext();
    const maFast = Array.isArray(indicators?.maFast) ? indicators.maFast : [];
    const maSlow = Array.isArray(indicators?.maSlow) ? indicators.maSlow : [];

    if (maFast.length < 2 || maSlow.length < 2) {
      return strategyApi.skip('WAIT_MA_DATA');
    }

    const [fastPrev, fastCurrent] = maFast.slice(-2);
    const [slowPrev, slowCurrent] = maSlow.slice(-2);

    const direction = getCrossDirection({
      fastPrev,
      fastCurrent,
      slowPrev,
      slowCurrent,
    });

    if (!direction) {
      return strategyApi.skip('NO_CROSS');
    }

    const position = await strategyApi.getCurrentPosition();
    if (position && position.qty > 0) {
      return strategyApi.skip('POSITION_EXISTS');
    }

    const { currentPrice } = await strategyApi.getDecisionPriceContext();

    const { stopLossPrice, takeProfitPrice, qty } =
      strategyApi.getDirectionalTpSlPrices({
        price: currentPrice,
        direction,
        takeProfitDelta: config.TP_PERCENT,
        stopLossDelta: config.SL_PERCENT,
        unit: 'percent',
        maxLossValue: config.MAX_LOSS_VALUE,
      });

    if (qty === undefined || !Number.isFinite(qty) || qty <= 0) {
      return strategyApi.skip('INVALID_QTY');
    }

    return strategyApi.entry({
      direction,
      indicators: {
        maFast: fastCurrent,
        maSlow: slowCurrent,
      },
      additionalIndicators: {
        cross: direction === 'LONG' ? 'bullish' : 'bearish',
      },
      orderPlan: {
        qty,
        stopLossPrice,
        takeProfits: [{ rate: 1, price: takeProfitPrice }],
      },
    });
  };
};
```

## 4. Name the strategy in its manifest

`manifest.ts`:

```ts
import type { StrategyManifest } from '@tradejs/types';

export const simpleMaManifest: StrategyManifest = { name: 'SimpleMa' };
```

## 5. Export Plugin Entry

`src/plugins/simpleMa.plugin.ts`:

```ts
import { defineStrategyPlugin } from '@tradejs/core/config';
import { createStrategyConfigParser } from '@tradejs/strategy-kit/config';
import { config } from '../strategies/SimpleMa/config';
import { createSimpleMaCore } from '../strategies/SimpleMa/core';
import { simpleMaManifest } from '../strategies/SimpleMa/manifest';

export default defineStrategyPlugin({
  strategyEntries: [{
    manifest: simpleMaManifest,
    defaults: config,
    parseConfig: createStrategyConfigParser({
      strategyName: simpleMaManifest.name,
      defaults: config,
    }),
    createCore: createSimpleMaCore,
  }],
});
```

`tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/simpleMa.plugin.ts'],
});
```

## 6. Add a Backtest Grid

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli JSON.SET \
  users:root:backtests:configs:SimpleMa:quickstart '$' '{
  "INTERVAL": ["15"],
  "MA_FAST": [14, 21],
  "MA_SLOW": [50, 55],
  "TP_PERCENT": [2],
  "SL_PERCENT": [1],
  "MAX_LOSS_VALUE": [10]
}' NX
```

## 7. Run and Validate

```bash
npm run backtest -- --config SimpleMa:quickstart --connector binance \
  --tickers BTCUSDT --timeframe 15 --days 7 --tests 4 --parallel 1
npm exec -- tradejs results --strategy SimpleMa --coverage --user root
```

## Notes

- `getCurrentIndicatorsContext().indicators` comes from the shared indicator pipeline and is typed by the strategy's `CreateStrategyCore` declaration.
- Keep `core.ts` focused on decision logic. Execution, AI/ML, hooks, and order placement are handled by shared runtime.
- If you need Pine integration, use [Pine Strategy Step by Step](./pine-strategy-step-by-step).
