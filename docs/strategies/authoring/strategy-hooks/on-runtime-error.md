---
title: onRuntimeError
---

TradeJS calls this hook when it catches an error while running a strategy or a
hook.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['onRuntimeError']>>[0];
```

`market`, `decision`, and `entry` are optional because some failures happen before all stage-specific context exists.

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If `onRuntimeError` itself throws, the error is logged but not re-thrown.
