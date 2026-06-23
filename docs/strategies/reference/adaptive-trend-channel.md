---
title: 'AdaptiveTrendChannel'
---

`AdaptiveTrendChannel` is a built-in TypeScript strategy from `@tradejs/strategies`.

It builds an adaptive channel from candle history, detects bullish or bearish flips, and can exit on channel breaks or opposite flips when configured.

## Entry Logic

1. Replays candles through the adaptive trend channel engine.
2. Waits for a channel flip signal.
3. Applies side config (`LONG` or `SHORT`).
4. Applies indicator/context filters.
5. Sizes the order from stop distance and `MAX_LOSS_VALUE`.
6. Returns an entry with channel figures and context.

## Exit Logic

When a position exists, config can enable:

- exit on channel break
- exit on opposite flip

Otherwise the strategy skips while a position is open.

## Research Notes

Recent source work tuned the adaptive channel AI gate with market context filters. Validate your own config on multiple periods and symbols before runtime automation.

Related:

- [Examples](../../examples)
- [Backtesting caveats](../../limitations/backtesting-caveats)
