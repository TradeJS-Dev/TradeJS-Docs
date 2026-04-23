---
sidebar_position: 5
title: Базовый API
---

`@tradejs/core` — публичный пакет для разработки strategy и indicator плагинов в TradeJS.

## Что экспортируется

- `defineConfig(basePreset, overrides)`
- `defineStrategyPlugin(plugin)`
- `defineIndicatorPlugin(plugin)`
- `defineConnectorPlugin(plugin)`
- общие типы доступны из `@tradejs/types`

## Правило импортов

- Импортируйте config/plugin registration из `@tradejs/core/config`.
- Импортируйте runtime/хелперы из явных публичных subpath’ов вроде `@tradejs/node/strategies`, `@tradejs/node/backtest`, `@tradejs/core/indicators`, `@tradejs/core/math`, `@tradejs/core/time`, `@tradejs/node/pine`.
- Импортируйте общие типы из `@tradejs/types`.
- Не используйте непубличные deep-imports.

## Конвенции по утилитам (для контрибьюторов)

- Browser-safe helper’ы держите в `@tradejs/core`, Node runtime helper’ы в `@tradejs/node`, infra-адаптеры в `@tradejs/infra`.
- Тестовые helper-утилиты изолируйте от runtime-кода и экспортируйте только стабильные API.
- Избегайте дублирования helper-логики в runtime-файлах; выносите общий код в единые функции.

## Как подключить плагины

Создайте `tradejs.config.ts` в корне проекта:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['@scope/my-strategy-plugin', './src/plugins/strategy.ts'],
  indicators: ['@scope/my-indicator-plugin', './src/plugins/indicator.ts'],
  connectors: ['@scope/my-connector-plugin', './src/plugins/connector.ts'],
  hooks: {
    onBar: async ({ ctx, market }) => {
      void ctx;
      void market;
    },
  },
});
```

Каждый элемент в списке плагинов — это строка-модуль:

- npm-пакет (например `@scope/my-plugin`)
- локальный относительный путь от корня проекта (например `./src/plugins/connector.ts`)
- абсолютный путь или `file://` URL

Поддерживаемые имена файла:

- `tradejs.config.ts`
- `tradejs.config.mts`
- `tradejs.config.js`
- `tradejs.config.mjs`
- `tradejs.config.cjs`

## Общие хуки проекта

`tradejs.config.ts` поддерживает project-level `hooks`. Они применяются ко всем стратегиям, которые загружены текущим config.

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  hooks: {
    beforeSignals: async ({
      connectorName,
      tickers,
      runtimeStrategies,
    }) => {
      void connectorName;
      void tickers;
      void runtimeStrategies;
    },
    onBar: async ({ ctx, market }) => {
      // Вызывается для каждой подключенной стратегии на каждой свече.
      // Подходит для общих risk rules и cross-strategy проверок.
      void ctx;
      void market;
    },
    beforePlaceOrder: async ({ ctx, entry }) => {
      // Вызывается перед постановкой ордера для любого entry.
      void ctx;
      void entry;
    },
  },
});
```

Используйте project hooks, когда логика должна быть общей для нескольких стратегий в одном проекте. Стратегически-специфичные hooks оставляйте в `manifest.ts`.

У project hooks есть две группы:

- strategy runtime hooks, например `onBar`, `afterBarDecision` и `beforePlaceOrder`
- batch hooks для signals, например `beforeSignals` и `afterSignals`

`beforeSignals` и `afterSignals` оборачивают весь пайплайн `npx @tradejs/cli signals`, а не одну свечу конкретной стратегии. Их можно объявлять только в `tradejs.config.ts`, но не в `manifest.ts`.

`beforeSignals` может прервать текущий прогон signals:

```ts
export default defineConfig(basePreset, {
  hooks: {
    beforeSignals: async () => {
      return {
        abort: true,
        reason: 'GLOBAL_UNREALIZED_PNL_TARGET_REACHED_CLOSE_ALL',
      };
    },
  },
});
```

`afterSignals` получает итог выполнения: найденные сигналы, статус и общую длительность прогона.

## Готовые project hook helpers

`@tradejs/node/strategies` экспортирует опциональные helpers для типовых
runtime risk controls. Они не включаются автоматически через `basePreset`;
добавляйте только те хуки, которые нужны конкретному проекту.

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';
import { getBuiltInStrategyDefaultConfig } from '@tradejs/strategies';
import {
  closeOppositePositionsBeforeOpen,
  createCloseAllOnGlobalProfitBeforeSignalsHook,
  createMoveStopToBreakEvenOnBarHook,
} from '@tradejs/node/strategies';

export default defineConfig(basePreset, {
  hooks: {
    beforeSignals: createCloseAllOnGlobalProfitBeforeSignalsHook({
      getStrategyDefaultConfig: getBuiltInStrategyDefaultConfig,
      profitRiskMultiplier: 5,
    }),
    onBar: createMoveStopToBreakEvenOnBarHook(),
    beforePlaceOrder: async ({ ctx, entry }) => {
      if (!ctx.strategyConfig.CLOSE_OPPOSITE_POSITIONS) {
        return;
      }

      await closeOppositePositionsBeforeOpen({
        connector: ctx.connector,
        entryContext: entry.context,
      });
    },
  },
});
```

