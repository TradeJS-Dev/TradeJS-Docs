---
title: Add a strategy to your TradeJS project
---

The [Marketplace](https://tradejs.dev/marketplace) marks strategies included in the
standard project with the `base` tag. This example adds
[Triangle](https://tradejs.dev/marketplace/triangle). Install the package from your project folder.

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
[the example for Triangle](https://tradejs.dev/marketplace/triangle#backtest).
