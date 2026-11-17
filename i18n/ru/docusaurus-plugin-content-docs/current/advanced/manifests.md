---
title: Manifests
---

Манифест сообщает TradeJS, какую стратегию предоставляет пакет и какими данными
можно дополнить её сигналы.

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
