---
title: 'VolatilityCompressionBreakout'
---

`VolatilityCompressionBreakout` trades expansion after a volatility
compression. It combines ATR and Bollinger-width ranks with a local support or
resistance breakout, then applies signal-time participation and acceptance
filters.

## Visual overview

![VolatilityCompressionBreakout strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolatilityCompressionBreakout/main/docs/strategy-logic.svg)

![VolatilityCompressionBreakout signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolatilityCompressionBreakout/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Require `baseContext` and detect compression from ATR/BB ranks.
2. Resolve a long or short breakout from local range or support/resistance state.
3. Check expansion, volume, candle body, distance, and optional MTF/trade-flow alignment.
4. Build a stop outside structure with ATR and percent fallbacks.
5. Use `VCB_TARGET_R_MULT` for the target and `MAX_LOSS_VALUE` for sizing.

Entry codes are `VCB_LONG_COMPRESSION_BREAKOUT` and
`VCB_SHORT_COMPRESSION_BREAKOUT`. With
`VCB_EXIT_ON_OPPOSITE_BREAKOUT=true`, an opposite setup exits through
`VCB_OPPOSITE_BREAKOUT_EXIT`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Risk estimates | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Estimate one-way fees, slippage, and market impact for position sizing and reward-to-risk checks. Backtest execution costs are configured separately. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators and levels | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Set the periods used to build shared market context, local levels, and signal filters. |
| Compression | `VCB_MAX_ATR_PCT_RANK`, `VCB_MAX_BB_WIDTH_RANK`, `VCB_REQUIRE_BOTH_COMPRESSION_FILTERS` | Set the maximum ATR and Bollinger-width ranks and choose whether both must show compression. |
| Expansion | `VCB_MIN_RANGE_EXPANSION_RANK`, `VCB_MIN_VOLUME_REL20`, `VCB_MIN_BREAKOUT_BODY_ATR`, `VCB_REQUIRE_BOTH_EXPANSION_FILTERS` | Require enough range expansion, relative volume, and breakout candle body. |
| Breakout geometry | `VCB_MIN_BREAKOUT_DISTANCE_ATR`, `VCB_MIN_BREAKOUT_DISTANCE_ATR_LONG`, `VCB_MIN_BREAKOUT_DISTANCE_ATR_SHORT`, `VCB_MAX_BREAKOUT_DISTANCE_ATR`, `VCB_ENTRY_MAX_ATR_PCT_RANK`, `VCB_ENTRY_MAX_ATR_PCT_RANK_LONG`, `VCB_ENTRY_MAX_ATR_PCT_RANK_SHORT`, `VCB_MIN_ACCEPTANCE_CLOSES`, `VCB_REQUIRE_DIRECTIONAL_BODY` | Limit breakout distance and entry volatility and require enough accepted closes and an optional directional body. |
| Context alignment | `VCB_REQUIRE_MTF_ALIGNMENT`, `VCB_REQUIRE_TRADE_FLOW_ALIGNMENT` | Require higher-timeframe or trade-flow context to agree with the breakout. |
| Target, stop, and exit | `VCB_STOP_ATR_BUFFER_MULT`, `VCB_STOP_BUFFER_PCT`, `VCB_FALLBACK_STOP_ATR_MULT`, `VCB_TARGET_R_MULT`, `VCB_EXIT_ON_OPPOSITE_BREAKOUT` | Set structural and fallback stops, target distance, and opposite-breakout exit behavior. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Set the loss budget and configure each direction and its minimum reward-to-risk ratio. |
