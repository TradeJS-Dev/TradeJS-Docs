---
title: 'GridClassic'
---

`GridClassic` builds a grid from a detected horizontal range. In
`mean_reversion` mode it enters at confirmed range edges. In
`breakout_continuation` mode it waits for acceptance and an optional retest.
It can also trade a failed-breakout reversal when enabled.

## Visual overview

![GridClassic strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-GridClassic/main/docs/strategy-logic.svg)

![GridClassic signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-GridClassic/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Detect a range from alternating pivots, containment, width, age, slope, and boundary divergence.
2. Confirm an edge rejection/close-inside signal or a breakout continuation.
3. Build multiple levels, one stop, and a center/opposite-edge target.
4. Add only while the basket risk budget and rejection rules allow it.
5. Manage breakeven, protection repricing, range invalidation, max hold, volatility shock, and target exits.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Fees | `FEE_PERCENT` | Include the configured trading fee in position and reward-to-risk calculations. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build shared market context and signal filters. |
| Mode and continuation | `GRIDCLASSIC_MODE`, `GRIDCLASSIC_CONTINUATION_ACCEPTANCE_BARS`, `GRIDCLASSIC_CONTINUATION_RETEST_MAX_BARS`, `GRIDCLASSIC_CONTINUATION_RETEST_TOLERANCE_ATR`, `GRIDCLASSIC_CONTINUATION_REQUIRE_DIRECTIONAL_RETEST`, `GRIDCLASSIC_CONTINUATION_MAX_ENTRY_DISTANCE_ATR`, `GRIDCLASSIC_CONTINUATION_TARGET_RANGE_MULT`, `GRIDCLASSIC_CONTINUATION_STOP_INSIDE_RANGE_FRACTION`, `GRIDCLASSIC_FAILED_BREAKOUT_REVERSAL_ENABLED` | Select mean reversion or breakout continuation and define its acceptance, retest, target, stop, and reversal rules. |
| Range geometry | `GRIDCLASSIC_ATR_PERIOD`, `GRIDCLASSIC_PIVOT_LEFT_BARS`, `GRIDCLASSIC_PIVOT_RIGHT_BARS`, `GRIDCLASSIC_LOOKBACK_BARS`, `GRIDCLASSIC_MIN_PIVOTS_PER_SIDE`, `GRIDCLASSIC_MIN_WIDTH_ATR`, `GRIDCLASSIC_MAX_WIDTH_ATR`, `GRIDCLASSIC_MAX_CENTER_SLOPE_ATR_PER_BAR`, `GRIDCLASSIC_MAX_BOUNDARY_DIVERGENCE_ATR`, `GRIDCLASSIC_MIN_CONTAINMENT_RATIO`, `GRIDCLASSIC_CONTAINMENT_TOLERANCE_ATR`, `GRIDCLASSIC_BREAKOUT_TOLERANCE_ATR`, `GRIDCLASSIC_MIN_RANGE_AGE_BARS` | Define range pivots, width, age, slope, boundary divergence, containment, and breakout tolerance. |
| Entry quality | `GRIDCLASSIC_MAX_VOLATILITY_EXPANSION`, `GRIDCLASSIC_MAX_CANDLE_RANGE_ATR`, `GRIDCLASSIC_EDGE_ZONE_FRACTION`, `GRIDCLASSIC_ENTRY_CONFIRMATION`, `GRIDCLASSIC_MIN_REJECTION_WICK_RATIO`, `GRIDCLASSIC_ENTRY_CONFIRMATION_BARS`, `GRIDCLASSIC_MAX_PIVOT_AGE_BARS`, `GRIDCLASSIC_MIN_ALTERNATING_PIVOTS`, `GRIDCLASSIC_RECENT_CONTAINMENT_BARS`, `GRIDCLASSIC_MIN_RECENT_CONTAINMENT_RATIO`, `GRIDCLASSIC_MIN_TARGET_DISTANCE_BPS`, `GRIDCLASSIC_MIN_NET_RISK_RATIO` | Reject weak, stale, overextended, or poorly contained range entries. |
| Grid construction | `GRIDCLASSIC_LEVELS`, `GRIDCLASSIC_REQUIRE_REJECTION_FOR_ADD`, `GRIDCLASSIC_GRID_STEP_ATR`, `GRIDCLASSIC_GRID_STEP_RANGE_FRACTION`, `GRIDCLASSIC_LEVEL_SIZE_DECAY`, `GRIDCLASSIC_STOP_ATR_BUFFER`, `GRIDCLASSIC_TP_MODE` | Set level count, addition rules, spacing, size decay, stop buffer, and target mode. |
| Position lifecycle | `GRIDCLASSIC_BREAKOUT_CONFIRM_BARS`, `GRIDCLASSIC_FAILED_REJECTION_EXIT_BARS`, `GRIDCLASSIC_FAILED_REJECTION_TOLERANCE_ATR`, `GRIDCLASSIC_BREAKEVEN_TRIGGER_FRACTION`, `GRIDCLASSIC_BREAKEVEN_OFFSET_BPS`, `GRIDCLASSIC_INVALIDATION_BARS`, `GRIDCLASSIC_MAX_HOLD_BARS`, `GRIDCLASSIC_COOLDOWN_BARS`, `GRIDCLASSIC_RISK_SLIPPAGE_BPS`, `GRIDCLASSIC_PROTECTION_REPRICE_ATR` | Control exits, breakeven, invalidation, maximum holding time, cooldown, slippage allowance, and protection repricing. |
| Figures and side policy | `GRIDCLASSIC_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Limit chart output, set the loss budget, and configure each direction. |

This strategy has stateful multi-leg behavior. Compare continuous execution
with replay and use [runtime parity](../../runtime/backtesting/runtime-parity)
before live order placement.
