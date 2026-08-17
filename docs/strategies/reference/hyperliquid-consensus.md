---
title: 'HyperliquidConsensus'
---

`HyperliquidConsensus` trades position-aware consensus from a configured set of
Hyperliquid whale accounts. The strategy declares `hyperliquidWhales` as a
required core context and skips when current coverage is missing or stale.

## Decision flow

1. Read the signal-time whale context from `baseContext`.
2. Require minimum unique whales, context coverage, position-aware coverage,
   total entry notional, and net entry notional.
3. Resolve long/short consensus from entry-notional share.
4. Apply cooldown and side policy.
5. Build an ATR-buffered stop, R-multiple target, and risk-sized order.

Entry codes are `HLC_LONG_CONSENSUS` and `HLC_SHORT_CONSENSUS`. Optional exits
respond to opposite consensus or material position reduction.

## Key configuration

- coverage: `HLC_MIN_UNIQUE_WHALES`, `HLC_MIN_COVERAGE_PCT`, `HLC_MIN_POSITION_AWARE_PCT`
- flow: `HLC_MIN_TOTAL_ENTRY_NOTIONAL_USD`, `HLC_MIN_NET_ENTRY_NOTIONAL_USD`, `HLC_LONG_MIN_ENTRY_SHARE`, `HLC_SHORT_MAX_ENTRY_SHARE`
- freshness/cooldown: `HLC_MAX_CONTEXT_AGE_MS`, `HLC_ENTRY_COOLDOWN_MS`
- risk: `HLC_STOP_ATR_MULT`, `HLC_STOP_BUFFER_PCT`, `HLC_TARGET_R_MULT`
- exits: `HLC_EXIT_ON_OPPOSITE_CONSENSUS`, `HLC_EXIT_ON_POSITION_REDUCTION`

The default interval is five minutes. Start the ingest/backfill described in
[Derivatives and spread ingest](../../operations/derivatives-ingest) and verify
Timescale coverage before backtesting or runtime use.

