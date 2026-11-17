---
title: Разработка плагина от начала до конца
---

Соберите пакет плагина, добавьте его в `tradejs.config.ts` и проверьте через
публичные интерфейсы TradeJS.

## 1. Создайте пакет плагина

- Пакет должен экспортировать `strategyEntries` и/или `indicatorEntries`.
- Используйте контракты из `@tradejs/types` и функции определения
  плагинов из `@tradejs/core/config`.

## 2. Реализуйте стратегию или индикатор

- Запись стратегии содержит `manifest`, `defaults`, `parseConfig` и `createCore`. См. [пример](./typescript-strategy-step-by-step).
- Плагин индикатора: `compute` и необязательный `renderer`.

## 3. Подключите плагин в проекте

Добавьте пакет в `tradejs.config.ts`:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['@scope/my-plugin'],
  indicators: ['@scope/my-plugin'],
});
```

## 4. Проверьте локально

- Запустите app/docs.
- Прогоните `signals` и/или `backtest`.

## 5. Публикация

- Обновите версию и changelog.
- Опубликуйте в npm/private registry.
- Зафиксируйте версию плагина в production.
