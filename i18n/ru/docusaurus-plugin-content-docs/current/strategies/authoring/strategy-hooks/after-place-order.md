---
title: afterPlaceOrder
---

TradeJS вызывает этот обработчик после успешной постановки ордера на вход. Он
работает и для входов без сигнала.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['afterPlaceOrder']>>[0];
```

`order.result` зависит от entry path:

- При signal path: `order.result` — это объект `Signal`.
- При no-signal path: `order.result` — это строка `decision.code`.

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
