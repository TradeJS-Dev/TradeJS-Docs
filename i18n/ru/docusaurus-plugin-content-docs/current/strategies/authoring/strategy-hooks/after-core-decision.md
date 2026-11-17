---
title: afterCoreDecision
---

TradeJS вызывает этот обработчик сразу после того, как `core.ts` вернул решение.

Этот stage срабатывает только если свеча дошла до `core.ts`. Если `onBar` уже вернул `StrategyDecision` на этой же свече, `afterCoreDecision` пропускается.

В `tradejs.config.ts` project-level `afterCoreDecision` hooks могут вернуть трансформированное `StrategyDecision`. В strategy `manifest.ts` этот hook остается observe-only и не должен возвращать новое решение.

Если нужен хук, который всегда видит итог по свече, используй [`afterBarDecision`](./after-bar-decision).

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['afterCoreDecision']>>[0];
```

## Output

| Область                     | Тип возврата                                |
| --------------------------- | ------------------------------------------- |
| hook в `manifest.ts`        | `void` или `Promise<void>`                  |
| hook в `tradejs.config.ts` | `void`, `StrategyDecision` или `Promise<...>` |

Этот хук не может блокировать runtime flow. Если он бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу.
