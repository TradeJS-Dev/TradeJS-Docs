---
sidebar_position: 1
title: Welcome
slug: /
---

TradeJS is an open-source, self-hosted framework for building, backtesting, and running programmable trading strategies in TypeScript.

Start here if you are opening the project for the first time:

1. Read [What is TradeJS?](./introduction/what-is-tradejs).
2. Install the public packages with [Installation](./getting-started/installation).
3. Run a deterministic first backtest with [Run your first backtest](./getting-started/first-backtest).
4. Learn the main objects in [Core Concepts](./core-concepts/strategy).
5. Copy from the practical [Examples](./examples).

The primary workflow is **write → backtest → run**: keep strategy logic in TypeScript, compare it on historical data, and move selected configurations into a runtime you operate.

TradeJS is designed for research, backtesting, signal generation, and controlled automation on your infrastructure. It is not financial advice, not an HFT engine, and not a system that can promise future returns.

## Product Focus

- **TypeScript-native:** strategies, indicators, plugins, and runtime contracts are programmable and typed.
- **One strategy lifecycle:** use the same strategy implementation for backtests and runtime evaluation.
- **Self-hosted:** keep strategy code, market data, credentials, and execution infrastructure under your control.

Pine compatibility, AI/ML enrichment, grid search, Telegram notifications, and the optional app extend this core workflow.

## Public Packages

- `@tradejs/core` - browser-safe authoring API, config helpers, shared indicator/math/time helpers
- `@tradejs/node` - Node runtime for strategy execution, backtests, Pine loading, connector/plugin registries
- `@tradejs/cli` - operational commands for backtests, signals, bots, doctor checks, ML workflows
- `@tradejs/app` - optional installable Next.js UI for viewing backtests, dashboards, and runtime data
- `@tradejs/base` - default preset that wires built-in strategies, indicators, and connectors
- `@tradejs/types` - shared TypeScript contracts
- `@tradejs/strategies`, `@tradejs/indicators`, `@tradejs/connectors` - built-in plugin catalogs

Use explicit public subpaths such as `@tradejs/core/config`, `@tradejs/core/indicators`, `@tradejs/node/strategies`, and `@tradejs/types`. Avoid non-public deep imports from package `src` folders.

## Links

- Website: [tradejs.dev](https://tradejs.dev)
- GitHub: [TradeJS-Dev/tradejs](https://github.com/TradeJS-Dev/tradejs)
- npm organization: [npmjs.com/org/tradejs](https://www.npmjs.com/org/tradejs)
- Examples: [Examples](./examples)

## Read Next

- [What is TradeJS?](./introduction/what-is-tradejs)
- [Quickstart](./getting-started/quickstart)
- [Run your first backtest](./getting-started/first-backtest)
- [What TradeJS is not](./introduction/what-tradejs-is-not)
- [Backtesting caveats](./limitations/backtesting-caveats)
