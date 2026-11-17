---
title: onRuntimeError
---

TradeJS вызывает этот обработчик, если во время расчёта стратегии или вызова
другого обработчика произошла ошибка.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['onRuntimeError']>>[0];
```

`market`, `decision` и `entry` опциональны, потому что некоторые ошибки происходят до того, как весь stage-specific контекст успел собраться.

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если сам `onRuntimeError` бросает ошибку, runtime логирует ее, но не пробрасывает дальше.
