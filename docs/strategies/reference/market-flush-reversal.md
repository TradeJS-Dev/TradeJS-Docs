---
title: 'MarketFlushReversal'
---

`MarketFlushReversal` looks for broad-market liquidation or pressure followed
by a directional rejection candle. Its decision uses only the closed candle and
market context available at that timestamp.

## Visual overview

![MarketFlushReversal strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MarketFlushReversal/main/docs/strategy-logic.svg)

![MarketFlushReversal signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MarketFlushReversal/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Require current shared market context.
2. Classify a long or short flush from liquidation/imbalance and candle-reversal evidence.
3. Apply side-specific range, turnover, candle-body, and confirmation filters.
4. Enter immediately or keep a bounded pending setup, depending on `MFR_ENTRY_MODE`.
5. Build an ATR/percent-buffered stop and an R-multiple target, then size from `MAX_LOSS_VALUE`.

Entry codes are `MFR_LONG_FLUSH_REVERSAL` and
`MFR_SHORT_FLUSH_REVERSAL`. `MFR_EXIT_ON_OPPOSITE_SIGNAL` optionally closes a
position with `MFR_OPPOSITE_FLUSH_EXIT`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Risk estimates | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Estimate one-way fees, slippage, and market impact for position sizing and reward-to-risk checks. Backtest execution costs are configured separately. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators and levels | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Set the periods used to build shared market context, local levels, and signal filters. |
| Market evidence | `MFR_MIN_VOLUME_REL20`, `MFR_MIN_MARKET_LIQ_SPIKE_RATIO`, `MFR_REQUIRE_MARKET_FLUSH_CONFIRMATION` | Set the required target volume and broad-market liquidation evidence. |
| Deterministic gate | `MFR_REQUIRE_CALIBRATED_LONG_REBOUND_POCKET`, `MFR_ENABLE_PROTECTED_V1_H1_RANGE50_SHORT_POCKET` | Enable the validated long rebound rule and the protected short approval path. |
| Rejection candle | `MFR_MIN_SWEEP_WICK_PCT`, `MFR_MIN_REJECTION_CLOSE_POSITION`, `MFR_MIN_REJECTION_CLOSE_POSITION_LONG`, `MFR_MIN_REJECTION_CLOSE_POSITION_SHORT`, `MFR_MIN_REJECTION_BODY_ATR`, `MFR_MIN_REJECTION_BODY_ATR_LONG`, `MFR_MIN_REJECTION_BODY_ATR_SHORT`, `MFR_MIN_ENTRY_BODY_STRENGTH`, `MFR_MIN_ENTRY_BODY_STRENGTH_LONG`, `MFR_MIN_ENTRY_BODY_STRENGTH_SHORT` | Define wick, close-location, body-size, and body-strength floors, with directional overrides. |
| Confirmation quality | `MFR_MIN_CONFIRMATION_DISPLACEMENT_ATR`, `MFR_MIN_CONFIRMATION_DISPLACEMENT_ATR_LONG`, `MFR_MIN_CONFIRMATION_DISPLACEMENT_ATR_SHORT`, `MFR_MIN_AVG_TURNOVER_20`, `MFR_MIN_AVG_TURNOVER_20_LONG`, `MFR_MIN_AVG_TURNOVER_20_SHORT`, `MFR_MAX_LONG_RANGE_POSITION`, `MFR_MIN_SHORT_RANGE_POSITION` | Require enough confirmation movement, turnover, and a valid range location for each direction. |
| Entry timing | `MFR_ENTRY_MODE`, `MFR_CONFIRMATION_BARS`, `MFR_CONFIRMATION_BARS_LONG`, `MFR_CONFIRMATION_BARS_SHORT`, `MFR_PENDING_MAX_BARS`, `MFR_REQUIRE_DIRECTIONAL_CONFIRMATION_BODY`, `MFR_USE_FROZEN_PENDING_STOP` | Choose immediate or delayed entry, bound pending state, and control confirmation-body and stop behavior. |
| Target, stop, and exit | `MFR_STOP_ATR_BUFFER_MULT`, `MFR_STOP_BUFFER_PCT`, `MFR_FALLBACK_STOP_ATR_MULT`, `MFR_TARGET_R_MULT`, `MFR_EXIT_ON_OPPOSITE_SIGNAL` | Set structural and fallback stops, target distance, and opposite-signal exit behavior. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Set the loss budget and configure each direction and its minimum reward-to-risk ratio. |

Fields ending in `_LONG` or `_SHORT` override the unsuffixed value for that
direction. Validate coverage of liquidation and market-context inputs before
interpreting a no-signal result.

In deterministic `AI_MODE: "gate"`, LONG and SHORT signals must match their
validated causal context pockets. Enabling the protected SHORT flag adds a
narrower approval path that requires supportive breadth, rejection wick,
derivatives, and 1h range-position context. Missing required features fail
closed.
