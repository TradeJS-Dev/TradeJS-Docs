---
title: What is TradeJS?
---

TradeJS is an open-source, self-hosted framework for building, backtesting, and running programmable trading strategies in TypeScript.

At the simplest level, a TradeJS project contains:

- market data as candles
- one or more strategies that read those candles
- signals that describe possible entries or exits
- a runtime that can backtest, scan, and optionally automate execution
- metrics and artifacts that help you compare strategy behavior

TradeJS is not a black-box trading product. It is a developer framework and runtime stack. You write or configure the strategy, run it against historical data, inspect the output, and decide whether it is suitable for runtime signals or controlled automation on infrastructure you operate.

## Primary Workflow

1. Write typed strategy logic and indicators in TypeScript.
2. Backtest and compare strategy configurations on historical data.
3. Promote a selected result into runtime configuration.
4. Generate signals and optionally automate execution on your infrastructure.

## What You Can Do

- Research strategy ideas with TypeScript.
- Run backtests and compare strategy/config variants.
- Generate runtime signals from the same strategy logic.
- Run the framework locally or on self-hosted infrastructure.
- Register custom strategy, indicator, and connector plugins.
- Add Pine-backed strategy compatibility and AI/ML workflows as optional extensions.
- Inspect results in the installable app.

## Public Surface

Use public packages:

- `@tradejs/core` for config, strategy authoring helpers, indicators, math, time, and figures
- `@tradejs/node` for Node-only runtime helpers, backtests, Pine strategy loading, and registries
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
