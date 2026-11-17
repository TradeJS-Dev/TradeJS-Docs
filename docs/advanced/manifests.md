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

A strategy entry provides `manifest`, `defaults`, `parseConfig`, and `createCore`. See the [registration example](../api/framework#strategy-plugin-api).

Project config loads those entries through plugin registration.

Related:

- [Plugins](../core-concepts/plugins)
- [Strategy runtime hooks](../strategies/authoring/strategy-hooks)
- [Core API](../api/framework)
