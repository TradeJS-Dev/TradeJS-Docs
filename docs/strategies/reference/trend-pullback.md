---
title: TrendPullback
---

TrendPullback waits for a pullback within an hourly trend. It uses two
exponential moving averages to find the direction and RSI to spot a pullback.

## Install the package

Run `npm install --save-exact @tradejs/strategy-trend-pullback@0.1.2` from
your TradeJS project. Add the package to
[the strategy list](../../getting-started/add-strategy) in `tradejs.config.ts`.

## Entry and exit

In an uptrend, the strategy waits for RSI to cross below its threshold. It
enters when a later candle closes above the previous candle's high. A
downtrend uses the opposite checks. The opportunity expires if it takes too
long to confirm or the trend ends.

The initial stop sits beyond the pullback's extreme. The strategy then
moves it as price moves in its favor. The default target is four times
the initial distance to the stop. A stop, lost trend, or time limit can
close the position sooner.

The package includes settings for hourly entries and 15-minute entries with
the same hourly trend check.

[Package settings and defaults](https://www.npmjs.com/package/@tradejs/strategy-trend-pullback)
