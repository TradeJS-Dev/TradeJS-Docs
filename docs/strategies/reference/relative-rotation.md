---
title: 'RelativeRotation'
---

`RelativeRotation` trades a symbol's rotation relative to BTC. It evaluates
24-hour alpha and ratio return, one-hour relative strength, ratio trend,
participation, correlation, and optional BTC/alt regime alignment.

## Visual overview

![RelativeRotation strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-RelativeRotation/main/docs/strategy-logic.svg)

![RelativeRotation signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-RelativeRotation/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Require a complete current `baseContext`.
2. Resolve long or short relative rotation from target-vs-BTC features.
3. Apply side policy and the configured relative-strength, volume, ADX,
   correlation, volatility-rank, and regime filters.
4. Build an ATR-buffered stop and a direction-aware R-multiple target.
5. Size the position from `MAX_LOSS_VALUE`.

Entry codes are `RR_LONG_RELATIVE_ROTATION` and
`RR_SHORT_RELATIVE_ROTATION`. `RR_EXIT_ON_OPPOSITE_ROTATION` enables
`RR_OPPOSITE_ROTATION_EXIT`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Risk estimates | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Estimate one-way fees, slippage, and market impact for position sizing and reward-to-risk checks. Backtest execution costs are configured separately. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators and levels | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Set the periods used to build shared market context, local levels, and signal filters. |
| Rotation signal | `RR_MIN_ALPHA_24H`, `RR_MIN_RATIO_RETURN_24H`, `RR_REQUIRE_ALPHA_AND_RATIO_RETURN`, `RR_MIN_RELATIVE_STRENGTH_1H`, `RR_MIN_RELATIVE_STRENGTH_1H_LONG`, `RR_MIN_RELATIVE_STRENGTH_1H_SHORT` | Set the alpha, ratio-return, and directional relative-strength thresholds and whether both daily conditions must pass. |
| Participation and alignment | `RR_MIN_VOLUME_REL20`, `RR_MAX_VOLUME_REL20`, `RR_MAX_VOLUME_REL20_LONG`, `RR_MAX_VOLUME_REL20_SHORT`, `RR_REQUIRE_RATIO_TREND`, `RR_REQUIRE_BTC_ALT_REGIME_ALIGNMENT` | Limit relative volume and require ratio-trend or BTC and alt-market regime agreement. |
| Directional quality | `RR_MIN_ADX_DI_MINUS`, `RR_MIN_ADX_DI_MINUS_LONG`, `RR_MIN_ADX_DI_MINUS_SHORT`, `RR_MIN_TARGET_BTC_CORRELATION`, `RR_MIN_TARGET_BTC_CORRELATION_LONG`, `RR_MIN_TARGET_BTC_CORRELATION_SHORT`, `RR_MAX_ATR_PCT_RANK100`, `RR_MAX_ATR_PCT_RANK100_LONG`, `RR_MAX_ATR_PCT_RANK100_SHORT` | Set directional trend-strength, BTC-correlation, and volatility-rank bounds. |
| Target, stop, and exit | `RR_STOP_ATR_MULT`, `RR_STOP_BUFFER_PCT`, `RR_TARGET_R_MULT`, `RR_TARGET_R_MULT_LONG`, `RR_TARGET_R_MULT_SHORT`, `RR_EXIT_ON_OPPOSITE_ROTATION` | Set stop and directional target distances and allow an opposite rotation to exit. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Set the loss budget and configure each direction and its minimum reward-to-risk ratio. |

BTC reference values are resolved at or before the evaluated candle. Check BTC
and symbol data coverage together when diagnosing missing entries.
