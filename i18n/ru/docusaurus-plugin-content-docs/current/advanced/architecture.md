---
title: Архитектура
---

TradeJS разделён на публичные пакеты с чёткими границами:

- `@tradejs/core` — конфигурация, API для стратегий, индикторы, графики,
  математические функции и работа со временем. Пакет можно использовать в браузере;
- `@tradejs/node` — среда исполнения Node.js, бэктесты, загрузка Pine-стратегий и реестры;
- `@tradejs/types` - общие контракты;
- `@tradejs/infra` — работа с Redis, Timescale, ML, журналами и вводом-выводом;
- `@tradejs/strategy-*` — независимо версионируемые плагины стратегий;
- `@tradejs/strategy-kit/*` — общие функции для разных стратегий, которые можно
  использовать в браузере;
- `@tradejs/indicators` — встроенный каталог индикторов;
- `@tradejs/connectors` — каталог коннекторов и источников рыночных данных;
- `@tradejs/base` — стандартный набор компонентов;
- `@tradejs/cli` — команды для запуска и обслуживания;
- `@tradejs/app` — устанавливаемый веб-интерфейс на Next.js.

Импортируйте только публичные подпути: `@tradejs/core/config`,
`@tradejs/core/indicators`, `@tradejs/core/aiModels`,
`@tradejs/node/strategies`, `@tradejs/node/registry`,
`@tradejs/infra/redis`, `@tradejs/infra/timescale/candles`, `@tradejs/types`.

`@tradejs/core`, `@tradejs/node` и `@tradejs/infra` экспортируют только подпути.
Не импортируйте корень пакета или файлы из `@tradejs/*/src/*`. Пакеты `@tradejs/node` и
`@tradejs/infra` не должны попадать в клиентскую сборку для браузера.

Подробнее: [владение репозиториями](./repository-ownership) и
[Core API](../api/framework).
