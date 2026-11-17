---
title: onInit
---

TradeJS вызывает этот обработчик один раз, после создания экземпляра стратегии и
до расчёта первой свечи.

## Params

```ts
{
  ctx: StrategyHookCtx;
  market: {
    data: KlineChartItem[];
    btcData: KlineChartItem[];
  };
}
```

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
