---
title: 'HeadAndShoulders'
---

`HeadAndShoulders` detects bearish and inverse head-and-shoulders patterns from
closed-candle pivots. It models the shoulders, head prominence, neckline,
breakout, stop, and measured target.

## Visual overview

![HeadAndShoulders strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HeadAndShoulders/main/docs/strategy-logic.svg)

![HeadAndShoulders signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HeadAndShoulders/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Build and validate the pivot pattern, symmetry, neckline slope, age, and prior move.
2. Enter on `breakout`, `close_acceptance`, or `retest`.
3. Apply breakout distance, confirmation candle, volume, and side-specific quality filters.
4. Reject an invalid stop, a passed target, or risk ratio below `LONG.minRiskRatio`/`SHORT.minRiskRatio`.
5. Size from `MAX_LOSS_VALUE`.

Entry codes distinguish regular breakdown and inverse breakout. An optional
opposite-pattern exit uses `HEADSHOULDERS_OPPOSITE_PATTERN_EXIT`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Fees | `FEE_PERCENT` | Include the configured trading fee in position and reward-to-risk calculations. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build shared market context and signal filters. |
| Pattern geometry | `HEADSHOULDERS_PIVOT_LOOKBACK`, `HEADSHOULDERS_SHOULDER_TOLERANCE_PCT`, `HEADSHOULDERS_MIN_HEAD_PROMINENCE_RATIO`, `HEADSHOULDERS_MIN_HEAD_HEIGHT_PCT`, `HEADSHOULDERS_MIN_HEAD_HEIGHT_ATR`, `HEADSHOULDERS_ATR_PERIOD` | Define pivots, shoulder balance, head prominence, minimum size, and ATR scale. |
| Pattern validity | `HEADSHOULDERS_MIN_PATTERN_BARS`, `HEADSHOULDERS_MAX_PATTERN_BARS`, `HEADSHOULDERS_MIN_PATTERN_SYMMETRY_RATIO`, `HEADSHOULDERS_MAX_NECKLINE_SLOPE_RATIO`, `HEADSHOULDERS_MAX_PATTERN_AGE_BARS`, `HEADSHOULDERS_PRIOR_TREND_LOOKBACK`, `HEADSHOULDERS_MAX_PRIOR_MOVE_ATR` | Limit duration, symmetry, neckline slope, age, and the move before the pattern. |
| Breakout quality | `HEADSHOULDERS_MIN_BREAKOUT_DISTANCE_ATR`, `HEADSHOULDERS_MAX_BREAKOUT_DISTANCE_HEIGHT_RATIO`, `HEADSHOULDERS_MAX_BREAKOUT_DISTANCE_PCT`, `HEADSHOULDERS_MAX_BREAKOUT_DELAY_BARS`, `HEADSHOULDERS_REQUIRE_BREAKOUT_CROSS` | Require a timely fresh neckline break inside the configured distance range. |
| Entry timing and candle quality | `HEADSHOULDERS_ENTRY_MODE`, `HEADSHOULDERS_CONFIRMATION_MAX_BARS`, `HEADSHOULDERS_MIN_CONFIRMATION_BODY_ATR`, `HEADSHOULDERS_MAX_CONFIRMATION_CLOSE_LOCATION`, `HEADSHOULDERS_CONFIRMATION_VOLUME_PERIOD`, `HEADSHOULDERS_MIN_CONFIRMATION_VOLUME_REL`, `HEADSHOULDERS_RETEST_MAX_BARS`, `HEADSHOULDERS_RETEST_TOLERANCE_ATR` | Choose breakout, close acceptance, or retest entry and validate its candle and volume. |
| Directional entry filters | `HEADSHOULDERS_MIN_SIGNAL_BODY_STRENGTH`, `HEADSHOULDERS_MIN_SIGNAL_BODY_STRENGTH_LONG`, `HEADSHOULDERS_MIN_SIGNAL_BODY_STRENGTH_SHORT`, `HEADSHOULDERS_MIN_ENTRY_HEAD_HEIGHT_ATR`, `HEADSHOULDERS_MIN_ENTRY_HEAD_HEIGHT_ATR_LONG`, `HEADSHOULDERS_MIN_ENTRY_HEAD_HEIGHT_ATR_SHORT` | Set body-strength and pattern-height floors, with directional overrides. |
| Target, stop, and exit | `HEADSHOULDERS_TARGET_HEIGHT_PCT`, `HEADSHOULDERS_TARGET_HEIGHT_PCT_LONG`, `HEADSHOULDERS_TARGET_HEIGHT_PCT_SHORT`, `HEADSHOULDERS_STOP_BUFFER_HEIGHT_PCT`, `HEADSHOULDERS_EXIT_ON_OPPOSITE_PATTERN` | Set directional targets, stop buffer, and opposite-pattern exit behavior. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Set the loss budget and enable each direction with its minimum reward-to-risk ratio. |

With deterministic `AI_MODE: "gate"`, SHORT setups are checked against
candle-wick and alt-basket breadth context, while LONG setups use
point-of-control distance and adaptive-channel slope. Missing required gate
features fail closed.

The current built-in default enables the short side and disables the long side;
enable inverse-pattern longs explicitly only after separate validation.
