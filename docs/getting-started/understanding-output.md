---
title: Understanding the output
---

TradeJS output is meant for analysis and comparison, not for promises about future behavior.

## Backtest Output

A backtest usually produces:

- console progress and summary lines
- per-test statistics in Redis
- result artifacts for orders/positions when available
- optional AI or ML dataset chunks
- result indexes that the app can display

The exact shape depends on strategy config, connector, cache mode, and enabled AI/ML flags.

## Common Metrics

- `orders`: number of closed simulated orders.
- `wins`: orders with positive result.
- `losses`: orders with negative result.
- `winRate`: wins divided by closed orders.
- `netProfit`: historical net result for the run.
- `maxDrawdown`: largest historical peak-to-trough decline.
- `riskRewardRatio`: relationship between average reward and risk when available.

## Signal Output

A signal describes a strategy decision at a candle timestamp. It commonly includes:

- `strategy`
- `symbol`
- `interval`
- `direction`
- `timestamp`
- `prices.currentPrice`
- `prices.takeProfitPrice`
- `prices.stopLossPrice`
- `figures` for chart inspection
- `indicators` and `additionalIndicators` for context

## AI/ML Output

When enabled, AI/ML layers may add:

- AI analysis records such as `analysis:<symbol>:<signalId>`
- ML feature rows
- approval or rejection metadata
- quality and threshold values

These are research and gating artifacts. They should be validated on historical data and monitored in runtime.

## How To Read Results

Use results to answer practical questions:

- Did the strategy trade when expected?
- Are entries and exits explainable from the candle data?
- Do metrics remain stable across symbols and periods?
- Are fees, slippage, and fill timing assumptions realistic?
- Does the same logic behave consistently in backtest and runtime?

Next: [Backtesting caveats](../limitations/backtesting-caveats).
