---
title: 'RelativeRotation'
---

`RelativeRotation` trades a symbol's rotation relative to BTC. It evaluates
24-hour alpha and ratio return, one-hour relative strength, ratio trend,
participation, correlation, and optional BTC/alt regime alignment.

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

## Key configuration

- rotation: `RR_MIN_ALPHA_24H`, `RR_MIN_RATIO_RETURN_24H`, `RR_MIN_RELATIVE_STRENGTH_1H*`
- alignment: `RR_REQUIRE_RATIO_TREND`, `RR_REQUIRE_BTC_ALT_REGIME_ALIGNMENT`
- quality: `RR_MIN_VOLUME_REL20`, `RR_MIN_ADX_DI_MINUS*`, `RR_MIN_TARGET_BTC_CORRELATION*`, `RR_MAX_ATR_PCT_RANK100*`
- risk: `RR_STOP_ATR_MULT`, `RR_STOP_BUFFER_PCT`, `RR_TARGET_R_MULT*`

BTC reference values are resolved at or before the evaluated candle. Check BTC
and symbol data coverage together when diagnosing missing entries.

