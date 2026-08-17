---
title: 'GridClassic'
---

`GridClassic` builds a grid from a detected horizontal range. In
`mean_reversion` mode it enters at confirmed range edges. In
`breakout_continuation` mode it waits for acceptance and an optional retest.
It can also trade a failed-breakout reversal when enabled.

## Decision flow

1. Detect a range from alternating pivots, containment, width, age, slope, and boundary divergence.
2. Confirm an edge rejection/close-inside signal or a breakout continuation.
3. Build multiple levels, one stop, and a center/opposite-edge target.
4. Add only while the basket risk budget and rejection rules allow it.
5. Manage breakeven, protection repricing, range invalidation, max hold, volatility shock, and target exits.

## Key configuration

- mode: `GRIDCLASSIC_MODE`, `GRIDCLASSIC_FAILED_BREAKOUT_REVERSAL_ENABLED`
- range: `GRIDCLASSIC_PIVOT_*`, `GRIDCLASSIC_LOOKBACK_BARS`, `GRIDCLASSIC_MIN_CONTAINMENT_RATIO`, width/slope/divergence limits
- confirmation: `GRIDCLASSIC_ENTRY_CONFIRMATION`, `GRIDCLASSIC_ENTRY_CONFIRMATION_BARS`
- levels: `GRIDCLASSIC_LEVELS`, `GRIDCLASSIC_GRID_STEP_ATR`, `GRIDCLASSIC_LEVEL_SIZE_DECAY`
- lifecycle: `GRIDCLASSIC_TP_MODE`, `GRIDCLASSIC_BREAKEVEN_TRIGGER_FRACTION`, `GRIDCLASSIC_MAX_HOLD_BARS`, `GRIDCLASSIC_COOLDOWN_BARS`

This strategy has stateful multi-leg behavior. Compare continuous execution
with replay and use [runtime parity](../../runtime/backtesting/runtime-parity)
before live order placement.

