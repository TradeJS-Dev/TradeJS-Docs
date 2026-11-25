---
title: Strategy
---

A strategy is a set of rules for reading market data and deciding when to enter,
manage, or close a trade.

On each candle, a strategy decides whether to:

- `skip`: do nothing and record an optional reason
- `entry`: create a signal and an order plan
- `exit`: close an open position
- `protect`: update the stop or targets for an open position

The shared runtime handles the surrounding work: market data flow, signal enrichment, optional AI/ML gates, order execution, hooks, and artifact storage.

## TypeScript Strategies

TypeScript strategies usually use `StrategyAPI` and return decisions through helper methods such as `strategyApi.skip(...)`, `strategyApi.entry(...)`, `strategyApi.exit(...)`, and `strategyApi.protect(...)`.

Use TypeScript when you want strong typing, custom state machines, custom figures, or deeper runtime integration.

## Pine Script-Inspired Strategies

TradeJS can also run Pine-backed strategy modules where the Pine source stays in a dedicated `.pine` file and TypeScript orchestrates runtime behavior.

Use this when you are porting or comparing Pine Script-inspired workflows.

## Built-In Strategies

The `@tradejs/base` package loads the default set of strategies.
See the [catalog](https://tradejs.dev/marketplace) for each strategy’s rules and settings.
For separately installed strategies, see [Add a strategy](../getting-started/add-strategy).

## Next

- [Create a simple strategy](../strategies/authoring/typescript-strategy-step-by-step)
- [Examples](../examples)
- [Strategy authoring deep dive](../strategies/authoring/write-strategies)
