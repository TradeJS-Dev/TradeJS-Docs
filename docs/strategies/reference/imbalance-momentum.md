---
title: 'ImbalanceMomentum'
---

ImbalanceMomentum looks for a directional gap across three consecutive four-hour candles.

## Install

Run the command in your TradeJS project.

```bash
npm install --save-exact @tradejs/strategy-imbalance-momentum
```

Add `"@tradejs/strategy-imbalance-momentum"` to the `strategies` list in
`tradejs.config.ts`. The package registers the `ImbalanceMomentum` strategy.

## Signal and exit

The strategy builds four-hour candles from closed 15-minute candles on UTC
boundaries. The middle candle sets the direction. In `IMBALANCE_MODE: "gap"`,
the first and third candles must leave a gap that contains more than half of
the middle candle's body. The initial stop sits three four-hour ATRs from
the fill. The strategy has no fixed profit target. It starts trailing after
price moves three initial stop distances in its favor.

Use TradeJS `3.1.29-beta.302` or a compatible newer release for entry plans
with an empty `takeProfits` list and a stop calculated from the fill.
Use matching versions of `@tradejs/core`, `@tradejs/types`, and `@tradejs/node`.

See the [package README](https://github.com/TradeJS-Dev/TradeJS-Strategy-ImbalanceMomentum#readme) for the full setup.
