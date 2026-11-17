---
title: afterEnrichMl
---

TradeJS вызывает этот обработчик после оценки входа моделью, если у решения есть
`decision.signal`.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['afterEnrichMl']>>[0];
```

`ml` содержит явный статус stage:

- `ml.attempted === false` значит, что runtime пропустил ML до любого ML request.
- `ml.applied === true` значит, что ML дал результат, и `ml.result` зеркалит `entry.signal?.ml`.
- `ml.skippedReason` объясняет, почему stage оказался no-op.

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
