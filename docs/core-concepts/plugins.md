---
title: Plugins
---

TradeJS loads strategies, indicators, and connectors as plugins.

Project-level registration happens in `tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/myStrategy.plugin.ts'],
  indicators: ['./src/plugins/myIndicator.plugin.ts'],
  connectors: ['./src/plugins/myConnector.plugin.ts'],
});
```

## Expected Exports

- strategy plugin: `strategyEntries`
- indicator plugin: `indicatorEntries`
- connector plugin: `connectorEntries`

Use helper functions from `@tradejs/core/config`:

- `defineStrategyPlugin`
- `defineIndicatorPlugin`
- `defineConnectorPlugin`

## Module Specifiers

Plugin entries can be:

- npm package names
- local relative paths from project root
- absolute paths
- `file://` URLs

## Import Rule

Use public package subpaths. Do not import from `@tradejs/*/src/*`.

Next: [Plugin end-to-end guide](../strategies/authoring/plugin-e2e).
