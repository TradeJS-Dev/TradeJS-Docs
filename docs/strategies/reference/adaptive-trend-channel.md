---
title: 'AdaptiveTrendChannel'
---

`AdaptiveTrendChannel` is a built-in TypeScript strategy from `@tradejs/strategies`.

It replays candles through an adaptive channel engine, watches for bullish/bearish channel flips, and sizes entries from the distance to the channel boundary used as the stop.

## Entry Logic

1. Builds runtime state with `createAdaptiveTrendChannelEngine({ initialCandles, config })`.
2. On each candle, reads `runtimeState.signal` and `runtimeState.snapshot`.
3. Skips until a channel flip signal exists.
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

## Config Parameters

Shared runtime:

- `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`
- `BACKTEST_PRICE_MODE`
- `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`
- `ML_ENABLED`, `ML_THRESHOLD`

Risk and shared indicators:

- `FEE_PERCENT`, `MAX_LOSS_VALUE`
- `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`
- `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`
- `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`

Channel model:

- `ADAPTIVE_TREND_CHANNEL_REGRESSION_BARS`
- `ADAPTIVE_TREND_CHANNEL_ENVELOPE_BARS`
- `ADAPTIVE_TREND_CHANNEL_ATR_STRETCH`
- `ADAPTIVE_TREND_CHANNEL_VOLATILITY_LOOKBACK`
- `ADAPTIVE_TREND_CHANNEL_TARGET_R_MULT`
- `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_PCT`
- `ADAPTIVE_TREND_CHANNEL_MAX_BREAKOUT_DISTANCE_PCT`
- `ADAPTIVE_TREND_CHANNEL_MIN_CHANNEL_WIDTH_PCT`
- `ADAPTIVE_TREND_CHANNEL_MAX_CHANNEL_WIDTH_PCT`
- `ADAPTIVE_TREND_CHANNEL_MIN_VOLUME_REL20`
- `ADAPTIVE_TREND_CHANNEL_REQUIRE_CONTEXT_ALIGNMENT`
- `ADAPTIVE_TREND_CHANNEL_EXIT_ON_OPPOSITE_FLIP`
- `ADAPTIVE_TREND_CHANNEL_EXIT_ON_CHANNEL_BREAK`
- `ADAPTIVE_TREND_CHANNEL_MAX_FIGURE_POINTS`

Side configs:

- `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`
- `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio`

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
