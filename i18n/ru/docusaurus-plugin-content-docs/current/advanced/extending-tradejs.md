---
title: Расширение TradeJS
---

Стратегию, индикатор или подключение к бирже можно добавить как плагин. В
примерах ниже используются публичные интерфейсы пакетов.

Extension points:

- strategy plugins;
- indicator plugins;
- connector plugins;
- project-level runtime hooks;
- AI adapters;
- ML adapters.

Начинайте с малого:

1. Добавьте один local plugin.
2. Зарегистрируйте его в `tradejs.config.ts`.
3. Запустите один deterministic backtest.
4. Добавьте figures/diagnostics только если они помогают inspection.

Связанные страницы:

- [Plugins](../core-concepts/plugins)
- [Plugin E2E](../strategies/authoring/plugin-e2e)
- [Add exchange connector](../operations/add-exchange-connector)
