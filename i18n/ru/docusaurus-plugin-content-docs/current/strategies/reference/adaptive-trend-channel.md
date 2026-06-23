---
title: 'AdaptiveTrendChannel'
---

`AdaptiveTrendChannel` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она прогоняет свечи через adaptive channel engine, ищет bullish/bearish channel flips и рассчитывает вход от расстояния до границы канала, которая используется как stop.

## Логика входа

1. Создает runtime state через `createAdaptiveTrendChannelEngine({ initialCandles, config })`.
2. На каждой свече читает `runtimeState.signal` и `runtimeState.snapshot`.
3. Ждет channel flip signal.
4. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
5. Применяет context filters через `getAdaptiveTrendChannelFilterSkipCode(...)`.
6. Использует границу канала как stop-loss:
   - long stop: `signal.floor`
   - short stop: `signal.roof`
7. Считает target от `ADAPTIVE_TREND_CHANNEL_TARGET_R_MULT`.
8. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
9. Возвращает `entry` с channel figures и `adaptiveTrendChannelContext`.

Entry codes:

- `ADAPTIVE_TREND_CHANNEL_BULLISH_FLIP`
- `ADAPTIVE_TREND_CHANNEL_BEARISH_FLIP`

## Выходы

Если позиция уже открыта:

- `ADAPTIVE_TREND_CHANNEL_BREAK_EXIT`, когда `ADAPTIVE_TREND_CHANNEL_EXIT_ON_CHANNEL_BREAK=true` и цена пробивает активную границу канала.
- `ADAPTIVE_TREND_CHANNEL_OPPOSITE_FLIP_EXIT`, когда `ADAPTIVE_TREND_CHANNEL_EXIT_ON_OPPOSITE_FLIP=true` и engine дает opposite flip.
- иначе `POSITION_EXISTS`.

## Параметры

Runtime:

- `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`
- `BACKTEST_PRICE_MODE`
- `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`
- `ML_ENABLED`, `ML_THRESHOLD`

Risk и индикаторы:

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

## Payload сигнала

Стратегия сохраняет:

- `additionalIndicators.adaptiveTrendChannelContext`
- channel figures из `buildAdaptiveTrendChannelFigures(...)`
- `orderPlan.qty`
- `orderPlan.stopLossPrice`
- один take-profit по рассчитанному target

## Частые skip reasons

- `NO_ADAPTIVE_TREND_CHANNEL_FLIP`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- filter-specific code из `getAdaptiveTrendChannelFilterSkipCode(...)`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Сначала смотрите generated channel figures, затем сравнивайте метрики. Стратегия зависит от structural channel state, поэтому gaps в данных и длина warmup могут менять ранние сигналы.
