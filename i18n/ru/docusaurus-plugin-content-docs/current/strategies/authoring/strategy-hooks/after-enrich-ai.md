---
title: afterEnrichAi
---

TradeJS вызывает этот обработчик после проверки входа с помощью ИИ, если у
решения есть `decision.signal`.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['afterEnrichAi']>>[0];
```

`ai.quality` присутствует только когда `ai.applied === true`. Если AI был пропущен или не вернул quality, смотри `ai.attempted` и `ai.skippedReason`.

## Output

| Возврат          | Тип                        |
| ---------------- | -------------------------- |
| Без return value | `void` или `Promise<void>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
