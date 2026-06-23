---
title: 'TrendShift'
---

`TrendShift` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она исследует trend transition setups через bullish/bearish flips в dynamic trend band.

## Логика входа

1. Прогоняет свечи через `createTrendShiftEngine(...)`.
2. Читает `runtimeState.signal` и `runtimeState.snapshot`.
3. Ждет bullish или bearish flip.
4. Применяет volatility и strategy guardrails.
5. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
6. Ставит stop за текущей band с ATR и percent buffers.
7. Считает target от `TRENDSHIFT_TARGET_R_MULT`.
8. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
9. Возвращает `entry` с trend-shift figures и `trendShiftContext`.

Entry codes:

- `TRENDSHIFT_BULLISH_FLIP`
- `TRENDSHIFT_BEARISH_FLIP`

## Выходы

Если позиция уже открыта:

- `TRENDSHIFT_OPPOSITE_FLIP_EXIT`, когда `TRENDSHIFT_EXIT_ON_OPPOSITE_FLIP=true` и engine дает opposite flip.
- иначе `POSITION_EXISTS`.

## Параметры

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

## Payload сигнала

Стратегия сохраняет:

- `additionalIndicators.trendShiftContext`
- band, flip, stop и target figures из `buildTrendShiftFigures(...)`
- `orderPlan.stopLossPrice`
- один take-profit по рассчитанному target

## Частые skip reasons

- `WAIT_DATA`
- `NO_SIGNAL`
- `POSITION_EXISTS`
- `VERY_VOLATILITY`
- guardrail skip code из `getTrendShiftGuardrailSkipCode(...)`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Повторно валидируйте стратегию после изменений market context, timeframe или risk settings. Trend-transition systems легко overfit: небольшие изменения band и confirmation settings могут переносить flips между свечами.

Related:

- [Compare strategies](../../guides/compare-strategies)
- [Backtesting caveats](../../limitations/backtesting-caveats)
