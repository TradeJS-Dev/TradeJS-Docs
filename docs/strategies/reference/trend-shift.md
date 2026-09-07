---
title: 'TrendShift'
---

`TrendShift` trades transitions detected as bullish or bearish flips in a
dynamic trend band.

## Visual overview

![TrendShift strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendShift/main/docs/strategy-logic.svg)

![TrendShift signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendShift/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. Replays candles through `createTrendShiftEngine(...)`.
2. Reads `runtimeState.signal` and `runtimeState.snapshot`.
3. Skips until a bullish or bearish flip exists.
4. Applies volatility and strategy guardrails.
5. Selects `LONG` or `SHORT` side config from signal direction.
6. Places the stop beyond the current band with ATR and percent buffers.
7. Computes target from `TRENDSHIFT_TARGET_R_MULT`.
8. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, using the `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, and `RISK_MARKET_IMPACT_BPS` estimates.
9. Returns `entry` with trend-shift figures and `trendShiftContext`.

Entry codes:

- `TRENDSHIFT_BULLISH_FLIP`
- `TRENDSHIFT_BEARISH_FLIP`

## Exits

When a position exists:

- `TRENDSHIFT_OPPOSITE_FLIP_EXIT` when `TRENDSHIFT_EXIT_ON_OPPOSITE_FLIP=true` and the engine emits the opposite flip.
- otherwise `POSITION_EXISTS`.

## Configuration keys

The keys are grouped by purpose. A listed `_LONG` or `_SHORT` key overrides
the unsuffixed value for that direction.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build shared market context and signal filters. |
| Trend band | `TRENDSHIFT_MULTIPLICATIVE_FACTOR`, `TRENDSHIFT_SLOPE`, `TRENDSHIFT_ATR_LENGTH`, `TRENDSHIFT_WIDTH_PCT` | Set the dynamic band response, slope, ATR period, and width. |
| Entry quality | `TRENDSHIFT_CONFIRM_FLIP_WITH_CLOSE`, `TRENDSHIFT_MIN_FLIP_DISTANCE_ATR`, `TRENDSHIFT_MIN_SIGNAL_BODY_STRENGTH`, `TRENDSHIFT_MIN_ADX` | Require close confirmation and set distance, candle-body, and trend-strength floors. |
| Target, stop, and exit | `TRENDSHIFT_STOP_ATR_BUFFER_MULT`, `TRENDSHIFT_STOP_BUFFER_PCT`, `TRENDSHIFT_TARGET_R_MULT`, `TRENDSHIFT_TARGET_R_MULT_LONG`, `TRENDSHIFT_TARGET_R_MULT_SHORT`, `TRENDSHIFT_EXIT_ON_OPPOSITE_FLIP`, `TRENDSHIFT_OPPOSITE_EXIT_CONFIRMATION_BARS` | Set stop and directional target distances and configure a confirmed opposite-flip exit. |
| Figures and side policy | `TRENDSHIFT_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Limit chart output, set the loss budget, and configure each direction. |

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
