---
title: LondonBreakout
---

LondonBreakout looks for a price break outside a range set at 08:00 UTC. It
uses the high and low of the nine preceding hourly candles.

## Install the package

Run `npm install --save-exact @tradejs/strategy-london-breakout@0.0.2` from
your TradeJS project. Add the package to
[the strategy list](../../getting-started/add-strategy) in `tradejs.config.ts`.
The published package declares compatibility with the stable TradeJS 3.1.28 line.

## Entry and exit

The strategy skips days with a missing candle or a range wider than half the
daily ATR, a measure of price movement. It looks for an hourly close beyond
the buffered range between 08:00 and 16:00 UTC, excluding 16:00. The default
configuration opens short positions only and applies a filter that checks
the breakout candle and the range.

After the fill, the strategy measures the stop and target from the fill price.
It closes any position still open at 08:00 UTC the next day. Use hourly candles
with enough history to calculate daily ATR.

[Package settings and defaults](https://www.npmjs.com/package/@tradejs/strategy-london-breakout)
