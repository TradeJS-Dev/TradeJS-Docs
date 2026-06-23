---
title: Use Pine Script-inspired workflows
---

TradeJS supports Pine Script-inspired strategy workflows through Node runtime helpers and Pine-backed strategy modules.

Use this path when you want to keep a Pine source file close to its original form while using TradeJS for backtesting, runtime integration, and artifacts.

## Typical Shape

- keep Pine source in a dedicated `.pine` file
- load it from the strategy runtime
- map Pine output into TradeJS signals, figures, and order plans
- validate behavior with backtests

Built-in example:

- [AdaptiveMomentumRibbon](../strategies/reference/adaptive-momentum-ribbon)

Deep dive:

- [Pine strategy step by step](../strategies/authoring/pine-strategy-step-by-step)
