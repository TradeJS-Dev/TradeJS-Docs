---
title: 'DoubleTap'
---

`DoubleTap` is a built-in TypeScript strategy from `@tradejs/strategy-double-tap`.

It detects double-bottom and double-top structures, then trades the breakout/breakdown with stop and target prices produced by the pattern engine.

## Visual overview

![DoubleTap strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-DoubleTap/main/docs/strategy-logic.svg)

![DoubleTap signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-DoubleTap/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. Replays candles through `createDoubleTapEngine(...)`.
2. Reads `runtimeState.pattern`.
3. Skips until a pattern exists.
4. Uses `LONG` config for a long pattern and `SHORT` config for a short pattern.
5. Computes `riskDistance` from current price to `pattern.stopLossPrice`.
6. Computes `riskRatio` from target distance divided by risk distance.
7. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, using the `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, and `RISK_MARKET_IMPACT_BPS` estimates.
8. Returns `entry` with double-tap figures and `doubleTapContext`.

Entry codes:

- `DOUBLETAP_DOUBLE_BOTTOM_BREAKOUT`
- `DOUBLETAP_DOUBLE_TOP_BREAKDOWN`

## Exits

When a position exists:

- `DOUBLETAP_OPPOSITE_PATTERN_EXIT` when `DOUBLETAP_EXIT_ON_OPPOSITE_PATTERN=true` and the engine detects the opposite pattern.
- otherwise `POSITION_EXISTS`.

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, shared indicator,
and position-sizing keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build shared market context and signal filters. |
| Pattern geometry | `DOUBLETAP_PIVOT_LENGTH`, `DOUBLETAP_PIVOT_TOLERANCE_PCT`, `DOUBLETAP_MIN_PATTERN_HEIGHT_PCT`, `DOUBLETAP_MIN_PATTERN_HEIGHT_ATR`, `DOUBLETAP_ATR_PERIOD`, `DOUBLETAP_MIN_TAP_SPACING_BARS`, `DOUBLETAP_MAX_PATTERN_AGE_BARS`, `DOUBLETAP_MIN_LEG_SYMMETRY_RATIO` | Define pivot confirmation, tap similarity, minimum height, spacing, age, and leg symmetry. |
| Breakout quality | `DOUBLETAP_MIN_BREAKOUT_DISTANCE_ATR`, `DOUBLETAP_MAX_BREAKOUT_DISTANCE_HEIGHT_RATIO`, `DOUBLETAP_MAX_BREAKOUT_DISTANCE_PCT`, `DOUBLETAP_MAX_BB_WIDTH_PCT`, `DOUBLETAP_MAX_BB_WIDTH_PCT_LONG`, `DOUBLETAP_MAX_BB_WIDTH_PCT_SHORT` | Limit breakout distance and Bollinger width, with directional volatility overrides. |
| Entry timing | `DOUBLETAP_ENTRY_MODE`, `DOUBLETAP_CONFIRMATION_MAX_BARS`, `DOUBLETAP_MAX_ENTRY_CONFIRMATION_BARS`, `DOUBLETAP_MAX_ENTRY_CONFIRMATION_BARS_LONG`, `DOUBLETAP_MAX_ENTRY_CONFIRMATION_BARS_SHORT`, `DOUBLETAP_RETEST_MAX_BARS`, `DOUBLETAP_RETEST_TOLERANCE_ATR` | Choose the entry mode and bound confirmation and retest timing, with directional confirmation overrides. |
| Target, stop, and exit | `DOUBLETAP_TARGET_FIB_PCT`, `DOUBLETAP_STOP_FIB_PCT`, `DOUBLETAP_EXIT_ON_OPPOSITE_PATTERN` | Set target and stop distances from pattern height and allow an opposite pattern to exit. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Set the loss budget and enable each direction with its minimum reward-to-risk ratio. |

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
