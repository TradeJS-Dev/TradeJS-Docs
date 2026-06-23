---
title: 'ReverseTrendLine'
---

`ReverseTrendLine` is a built-in TypeScript strategy from `@tradejs/strategies`.

It shares the trendline-style workflow with `TrendLine`, but is intended for reverse/rejection behavior rather than the primary breakout path.

## Use It For Researching

- trendline rejection setups
- support/resistance geometry
- figure-driven chart inspection
- comparison against `TrendLine`

## Notes

- It has a strategy-specific AI adapter.
- Validate behavior with backtests before runtime use.
- Treat trendline geometry as an input to inspect, not as proof of future behavior.

Related:

- [TrendLine](./trendline)
- [Backtesting caveats](../../limitations/backtesting-caveats)
