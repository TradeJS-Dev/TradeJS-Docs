---
title: Pine Indicator Plugins
---

TradeJS does not currently support authoring or registering standalone indicator plugins in Pine Script.

Pine support is limited to [Pine-backed strategies](../strategies/authoring/pine-strategy-step-by-step). A Pine strategy may use `plot(...)` internally to expose values that its TypeScript runtime bridge reads for signals and strategy figures, but those plots are not reusable TradeJS indicator plugins.

To create a custom indicator, use a [TypeScript indicator plugin](./authoring).
