---
title: 'TrendFollow'
---

`TrendFollow` is a built-in TypeScript strategy from `@tradejs/strategies`.

It researches continuation-style trend setups, using a trailing stop line and strategy-specific deterministic guardrails.

## Entry Logic

1. Replays candles through `createTrendFollowEngine(...)`.
2. Reads `runtimeState.signal` and `runtimeState.snapshot`.
3. Skips until a bullish or bearish trend signal exists.
4. Selects `LONG` or `SHORT` side config from signal direction.
5. Uses `signal.trailStop` as the stop-loss reference.
6. Computes target from `TRENDFOLLOW_TARGET_R_MULT`.
7. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
8. Returns `entry` with trend-follow figures and `trendFollowContext`.

Entry codes:

- `TRENDFOLLOW_BULL_TREND`
- `TRENDFOLLOW_BEAR_TREND`

## Exits

When a position exists:

- `TRENDFOLLOW_TRAIL_STOP_EXIT` when `TRENDFOLLOW_EXIT_ON_TRAIL_STOP=true` and price crosses the active trailing stop.
- `TRENDFOLLOW_OPPOSITE_SIGNAL_EXIT` when `TRENDFOLLOW_EXIT_ON_OPPOSITE_SIGNAL=true` and the engine emits an opposite trend signal.
- otherwise `POSITION_EXISTS`.

## Config Parameters

Trend model:

- `TRENDFOLLOW_PIVOT_LENGTH`
- `TRENDFOLLOW_MIN_BARS_BETWEEN_SIGNALS`
- `TRENDFOLLOW_ATR_LENGTH`
- `TRENDFOLLOW_ATR_MULT`
- `TRENDFOLLOW_SIGNAL_OFFSET_ATR`
- `TRENDFOLLOW_TARGET_R_MULT`
- `TRENDFOLLOW_EXIT_ON_TRAIL_STOP`
- `TRENDFOLLOW_EXIT_ON_OPPOSITE_SIGNAL`
- `TRENDFOLLOW_MAX_FIGURE_POINTS`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Signal Payload

The strategy stores:

- `additionalIndicators.trendFollowContext`
- trend and trailing-stop figures from `buildTrendFollowFigures(...)`
- stop at `signal.trailStop`
- one take-profit at the computed target

## Common Skip Reasons

- `NO_TREND_FOLLOW_SIGNAL`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Trend-following experiments are very sensitive to stop distance, warmup length, and market regime. Treat guardrail behavior as implementation detail to validate with your own tickers and timeframes.

Related:

- [AI/ML workflows](../../guides/ai-ml-workflows)
- [Backtesting caveats](../../limitations/backtesting-caveats)
