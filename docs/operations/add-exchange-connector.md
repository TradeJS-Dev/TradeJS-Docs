---
title: Add a New Exchange Connector
---

Add the connector as a plugin, register it in `tradejs.config.ts`, then check the
commands that will use it.

Important:

- connectors can be registered via `tradejs.config.ts` using `connectors`
- connector plugins export `connectorEntries`
- CLI/runtime resolve providers and connector names from the merged built-in + plugin connector registry

## 1. Implement Connector Creator

Create `myExchangeConnector.ts` and export `MyExchangeConnectorCreator` typed as `ConnectorCreator` from `@tradejs/types`.

The returned `Connector` describes the market and supported capabilities, lists instruments and candles, stores state, and provides position and order methods. Report rejected exchange operations as failures. For a history integration, start by checking the instrument list and candles.

## 2. Export Connector Plugin Entries

In your connector package, export `connectorEntries`:

```ts
import { defineConnectorPlugin } from '@tradejs/core/config';
import type { ConnectorRegistryEntry } from '@tradejs/types';

import { MyExchangeConnectorCreator } from './myExchangeConnector';

const connectorEntries: ConnectorRegistryEntry[] = [
  {
    name: 'MyExchange',
    providers: ['myexchange', 'mx'],
    creator: MyExchangeConnectorCreator,
  },
];

export default defineConnectorPlugin({ connectorEntries });
```

Then connect plugin package in root config:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  connectors: ['@your-scope/tradejs-connectors'],
});
```

## 3. CLI Integration Points

Already map-based and plugin-aware:

- `backtest` command in `@tradejs/cli`
- `continuity` command in `@tradejs/cli`

Still strategy-specific/fixed in current architecture:

- `backtest.ts` and `signals.ts` also load BTC reference data from Binance/Coinbase for spread/correlation paths
- `results.ts --coverage` uses ByBit ticker universe for denominator

So adding a connector for generic market history is easy, but some flows intentionally keep Binance/Coinbase/ByBit roles.

## 4. Recommended Validation Checklist

1. Run TypeScript checks in your connector project.
2. Run unit tests in your connector project.
3. `npm exec -- tradejs backtest --updateOnly --connector '<provider>' --config '<Strategy:Config>' --timeframe 15`
4. `npm exec -- tradejs backtest --connector '<provider>' --config '<Strategy:Config>' --tests 20`

## 5. Optional Next Step

If you want even fewer entry points for new connectors, you can extract BTC reference providers and coverage universe into configurable provider settings instead of fixed Binance/Coinbase/ByBit choices.
