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
- Import runtime/helpers from explicit public subpaths like `@tradejs/node/strategies`, `@tradejs/node/backtest`, `@tradejs/core/indicators`, `@tradejs/core/math`, `@tradejs/core/time`, `@tradejs/node/pine`.
- Import shared types from `@tradejs/types`.
- Do not use non-public deep imports.

## Utilities Convention (Contributors)

- Keep browser-safe helpers inside `@tradejs/core`, Node runtime helpers inside `@tradejs/node`, and infra adapters inside `@tradejs/infra`.
- Keep test-only helpers isolated from runtime code and export only stable APIs.
- Avoid duplicated helper logic across runtime files; extract shared helpers instead.

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
