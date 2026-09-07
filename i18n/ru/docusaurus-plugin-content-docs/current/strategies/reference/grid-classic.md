---
title: 'GridClassic'
---

`GridClassic` строит сетку по обнаруженному горизонтальному диапазону. В режиме
`mean_reversion` стратегия входит после подтверждения края диапазона, а в
`breakout_continuation` — после закрепления за границей и необязательного
повторного теста. Отдельно можно включить разворот ложного пробоя.

## Визуальная схема

![Логика GridClassic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-GridClassic/main/docs/strategy-logic.svg)

![Пример сигнала GridClassic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-GridClassic/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Находит range по pivots, containment, width, age, slope и boundary divergence.
2. Подтверждает edge rejection/close-inside или breakout continuation.
3. Строит несколько уровней, единый stop и center/opposite-edge target.
4. Добавляет позицию только в пределах basket risk budget.
5. Управляет breakeven, protection, range invalidation, max hold, volatility shock и target exits.

Ключевые настройки: `GRIDCLASSIC_MODE`,
`GRIDCLASSIC_FAILED_BREAKOUT_REVERSAL_ENABLED`, `GRIDCLASSIC_PIVOT_*`,
range quality limits, `GRIDCLASSIC_ENTRY_CONFIRMATION`,
`GRIDCLASSIC_LEVELS`, `GRIDCLASSIC_GRID_STEP_ATR`,
`GRIDCLASSIC_TP_MODE` и lifecycle limits.

Перед live сравните continuous execution с replay через
[runtime parity](../../runtime/backtesting/runtime-parity).

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML и размера позиции
работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Оценка издержек | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Задаёт оценки комиссии, проскальзывания и влияния на рынок для расчёта позиции и отношения доходности к риску. Издержки исполнения бэктеста настраиваются отдельно. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста и фильтров сигнала. |
| Режим и продолжение | `GRIDCLASSIC_MODE`, `GRIDCLASSIC_CONTINUATION_ACCEPTANCE_BARS`, `GRIDCLASSIC_CONTINUATION_RETEST_MAX_BARS`, `GRIDCLASSIC_CONTINUATION_RETEST_TOLERANCE_ATR`, `GRIDCLASSIC_CONTINUATION_REQUIRE_DIRECTIONAL_RETEST`, `GRIDCLASSIC_CONTINUATION_MAX_ENTRY_DISTANCE_ATR`, `GRIDCLASSIC_CONTINUATION_TARGET_RANGE_MULT`, `GRIDCLASSIC_CONTINUATION_STOP_INSIDE_RANGE_FRACTION`, `GRIDCLASSIC_FAILED_BREAKOUT_REVERSAL_ENABLED` | Выбирают возврат к среднему или продолжение пробоя и задают правила закрепления, повторного теста, цели, стопа и ложного пробоя. |
| Геометрия диапазона | `GRIDCLASSIC_ATR_PERIOD`, `GRIDCLASSIC_PIVOT_LEFT_BARS`, `GRIDCLASSIC_PIVOT_RIGHT_BARS`, `GRIDCLASSIC_LOOKBACK_BARS`, `GRIDCLASSIC_MIN_PIVOTS_PER_SIDE`, `GRIDCLASSIC_MIN_WIDTH_ATR`, `GRIDCLASSIC_MAX_WIDTH_ATR`, `GRIDCLASSIC_MAX_CENTER_SLOPE_ATR_PER_BAR`, `GRIDCLASSIC_MAX_BOUNDARY_DIVERGENCE_ATR`, `GRIDCLASSIC_MIN_CONTAINMENT_RATIO`, `GRIDCLASSIC_CONTAINMENT_TOLERANCE_ATR`, `GRIDCLASSIC_BREAKOUT_TOLERANCE_ATR`, `GRIDCLASSIC_MIN_RANGE_AGE_BARS` | Задают экстремумы, ширину, возраст, наклон, расхождение границ, долю свечей внутри диапазона и допуск пробоя. |
| Качество входа | `GRIDCLASSIC_MAX_VOLATILITY_EXPANSION`, `GRIDCLASSIC_MAX_CANDLE_RANGE_ATR`, `GRIDCLASSIC_EDGE_ZONE_FRACTION`, `GRIDCLASSIC_ENTRY_CONFIRMATION`, `GRIDCLASSIC_MIN_REJECTION_WICK_RATIO`, `GRIDCLASSIC_ENTRY_CONFIRMATION_BARS`, `GRIDCLASSIC_MAX_PIVOT_AGE_BARS`, `GRIDCLASSIC_MIN_ALTERNATING_PIVOTS`, `GRIDCLASSIC_RECENT_CONTAINMENT_BARS`, `GRIDCLASSIC_MIN_RECENT_CONTAINMENT_RATIO`, `GRIDCLASSIC_MIN_TARGET_DISTANCE_BPS`, `GRIDCLASSIC_MIN_NET_RISK_RATIO` | Отсекают слабые, старые, слишком растянутые или плохо удерживаемые входы в диапазоне. |
| Построение сетки | `GRIDCLASSIC_LEVELS`, `GRIDCLASSIC_REQUIRE_REJECTION_FOR_ADD`, `GRIDCLASSIC_GRID_STEP_ATR`, `GRIDCLASSIC_GRID_STEP_RANGE_FRACTION`, `GRIDCLASSIC_LEVEL_SIZE_DECAY`, `GRIDCLASSIC_STOP_ATR_BUFFER`, `GRIDCLASSIC_TP_MODE` | Задают число уровней, правила добавления, шаг, уменьшение размера, запас стопа и режим цели. |
| Жизненный цикл позиции | `GRIDCLASSIC_BREAKOUT_CONFIRM_BARS`, `GRIDCLASSIC_FAILED_REJECTION_EXIT_BARS`, `GRIDCLASSIC_FAILED_REJECTION_TOLERANCE_ATR`, `GRIDCLASSIC_BREAKEVEN_TRIGGER_FRACTION`, `GRIDCLASSIC_BREAKEVEN_OFFSET_BPS`, `GRIDCLASSIC_INVALIDATION_BARS`, `GRIDCLASSIC_MAX_HOLD_BARS`, `GRIDCLASSIC_COOLDOWN_BARS`, `GRIDCLASSIC_RISK_SLIPPAGE_BPS`, `GRIDCLASSIC_PROTECTION_REPRICE_ATR` | Управляют выходами, безубытком, отменой модели, временем удержания, паузой, допуском проскальзывания и пересчётом защиты. |
| Графика и направления | `GRIDCLASSIC_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Ограничивают объём графики, задают лимит убытка и настройки направлений. |
