---
title: 'Diamond'
---

import StrategySignalChart from "@site/src/components/StrategySignalChart";

Diamond looks for a reversal when a widening price range contracts and breaks.

Install this package separately. [Keep the standard strategies when adding the package](../../getting-started/add-strategy).

## Visual overview

<StrategySignalChart strategy="diamond" />

## Install

Run the command in your TradeJS project.

```bash
npm install --save-exact @tradejs/strategy-diamond
```

Add `"@tradejs/strategy-diamond"` to the `strategies` list in
`tradejs.config.ts`. The package registers the `Diamond` strategy.

## Signal and exit

The default interval is 15 minutes. Six confirmed pivots define the pattern.
After a decline, a close above the descending boundary can confirm a long.
After a rise, a close below the ascending boundary can confirm a short.
`DIAMOND_ENTRY_MODE` controls how the strategy confirms the break. The
default `close_acceptance` waits for a confirming close after the breakout.

The default target is one pattern height from the break. The stop sits past
the last turning point on the opposite side, with a buffer of 10% of the pattern height.

See the [package README](https://github.com/TradeJS-Dev/TradeJS-Strategy-Diamond#readme) for the full setup.
