---
title: 'AdaptiveTrendChannel'
---

`AdaptiveTrendChannel` ищет смену направления адаптивного ценового канала.
Размер позиции рассчитывается по расстоянию до границы канала, которая служит
структурным стопом.

## Визуальная схема

![Логика AdaptiveTrendChannel](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-AdaptiveTrendChannel/main/docs/strategy-logic.svg)

![Пример сигнала AdaptiveTrendChannel](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-AdaptiveTrendChannel/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Создает runtime state через `createAdaptiveTrendChannelEngine({ initialCandles, config })`.
2. На каждой свече читает `runtimeState.signal` и `runtimeState.snapshot`.
3. Ждёт, пока channel flip пройдёт настроенное подтверждение по свечам;
   optional price acceptance дополнительно требует закрытие за недавним
   максимумом или минимумом.
4. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
5. Применяет context filters через `getAdaptiveTrendChannelFilterSkipCode(...)`.
6. Использует границу канала как stop-loss:
   - long stop: `signal.floor`
   - short stop: `signal.roof`
7. Считает target от `ADAPTIVE_TREND_CHANNEL_TARGET_R_MULT`.
8. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учётом оценок `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS` и `RISK_MARKET_IMPACT_BPS`.
9. Возвращает `entry` с channel figures и `adaptiveTrendChannelContext`.

Entry codes:

- `ADAPTIVE_TREND_CHANNEL_BULLISH_FLIP`
- `ADAPTIVE_TREND_CHANNEL_BEARISH_FLIP`

## Выходы

Если позиция уже открыта:

- `ADAPTIVE_TREND_CHANNEL_BREAK_EXIT`, когда `ADAPTIVE_TREND_CHANNEL_EXIT_ON_CHANNEL_BREAK=true` и цена пробивает активную границу канала.
- `ADAPTIVE_TREND_CHANNEL_OPPOSITE_FLIP_EXIT`, когда `ADAPTIVE_TREND_CHANNEL_EXIT_ON_OPPOSITE_FLIP=true` и engine дает opposite flip.
- иначе `POSITION_EXISTS`.

`ADAPTIVE_TREND_CHANNEL_EXIT_CONFIRMATION_BARS` задерживает оба типа выхода,
пока условие не сохранится заданное число свечей. Directional overrides
`_LONG` и `_SHORT` имеют приоритет.
`ADAPTIVE_TREND_CHANNEL_REENTRY_COOLDOWN_MS` задаёт паузу перед новым входом
после сделки.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML, индикаторов и
размера позиции работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста. |
| Построение канала | `ADAPTIVE_TREND_CHANNEL_REGRESSION_BARS`, `ADAPTIVE_TREND_CHANNEL_ENVELOPE_BARS`, `ADAPTIVE_TREND_CHANNEL_ATR_STRETCH`, `ADAPTIVE_TREND_CHANNEL_VOLATILITY_LOOKBACK`, `ADAPTIVE_TREND_CHANNEL_MIN_CHANNEL_WIDTH_PCT`, `ADAPTIVE_TREND_CHANNEL_MAX_CHANNEL_WIDTH_PCT` | Задают окно регрессии, оболочку, поправку на волатильность и допустимую ширину канала. |
| Качество пробоя | `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_PCT`, `ADAPTIVE_TREND_CHANNEL_MAX_BREAKOUT_DISTANCE_PCT`, `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_ATR`, `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_ATR_LONG`, `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_ATR_SHORT`, `ADAPTIVE_TREND_CHANNEL_MAX_BREAKOUT_DISTANCE_ATR`, `ADAPTIVE_TREND_CHANNEL_MIN_VOLUME_REL20` | Ограничивают расстояние пробоя и относительный объём с минимальными значениями по направлениям. |
| Контекст и подтверждение | `ADAPTIVE_TREND_CHANNEL_REQUIRE_CONTEXT_ALIGNMENT`, `ADAPTIVE_TREND_CHANNEL_MIN_CONTEXT_ALIGNMENTS`, `ADAPTIVE_TREND_CHANNEL_FLIP_CONFIRMATION_BARS`, `ADAPTIVE_TREND_CHANNEL_REQUIRE_PRICE_ACCEPTANCE` | Требуют согласия рыночного контекста и управляют подтверждением разворота и закрепления цены. |
| Цель и жизненный цикл | `ADAPTIVE_TREND_CHANNEL_TARGET_R_MULT`, `ADAPTIVE_TREND_CHANNEL_EXIT_ON_OPPOSITE_FLIP`, `ADAPTIVE_TREND_CHANNEL_EXIT_ON_CHANNEL_BREAK`, `ADAPTIVE_TREND_CHANNEL_EXIT_CONFIRMATION_BARS`, `ADAPTIVE_TREND_CHANNEL_REENTRY_COOLDOWN_MS` | Задают цель, условия и подтверждение выхода и паузу перед повторным входом. Для подтверждения выхода допустимы переопределения по направлениям. |
| Графика и направления | `ADAPTIVE_TREND_CHANNEL_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Ограничивают объём графики, задают лимит убытка и настройки направлений. |

Runtime:

- `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`
- `BACKTEST_PRICE_MODE`
- `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`
- `ML_ENABLED`, `ML_THRESHOLD`

Risk и индикаторы:

- `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`
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
- `ADAPTIVE_TREND_CHANNEL_MIN_BREAKOUT_DISTANCE_ATR` с overrides `_LONG` и `_SHORT`
- `ADAPTIVE_TREND_CHANNEL_MAX_BREAKOUT_DISTANCE_ATR`
- `ADAPTIVE_TREND_CHANNEL_MIN_CHANNEL_WIDTH_PCT`
- `ADAPTIVE_TREND_CHANNEL_MAX_CHANNEL_WIDTH_PCT`
- `ADAPTIVE_TREND_CHANNEL_MIN_VOLUME_REL20`
- `ADAPTIVE_TREND_CHANNEL_REQUIRE_CONTEXT_ALIGNMENT`
- `ADAPTIVE_TREND_CHANNEL_MIN_CONTEXT_ALIGNMENTS`
- `ADAPTIVE_TREND_CHANNEL_FLIP_CONFIRMATION_BARS`
- `ADAPTIVE_TREND_CHANNEL_REQUIRE_PRICE_ACCEPTANCE`
- `ADAPTIVE_TREND_CHANNEL_EXIT_ON_OPPOSITE_FLIP`
- `ADAPTIVE_TREND_CHANNEL_EXIT_ON_CHANNEL_BREAK`
- `ADAPTIVE_TREND_CHANNEL_EXIT_CONFIRMATION_BARS` с overrides `_LONG` и `_SHORT`
- `ADAPTIVE_TREND_CHANNEL_REENTRY_COOLDOWN_MS`
- `ADAPTIVE_TREND_CHANNEL_MAX_FIGURE_POINTS`

Side configs:

- `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`
- `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio`

## Содержимое сигнала

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
