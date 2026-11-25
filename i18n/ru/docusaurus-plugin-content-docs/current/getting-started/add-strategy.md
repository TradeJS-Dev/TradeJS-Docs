---
title: Как подключить стратегию
---

В [Marketplace](https://tradejs.dev/marketplace) тег `base` отмечает стратегии
из стандартного набора. В этом примере подключим
[Triangle](https://tradejs.dev/marketplace/triangle).

Выполните в папке проекта:

```bash
npm install --save-exact @tradejs/strategy-triangle
```

Если ваш `tradejs.config.ts` содержит `defineConfig(basePreset)`, добавьте
пакет вторым аргументом. Так в проекте останутся стандартные стратегии
и подключения к биржам.

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['@tradejs/strategy-triangle'],
});
```

Если в файле уже есть список `strategies`, добавьте пакет туда. Перезапустите
приложение командой `npm run dev`. Для проверки используйте
[пример бэктеста Triangle](https://tradejs.dev/marketplace/triangle#backtest).
