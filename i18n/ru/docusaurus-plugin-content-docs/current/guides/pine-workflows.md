---
title: Pine Script-inspired workflows
---

TradeJS поддерживает Pine Script-inspired workflow через Node runtime helpers и Pine-backed strategy modules.

Типовая форма:

- Pine source лежит в отдельном `.pine` файле;
- strategy runtime загружает его;
- Pine output мапится в TradeJS signals, figures и order plans;
- поведение проверяется backtests.

Built-in пример:

- [AdaptiveMomentumRibbon](../strategies/reference/adaptive-momentum-ribbon)

Deep dive:

- [Pine strategy step by step](../strategies/authoring/pine-strategy-step-by-step)
