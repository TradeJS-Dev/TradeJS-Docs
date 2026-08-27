---
title: Плагины
---

TradeJS загружает стратегии, индикаторы и коннекторы как плагины.

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

Каждый вид плагина экспортирует своё поле:

- плагин стратегии: `strategyEntries`;
- плагин индикатора: `indicatorEntries`;
- плагин коннектора: `connectorEntries`.

Для определения плагинов используйте `defineStrategyPlugin`,
`defineIndicatorPlugin` и `defineConnectorPlugin` из `@tradejs/core/config`.

Не импортируйте из `@tradejs/*/src/*`.
