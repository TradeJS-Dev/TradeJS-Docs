---
title: 'Crab'
---

Crab looks for a reversal after five price pivots form the XABCD pattern.

Install this package separately. [Keep the standard strategies when adding the package](../../getting-started/add-strategy).

## Install

Run the command in your TradeJS project.

```bash
npm install --save-exact @tradejs/strategy-crab
```

Add `"@tradejs/strategy-crab"` to the `strategies` list in
`tradejs.config.ts`. The package registers the `Crab` strategy.

## Signal and exit

On the default 15-minute interval, the strategy waits for the last pivot
D to be confirmed. The bullish pattern ends at a low and opens a long. The
bearish pattern ends at a high and opens a short. The default target is a
61.8% retracement of A–D from D. The stop sits beyond D at a distance equal
to 10% of X–A.

The strategy confirms D only after later candles have closed. The backtest
uses the confirmed signal time rather than the price at the earlier turning point.

![Illustrated entry for Crab](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Crab/main/docs/signal-example.svg)

See the [package README](https://github.com/TradeJS-Dev/TradeJS-Strategy-Crab#readme) for the full setup.
