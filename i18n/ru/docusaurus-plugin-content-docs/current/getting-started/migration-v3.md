---
title: Миграция на TradeJS 3
---

В TradeJS 3 границы пакетов стали явными. Стандартная структура проекта от
`create-tradejs` не изменилась, но custom-интеграциям могут понадобиться новые
пути импортов. Во время миграции держите engine packages на одной совместимой
major-версии.

## Отдельные strategy packages

Aggregate-пакет `@tradejs/strategies` удалён. `@tradejs/base` теперь зависит от
полного каталога независимых пакетов `@tradejs/strategy-*`. Временного
re-export нет: удалите прямые aggregate imports и используйте конкретный
strategy package или runtime registry.

TrendLine и ReverseTrendLine используют общий
`@tradejs/strategy-trend-line`; остальные публичные strategy packages
соответствуют своим source repositories один-к-одному. Нейтральные helpers
живут в явных `@tradejs/strategy-kit/*` subpaths. Подробнее:
[Владение репозиториями и пакетами](../advanced/repository-ownership).

## Browser-safe AI-конфигурация

Нормализация endpoint, языка и модели AI перенесена из server-only infra в
browser-safe subpath'ы core:

```diff
- import { normalizeAiEndpoint } from '@tradejs/infra/aiEndpoints';
+ import { normalizeAiEndpoint } from '@tradejs/core/aiEndpoints';

- import { normalizeAiResponseLanguage } from '@tradejs/infra/aiLanguages';
+ import { normalizeAiResponseLanguage } from '@tradejs/core/aiLanguages';

- import { normalizeAiModel } from '@tradejs/infra/aiModels';
+ import { normalizeAiModel } from '@tradejs/core/aiModels';
```

`@tradejs/infra/userSettings` теперь возвращает сохраненные значения без
нормализации. Нормализуйте их в runtime- или UI-composition слое через
соответствующий helper из `@tradejs/core/*`.

## Узкие Timescale-импорты

Агрегирующий entrypoint `@tradejs/infra/timescale` удален. Импортируйте самый
узкий адаптер, который нужен модулю:

```diff
- import { getCandlesRange, upsertCandles } from '@tradejs/infra/timescale';
+ import { getCandlesRange, upsertCandles } from '@tradejs/infra/timescale/candles';
```

Доступные Timescale subpath'ы:

- `@tradejs/infra/timescale/client`
- `@tradejs/infra/timescale/candles`
- `@tradejs/infra/timescale/derivatives`
- `@tradejs/infra/timescale/spread`
- `@tradejs/infra/timescale/marketContext`
- `@tradejs/infra/timescale/hyperliquidWhales`

## Test connector

Runtime-backed connector `Test` больше не экспортируется из
`@tradejs/connectors`. Backtest-интеграции, которые создают его напрямую,
должны использовать:

```ts
import { createTestConnector } from '@tradejs/node/backtest';
```

Обычный запуск `npx @tradejs/cli backtest` не требует создавать test connector
вручную.

## Инициализация strategy registry

`ensureAiStrategyPluginsLoaded` удален из `@tradejs/node/ai`. Custom Node
composition root со strategy-aware AI adapters должен явно загрузить общий
registry:

```ts
import { ensureStrategyPluginsLoaded } from '@tradejs/node/registry';

await ensureStrategyPluginsLoaded(process.cwd());
```

TradeJS CLI и app уже делают эту инициализацию.

## Проверка

После обновления импортов:

```bash
npm install
npm run build
npx @tradejs/cli doctor --skip-ml
```

Также найдите root- и source-deep импорты. `@tradejs/core`, `@tradejs/node` и
`@tradejs/infra` экспортируют только subpath'ы; `@tradejs/core/src/*` не является
публичным API.
