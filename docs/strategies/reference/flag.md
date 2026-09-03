---
title: 'Flag'
---

`Flag` is a continuation strategy from `@tradejs/strategy-flag`. It looks for a
strong directional pole, a compact counter-trend channel, and a break in the
direction of the original move.

## Visual overview

![Flag strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Flag/main/docs/strategy-logic.svg)

![Bull and bear flag examples](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Flag/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry logic

1. Finds a sufficiently large and efficient directional pole.
2. Fits parallel boundaries to the following consolidation.
3. Checks duration, width, retracement, touch, slope, and boundary rules.
4. Waits for a `breakout`, `close_acceptance`, or `retest` entry.
5. Places the stop beyond the opposite boundary and projects the target from
   the pole length.

## Exits

The position closes at its computed stop or target. When
`FLAG_EXIT_ON_OPPOSITE_PATTERN` is enabled, a confirmed opposite flag can also
close it.

## Configuration keys

Keys are grouped by the part of the strategy they control. A value of `0` or
`false` disables the corresponding optional filter unless stated otherwise.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Select the runtime mode, candle interval, order behavior, and backtest fill price. |
| AI and ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Control optional AI and ML enrichment and their acceptance thresholds. |
| Risk | `FEE_PERCENT`, `MAX_LOSS_VALUE`, `FLAG_TARGET_POLE_RATIO`, `FLAG_STOP_BUFFER_ATR`, `FLAG_EXIT_ON_OPPOSITE_PATTERN` | Account for fees, size positions, project the target, buffer the stop, and choose the opposite-pattern exit. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `FLAG_ATR_PERIOD` | Set the lookback periods used by market context, signal filters, and flag normalization. |
| Pole size | `FLAG_POLE_LOOKBACK_BARS`, `FLAG_MIN_POLE_MOVE_PCT`, `FLAG_MIN_POLE_MOVE_ATR`, `FLAG_MIN_POLE_EFFICIENCY_RATIO` | Define the search window and the minimum size and directional efficiency of the pole. |
| Pole quality | `FLAG_MIN_POLE_DIRECTIONAL_CONSISTENCY_RATIO`, `FLAG_MIN_POLE_DIRECTIONAL_CONSISTENCY_RATIO_LONG`, `FLAG_MIN_POLE_DIRECTIONAL_CONSISTENCY_RATIO_SHORT`, `FLAG_MAX_POLE_TERMINAL_EXPANSION_RATIO`, `FLAG_MAX_POLE_TERMINAL_EXPANSION_RATIO_LONG`, `FLAG_MAX_POLE_TERMINAL_EXPANSION_RATIO_SHORT`, `FLAG_POLE_TERMINAL_BARS` | Limit noisy poles and excessive expansion near the pole end, globally or by direction. |
| Channel duration | `FLAG_MIN_BARS`, `FLAG_MAX_BARS`, `FLAG_MAX_FLAG_TO_POLE_BARS_RATIO`, `FLAG_MAX_FLAG_TO_POLE_BARS_RATIO_LONG`, `FLAG_MAX_FLAG_TO_POLE_BARS_RATIO_SHORT` | Set absolute and pole-relative consolidation duration limits. |
| Channel geometry | `FLAG_PIVOT_RADIUS`, `FLAG_MIN_TOUCHES_PER_BOUNDARY`, `FLAG_MIN_COUNTER_TREND_SLOPE_PCT_PER_BAR`, `FLAG_MAX_SLOPE_DIVERGENCE_RATIO` | Define swing detection, required boundary touches, counter-trend slope, and line parallelism. |
| Channel size and volume | `FLAG_MAX_CHANNEL_WIDTH_PCT`, `FLAG_MAX_CHANNEL_WIDTH_ATR`, `FLAG_MAX_CHANNEL_WIDTH_ATR_LONG`, `FLAG_MAX_CHANNEL_WIDTH_ATR_SHORT`, `FLAG_MAX_CHANNEL_TO_POLE_RATIO`, `FLAG_MAX_FLAG_TO_POLE_VOLUME_RATIO`, `FLAG_MAX_RETRACEMENT_RATIO`, `FLAG_MAX_BOUNDARY_VIOLATION_ATR` | Limit channel width, volume, retracement, and temporary boundary violations. |
| Entry timing | `FLAG_BREAKOUT_BUFFER_ATR`, `FLAG_MAX_BREAKOUT_DISTANCE_ATR`, `FLAG_ENTRY_MODE`, `FLAG_CONFIRMATION_MAX_BARS`, `FLAG_RETEST_MAX_BARS`, `FLAG_RETEST_TOLERANCE_ATR` | Define a valid break and the confirmation or retest window. |
| Direction policy | `LONG.*`, `SHORT.*` | Enable each direction and set its order direction and minimum risk/reward ratio. |

## Signal payload

The signal contains pole and channel geometry, boundary lines, breakout state,
the computed stop and target, and chart figures for the detected pattern.

## Run

```bash
npx @tradejs/cli backtest --user root --config Flag:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
