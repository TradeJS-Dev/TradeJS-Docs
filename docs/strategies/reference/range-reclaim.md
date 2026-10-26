---
title: RangeReclaim
---

`@tradejs/strategy-range-reclaim` trades a return inside the range of a closed
higher-timeframe candle after a failed breakout. Version `0.1.1` is published
separately from `@tradejs/base`. Its defaults and optional entry policies are
research parameters, not validated trading recommendations.

## Installation

```bash
npm install @tradejs/strategy-range-reclaim@0.1.1
```

Append `"@tradejs/strategy-range-reclaim"` to your Project's `strategies`
list, preserving its existing preset, connectors, indicators and runtime config.
Pin the installed version and keep the lockfile.

## Entry and exit

The detector builds the source candle from consecutive closed execution candles.
Supported execution/source interval pairs are `15/240`, `15/60` and `60/240`
minutes. The range becomes available at the start of the next source period;
the final candle of a period cannot trade its own newly formed range.

LONG requires a low strictly below the range low followed by a close strictly
inside the range. SHORT is symmetric. Confirmation may occur on the breakout
candle or within `RANGE_RECLAIM_WAIT_BARS` additional candles. A new extreme
does not extend the deadline. Crossing both boundaries, exceeding the depth
limit, expiry or a source-range update cancels the pending setup.

Only one confirmed entry attempt is allowed per source range. A disabled side,
an existing position, a risk rejection or an execution rejection consumes that
attempt. The stop is beyond the excursion extreme with an ATR buffer. The
target is the source midpoint or opposite boundary. Both remain fixed after
confirmation. Position sizing and the minimum risk ratio include estimated costs.

TradeJS executes stops and targets. The strategy also requests an exit after
`RANGE_RECLAIM_MAX_HOLD_BARS` execution intervals from the signal timestamp;
missing candles do not extend that deadline. Default historical execution uses
the next candle's open, so a price gap can change the signal's risk ratio.

## Configuration keys

| Group | Keys | Purpose |
| --- | --- | --- |
| Intervals | `INTERVAL`, `RANGE_RECLAIM_RANGE_INTERVAL` | Execution/source minutes; defaults `15`/`240`. |
| Confirmation | `RANGE_RECLAIM_WAIT_BARS`, `RANGE_RECLAIM_MAX_DEPTH_RATIO` | Additional waiting candles and maximum excursion as a fraction of source width; defaults `1` and `0.25`. |
| Source age | `RANGE_RECLAIM_MAX_SOURCE_AGE_BARS` | Confirmation deadline after source close, in execution intervals. Default `0` disables it; equality with a positive deadline is expired. |
| Stop and target | `RANGE_RECLAIM_ATR_LENGTH`, `RANGE_RECLAIM_STOP_ATR_BUFFER`, `RANGE_RECLAIM_TARGET` | ATR length `14`, stop buffer `0.1` ATR, and `midpoint` (default) or `opposite`. |
| Holding limit | `RANGE_RECLAIM_MAX_HOLD_BARS` | Default `16` execution intervals. |
| Admission | `RANGE_RECLAIM_MAX_COST_SHARE` | Maximum estimated round-trip costs divided by gross target reward. Default `0` disables it; equality with a positive cap is allowed. |
| Risk | `MAX_LOSS_VALUE`, `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `LONG.*`, `SHORT.*` | Loss budget, estimated costs, direction switches and minimum net risk ratios. Both sides default to enabled with minimum ratio `1`. |
| Historical fills | `BACKTEST_PRICE_MODE`, `BACKTEST_ENTRY_DELAY_BARS` | Defaults `open` and `1`. |
| Entry policy | `RANGE_RECLAIM_ENTRY_POLICY` | Default `off`; optional research policies below require `15/240`. |

The optional policies are `purple`, `orange`, `purple-short`, `intersection`
and `union`. `purple` requires reclaim depth of at least 10% of range width.
`orange` requires SHORT and width strictly above 6 ATR or 3475 basis points of
confirmation price. `purple-short` adds the SHORT requirement to `purple`;
`intersection` requires both rules and `union` either rule. They act before
entry independently of AI. No separately trained AI gate ships with this package.

## Data and restart behavior

Partial source periods and candle gaps prevent a valid range. A gap resets
the range, pending setup and ATR. The engine rebuilds through the same candle
transitions used during continuous evaluation, and repeated timestamps do not
advance its state.

An open position needs its saved lifecycle checkpoint. Without an entry time,
the strategy requests `RANGE_RECLAIM_UNKNOWN_POSITION_AGE` rather than guessing
the remaining holding period. Entry figures show the source range, excursion,
confirmation, stop and target; actual delayed fills are recorded by TradeJS.