Доступные helpers:

- `closeOppositePositionsBeforeOpen(...)` закрывает уже открытые позиции на других символах с противоположным направлением перед постановкой нового entry. Используйте его из `beforePlaceOrder`, если проекту нужна cross-symbol очистка позиций перед новым ордером.
- `createCloseAllOnGlobalProfitBeforeSignalsHook(...)` создает `beforeSignals` hook. Он проверяет общий unrealized PnL до обработки тикеров, закрывает все открытые позиции при достижении глобального порога и прерывает текущий запуск `signals`.
- `createMoveStopToBreakEvenOnBarHook(...)` создает `onBar` hook. Он переносит stop loss в цену входа позиции после того, как движение в плюс достигло заданного множителя риска. Без параметров используется дефолтный trigger в половину риска.

`createCloseAllOnGlobalProfitBeforeSignalsHook` принимает:

- `getStrategyDefaultConfig(strategyName)` — опциональный resolver, который нужен, чтобы объединить default config стратегии с runtime config перед чтением `MAX_LOSS_VALUE`.
- `profitRiskMultiplier` — опциональный множитель для порога от среднего `MAX_LOSS_VALUE`.

`createMoveStopToBreakEvenOnBarHook` принимает:

- `isEnabled(config)` — опциональный predicate для включения хука по config конкретной стратегии.
- `triggerRiskMultiplier` — опциональный множитель от текущего или сконфигурированного процента риска. Дефолт — `0.5`.

Для одного и того же stage:

- сначала выполняются project hooks из `tradejs.config.ts`
- затем hooks из `manifest.ts`
- hooks merge’ятся дополнительно, поэтому strategy-local hooks не отключаются

## Strategy plugin API

Плагин стратегии экспортирует `strategyEntries`:

```ts
import { defineStrategyPlugin } from '@tradejs/core/config';
import type { StrategyRegistryEntry } from '@tradejs/types';

const strategyEntries: StrategyRegistryEntry[] = [
  {
    manifest: { name: 'MyStrategy' },
    creator: async () => {
      return async () => 'NO_SIGNAL';
    },
  },
];

export default defineStrategyPlugin({ strategyEntries });
```

## Strategy Manifest

Каждый strategy entry содержит `manifest` с полями:

- обязательное `name`
- опциональные `hooks`
- опциональный `aiAdapter`
- опциональный `mlAdapter`

Подробно про lifecycle-хуки: [Strategy Runtime Hooks](../strategies/authoring/strategy-hooks).

## Indicator plugin API

Плагин индикаторов экспортирует `indicatorEntries`:

```ts
import { defineIndicatorPlugin } from '@tradejs/core/config';

export default defineIndicatorPlugin({
  indicatorEntries: [
    {
      indicator: { id: 'myIndicator', label: 'My Indicator', enabled: false },
      historyKey: 'myIndicatorHistory',
      compute: ({ data }) => data.at(-1)?.close ?? null,
      renderer: {
        indicatorName: 'MY_INDICATOR',
        shortName: 'MY_IND',
        paneId: 'candle_pane',
        figures: [{ key: 'myIndicator', title: 'MY_IND', type: 'line' }],
      },
    },
  ],
});
```

## Connector plugin API

Плагин коннекторов экспортирует `connectorEntries`:

```ts
import { defineConnectorPlugin } from '@tradejs/core/config';
import type { ConnectorRegistryEntry } from '@tradejs/types';

const connectorEntries: ConnectorRegistryEntry[] = [
  {
    name: 'MyExchange',
    providers: ['myexchange', 'mx'],
    creator: async ({ userName }) => {
      return {
        kline: async () => [],
        getTickers: async () => [],
        getPosition: async () => null,
        getPositions: async () => [],
        placeOrder: async () => true,
        closePosition: async () => true,
        getState: async () => ({}),
        setState: async () => {},
      };
    },
  },
];

export default defineConnectorPlugin({ connectorEntries });
```

## Типы, которые чаще всего нужны

- `StrategyCreator`
- `StrategyDecision`
- `StrategyAPI`
- `Signal`
- `Direction`, `Interval`, `Candle`

Общие контракты лежат в `@tradejs/types`, а публичные helper/runtime entrypoint’ы — в `@tradejs/core/*` и `@tradejs/node/*`.
