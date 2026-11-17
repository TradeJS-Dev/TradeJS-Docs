---
title: 'ValueAreaReclaim'
---

ValueAreaReclaim looks for a return to the main traded volume range after a failed break.

Install this package separately. [Keep the standard strategies when adding the package](../../getting-started/add-strategy).

## Install

Run the command in your TradeJS project.

```bash
npm install --save-exact @tradejs/strategy-value-area-reclaim
```

Add `"@tradejs/strategy-value-area-reclaim"` to the `strategies` list in
`tradejs.config.ts`. The package registers the `ValueAreaReclaim` strategy.

## Signal and exit

Price must leave the volume area and close back inside it. The stop goes
beyond the excursion extreme, with a buffer of one quarter of ATR.

The strategy builds its volume profile from closed 15-minute candles.
`VAR_PROFILE_DAYS` defaults to three complete UTC days. The target is the
price level in the profile with the highest volume. For hourly execution,
TradeJS supplies the same 15-minute history through
`StrategyAPI.getClosedCandles`. An incomplete source window blocks new entries
until the next UTC day.

Use TradeJS `3.1.29-beta.302` or a compatible newer release. Use matching
versions of `@tradejs/core`, `@tradejs/types`, and `@tradejs/node`.

See the [package README](https://github.com/TradeJS-Dev/TradeJS-Strategy-ValueAreaReclaim#readme) for the full setup.
