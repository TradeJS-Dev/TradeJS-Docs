---
title: Add indicators
---

Indicators transform candle history into values a strategy can use.

Use built-in indicators when possible. Add a custom indicator when your strategy needs reusable derived data.

## Plugin Registration

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  indicators: ['./src/plugins/myIndicator.plugin.ts'],
});
```

## Design Rules

- Keep indicators reusable and strategy-neutral.
- Avoid future data leakage.
- Keep current-value context separate from historical series.
- Add figures only when they help inspect the decision.

Deep dives:

- [Writing indicators](../indicators/authoring)
- [Indicator catalog](../indicators/catalog)
- [Pine indicators](../indicators/pine)
