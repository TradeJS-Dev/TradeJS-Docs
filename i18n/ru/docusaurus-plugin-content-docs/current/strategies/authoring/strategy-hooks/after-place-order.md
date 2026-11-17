---
title: afterPlaceOrder
---

TradeJS вызывает этот обработчик после успешной постановки ордера на вход. Он
работает и для входов без сигнала.

## Params

```ts
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

`order.result` зависит от entry path:

- При signal path: `order.result` — это объект `Signal`.
- При no-signal path: `order.result` — это строка `decision.code`.

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
