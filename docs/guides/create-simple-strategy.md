---
title: Create a simple strategy
---

Start with the existing TypeScript strategy guide if you are building your first custom strategy:

- [TypeScript Strategy Step by Step](../strategies/authoring/typescript-strategy-step-by-step)

The shortest shape is:

1. Create a strategy config.
2. Implement `core.ts`.
3. Export a manifest and strategy creator.
4. Register the strategy plugin from `tradejs.config.ts`.
5. Run a small backtest.

## Minimal Registration

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/simpleMa.plugin.ts'],
});
```

## Decision Contract

Your strategy should return:

- `strategyApi.skip('REASON')`
- `strategyApi.entry({ direction, orderPlan })`
- `strategyApi.exit({ code, direction })`

Keep strategy logic causal: only use data available at the current candle timestamp.

Next: [Examples](../examples).
