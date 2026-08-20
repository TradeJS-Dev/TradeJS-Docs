---
title: Built-In Strategy Catalog
---

`@tradejs/base` installs 20 packages that provide 21 strategy implementations.
They are inspectable starting points, not trading recommendations or validated
parameter sets. Test every strategy with your own market, data source, costs,
timeframe, liquidity, and risk limits.

TrendLine and ReverseTrendLine share `@tradejs/strategy-trend-line`; each other
strategy has its own package.

## Trend, Momentum, and Breakout

- [TrendLine](./trendline) — breakout through a trendline fitted to swing highs
  or lows.
- [ReverseTrendLine](./reverse-trendline) — rejection or reversal around a
  fitted support/resistance line.
- [TrendFollow](./trend-follow) — trend continuation with a trailing stop line.
- [TrendShift](./trend-shift) — directional change after a dynamic trend-band flip.
- [Breakout](./breakout) — weighted confirmation of long or short breakout conditions.
- [AdaptiveTrendChannel](./adaptive-trend-channel) — direction change in an
  adaptive channel with a structural stop at its boundary.
- [AdaptiveMomentumRibbon](./adaptive-momentum-ribbon) — momentum-ribbon signal
  with Keltner bias and structural invalidation.
- [MaStrategy](./ma-strategy) — fast/slow moving-average crossover.
- [VolatilityCompressionBreakout](./volatility-compression-breakout) — range
  expansion after low ATR and Bollinger-width ranks.
- [RelativeRotation](./relative-rotation) — relative strength and rotation of a
  symbol versus BTC.

## Price Structure, Liquidity, and Reversal

- [DoubleTap](./double-tap) — double top/bottom structure followed by a
  breakout or breakdown.
- [CupAndHandle](./cup-and-handle) — bullish cup-and-handle or bearish inverted
  cup with a measured target.
- [HeadAndShoulders](./head-and-shoulders) — standard or inverse
  head-and-shoulders neckline breakout.
- [LiquidityTails](./liquidity-tails) — reaction after a retest of a zone formed
  by large candle wicks.
- [LiquidityZones](./liquidity-zones) — reaction at liquidity zones derived from
  swing highs and lows.
- [StructureZones](./structure-zones) — reaction or transition breakout at
  market-structure zones.
- [MarketFlushReversal](./market-flush-reversal) — rejection after broad market
  liquidation or pressure.
- [VolumeDivergence](./volume-divergence) — reversal based on divergence between
  price pivots and normalized-volume pivots.

## Position Building and External Context

- [Grid](./grid) — directional pullback or breakout-retest entries with staged
  additions inside one risk budget.
- [GridClassic](./grid-classic) — horizontal-range mean reversion, breakout
  continuation, or optional failed-breakout reversal.
- [HyperliquidConsensus](./hyperliquid-consensus) — direction derived from the
  position-aware flow of configured Hyperliquid accounts.

## How to Evaluate a Strategy

Each reference page explains the decision sequence, exits, required data,
configuration fields, output, and example commands. The diagrams are schematic
and show logic rather than historical performance.

Before comparing results, identify:

1. the market hypothesis and regime the strategy is intended for;
2. the required candles and optional context data;
3. entry, invalidation, exit, and position-sizing rules;
4. turnover, expected holding period, and execution sensitivity;
5. parameters selected before the test and the independent validation plan.

For configuration and execution, see
[Define a backtest parameter grid](../../getting-started/backtest-config),
[How backtests work](../../runtime/backtesting/overview), and
[How live signals work](../../runtime/execution/signals).
