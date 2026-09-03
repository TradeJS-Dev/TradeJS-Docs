---
title: 'Dragon'
---

`Dragon` is a four pivot reversal strategy from
`@tradejs/strategy-dragon`. It confirms the pattern against a projected
trendline from head to hump before it creates an entry.

## Visual overview

![Dragon strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Dragon/main/docs/strategy-logic.svg)

![Bullish Dragon signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Dragon/main/docs/signal-example.svg)

The illustrations are schematic and are not market data. The active strategy
config supplies the exact geometry, confirmation, and risk thresholds.

## Decision flow

1. Confirm four alternating wick pivots with `DRAGON_PIVOT_LENGTH`.
2. Match a bullish sequence of high, low, lower high, and higher low, or its
   bearish mirror.
3. Check the hump retracement, rear foot offset, pattern size, age, leg length,
   and projected trendline slope.
4. Require a close through the trendline and apply the selected
   `DRAGON_ENTRY_MODE`: immediate breakout, later close acceptance, or retest.
5. Build the target and stop from pattern height, then reject an invalid stop,
   a passed target, or insufficient risk ratio.
6. Size the order from `MAX_LOSS_VALUE` and the calculated loss per unit.

Entry codes start with `DRAGON_BULLISH_` or `DRAGON_BEARISH_` and include the
entry stage. When `DRAGON_EXIT_ON_OPPOSITE_PATTERN=true`, a confirmed opposite
pattern can close an open position with `DRAGON_OPPOSITE_PATTERN_EXIT`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Fees | `FEE_PERCENT` | Include the configured trading fee in position and reward-to-risk calculations. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build the shared market context. |
| Pivot shape | `DRAGON_PIVOT_LENGTH`, `DRAGON_MIN_REAR_FOOT_OFFSET_PCT`, `DRAGON_MAX_REAR_FOOT_OFFSET_PCT`, `DRAGON_MIN_HUMP_RETRACEMENT_PCT`, `DRAGON_MAX_HUMP_RETRACEMENT_PCT` | Define pivot confirmation and the allowed rear-foot and hump geometry. |
| Size and age | `DRAGON_MIN_PATTERN_HEIGHT_PCT`, `DRAGON_MIN_PATTERN_HEIGHT_ATR`, `DRAGON_ATR_PERIOD`, `DRAGON_MIN_LEG_BARS`, `DRAGON_MAX_PATTERN_AGE_BARS`, `DRAGON_MAX_BREAKOUT_AFTER_REAR_FOOT_BARS` | Set the minimum pattern size and reject short legs, old patterns, or late breakouts. |
| Breakout quality | `DRAGON_MIN_TRENDLINE_SLOPE_PCT_PER_BAR`, `DRAGON_MIN_BREAKOUT_DISTANCE_ATR`, `DRAGON_MAX_BREAKOUT_DISTANCE_HEIGHT_RATIO` | Limit the trendline slope and the minimum and maximum valid breakout distance. |
| Entry timing | `DRAGON_ENTRY_MODE`, `DRAGON_CONFIRMATION_MAX_BARS`, `DRAGON_RETEST_MAX_BARS`, `DRAGON_RETEST_TOLERANCE_ATR` | Choose breakout, close acceptance, or retest entry and bound the confirmation window. |
| Target, stop, and exit | `DRAGON_TARGET_FIB_PCT`, `DRAGON_STOP_FIB_PCT`, `DRAGON_EXIT_ON_OPPOSITE_PATTERN` | Set target and stop distances from pattern height and allow an opposite pattern to exit. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Set the loss budget and enable each direction with its minimum reward-to-risk ratio. |

## Signal payload

An entry includes `additionalIndicators.dragonContext`, pattern and order
figures, and one take profit order. The context records the four pivots,
trendline, entry stage, pattern measurements, target, stop, and calculated
trade economics.

## Common skip reasons

- `NO_PATTERN`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `TARGET_ALREADY_PASSED`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation notes

Test both directions separately and inspect the pattern figures. Small changes
to pivot confirmation, pattern age, or breakout distance can change signal
timing and trade count. Validate each entry mode on data that was not used to
choose its parameters.
