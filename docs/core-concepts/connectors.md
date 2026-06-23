---
title: Connectors
---

Connectors provide market data and execution access.

The built-in connector package is `@tradejs/connectors`. The default `basePreset` registers the built-in connector catalog.

Connectors may support:

- candle history
- ticker universe
- current prices
- positions
- order placement
- take-profit and stop-loss updates

## Connector Provider

Many CLI commands accept a connector/provider option:

```bash
npx @tradejs/cli backtest --connector bybit
npx @tradejs/cli signals --connector bybit
```

Use the provider that matches your data source and execution assumptions.

## Custom Connectors

Custom connector plugins are registered from `tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  connectors: ['./src/plugins/myConnector.plugin.ts'],
});
```

See [Plugins](./plugins) and [Add Exchange Connector](../operations/add-exchange-connector).
