---
title: 'ReverseTrendLine'
---

`ReverseTrendLine` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она строит support/resistance trendlines по recent highs/lows и исследует rejection behavior вокруг линий, а не основной breakout path.

## Логика входа

1. Строит high/low trendline candidates из candle pivots.
2. Ждет valid reverse setup по включенной стороне (`HIGHS` или `LOWS`).
3. Применяет volatility и timing filters.
4. Выбирает side config по направлению candidate.
5. Ставит stop от `REVERSE_TRENDLINE_STOP_BASE_PCT`.
6. Считает target от `REVERSE_TRENDLINE_TARGET_R_MULT`.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
8. Возвращает `entry` с reverse-trendline figures и signal seed indicators.

Entry code:

- `REVERSE_TRENDLINE_SIGNAL`

## Выходы

Если позиция уже открыта:

- `REVERSE_TRENDLINE_FAILED_BOUNCE_EXIT`, когда expected bounce/rejection не подтверждается.
- иначе `POSITION_EXISTS`.

## Параметры

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

## Payload сигнала

Стратегия сохраняет:

- reverse-trendline figures из `buildReverseTrendLineFigures(...)`
- signal seed indicators из `buildReverseTrendlineSignalSeed(...)`
- `orderPlan.qty`
- `orderPlan.stopLossPrice`
- один take-profit по рассчитанному target

## Частые skip reasons

- `NO_TRENDLINE`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `VERY_VOLATILITY`
- `REVERSE_TRENDLINE_TIMING:<code>`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Trendline-стратегии чувствительны к выбору pivots, gaps в свечах и масштабу графика. Проверяйте generated figures перед интерпретацией метрик, особенно при изменении `TRENDLINE.epsilon` или timeframe.

Related:

- [TrendLine](./trendline)
- [Backtesting caveats](../../limitations/backtesting-caveats)
