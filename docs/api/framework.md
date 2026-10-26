---
sidebar_position: 5
title: Core API
---

`@tradejs/core` is the public package for strategy and indicator plugin development.

## Main Exports

- `defineConfig(basePreset, overrides)`
- `defineStrategyPlugin(plugin)`
- `defineIndicatorPlugin(plugin)`
- `defineConnectorPlugin(plugin)`
- Shared types are available from `@tradejs/types`

## Import Rule

- Import config/plugin registration from `@tradejs/core/config`.
- Import runtime/helpers from explicit public subpaths like `@tradejs/node/strategies`, `@tradejs/node/backtest`, `@tradejs/node/registry`, `@tradejs/core/indicators`, `@tradejs/core/math`, `@tradejs/core/time`, and `@tradejs/node/pine`.
- Import shared types from `@tradejs/types`.
- Do not use non-public deep imports.

`@tradejs/core`, `@tradejs/node`, and `@tradejs/infra` have no root export.

## Public Package Surfaces

Browser-safe `@tradejs/core` subpaths include:

- authoring and runtime contracts: `config`, `strategies`, `indicators`, `figures`
- data and calculation helpers: `data`, `math`, `time`, `tickers`, `trade`, `grid`, `backtest`
- shared utilities: `api`, `async`, `constants`
- AI setting normalization: `aiEndpoints`, `aiLanguages`, `aiModels`

Node-only `@tradejs/node` subpaths include:

- `strategies`, `registry`, `backtest`, `pine`
- `ai`, `connectors`, `cli`, `constants`

Server-only `@tradejs/infra` includes Redis, logging, files, HTTP, ML, user and
runtime settings, trading accounts, and focused Timescale subpaths. Import
candles, derivatives, spread, market context, Hyperliquid whale context, or the
Timescale client from `@tradejs/infra/timescale/*`; there is no aggregate
`@tradejs/infra/timescale` export in TradeJS 3.

## Project Config API

Create `tradejs.config.ts` in project root:

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

Each plugin entry is a module specifier string:

- npm package name (for example `@scope/my-plugin`)
- local relative path from project root (for example `./src/plugins/connector.ts`)
- absolute path or `file://` URL

Supported filenames:

- `tradejs.config.ts`
- `tradejs.config.mts`
- `tradejs.config.js`
- `tradejs.config.mjs`
- `tradejs.config.cjs`

## Shared Project Hooks

`tradejs.config.ts` also supports project-level `hooks`. These hooks apply to every strategy loaded by the current config.

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
      // Runs for every configured strategy on every candle.
      // Use it for shared risk rules or cross-strategy checks.
      void ctx;
      void market;
    },
    beforePlaceOrder: async ({ ctx, entry }) => {
      // Runs for every entry before connector placement.
      void ctx;
      void entry;
    },
  },
});
```

Use project hooks when the behavior should be shared across multiple strategies in the same project. Keep strategy-specific hooks in `manifest.ts`.

There are two groups of project hooks:

- strategy runtime hooks such as `onBar`, `afterBarDecision`, and `beforePlaceOrder`
- signals batch hooks such as `beforeSignals` and `afterSignals`

`beforeSignals` and `afterSignals` run around the `npx @tradejs/cli signals` pipeline, not around an individual strategy candle. They are only available in `tradejs.config.ts`, not in `manifest.ts`.

`beforeSignals` may abort the current signals run:

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

`afterSignals` receives the final outcome of the run, including collected signals, status, and total duration.

## Ready-made Project Hook Helpers

`@tradejs/node/strategies` exports optional hook helpers for common runtime
risk controls. They are not enabled by `basePreset`; add only the ones your
project should use.

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';
import {
  closeOppositePositionsBeforeOpen,
  createCloseAllOnGlobalProfitBeforeSignalsHook,
  createMoveStopToBreakEvenOnBarHook,
} from '@tradejs/node/strategies';

export default defineConfig(basePreset, {
  hooks: {
    beforeSignals: createCloseAllOnGlobalProfitBeforeSignalsHook({
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

Available helpers:

- `closeOppositePositionsBeforeOpen(...)` closes already-open positions on other symbols with the opposite direction before a new entry is placed. Use it from `beforePlaceOrder` when your project wants cross-symbol position cleanup before opening a new order.
- `createCloseAllOnGlobalProfitBeforeSignalsHook(...)` creates a `beforeSignals` hook. It checks aggregate unrealized PnL before ticker evaluation, closes all open positions when the configured global threshold is reached, and aborts the current `signals` run.
- `createMoveStopToBreakEvenOnBarHook(...)` creates an `onBar` hook. It moves the stop loss to the position entry price after the favorable move reaches the configured risk multiple. With no options it uses the default half-risk trigger.

`createCloseAllOnGlobalProfitBeforeSignalsHook` accepts:

- `getStrategyDefaultConfig(strategyName)` — optional resolver used to combine default strategy config with runtime strategy config before reading `MAX_LOSS_VALUE`.
- `profitRiskMultiplier` — optional multiplier for the average `MAX_LOSS_VALUE` threshold.

`createMoveStopToBreakEvenOnBarHook` accepts:

- `isEnabled(config)` — optional predicate for enabling the hook per strategy config.
- `triggerRiskMultiplier` — optional multiplier applied to the current or configured risk percentage. The default is `0.5`.

For the same stage:

- project hooks from `tradejs.config.ts` run first
- strategy hooks from `manifest.ts` run after them
- hooks are merged additively, so strategy-local hooks still work

## Strategy Plugin API

A strategy plugin exports `strategyEntries`:

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

Each strategy entry uses `manifest` with:

- required `name`
- optional `hooks`
- optional `aiAdapter`
- optional `mlAdapter`

For hook lifecycle details, see [Strategy Runtime Hooks](../strategies/authoring/strategy-hooks).

## Indicator Plugin API

An indicator plugin exports `indicatorEntries`:

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

## Connector Plugin API

A connector plugin exports `connectorEntries`:

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

## Runtime Types You Will Use Most

- `StrategyCreator`
- `StrategyDecision`
- `StrategyAPI`
- `Signal`
- `Direction`, `Interval`, `Candle`

See shared contracts in `@tradejs/types` and public helper/runtime entrypoints in `@tradejs/core/*` and `@tradejs/node/*`.

## Bounded closed-candle history

`StrategyAPI.getClosedCandles` is available in the verified framework cohort
`3.1.29-beta.281`; stable `3.1.28` does not include it. Use a complete exact
framework cohort when installing that beta.

```ts
const source = await strategyApi.getClosedCandles({
  interval: '15',
  start: sourceStart,
  end: sourceEnd,
  limit: 96,
});
if (!source.complete) {
  return strategyApi.skip('SOURCE_HISTORY_INCOMPLETE');
}
```

`sourceStart` and `sourceEnd` are UTC millisecond timestamps aligned to 15-minute
boundaries. The window is half-open `[start, end)` and cannot end after the
current decision candle closes. Only the `15`-minute source interval is accepted;
`limit` must cover all expected slots and cannot exceed 1536. The current
strategy symbol and connector are fixed by the runtime.

The result contains sorted `candles`, `complete`, `missingRanges`, `start`,
`end`, `interval` and the frozen decision boundary `asOf`. Missing candles are
reported rather than filled. Invalid or duplicate rows cause an error. In
`BACKTEST` and `PARITY`, reads use cached history only. Check completeness before
using the data; do not replace missing source candles with another interval.
