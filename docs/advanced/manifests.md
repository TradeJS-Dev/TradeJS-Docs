---
title: Manifests
---

Strategy manifests describe how a strategy is registered and enriched.

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
