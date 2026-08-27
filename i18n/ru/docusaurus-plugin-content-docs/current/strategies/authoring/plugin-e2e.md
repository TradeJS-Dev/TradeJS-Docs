---
title: Разработка плагина от начала до конца
---

Плагин оформляется как пакет, подключается в `tradejs.config.ts` и
проверяется через публичные интерфейсы TradeJS.

## 1. Создайте пакет плагина

- Пакет должен экспортировать `strategyEntries` и/или `indicatorEntries`.
- Используйте контракты из `@tradejs/types` и функции определения
  плагинов из `@tradejs/core/config`.

## 2. Реализуйте стратегию или индикатор

- Плагин стратегии: `manifest` и `creator`.
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
