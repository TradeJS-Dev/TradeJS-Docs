---
title: beforeEntryGate
---

TradeJS вызывает `beforeEntryGate` после встроенных проверок, перед отправкой
ордера на вход. Обработчик работает и для входов без сигнала.

## Параметры

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
}
```

`policy.aiQuality` равен `undefined`, когда сигнала нет или AI не вернул оценку качества.

## Результат

| Возврат             | Тип                                                                                        | Эффект                                    |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| Разрешить/запретить | `{ allow?: boolean; reason?: string }` или `Promise<{ allow?: boolean; reason?: string }>` | Если `allow === false`, вход блокируется. |
| Без результата    | `void` или `Promise<void>`                                                                 | Вход продолжается.                        |

Если проверка запрещает вход (`allow === false`):

- Если существует `entry.signal`, TradeJS записывает `signal.orderStatus = 'skipped'` и `signal.orderSkipReason = 'HOOK_BEFORE_ENTRY_GATE:${reason}'` или `HOOK_BEFORE_ENTRY_GATE`.
- Если сигнала нет, TradeJS возвращает строку `HOOK_BEFORE_ENTRY_GATE:${reason}` или `HOOK_BEFORE_ENTRY_GATE`.

Если проверка завершается исключением, TradeJS
записывает ошибку в журнал и блокирует вход с кодом `HOOK_BEFORE_ENTRY_GATE:ERROR`.
