---
title: 'Gartley'
---

`Gartley` is a harmonic reversal strategy from `@tradejs/strategy-gartley`. It
detects bullish and bearish five-pivot XABCD patterns and validates their
Fibonacci ratios before entry.

## Visual overview

![Gartley strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Gartley/main/docs/strategy-logic.svg)

![Bullish Gartley signal](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Gartley/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact ratios, confirmation
rules, and risk parameters come from the active strategy config.

## Entry logic

1. Finds alternating XABCD pivots with sufficient XA height and leg length.
2. Checks the AB, BC, CD, AD, and AB≈CD ratio ranges.
3. Confirms D and waits for a break of B in the reversal direction.
4. Applies direction-specific trend filters.
5. Uses the configured XA projections to place the target and stop.

## Exits

The position closes at its computed stop or target. When
`GARTLEY_EXIT_ON_OPPOSITE_PATTERN` is enabled, a confirmed opposite pattern can
also close it.

## Configuration keys

Keys are grouped by the part of the strategy they control. A value of `0` or
`false` disables the corresponding optional filter unless stated otherwise.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Select the runtime mode, candle interval, order behavior, and backtest fill price. |
| AI and ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Control optional AI and ML enrichment and their acceptance thresholds. |
| Risk | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `GARTLEY_TARGET_XA_FIB_PCT`, `GARTLEY_STOP_XA_FIB_PCT`, `GARTLEY_EXIT_ON_OPPOSITE_PATTERN` | Estimate one-way fees, slippage, and market impact, size positions, project the target and stop from XA, and choose the opposite-pattern exit. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `GARTLEY_ATR_PERIOD` | Set the lookback periods used by market context, direction filters, and pattern normalization. |
| Pivot search | `GARTLEY_PIVOT_LENGTH`, `GARTLEY_MIN_LEG_BARS`, `GARTLEY_MAX_PATTERN_AGE_BARS`, `GARTLEY_MAX_BREAKOUT_AFTER_D_BARS` | Define pivot confirmation, minimum leg duration, pattern age, and the time allowed to break B after D. |
| AB and BC ratios | `GARTLEY_MIN_AB_RETRACEMENT_RATIO`, `GARTLEY_MAX_AB_RETRACEMENT_RATIO`, `GARTLEY_MIN_BC_RETRACEMENT_RATIO`, `GARTLEY_MAX_BC_RETRACEMENT_RATIO` | Set the accepted AB/XA and BC/AB retracement ranges. |
| CD and AD ratios | `GARTLEY_MIN_CD_EXTENSION_RATIO`, `GARTLEY_MAX_CD_EXTENSION_RATIO`, `GARTLEY_MIN_AD_RETRACEMENT_RATIO`, `GARTLEY_MAX_AD_RETRACEMENT_RATIO`, `GARTLEY_MAX_AB_CD_DEVIATION_PCT` | Set the accepted CD/BC and AD/XA ranges and maximum AB-to-CD length mismatch. |
| Pattern size | `GARTLEY_MIN_XA_HEIGHT_PCT`, `GARTLEY_MIN_XA_HEIGHT_ATR` | Require a minimum XA height in price-percent and ATR units. |
| Entry timing | `GARTLEY_MIN_BREAKOUT_DISTANCE_ATR`, `GARTLEY_MAX_BREAKOUT_DISTANCE_XA_RATIO`, `GARTLEY_ENTRY_MODE`, `GARTLEY_CONFIRMATION_MAX_BARS`, `GARTLEY_RETEST_MAX_BARS`, `GARTLEY_RETEST_TOLERANCE_ATR` | Define a valid break of B and the confirmation or retest window. |
| Direction filters | `GARTLEY_LONG_REQUIRE_POSITIVE_MACD_HISTOGRAM`, `GARTLEY_SHORT_REQUIRE_PRICE_BELOW_MA_SLOW` | Optionally require bullish MACD momentum for long entries and price below the slow average for short entries. |
| Direction policy | `LONG.*`, `SHORT.*` | Enable each direction and set its order direction and minimum risk/reward ratio. |

## Signal payload

The signal contains the XABCD pivots, harmonic ratios, confirmation state,
computed stop and target, and chart figures for the detected pattern.

## Run

```bash
npx @tradejs/cli backtest --user root --config Gartley:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
