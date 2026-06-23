---
title: 'TrendShift'
---

`TrendShift` is a built-in TypeScript strategy from `@tradejs/strategies`.

It researches trend transition setups by detecting bullish and bearish flips in a dynamic trend band.

## Entry Logic

1. Replays candles through `createTrendShiftEngine(...)`.
2. Reads `runtimeState.signal` and `runtimeState.snapshot`.
3. Skips until a bullish or bearish flip exists.
4. Applies volatility and strategy guardrails.
5. Selects `LONG` or `SHORT` side config from signal direction.
6. Places the stop beyond the current band with ATR and percent buffers.
7. Computes target from `TRENDSHIFT_TARGET_R_MULT`.
8. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
9. Returns `entry` with trend-shift figures and `trendShiftContext`.

Entry codes:

- `TRENDSHIFT_BULLISH_FLIP`
- `TRENDSHIFT_BEARISH_FLIP`

## Exits

When a position exists:

- `TRENDSHIFT_OPPOSITE_FLIP_EXIT` when `TRENDSHIFT_EXIT_ON_OPPOSITE_FLIP=true` and the engine emits the opposite flip.
- otherwise `POSITION_EXISTS`.

## Config Parameters

Trend-band model:

- `TRENDSHIFT_MULTIPLICATIVE_FACTOR`
- `TRENDSHIFT_SLOPE`
- `TRENDSHIFT_ATR_LENGTH`
- `TRENDSHIFT_WIDTH_PCT`
- `TRENDSHIFT_CONFIRM_FLIP_WITH_CLOSE`
- `TRENDSHIFT_MIN_FLIP_DISTANCE_ATR`
- `TRENDSHIFT_STOP_ATR_BUFFER_MULT`
- `TRENDSHIFT_STOP_BUFFER_PCT`
- `TRENDSHIFT_TARGET_R_MULT`
- `TRENDSHIFT_EXIT_ON_OPPOSITE_FLIP`
- `TRENDSHIFT_MAX_FIGURE_POINTS`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Signal Payload

The strategy stores:

- `additionalIndicators.trendShiftContext`
- band, flip, stop, and target figures from `buildTrendShiftFigures(...)`
- `orderPlan.stopLossPrice`
- one take-profit at the computed target

## Common Skip Reasons

- `WAIT_DATA`
- `NO_SIGNAL`
- `POSITION_EXISTS`
- `VERY_VOLATILITY`
- guardrail skip code from `getTrendShiftGuardrailSkipCode(...)`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Revalidate after changing market context, timeframe, or risk settings. Trend-transition systems are vulnerable to overfitting because small band and confirmation changes can move flips across candles.

Related:

- [Compare strategies](../../guides/compare-strategies)
- [Backtesting caveats](../../limitations/backtesting-caveats)
