---
title: onInit
---

TradeJS calls this hook once, after creating the strategy instance and before
processing the first candle.

## Params

```tstype
{
  ctx: StrategyHookCtx;
  market: {
    data: KlineChartItem[];
    btcData: KlineChartItem[];
  };
}
```

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
