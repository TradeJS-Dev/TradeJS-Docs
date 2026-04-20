---
title: afterCoreDecision
---

Вызывается сразу после того, как `core.ts` вернул решение.

Этот stage срабатывает только если свеча дошла до `core.ts`. Если `onBar` уже вернул `StrategyDecision` на этой же свече, `afterCoreDecision` пропускается.

В `tradejs.config.ts` project-level `afterCoreDecision` hooks могут вернуть трансформированное `StrategyDecision`. В strategy `manifest.ts` этот hook остается observe-only и не должен возвращать новое решение.

Если нужен хук, который всегда видит итог по свече, используй [`afterBarDecision`](./after-bar-decision).

## Params

```ts
{
  ctx: StrategyHookCtx;
  market: {
    candle: KlineChartItem;
    btcCandle: KlineChartItem;
  }
  decision: SkipDecision | EntryDecision | ExitDecision;
}
```

## Output

| Область                     | Тип возврата                                |
| --------------------------- | ------------------------------------------- |
| hook в `manifest.ts`        | `void` или `Promise<void>`                  |
| hook в `tradejs.config.ts` | `void`, `StrategyDecision` или `Promise<...>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
