---
title: afterEnrichMl
---

TradeJS calls this hook after applying the ML model to an entry with a
`decision.signal`.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['afterEnrichMl']>>[0];
```

`ml` is explicit stage metadata:

- `ml.attempted === false` means runtime skipped ML before any ML request.
- `ml.applied === true` means ML produced a result and `ml.result` mirrors `entry.signal?.ml`.
- `ml.skippedReason` explains why the stage was a no-op.

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
