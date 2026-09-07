---
title: 'CupAndHandle'
---

`CupAndHandle` detects bullish cup-and-handle and bearish inverted-cup patterns
from closed-candle pivots. It derives the rim, cup depth, handle, breakout,
stop, and measured target from the same historical window.

## Visual overview

![CupAndHandle strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-CupAndHandle/main/docs/strategy-logic.svg)

![CupAndHandle signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-CupAndHandle/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Decision flow

1. Replay pivots through `createCupAndHandleEngine(...)`.
2. Validate cup depth, symmetry, duration, handle depth, and pattern age.
   `CUPHANDLE_REQUIRE_PATH_QUALITY` can also require both cup legs to
   progress on more than half of their comparable closes.
3. Enter on `breakout`, `close_acceptance`, or `retest` according to `CUPHANDLE_ENTRY_MODE`.
4. Optionally require relative breakout volume.
5. Size against the engine stop and target with the side's `minRiskRatio`.

The entry code is `CUPHANDLE_BREAKOUT` or
`CUPHANDLE_INVERTED_BREAKDOWN`. When
`CUPHANDLE_EXIT_ON_OPPOSITE_PATTERN=true`, the opposite pattern exits with
`CUPHANDLE_OPPOSITE_PATTERN_EXIT`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Risk estimates | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Estimate one-way fees, slippage, and market impact for position sizing and reward-to-risk checks. Backtest execution costs are configured separately. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build the shared market context. |
| Cup geometry | `CUPHANDLE_PIVOT_LOOKBACK`, `CUPHANDLE_RIM_TOLERANCE_PCT`, `CUPHANDLE_MIN_CUP_DEPTH_PCT`, `CUPHANDLE_MIN_CUP_DEPTH_ATR`, `CUPHANDLE_ATR_PERIOD` | Define the pivots, rim tolerance, minimum cup depth, and ATR scale. |
| Cup timing and symmetry | `CUPHANDLE_MIN_CUP_BARS`, `CUPHANDLE_MAX_CUP_BARS`, `CUPHANDLE_MIN_CUP_SYMMETRY_RATIO`, `CUPHANDLE_MAX_PATTERN_AGE_BARS` | Limit the cup duration, balance its two legs, and reject old patterns. |
| Handle geometry | `CUPHANDLE_MIN_HANDLE_BARS`, `CUPHANDLE_MAX_HANDLE_BARS`, `CUPHANDLE_MIN_HANDLE_DEPTH_RATIO`, `CUPHANDLE_MAX_HANDLE_DEPTH_RATIO` | Limit the handle duration and its depth relative to the cup. |
| Breakout quality | `CUPHANDLE_MIN_BREAKOUT_DISTANCE_ATR`, `CUPHANDLE_MAX_BREAKOUT_DISTANCE_DEPTH_RATIO`, `CUPHANDLE_MAX_BREAKOUT_DISTANCE_PCT`, `CUPHANDLE_REQUIRE_BREAKOUT_CROSS`, `CUPHANDLE_REQUIRE_PATH_QUALITY`, `CUPHANDLE_MIN_BREAKOUT_VOLUME_REL20` | Control breakout distance, require a fresh cross or clean cup path, and optionally require relative volume. |
| Entry timing | `CUPHANDLE_ENTRY_MODE`, `CUPHANDLE_CONFIRMATION_MAX_BARS`, `CUPHANDLE_RETEST_MAX_BARS`, `CUPHANDLE_RETEST_TOLERANCE_ATR` | Choose immediate breakout, close acceptance, or retest entry and bound the confirmation window. |
| Target, stop, and exit | `CUPHANDLE_TARGET_DEPTH_PCT`, `CUPHANDLE_STOP_BUFFER_DEPTH_PCT`, `CUPHANDLE_EXIT_ON_OPPOSITE_PATTERN` | Set target and stop distances from cup depth and allow an opposite pattern to exit. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Set the loss budget and enable each direction with its minimum reward-to-risk ratio. |

With deterministic `AI_MODE: "gate"`, the strategy-local gate approves a
signal only when the nearest resistance has at least 19 hits and the target's
20-period beta to ETH is non-negative. Missing gate features fail closed.
