---
title: afterEnrichAi
---

TradeJS calls this hook after the AI check on an entry with a `decision.signal`.

## Params

```tstype
{
  ctx: StrategyHookCtx;
  market: {
    candle: KlineChartItem;
    btcCandle: KlineChartItem;
  };
  decision: EntryDecision;
  entry: StrategyHookEntryContext;
  ml: StrategyHookMlContext;
  ai: StrategyHookAiContext;
}
```

`ai.quality` is present only when `ai.applied === true`. When AI was skipped or produced no score, inspect `ai.attempted` and `ai.skippedReason`.

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
