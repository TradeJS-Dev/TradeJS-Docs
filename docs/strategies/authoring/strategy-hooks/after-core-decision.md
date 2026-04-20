---
title: afterCoreDecision
---

Called right after `core.ts` returns a decision.

This stage only runs when the candle reached `core.ts`. If `onBar` already returned a `StrategyDecision` for the same candle, `afterCoreDecision` is skipped.

In `tradejs.config.ts`, project-level `afterCoreDecision` hooks may return a transformed `StrategyDecision`. In strategy `manifest.ts`, `afterCoreDecision` is observe-only and should not return a new decision.

If you need a hook that always sees the final result of the candle, use [`afterBarDecision`](./after-bar-decision) instead.

## Params

```tstype
{
  ctx: StrategyHookCtx;
  market: {
    candle: KlineChartItem;
    btcCandle: KlineChartItem;
  };
  decision: SkipDecision | EntryDecision | ExitDecision;
}
```

## Output

| Scope                     | Return type                                  |
| ------------------------- | -------------------------------------------- |
| `manifest.ts` hook        | `void` or `Promise<void>`                    |
| `tradejs.config.ts` hook | `void`, `StrategyDecision`, or `Promise<...>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
