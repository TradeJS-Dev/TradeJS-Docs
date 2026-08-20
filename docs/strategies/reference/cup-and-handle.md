---
title: 'CupAndHandle'
---

`CupAndHandle` detects bullish cup-and-handle and bearish inverted-cup patterns
from closed-candle pivots. It derives the rim, cup depth, handle, breakout,
stop, and measured target from the same historical window.

## Visual overview

![CupAndHandle strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-CupAndHandle/main/docs/strategy-logic.svg)

![CupAndHandle signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-CupAndHandle/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Replay pivots through `createCupAndHandleEngine(...)`.
2. Validate cup depth, symmetry, duration, handle depth, and pattern age.
3. Enter on `breakout`, `close_acceptance`, or `retest` according to `CUPHANDLE_ENTRY_MODE`.
4. Optionally require relative breakout volume.
5. Size against the engine stop and target with the side's `minRiskRatio`.

The entry code is `CUPHANDLE_BREAKOUT` or
`CUPHANDLE_INVERTED_BREAKDOWN`. When
`CUPHANDLE_EXIT_ON_OPPOSITE_PATTERN=true`, the opposite pattern exits with
`CUPHANDLE_OPPOSITE_PATTERN_EXIT`.

## Key configuration

- geometry: `CUPHANDLE_PIVOT_LOOKBACK`, `CUPHANDLE_RIM_TOLERANCE_PCT`, `CUPHANDLE_MIN_CUP_DEPTH_ATR`
- timing: `CUPHANDLE_MIN_CUP_BARS`, `CUPHANDLE_MAX_CUP_BARS`, `CUPHANDLE_MIN_HANDLE_BARS`, `CUPHANDLE_MAX_HANDLE_BARS`
- entry: `CUPHANDLE_ENTRY_MODE`, `CUPHANDLE_CONFIRMATION_MAX_BARS`, `CUPHANDLE_RETEST_MAX_BARS`
- target/stop: `CUPHANDLE_TARGET_DEPTH_PCT`, `CUPHANDLE_STOP_BUFFER_DEPTH_PCT`
