---
title: beforePlaceOrder
---

TradeJS вызывает этот обработчик перед отправкой ордера на вход. Он работает и
для входов без сигнала.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['beforePlaceOrder']>>[0];
```

Используй `entry.context` вместо отдельного top-level alias `entryContext`.

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
