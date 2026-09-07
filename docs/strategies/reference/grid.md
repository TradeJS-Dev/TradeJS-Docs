---
title: 'Grid'
---

`Grid` is a directional, position-building strategy. It can enter an EMA-trend
pullback recovery or a confirmed breakout retest, then add levels while keeping
the whole basket inside one configured risk budget.

## Visual overview

![Grid strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Grid/main/docs/strategy-logic.svg)

![Grid signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Grid/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Classify trend direction and strength from fast/slow EMA and ATR geometry.
2. Wait for `pullback_recovery` or `breakout_retest` according to `GRID_ENTRY_MODE`.
3. Reject out-of-range volatility, oversized candles, invalid range geometry, or cooldown.
4. Create the initial order plan and optional scale-in levels.
5. Reprice basket protection after fills; exit on hard stop, regime flip, or volatility shock.

Entry codes are `GRID_DIRECTIONAL_PULLBACK_ENTRY` and
`GRID_BREAKOUT_RETEST_ENTRY`. Additional legs use `GRID_SCALE_IN_<level>`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Risk estimates | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Estimate one-way fees, slippage, and market impact for position sizing and reward-to-risk checks. Backtest execution costs are configured separately. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build shared market context and signal filters. |
| Trend model | `GRID_FAST_EMA`, `GRID_SLOW_EMA`, `GRID_ATR_PERIOD`, `GRID_TREND_SLOPE_BARS`, `GRID_MIN_TREND_STRENGTH_ATR`, `GRID_MAX_TREND_STRENGTH_ATR`, `GRID_MIN_SLOW_SLOPE_ATR` | Define the EMA trend, its slope window, and the allowed strength range. |
| Volatility and pullback | `GRID_MIN_ATR_PCT`, `GRID_MAX_ATR_PCT`, `GRID_MAX_PULLBACK_BEYOND_SLOW_ATR`, `GRID_MAX_CANDLE_RANGE_ATR` | Reject volatility, pullback depth, or candle size outside the configured bounds. |
| Breakout entry | `GRID_ENTRY_MODE`, `GRID_BREAKOUT_LOOKBACK_BARS`, `GRID_BREAKOUT_MIN_DISTANCE_ATR`, `GRID_BREAKOUT_ACCEPTANCE_BARS`, `GRID_BREAKOUT_RETEST_MAX_BARS`, `GRID_BREAKOUT_RETEST_TOLERANCE_ATR`, `GRID_BREAKOUT_RETEST_MAX_CLOSE_DISTANCE_ATR` | Select the entry model and define breakout, acceptance, and retest limits. |
| Continuation risk | `GRID_CONTINUATION_ALLOW_SCALE_IN`, `GRID_CONTINUATION_RISK_MODE`, `GRID_CONTINUATION_STOP_BUFFER_ATR`, `GRID_CONTINUATION_MIN_STOP_DISTANCE_ATR`, `GRID_CONTINUATION_TARGET_R` | Control additions and stop and target geometry for breakout continuation. |
| Grid construction | `GRID_STEP_ATR_MULT`, `GRID_MIN_STEP_PCT`, `GRID_MAX_LEVELS`, `GRID_STOP_ATR_MULT`, `GRID_TAKE_PROFIT_STEP_MULT`, `GRID_TAKE_PROFIT_STEP_MULT_LONG`, `GRID_TAKE_PROFIT_STEP_MULT_SHORT`, `GRID_MIN_NET_RISK_RATIO` | Set grid spacing, level count, basket stop, directional targets, and minimum net reward-to-risk. |
| Lifecycle | `GRID_EXIT_ON_REGIME_FLIP`, `GRID_EXIT_ON_VOLATILITY_SHOCK`, `GRID_ENTRY_COOLDOWN_BARS`, `GRID_PROTECTION_REPRICE_ATR` | Exit on regime or volatility changes, delay re-entry, and control protection repricing. |
| Range filter | `GRID_RANGE_FILTER_MODE`, `GRID_RANGE_PIVOT_LEFT_BARS`, `GRID_RANGE_PIVOT_RIGHT_BARS`, `GRID_RANGE_LOOKBACK_BARS`, `GRID_RANGE_MIN_PIVOTS_PER_SIDE`, `GRID_RANGE_MIN_WIDTH_ATR`, `GRID_RANGE_MAX_WIDTH_ATR`, `GRID_RANGE_MAX_CENTER_SLOPE_ATR_PER_BAR`, `GRID_RANGE_MAX_BOUNDARY_DIVERGENCE_ATR`, `GRID_RANGE_MIN_CONTAINMENT_RATIO`, `GRID_RANGE_CONTAINMENT_TOLERANCE_ATR`, `GRID_RANGE_EDGE_FRACTION` | Configure the optional horizontal-range detector and its containment and edge rules. |
| Figures and side policy | `GRID_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Limit chart output, set the loss budget, and configure each direction. |

Scale-in entries increase an existing position; validate connector support and
basket-level loss behavior before enabling orders.
