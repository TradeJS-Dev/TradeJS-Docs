---
title: beforePlaceOrder
---

TradeJS calls this hook just before sending an entry order to the connector. It
runs for entries with or without a signal.

## Params

```ts
import type { StrategyManifest } from '@tradejs/types';

type Params = Parameters<NonNullable<NonNullable<StrategyManifest['hooks']>['beforePlaceOrder']>>[0];
```

Use `entry.context` instead of a separate top-level `entryContext` alias.

## Output

| Return          | Type                      |
| --------------- | ------------------------- |
| No return value | `void` or `Promise<void>` |

This hook cannot block runtime flow. If it throws, the error is logged, `onRuntimeError` is called, and the runtime continues.
