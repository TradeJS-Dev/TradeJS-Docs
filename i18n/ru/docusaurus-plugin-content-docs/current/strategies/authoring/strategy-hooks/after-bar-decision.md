---
title: afterBarDecision
---

Вызывается после того, как известно финальное решение по текущей свече.

Этот stage срабатывает на каждой свече после того, как runtime определил итоговое `StrategyDecision`, независимо от того, пришло это решение из `onBar` или из `core.ts`.

Используй этот хук, когда нужно наблюдать или дообрабатывать итог свечи даже в тех случаях, когда `onBar` short-circuit’нул выполнение до `core.ts`.

В `tradejs.config.ts` project-level `afterBarDecision` hooks могут вернуть трансформированное `StrategyDecision`. В strategy `manifest.ts` этот hook остается observe-only и не должен возвращать новое решение.

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

| Область                     | Тип возврата                                |
| --------------------------- | ------------------------------------------- |
| hook в `manifest.ts`        | `void` или `Promise<void>`                  |
| hook в `tradejs.config.ts` | `void`, `StrategyDecision` или `Promise<...>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
