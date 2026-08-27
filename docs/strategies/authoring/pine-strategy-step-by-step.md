---
sidebar_label: Pine Strategy Step by Step
title: Add and Backtest a Pine Script Strategy in TradeJS
description: 'Add a Pine Script strategy to TradeJS through four focused chapters covering Pine source, figures, the runtime bridge, registration, and backtesting.'
---

This walkthrough shows how to add a Pine strategy to TradeJS as a normal first-class strategy module. The complete `AdaptiveMomentumRibbon` implementation is split into focused chapters so you can load and follow only the task you are working on.

If you need the TypeScript-only path, see [TypeScript strategy with `StrategyAPI`](./typescript-strategy-step-by-step).

## Follow the implementation path

1. [Create the module, Pine source, and configuration](./pine-strategy-pine-and-config) — folder layout, `.pine` source, and typed strategy configuration.
2. [Build entry figures](./pine-strategy-figures) — translate Pine plots into TradeJS chart lines and points.
3. [Implement the runtime bridge](./pine-strategy-runtime-bridge) — run Pine, read plots, and emit TradeJS decisions.
4. [Register, backtest, and validate](./pine-strategy-registration-and-backtest) — entrypoint, adapters, manifest, plugin wiring, grid, and checks.

Each chapter links to the previous and next step. The original guide URL remains this overview, so bookmarks and search results continue to lead into the complete workflow.
