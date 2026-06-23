---
title: Плагины
---

TradeJS загружает strategies, indicators и connectors как plugins.

Регистрация в `tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/myStrategy.plugin.ts'],
  indicators: ['./src/plugins/myIndicator.plugin.ts'],
  connectors: ['./src/plugins/myConnector.plugin.ts'],
});
```

Ожидаемые exports:

- strategy plugin: `strategyEntries`;
- indicator plugin: `indicatorEntries`;
- connector plugin: `connectorEntries`.

Используйте helpers из `@tradejs/core/config`: `defineStrategyPlugin`, `defineIndicatorPlugin`, `defineConnectorPlugin`.

Не импортируйте из `@tradejs/*/src/*`.
