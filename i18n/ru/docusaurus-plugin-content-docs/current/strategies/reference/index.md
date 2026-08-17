---
title: Каталог встроенных стратегий
---

Непустой preset `@tradejs/base` устанавливает 20 независимых strategy packages,
которые предоставляют 21 стратегию. Это reference implementations и исходные
точки, а не готовые торговые рекомендации. Перед runtime-пуском перепроверьте
каждую стратегию на своих symbols, costs, interval, provider и risk limits.

TrendLine и ReverseTrendLine намеренно используют общий пакет
`@tradejs/strategy-trend-line`; все остальные пакеты соответствуют одной
стратегии.

## Тренд и breakout

- [TrendLine](./trendline) и [ReverseTrendLine](./reverse-trendline)
- [TrendFollow](./trend-follow) и [TrendShift](./trend-shift)
- [Breakout](./breakout)
- [AdaptiveTrendChannel](./adaptive-trend-channel)
- [AdaptiveMomentumRibbon](./adaptive-momentum-ribbon)
- [MaStrategy](./ma-strategy)
- [VolatilityCompressionBreakout](./volatility-compression-breakout)
- [RelativeRotation](./relative-rotation)

## Структура и ликвидность

- [DoubleTap](./double-tap)
- [CupAndHandle](./cup-and-handle)
- [HeadAndShoulders](./head-and-shoulders)
- [LiquidityTails](./liquidity-tails)
- [LiquidityZones](./liquidity-zones)
- [StructureZones](./structure-zones)
- [MarketFlushReversal](./market-flush-reversal)
- [VolumeDivergence](./volume-divergence)

## Набор позиции и внешний контекст

- [Grid](./grid) — directional pullback или breakout-retest grid
- [GridClassic](./grid-classic) — range mean reversion или breakout continuation
- [HyperliquidConsensus](./hyperliquid-consensus) — position-aware whale-flow context

Большинство TypeScript-стратегий держат detector state replayable и строят
figures из того же состояния, по которому принимается решение. Стратегии с
optional market context делают skip, если signal-time context недоступен.
