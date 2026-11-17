---
title: onRuntimeError
---

TradeJS вызывает этот обработчик, если во время расчёта стратегии или вызова
другого обработчика произошла ошибка.

## Params

```ts
{
  ctx: StrategyHookCtx;
  market?: StrategyHookMarketContext;
  decision?: StrategyDecision;
  entry?: StrategyHookEntryContext;
  error: {
    stage: StrategyHookStage;
    cause: unknown;
  };
}
```

`market`, `decision` и `entry` опциональны, потому что некоторые ошибки происходят до того, как весь stage-specific контекст успел собраться.

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если сам `onRuntimeError` бросает ошибку, runtime логирует ее, но не пробрасывает дальше.
