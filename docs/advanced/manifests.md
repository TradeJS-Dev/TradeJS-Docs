---
title: Manifests
---

A strategy manifest tells TradeJS which strategy a package exports and which
data to add to its signals.

Common manifest fields include:

- `name`
- optional `aiAdapter`
- optional `mlAdapter`
- optional runtime defaults
- optional lifecycle hooks

Built-in strategy plugins export registry entries that pair a manifest with a strategy creator.

```ts
export const strategyEntries = [
  {
    manifest: trendLineManifest,
    creator: TrendlineStrategyCreator,
  },
];
```

Project config loads those entries through plugin registration.

Related:

- [Plugins](../core-concepts/plugins)
- [Strategy runtime hooks](../strategies/authoring/strategy-hooks)
- [Core API](../api/framework)
