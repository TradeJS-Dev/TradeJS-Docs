---
title: Добавить индикаторы
---

Indicators преобразуют candle history в значения для стратегии.

Пользовательские индикаторы создаются как TypeScript plugins.

## Регистрация plugin

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  indicators: ['./src/plugins/myIndicator.plugin.ts'],
});
```

## Правила

- Делайте indicators reusable и strategy-neutral.
- Не допускайте future data leakage.
- Разделяйте current context и historical series.
- Добавляйте figures только если они помогают inspection.

Подробнее:

- [Создание индикаторов](../indicators/authoring)
- [Каталог индикаторов](../indicators/catalog)
