---
title: 'AdaptiveTrendChannel'
---

`AdaptiveTrendChannel` is a built-in TypeScript strategy from `@tradejs/strategy-adaptive-trend-channel`.

It replays candles through an adaptive channel engine, watches for bullish/bearish channel flips, and sizes entries from the distance to the channel boundary used as the stop.

## Visual overview

![AdaptiveTrendChannel strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-AdaptiveTrendChannel/main/docs/strategy-logic.svg)

![AdaptiveTrendChannel signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-AdaptiveTrendChannel/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. Builds runtime state with `createAdaptiveTrendChannelEngine({ initialCandles, config })`.
2. On each candle, reads `runtimeState.signal` and `runtimeState.snapshot`.
3. Skips until a channel flip passes the configured bar confirmation; optional
   price acceptance also requires the close beyond the recent peak or trough.
4. Selects `LONG` or `SHORT` side config from the signal direction.
5. Applies context filters through `getAdaptiveTrendChannelFilterSkipCode(...)`.
6. Uses the signal floor/roof as stop-loss:
   - long stop: `signal.floor`
   - short stop: `signal.roof`
7. Computes target from `ADAPTIVE_TREND_CHANNEL_TARGET_R_MULT`.
8. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
9. Returns `entry` with channel figures and `adaptiveTrendChannelContext`.

Entry codes:

- `ADAPTIVE_TREND_CHANNEL_BULLISH_FLIP`
- `ADAPTIVE_TREND_CHANNEL_BEARISH_FLIP`

## Exits

When a position exists:

- `ADAPTIVE_TREND_CHANNEL_BREAK_EXIT` when `ADAPTIVE_TREND_CHANNEL_EXIT_ON_CHANNEL_BREAK=true` and price breaks the active channel boundary.
- `ADAPTIVE_TREND_CHANNEL_OPPOSITE_FLIP_EXIT` when `ADAPTIVE_TREND_CHANNEL_EXIT_ON_OPPOSITE_FLIP=true` and the engine emits the opposite flip.
- otherwise `POSITION_EXISTS`.

`ADAPTIVE_TREND_CHANNEL_EXIT_CONFIRMATION_BARS` delays either exit until its
condition persists. Directional `_LONG` and `_SHORT` overrides take precedence.
`ADAPTIVE_TREND_CHANNEL_REENTRY_COOLDOWN_MS` controls the post-trade entry
cooldown.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build the shared market context. |
| Channel construction | `ADAPTIVE_TREND_CHANNEL_REGRESSION_BARS`, `ADAPTIVE_TREND_CHANNEL_ENVELOPE_BARS`, `ADAPTIVE_TREND_CHANNEL_ATR_STRETCH`, `ADAPTIVE_TREND_CHANNEL_VOLATILITY_LOOKBACK`, `ADAPTIVE_TREND_CHANNEL_MIN_CHANNEL_WIDTH_PCT`, `ADAPTIVE_TREND_CHANNEL_MAX_CHANNEL_WIDTH_PCT` | Define the regression window, envelope, volatility adjustment, and allowed channel width. |
| Breakout quality | `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_PCT`, `ADAPTIVE_TREND_CHANNEL_MAX_BREAKOUT_DISTANCE_PCT`, `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_ATR`, `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_ATR_LONG`, `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_ATR_SHORT`, `ADAPTIVE_TREND_CHANNEL_MAX_BREAKOUT_DISTANCE_ATR`, `ADAPTIVE_TREND_CHANNEL_MIN_VOLUME_REL20` | Limit breakout distance and relative volume, with directional minimum-distance overrides. |
| Context and confirmation | `ADAPTIVE_TREND_CHANNEL_REQUIRE_CONTEXT_ALIGNMENT`, `ADAPTIVE_TREND_CHANNEL_MIN_CONTEXT_ALIGNMENTS`, `ADAPTIVE_TREND_CHANNEL_FLIP_CONFIRMATION_BARS`, `ADAPTIVE_TREND_CHANNEL_REQUIRE_PRICE_ACCEPTANCE` | Require market-context agreement and control flip and price acceptance confirmation. |
| Target and lifecycle | `ADAPTIVE_TREND_CHANNEL_TARGET_R_MULT`, `ADAPTIVE_TREND_CHANNEL_EXIT_ON_OPPOSITE_FLIP`, `ADAPTIVE_TREND_CHANNEL_EXIT_ON_CHANNEL_BREAK`, `ADAPTIVE_TREND_CHANNEL_EXIT_CONFIRMATION_BARS`, `ADAPTIVE_TREND_CHANNEL_REENTRY_COOLDOWN_MS` | Set target distance, exit triggers, exit confirmation, and re-entry cooldown. Directional exit-confirmation overrides are accepted when supplied. |
| Figures and side policy | `ADAPTIVE_TREND_CHANNEL_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Limit chart output, set the loss budget, and configure each direction. |

## Signal Payload

The strategy stores:

- `additionalIndicators.adaptiveTrendChannelContext`
- channel figures from `buildAdaptiveTrendChannelFigures(...)`
- `orderPlan.qty`
- `orderPlan.stopLossPrice`
- one take-profit at the computed target price

## Common Skip Reasons

- `NO_ADAPTIVE_TREND_CHANNEL_FLIP`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- filter-specific skip code from `getAdaptiveTrendChannelFilterSkipCode(...)`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Inspect the generated channel figures before comparing metrics. This strategy depends on structural channel state, so data gaps and warmup length can change early signals.
