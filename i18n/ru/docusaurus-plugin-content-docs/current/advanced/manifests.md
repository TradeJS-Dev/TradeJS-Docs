---
title: Manifests
---

Strategy manifest описывает регистрацию и enrichment стратегии.

Обычно содержит:

- `name`;
- optional `aiAdapter`;
- optional `mlAdapter`;
- runtime defaults;
- lifecycle hooks.

Registry entry связывает manifest и creator:

```ts
export const strategyEntries = [
  {
    manifest: trendLineManifest,
    creator: TrendlineStrategyCreator,
  },
];
```

Связанные страницы:

- [Plugins](../core-concepts/plugins)
- [Strategy runtime hooks](../strategies/authoring/strategy-hooks)
- [Core API](../api/framework)
