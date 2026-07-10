---
sidebar_position: 7
title: Creating Strategies
---

This page explains the core strategy contract in TradeJS and where to place strategy logic.

TradeJS supports two strategy creation paths:

- [TypeScript strategy with `StrategyAPI`](./typescript-strategy-step-by-step)
- [Pine strategy with a dedicated `.pine` source](./pine-strategy-step-by-step)

## Typical Strategy Layout

Each strategy package (built-ins in `packages/strategies`, user plugins in `src/strategies`) usually has:

- `config.ts`
- `core.ts`
- `figures.ts` (if strategy draws custom lines/points/zones)
- `strategy.ts`
- `manifest.ts`
- `adapters/ai.ts` (optional)
- `adapters/ml.ts` (optional)
- `hooks.ts` (optional)

## Runtime Contract

`core.ts` returns one of three decisions:

- `skip`
- `entry`
- `exit`

Shared runtime handles:

- signal enrichment (AI/ML)
- policy gates
- order execution
- lifecycle hooks

Files:

- `@tradejs/node/strategies`
- `@tradejs/core/strategies`
- [Strategy Runtime Hooks](./strategy-hooks) (full lifecycle hooks catalog)

Import rule:

- import Node runtime wiring from `@tradejs/node/strategies`
- import pure strategy helpers from `@tradejs/core/strategies`
- import shared contracts from `@tradejs/types`
- avoid non-public deep imports

## Minimal `core.ts` Example

```ts
export const createMyStrategyCore: CreateStrategyCore<
  MyStrategyConfig
> = async ({ strategyApi }) => {
  return async () => {
    const position = await strategyApi.getCurrentPosition();
    if (position && position.qty > 0) {
      return strategyApi.skip('POSITION_EXISTS');
    }

    const { currentPrice } = await strategyApi.getDecisionPriceContext();

    const { stopLossPrice, takeProfitPrice } =
      strategyApi.getDirectionalTpSlPrices({
        price: currentPrice,
        direction: 'LONG',
        takeProfitDelta: 2,
        stopLossDelta: 1,
        unit: 'percent',
      });

    return strategyApi.entry({
      direction: 'LONG',
      orderPlan: {
        qty: 1,
        stopLossPrice,
        takeProfits: [{ rate: 1, price: takeProfitPrice }],
      },
    });
  };
};
```

## StrategyAPI Data Rules

- Use `getDecisionPriceContext()` for the current closed candle, timestamp, and signal-time price.
- Use `getCurrentIndicatorsContext()` for the strategy's typed indicator snapshot and `baseContext`. The snapshot type is inherited from `CreateStrategyCore`; do not pass a generic type argument to the method.
- Use `getCurrentPosition()` once and derive position existence from `qty`.
- Full market history is not exposed through `StrategyAPI`. Stateful detectors should rebuild from their initialization data and keep only the bounded rolling window they need.
- Return exits through `strategyApi.exit({ code, direction })`. Exit price and timestamp are resolved from the current closed candle and cannot be overridden by strategy code.

## Where Runtime Behavior Is Defined

- `manifest.ts`:

  - `entryRuntimeDefaults`
  - `hooks`
  - `aiAdapter`
  - `mlAdapter`

- `tradejs.config.ts`:

  - `hooks` for shared behavior across all strategies in the current project
  - useful for common risk rules, cross-strategy position handling, and shared order filters

- `adapters/*`:

  - runtime policy mapping from config (`mapEntryRuntimeFromConfig`)
  - AI/ML payload normalization

## Step-by-Step Guides

- [TypeScript Strategy Step by Step](./typescript-strategy-step-by-step) — full TypeScript strategy walkthrough
- [Pine Strategy Step by Step](./pine-strategy-step-by-step) — full Pine strategy walkthrough

## External Strategy as an npm Plugin

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['@scope/tradejs-strategy-pack'],
});
```

Plugin example:

- publish your strategy as an npm package and register it in `strategies`
