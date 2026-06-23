---
title: Extending TradeJS
---

Extend TradeJS through plugins and public package APIs.

## Extension Points

- strategy plugins
- indicator plugins
- connector plugins
- project-level runtime hooks
- AI adapters
- ML adapters

## Start Small

1. Add one local plugin.
2. Register it from `tradejs.config.ts`.
3. Run one deterministic backtest.
4. Add figures or diagnostics only where they help inspection.
5. Move shared code into reusable helpers after the behavior is clear.

## Keep Boundaries Clear

- browser-safe helpers belong in `@tradejs/core`
- Node runtime orchestration belongs in `@tradejs/node`
- infra adapters belong in `@tradejs/infra`
- shared contracts belong in `@tradejs/types`

Related:

- [Plugins](../core-concepts/plugins)
- [Plugin end-to-end guide](../strategies/authoring/plugin-e2e)
- [Add exchange connector](../operations/add-exchange-connector)
