---
title: onRuntimeError
---

TradeJS calls this hook when it catches an error while running a strategy or a
hook.

## Params

```tstype
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

`market`, `decision`, and `entry` are optional because some failures happen before all stage-specific context exists.

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If `onRuntimeError` itself throws, the error is logged but not re-thrown.
