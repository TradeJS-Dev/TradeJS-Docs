---
sidebar_label: Пошаговое создание стратегии на TypeScript
title: Как написать торговую стратегию на TypeScript
description: 'Создайте стратегию пересечения скользящих средних на TypeScript через TradeJS StrategyAPI: файлы, публичные импорты, конфигурация, регистрация и тесты.'
---

Напишите стратегию на TypeScript через `StrategyAPI`, подключите её как плагин и
проверьте решения в тестах.

Пример стратегии: простое пересечение MA.

В примере действуют два правила импортов:

- используйте публичные подпути `@tradejs/core/*` для кода браузера,
  `@tradejs/node/*` для среды Node.js и `@tradejs/types` для типов;
- не импортируйте непубличные внутренние файлы.

[Как пройти это руководство с агентом](../../guides/develop-with-an-agent).

## 1. Создайте файлы

Создайте папку:

- `src/strategies/SimpleMa`

Создайте файлы:

- `config.ts`
- `core.ts`
- `manifest.ts`
- `src/plugins/simpleMa.plugin.ts`

## 2. Добавьте конфиг стратегии (`config.ts`)

В папке проекта установите библиотеку проверки настроек:

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

## 3. Добавьте логику стратегии (`core.ts`)

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

## 4. Опишите стратегию в манифесте

`manifest.ts`:

```ts
import type { StrategyManifest } from '@tradejs/types';

export const simpleMaManifest: StrategyManifest = { name: 'SimpleMa' };
```

## 5. Экспортируйте plugin entry

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

## 6. Добавьте backtest grid

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

## 7. Запустите и проверьте

```bash
npm run backtest -- --config SimpleMa:quickstart --connector binance \
  --tickers BTCUSDT --timeframe 15 --days 7 --tests 4 --parallel 1
npm exec -- tradejs results --strategy SimpleMa --coverage --user root
```

## Примечания

- `getCurrentIndicatorsContext().indicators` приходит из общего indicator pipeline и типизируется через декларацию `CreateStrategyCore` текущей стратегии.
- В `core.ts` оставляйте только стратегическую логику. Исполнение, AI/ML, hooks и placement делает shared runtime.
- Для Pine-пути используйте [Pine Strategy Step by Step](./pine-strategy-step-by-step).
