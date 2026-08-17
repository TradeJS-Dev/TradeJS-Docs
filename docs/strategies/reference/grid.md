---
title: 'Grid'
---

`Grid` is a directional, position-building strategy. It can enter an EMA-trend
pullback recovery or a confirmed breakout retest, then add levels while keeping
the whole basket inside one configured risk budget.

## Decision flow

1. Classify trend direction and strength from fast/slow EMA and ATR geometry.
2. Wait for `pullback_recovery` or `breakout_retest` according to `GRID_ENTRY_MODE`.
3. Reject out-of-range volatility, oversized candles, invalid range geometry, or cooldown.
4. Create the initial order plan and optional scale-in levels.
5. Reprice basket protection after fills; exit on hard stop, regime flip, or volatility shock.

Entry codes are `GRID_DIRECTIONAL_PULLBACK_ENTRY` and
`GRID_BREAKOUT_RETEST_ENTRY`. Additional legs use `GRID_SCALE_IN_<level>`.

## Key configuration

- trend: `GRID_FAST_EMA`, `GRID_SLOW_EMA`, `GRID_MIN_TREND_STRENGTH_ATR`, `GRID_MIN_SLOW_SLOPE_ATR`
- entry: `GRID_ENTRY_MODE`, `GRID_BREAKOUT_LOOKBACK_BARS`, `GRID_BREAKOUT_RETEST_MAX_BARS`
- grid/risk: `GRID_STEP_ATR_MULT`, `GRID_MAX_LEVELS`, `GRID_STOP_ATR_MULT`, `GRID_CONTINUATION_RISK_MODE`
- lifecycle: `GRID_EXIT_ON_REGIME_FLIP`, `GRID_EXIT_ON_VOLATILITY_SHOCK`, `GRID_ENTRY_COOLDOWN_BARS`
- optional range guard: `GRID_RANGE_FILTER_MODE` and `GRID_RANGE_*`

Scale-in entries increase an existing position; validate connector support and
basket-level loss behavior before enabling orders.

