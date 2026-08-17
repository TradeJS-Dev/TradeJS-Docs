---
title: 'MarketFlushReversal'
---

`MarketFlushReversal` is a TypeScript strategy that looks for a broad market
liquidation/pressure flush followed by a directional candle rejection. It uses
the closed candle and `baseContext`; it does not fetch future or connector data
from the strategy core.

## Decision flow

1. Require current shared market context.
2. Classify a long or short flush from liquidation/imbalance and candle-reversal evidence.
3. Apply side-specific range, turnover, candle-body, and confirmation filters.
4. Enter immediately or keep a bounded pending setup, depending on `MFR_ENTRY_MODE`.
5. Build an ATR/percent-buffered stop and an R-multiple target, then size from `MAX_LOSS_VALUE`.

Entry codes are `MFR_LONG_FLUSH_REVERSAL` and
`MFR_SHORT_FLUSH_REVERSAL`. `MFR_EXIT_ON_OPPOSITE_SIGNAL` optionally closes a
position with `MFR_OPPOSITE_FLUSH_EXIT`.

## Key configuration

- evidence: `MFR_MIN_VOLUME_REL20`, `MFR_MIN_MARKET_LIQ_SPIKE_RATIO`
- rejection: `MFR_MIN_SWEEP_WICK_PCT`, `MFR_MIN_REJECTION_CLOSE_POSITION*`, `MFR_MIN_REJECTION_BODY_ATR*`
- confirmation: `MFR_ENTRY_MODE`, `MFR_CONFIRMATION_BARS*`, `MFR_PENDING_MAX_BARS`
- risk: `MFR_STOP_ATR_BUFFER_MULT`, `MFR_STOP_BUFFER_PCT`, `MFR_FALLBACK_STOP_ATR_MULT`, `MFR_TARGET_R_MULT`
- side policy: `LONG.*`, `SHORT.*`

Fields ending in `_LONG` or `_SHORT` override the unsuffixed value for that
direction. Validate coverage of liquidation and market-context inputs before
interpreting a no-signal result.

