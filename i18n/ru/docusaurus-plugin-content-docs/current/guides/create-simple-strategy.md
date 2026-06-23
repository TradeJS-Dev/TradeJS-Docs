---
title: Создать простую стратегию
---

Для первой пользовательской стратегии начните с подробного гайда:

- [Пошаговое создание стратегии на TypeScript](../strategies/authoring/typescript-strategy-step-by-step)

Короткий путь:

1. Создайте config.
2. Реализуйте `core.ts`.
3. Экспортируйте manifest и strategy creator.
4. Зарегистрируйте plugin в `tradejs.config.ts`.
5. Запустите маленький backtest.

## Регистрация

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['./src/plugins/simpleMa.plugin.ts'],
});
```

## Контракт решения

Стратегия возвращает:

- `strategyApi.skip('REASON')`;
- `strategyApi.entry({ direction, orderPlan })`;
- `strategyApi.exit({ code, direction })`.

Логика должна быть causal: используйте только данные, доступные на текущей свече.
