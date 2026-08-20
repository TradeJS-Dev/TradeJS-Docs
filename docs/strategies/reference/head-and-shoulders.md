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

## Key configuration

- shape: `HEADSHOULDERS_PIVOT_LOOKBACK`, `HEADSHOULDERS_SHOULDER_TOLERANCE_PCT`, `HEADSHOULDERS_MIN_HEAD_PROMINENCE_RATIO`
- validity: `HEADSHOULDERS_MIN_PATTERN_BARS`, `HEADSHOULDERS_MAX_PATTERN_BARS`, `HEADSHOULDERS_MAX_NECKLINE_SLOPE_RATIO`
- entry: `HEADSHOULDERS_ENTRY_MODE`, `HEADSHOULDERS_CONFIRMATION_MAX_BARS`, `HEADSHOULDERS_RETEST_MAX_BARS`
- target/stop: `HEADSHOULDERS_TARGET_HEIGHT_PCT*`, `HEADSHOULDERS_STOP_BUFFER_HEIGHT_PCT`

The current built-in default enables the short side and disables the long side;
enable inverse-pattern longs explicitly only after separate validation.
