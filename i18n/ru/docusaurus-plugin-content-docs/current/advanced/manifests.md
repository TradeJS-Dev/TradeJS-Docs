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

В записи стратегии плагин указывает `manifest`, `defaults`, `parseConfig` и `createCore`. См. [пример регистрации](../api/framework#strategy-plugin-api).

Связанные страницы:

- [Plugins](../core-concepts/plugins)
- [Strategy runtime hooks](../strategies/authoring/strategy-hooks)
- [Core API](../api/framework)
