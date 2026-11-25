---
title: Examples
---

Use these examples to see how a strategy is put together. To test an existing
strategy without writing code, start from the [strategy
catalog](https://tradejs.dev/marketplace).

## 1. Simple Moving Average Strategy

Use this when you want the smallest understandable TypeScript strategy idea: compare a fast and slow moving average and enter on a crossover.

Related pages:

- [Create a simple strategy](./strategies/authoring/typescript-strategy-step-by-step)
- [MaStrategy reference](https://tradejs.dev/marketplace/ma-strategy)

## 2. Breakout Strategy

The built-in `Breakout` strategy uses a weighted signal model. A long setup can require price and indicator conditions such as trend, OBV, volatility, and level breakout.

Related pages:

- [Breakout reference](https://tradejs.dev/marketplace/breakout)
- [Backtest a strategy](./runtime/backtesting/overview)

## 3. Trendline / Channel-Based Strategy

TradeJS has multiple geometry-based strategies, including `TrendLine`, `ReverseTrendLine`, and `AdaptiveTrendChannel`.

The common idea is:

1. Build a support/resistance line or adaptive channel from prior candles.
2. Wait for a breakout, rejection, or channel flip.
3. Attach figures so the chart explains the decision.
4. Size the trade from stop distance and configured max loss.

Related pages:

- [TrendLine reference](https://tradejs.dev/marketplace/trendline)
- [AdaptiveTrendChannel reference](https://tradejs.dev/marketplace/adaptive-trend-channel)
- [Backtesting caveats](./limitations/backtesting-caveats)

## First Runnable Backtest

For the complete package-only flow, run `create-tradejs` as described in
[Run your first backtest](./getting-started/first-backtest). It creates an npm
project, starts local infrastructure, seeds `MaStrategy:base`, and opens the
Backtest UI.
