---
title: What is TradeJS?
---

TradeJS is a TypeScript framework for systematic trading research,
backtesting, market scanning, and self-hosted execution.

At the simplest level, a TradeJS project contains:

- market data as candles
- one or more strategies that read those candles
- signals that describe possible entries or exits
- a backtest that applies those rules to historical candles
- a live process that evaluates newly closed candles and can optionally place orders
- reports that help you compare configurations and diagnose differences between
  historical and live behavior

TradeJS is not a black-box trading product. You define or configure the
strategy, state the market-data and execution assumptions, inspect the results,
and decide whether the evidence is strong enough for further validation or a
limited live rollout.

## Primary Workflow

1. Define strategy rules, risk limits, symbol universe, and timeframe.
2. Backtest candidate configurations on historical data.
3. Validate selected candidates out of sample and under realistic fees,
   slippage, latency, and liquidity assumptions.
4. Replay the exact live configuration over a known window and compare its
   decisions with the backtest or live record.
5. Generate live signals and, after separate risk approval, optionally allow
   order placement.

## What You Can Do

- Research strategy ideas with TypeScript.
- Run backtests and compare strategy/config variants.
- Generate runtime signals from the same strategy logic.
- Run the framework locally or on self-hosted infrastructure.
- Register custom strategy, indicator, and connector plugins.
- Add Pine-backed strategy compatibility and AI/ML workflows as optional extensions.
- Inspect backtests and live status in the installable web app.

## Main Packages

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

- [Trading Workflow and Terms](./trading-workflow-and-terms)
- [Installation](../getting-started/installation)
- [Run your first backtest](../getting-started/first-backtest)
- [Core Concepts: Strategy](../core-concepts/strategy)
- [Examples](../examples)
- [Licensing](./licensing)
