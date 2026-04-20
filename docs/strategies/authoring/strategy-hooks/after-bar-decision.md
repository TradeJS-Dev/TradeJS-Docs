---
title: afterBarDecision
---

Called after the final candle decision is known.

This stage runs for every candle after runtime has resolved its final `StrategyDecision`, regardless of whether that decision came from `onBar` or from `core.ts`.

Use this hook when you need to observe or post-process the final result of the candle even if `onBar` short-circuited execution before `core.ts`.

In `tradejs.config.ts`, project-level `afterBarDecision` hooks may return a transformed `StrategyDecision`. In strategy `manifest.ts`, `afterBarDecision` is observe-only and should not return a new decision.

## Params

```ts
{
  ctx: StrategyHookCtx;
  market: {
    candle: KlineChartItem;
    btcCandle: KlineChartItem;
  };
  decision: SkipDecision | EntryDecision | ExitDecision | ProtectDecision;
}
```

## Output

| Scope                     | Return type                                  |
| ------------------------- | -------------------------------------------- |
| `manifest.ts` hook        | `void` or `Promise<void>`                    |
| `tradejs.config.ts` hook | `void`, `StrategyDecision`, or `Promise<...>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
