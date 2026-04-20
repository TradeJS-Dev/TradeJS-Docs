---
title: onBar
---

Called on every candle before `core.ts`.

Use this hook for global or pre-core behavior that should run even when the strategy itself would later return `skip`, for example shared risk checks, cross-strategy position management, or project-wide order guards.

## Where It Can Be Defined

- `tradejs.config.ts -> hooks.onBar` for shared hooks across all strategies in the project
- `manifest.ts -> hooks.onBar` for strategy-local pre-core logic

Project `onBar` hooks run before strategy manifest `onBar` hooks.

## Params

```ts
{
  ctx: StrategyHookCtx;
  market: {
    candle: KlineChartItem;
    btcCandle: KlineChartItem;
  };
}
```

## Output

| Return                | Type                                 |
| --------------------- | ------------------------------------ |
| No return value       | `void` or `Promise<void>`            |
| Short-circuit bar     | `StrategyDecision` or `Promise<...>` |

If `onBar` returns a `StrategyDecision`, the current candle is short-circuited:

- `core.ts` does not run for that candle
- later runtime flow continues from the returned decision
- for example, returning `skip` will still trigger `onSkip`

If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues as if the hook returned `undefined`.
