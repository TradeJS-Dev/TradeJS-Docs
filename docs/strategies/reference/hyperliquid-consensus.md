---
title: 'HyperliquidConsensus'
---

`HyperliquidConsensus` trades directional agreement in the position-aware flow
of configured Hyperliquid accounts. It requires sufficiently complete and
current whale-position data and skips when that context is missing or stale.

## Visual overview

![HyperliquidConsensus strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HyperliquidConsensus/main/docs/strategy-logic.svg)

![HyperliquidConsensus signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HyperliquidConsensus/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Read the signal-time whale context from `baseContext`.
2. Require minimum unique whales, context coverage, position-aware coverage,
   total entry notional, and net entry notional.
3. Resolve long/short consensus from entry-notional share.
4. Apply cooldown and side policy.
5. Build an ATR-buffered stop, R-multiple target, and risk-sized order.

Entry codes are `HLC_LONG_CONSENSUS` and `HLC_SHORT_CONSENSUS`. Optional exits
respond to opposite consensus or material position reduction.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Fees | `FEE_PERCENT` | Include the configured trading fee in position and reward-to-risk calculations. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators and levels | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Set the periods used for shared market context and local levels. |
| Data coverage | `HLC_MIN_UNIQUE_WHALES`, `HLC_MIN_COVERAGE_PCT`, `HLC_MIN_POSITION_AWARE_PCT`, `HLC_MAX_CONTEXT_AGE_MS` | Require enough current accounts and sufficiently complete position-aware data. |
| Consensus flow | `HLC_MIN_TOTAL_ENTRY_NOTIONAL_USD`, `HLC_MIN_NET_ENTRY_NOTIONAL_USD`, `HLC_LONG_MIN_ENTRY_SHARE`, `HLC_SHORT_MAX_ENTRY_SHARE` | Set the minimum flow size and the long and short consensus shares. |
| Entry and risk | `HLC_ENTRY_COOLDOWN_MS`, `HLC_STOP_ATR_MULT`, `HLC_STOP_BUFFER_PCT`, `HLC_TARGET_R_MULT`, `MAX_LOSS_VALUE` | Delay repeated entries and set the stop, target, and position loss budget. |
| Exit confirmation | `HLC_EXIT_ON_OPPOSITE_CONSENSUS`, `HLC_EXIT_ON_POSITION_REDUCTION`, `HLC_EXIT_MIN_UNIQUE_WHALES`, `HLC_EXIT_MIN_NOTIONAL_USD`, `HLC_EXIT_MIN_DIRECTION_SHARE` | Enable exits and require enough accounts, notional, and directional share to confirm them. |
| Side policy | `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Enable each direction and set its minimum reward-to-risk ratio. |

The default interval is five minutes. Start the ingest/backfill described in
[Derivatives and spread ingest](../../operations/derivatives-ingest) and verify
Timescale coverage before backtesting or runtime use.
