---
title: Strategy
---

A strategy is the decision-making unit in TradeJS.

On each candle, a strategy decides whether to:

- `skip`: do nothing and record an optional reason
- `entry`: create a signal and an order plan
- `exit`: close or manage an existing position

The shared runtime handles the surrounding work: market data flow, signal enrichment, optional AI/ML gates, order execution, hooks, and artifact storage.

## TypeScript Strategies

TypeScript strategies usually use `StrategyAPI` and return decisions through helper methods such as `strategyApi.skip(...)`, `strategyApi.entry(...)`, and `strategyApi.exit(...)`.

Use TypeScript when you want strong typing, custom state machines, custom figures, or deeper runtime integration.

## Pine Script-Inspired Strategies

TradeJS can also run Pine-backed strategy modules where the Pine source stays in a dedicated `.pine` file and TypeScript orchestrates runtime behavior.

Use this when you are porting or comparing Pine Script-inspired workflows.

## Built-In Strategies

The current built-in catalog includes:

- `Breakout`
- `TrendLine`
- `ReverseTrendLine`
- `TrendShift`
- `TrendFollow`
- `DoubleTap`
- `LiquidityTails`
- `LiquidityZones`
- `StructureZones`
- `AdaptiveTrendChannel`
- `AdaptiveMomentumRibbon`
- `MaStrategy`
- `VolumeDivergence`

Built-ins are useful examples, but they are still strategy code that needs your own validation.

## Next

- [Create a simple strategy](../guides/create-simple-strategy)
- [Examples](../examples)
- [Strategy authoring deep dive](../strategies/authoring/write-strategies)
