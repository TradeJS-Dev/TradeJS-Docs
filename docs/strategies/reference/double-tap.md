---
title: 'DoubleTap'
---

`DoubleTap` is a built-in TypeScript strategy from `@tradejs/strategies`.

It detects double-bottom and double-top structures, then trades the breakout/breakdown with stop and target prices produced by the pattern engine.

## Entry Logic

1. Replays candles through `createDoubleTapEngine(...)`.
2. Reads `runtimeState.pattern`.
3. Skips until a pattern exists.
4. Uses `LONG` config for a long pattern and `SHORT` config for a short pattern.
5. Computes `riskDistance` from current price to `pattern.stopLossPrice`.
6. Computes `riskRatio` from target distance divided by risk distance.
7. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
8. Returns `entry` with double-tap figures and `doubleTapContext`.

Entry codes:

- `DOUBLETAP_DOUBLE_BOTTOM_BREAKOUT`
- `DOUBLETAP_DOUBLE_TOP_BREAKDOWN`

## Exits

When a position exists:

- `DOUBLETAP_OPPOSITE_PATTERN_EXIT` when `DOUBLETAP_EXIT_ON_OPPOSITE_PATTERN=true` and the engine detects the opposite pattern.
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

Pattern model:

- `DOUBLETAP_PIVOT_LENGTH`
- `DOUBLETAP_PIVOT_TOLERANCE_PCT`
- `DOUBLETAP_TARGET_FIB_PCT`
- `DOUBLETAP_STOP_FIB_PCT`
- `DOUBLETAP_MIN_PATTERN_HEIGHT_PCT`
- `DOUBLETAP_MAX_BREAKOUT_DISTANCE_PCT`
- `DOUBLETAP_EXIT_ON_OPPOSITE_PATTERN`

Side configs:

- `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`
- `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio`

## Signal Payload

The strategy stores:

- `additionalIndicators.doubleTapContext`
- figures from `buildDoubleTapFigures(...)`
- stop at `pattern.stopLossPrice`
- one take-profit at `pattern.targetPrice`

## Common Skip Reasons

- `NO_PATTERN`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Use chart figures to confirm that the detected double top/bottom matches the structure you expected. Pattern engines are sensitive to pivot length and tolerance settings.
