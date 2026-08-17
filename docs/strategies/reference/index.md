---
title: Built-In Strategy Catalog
---

The non-empty `@tradejs/base` preset currently installs 20 independent strategy
packages providing 21 strategies. They are reference implementations and
starting points, not pre-validated recommendations. Backtest each strategy with
your own symbols, costs, interval, provider, and risk limits before runtime use.

TrendLine and ReverseTrendLine intentionally share
`@tradejs/strategy-trend-line`; every other package maps to one strategy.

## Trend and breakout

- [TrendLine](./trendline) and [ReverseTrendLine](./reverse-trendline)
- [TrendFollow](./trend-follow) and [TrendShift](./trend-shift)
- [Breakout](./breakout)
- [AdaptiveTrendChannel](./adaptive-trend-channel)
- [AdaptiveMomentumRibbon](./adaptive-momentum-ribbon)
- [MaStrategy](./ma-strategy)
- [VolatilityCompressionBreakout](./volatility-compression-breakout)
- [RelativeRotation](./relative-rotation)

## Structure and liquidity

- [DoubleTap](./double-tap)
- [CupAndHandle](./cup-and-handle)
- [HeadAndShoulders](./head-and-shoulders)
- [LiquidityTails](./liquidity-tails)
- [LiquidityZones](./liquidity-zones)
- [StructureZones](./structure-zones)
- [MarketFlushReversal](./market-flush-reversal)
- [VolumeDivergence](./volume-divergence)

## Position-building and external context

- [Grid](./grid) — directional pullback or breakout-retest grid
- [GridClassic](./grid-classic) — range mean reversion or breakout continuation
- [HyperliquidConsensus](./hyperliquid-consensus) — position-aware whale-flow context

Most TypeScript strategies keep detector state replayable and create figures
from the same state used for the decision. Strategies that depend on optional
market context skip when the required signal-time context is unavailable.

For config storage and execution, see [Create a backtest config](../../getting-started/backtest-config)
and [How signals work](../../runtime/execution/signals).
