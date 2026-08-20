---
sidebar_position: 1
title: Welcome
slug: /
---

TradeJS is a TypeScript framework for systematic trading research and
self-hosted execution. You can implement a strategy once, test it on historical
data, reproduce its decisions on closed candles, and run the same logic against
live market data.

Start here if you are opening the project for the first time:

1. Read [What is TradeJS?](./introduction/what-is-tradejs).
2. Review the [trading workflow and terminology](./introduction/trading-workflow-and-terms).
3. Create a local project and run the [first backtest](./getting-started/first-backtest).
4. Learn how TradeJS represents [strategies](./core-concepts/strategy),
   [signals](./core-concepts/signals), and [orders and positions](./core-concepts/orders-positions).
5. Use the practical [examples](./examples) as starting points.

The primary workflow is **define → backtest → validate → replay → run**.
Backtest results are research evidence, not a live-trading decision by
themselves. Before deploying a configuration, test it out of sample, include
fees and realistic execution assumptions, and verify that replay reproduces
the expected decisions.

TradeJS is designed for research, backtesting, signal generation, and
controlled automation on infrastructure you operate. It is not financial
advice, an HFT engine, or a system that can promise future returns.

## Product Focus

- **TypeScript-native:** strategies, indicators, plugins, and runtime contracts are programmable and typed.
- **One strategy implementation:** use the same decision logic for backtests,
  historical replay, and live evaluation.
- **Self-hosted:** keep strategy code, market data, credentials, and execution infrastructure under your control.

Pine-backed strategy compatibility, AI/ML enrichment, grid search, Telegram notifications, and the optional app extend this core workflow.

## Packages

- `@tradejs/core` - strategy authoring API, configuration helpers, indicators,
  math, and time utilities
- `@tradejs/node` - Node.js execution, backtests, Pine strategy loading, and
  connector/plugin registries
- `@tradejs/cli` - commands for infrastructure, backtests, signals, results,
  replay, and diagnostics
- `@tradejs/app` - optional installable Next.js UI for viewing backtests, dashboards, and runtime data
- `@tradejs/base` - default preset that wires built-in strategies, indicators, and connectors
- `@tradejs/types` - shared TypeScript contracts
- `@tradejs/strategy-*` - independent strategy plugins installed by `@tradejs/base`
- `@tradejs/indicators`, `@tradejs/connectors` - built-in indicator and connector catalogs

Use documented package entry points such as `@tradejs/core/config`,
`@tradejs/core/indicators`, `@tradejs/node/strategies`, and `@tradejs/types`.

## Links

- Website: [tradejs.dev](https://tradejs.dev)
- GitHub: [TradeJS-Dev/tradejs](https://github.com/TradeJS-Dev/tradejs)
- npm organization: [npmjs.com/org/tradejs](https://www.npmjs.com/org/tradejs)
- Examples: [Examples](./examples)
- Licensing: [License overview](./introduction/licensing)
- Package and repository map: [Repository and package ownership](./advanced/repository-ownership)

## Read Next

- [What is TradeJS?](./introduction/what-is-tradejs)
- [Quickstart](./getting-started/quickstart)
- [Run your first backtest](./getting-started/first-backtest)
- [What TradeJS is not](./introduction/what-tradejs-is-not)
- [Licensing](./introduction/licensing)
- [Backtesting caveats](./limitations/backtesting-caveats)
