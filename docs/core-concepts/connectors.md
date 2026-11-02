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

## Bybit entry size and leverage

In the published `3.1.29-beta.285` connector cohort, entry quantity is capped
at the instrument's market or limit order maximum, then rounded down to the
quantity step. It is never increased to meet the minimum. Invalid limits or a
quantity below the minimum block entry. Protective exits continue to cover the
full position.

Before entry, the connector sets and reads back the effective leverage. The
requested value is capped by the instrument limit and risk tier, including
existing positions and pending orders, and rounded to the leverage step.
Unknown exchange state, an unconfirmed value or unsupported hedge mode blocks
entry. Reducing leverage does not increase quantity or change margin mode.
Inspect `orderLeverage` for requested/effective values and the reduction reason,
and `orderFailureReason` for a blocked entry. These changes are not included in
`latest` `3.1.28`.
