---
title: Коннекторы
---

Коннекторы дают стратегиям доступ к рыночным данным и исполнению ордеров.

Стандартный `basePreset` регистрирует встроенный каталог коннекторов из
`@tradejs/connectors`.

Коннектор может поддерживать:

- историю свечей;
- список торгуемых символов;
- текущие цены;
- позиции;
- постановку ордеров;
- обновление тейк-профита и стоп-лосса.

Пример:

```bash
npx @tradejs/cli backtest --connector bybit
npx @tradejs/cli signals --connector bybit
```

Пользовательский коннектор подключается через `tradejs.config.ts`:

```ts
export default defineConfig(basePreset, {
  connectors: ['./src/plugins/myConnector.plugin.ts'],
});
```
