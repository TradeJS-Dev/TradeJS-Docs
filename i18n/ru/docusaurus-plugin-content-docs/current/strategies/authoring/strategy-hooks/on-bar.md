---
title: onBar
---

TradeJS вызывает этот обработчик на каждой свече перед запуском `core.ts`.

Этот hook подходит для общей логики, которую нужно запускать до `core` даже если сама стратегия потом вернет `skip`: например, для shared risk checks, cross-strategy управления позициями или общих project-wide guard’ов.

## Где можно объявить

- `tradejs.config.ts -> hooks.onBar` для общих хуков на все стратегии проекта
- `manifest.ts -> hooks.onBar` для локальной pre-core логики одной стратегии

Project `onBar` hooks выполняются раньше, чем `onBar` hooks из strategy manifest.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['onBar']>>[0];
```

## Output

| Возврат               | Тип                                  |
| --------------------- | ------------------------------------ |
| Без return value      | `void` или `Promise<void>`           |
| Short-circuit свечи   | `StrategyDecision` или `Promise<...>` |

Если `onBar` возвращает `StrategyDecision`, текущая свеча short-circuit’ится:

- `core.ts` на этой свече уже не выполняется
- дальнейший runtime flow продолжается с возвращенного решения
- например, при возврате `skip` дальше все равно вызовется `onSkip`

Если hook бросает ошибку, runtime логирует ее, вызывает `onRuntimeError` и продолжает работу так, как будто hook вернул `undefined`.
