---
title: What is TradeJS?
---

TradeJS helps developers build, test, and automate trading strategies using TypeScript.

At the simplest level, a TradeJS project contains:

- market data as candles
- one or more strategies that read those candles
- signals that describe possible entries or exits
- a runtime that can backtest, scan, and optionally automate execution
- metrics and artifacts that help you compare strategy behavior

TradeJS is not a black-box trading product. It is a developer framework. You write or configure the strategy, run it against historical data, inspect the output, and decide whether it is suitable for further research or automation.

## What You Can Do

- Research strategy ideas with TypeScript or Pine Script-inspired workflows.
- Run backtests and compare strategy/config variants.
- Generate runtime signals from the same strategy logic.
- Register custom strategy, indicator, and connector plugins.
- Use AI/ML workflows as optional research and gating layers.
- Inspect results in the installable app.

## Public Surface

Use public packages:

- `@tradejs/core` for config, strategy authoring helpers, indicators, math, time, and figures
- `@tradejs/node` for Node-only runtime helpers, backtests, Pine loading, and registries
- `@tradejs/cli` for setup, backtests, signals, results, AI/ML workflows, and runtime checks
- `@tradejs/app` for the optional web UI
- `@tradejs/base` for the default preset
- `@tradejs/types` for shared contracts

The recommended project config starts with:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

## Where To Go Next

- [Installation](../getting-started/installation)
- [Run your first backtest](../getting-started/first-backtest)
- [Core Concepts: Strategy](../core-concepts/strategy)
- [Examples](../examples)
