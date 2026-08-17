---
title: 'VolatilityCompressionBreakout'
---

`VolatilityCompressionBreakout` trades expansion after a volatility
compression. It combines ATR and Bollinger-width ranks with a local support or
resistance breakout, then applies signal-time participation and acceptance
filters.

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

## Key configuration

- compression: `VCB_MAX_ATR_PCT_RANK`, `VCB_MAX_BB_WIDTH_RANK`, `VCB_REQUIRE_BOTH_COMPRESSION_FILTERS`
- expansion: `VCB_MIN_RANGE_EXPANSION_RANK`, `VCB_MIN_VOLUME_REL20`, `VCB_MIN_BREAKOUT_BODY_ATR`
- entry geometry: `VCB_MIN_BREAKOUT_DISTANCE_ATR*`, `VCB_MAX_BREAKOUT_DISTANCE_ATR`, `VCB_MIN_ACCEPTANCE_CLOSES`
- context: `VCB_REQUIRE_MTF_ALIGNMENT`, `VCB_REQUIRE_TRADE_FLOW_ALIGNMENT`
- risk: `VCB_STOP_ATR_BUFFER_MULT`, `VCB_FALLBACK_STOP_ATR_MULT`, `VCB_TARGET_R_MULT`

