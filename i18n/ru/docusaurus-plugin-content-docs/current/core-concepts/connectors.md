---
title: Коннекторы
---

Connectors дают доступ к market data и execution.

Default `basePreset` регистрирует built-in connector catalog из `@tradejs/connectors`.

Connector может поддерживать:

- candle history;
- ticker universe;
- current prices;
- positions;
- order placement;
- take-profit/stop-loss updates.

Пример:

```bash
npx @tradejs/cli backtest --connector bybit
npx @tradejs/cli signals --connector bybit
```

Custom connector подключается через `tradejs.config.ts`:

```ts
export default defineConfig(basePreset, {
  connectors: ['./src/plugins/myConnector.plugin.ts'],
});
```
