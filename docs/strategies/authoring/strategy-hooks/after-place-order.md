---
title: afterPlaceOrder
---

TradeJS calls this hook after it places an entry order successfully, including
orders placed without a signal.

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
  policy: StrategyHookPolicyContext;
  ml?: StrategyHookMlContext;
  ai?: StrategyHookAiContext;
  order: StrategyHookOrderContext;
}
```

`order.result` depends on the entry path:

- With signal: `order.result` is the `Signal` object.
- Without signal: `order.result` is the `decision.code` string.

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
