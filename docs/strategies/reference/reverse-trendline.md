---
title: 'ReverseTrendLine'
---

`ReverseTrendLine` is a built-in TypeScript strategy from `@tradejs/strategies`.

It builds support/resistance trendlines from recent highs and lows, then researches rejection behavior around those lines instead of the primary breakout path.

## Entry Logic

1. Builds high and low trendline candidates from candle pivots.
2. Skips until an enabled side (`HIGHS` or `LOWS`) produces a valid reverse setup.
3. Applies volatility and timing filters.
4. Selects the side config from the candidate direction.
5. Places a stop from `REVERSE_TRENDLINE_STOP_BASE_PCT`.
6. Computes target from `REVERSE_TRENDLINE_TARGET_R_MULT`.
7. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
8. Returns `entry` with reverse-trendline figures and signal seed indicators.

Entry code:

- `REVERSE_TRENDLINE_SIGNAL`

## Exits

When a position exists:

- `REVERSE_TRENDLINE_FAILED_BOUNCE_EXIT` when the expected bounce/rejection fails.
- otherwise `POSITION_EXISTS`.

## Config Parameters

Trendline model:

- `TRENDLINE.minTouches`
- `TRENDLINE.offset`
- `TRENDLINE.epsilon`
- `TRENDLINE.epsilonOffset`
- `REVERSE_TRENDLINE_STOP_BASE_PCT`
- `REVERSE_TRENDLINE_TARGET_R_MULT`

Side configs:

- `HIGHS.enable`, `HIGHS.direction`, `HIGHS.minRiskRatio`
- `LOWS.enable`, `LOWS.direction`, `LOWS.minRiskRatio`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Signal Payload

The strategy stores:

- reverse-trendline figures from `buildReverseTrendLineFigures(...)`
- signal seed indicators from `buildReverseTrendlineSignalSeed(...)`
- `orderPlan.qty`
- `orderPlan.stopLossPrice`
- one take-profit at the computed target

## Common Skip Reasons

- `NO_TRENDLINE`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `VERY_VOLATILITY`
- `REVERSE_TRENDLINE_TIMING:<code>`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Trendline strategies are sensitive to pivot selection, candle gaps, and chart scaling. Inspect generated figures before interpreting metrics, especially when changing `TRENDLINE.epsilon` or timeframe.

Related:

- [TrendLine](./trendline)
- [Backtesting caveats](../../limitations/backtesting-caveats)
