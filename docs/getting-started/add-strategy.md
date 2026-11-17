---
title: Add a strategy to your TradeJS project
---

If the [catalog](../strategies/reference) lists a strategy under separately
installed packages, install it from your project folder. This example uses
[Triangle](../strategies/reference/triangle).

```bash
npm install --save-exact @tradejs/strategy-triangle
```

If your project uses `defineConfig(basePreset)`, add the package as a second
argument. This keeps the default strategies and connectors.

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['@tradejs/strategy-triangle'],
});
```

If you already have a `strategies` list, add the package to that list. Restart
the app with `npm run dev`. To run a backtest, follow
[the example for Triangle](../strategies/reference/triangle#backtest).
