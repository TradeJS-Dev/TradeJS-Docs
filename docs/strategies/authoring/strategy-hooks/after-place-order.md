---
title: afterPlaceOrder
---

TradeJS calls this hook after it places an entry order successfully, including
orders placed without a signal.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['afterPlaceOrder']>>[0];
```

`order.result` depends on the entry path:

- With signal: `order.result` is the `Signal` object.
- Without signal: `order.result` is the `decision.code` string.

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
