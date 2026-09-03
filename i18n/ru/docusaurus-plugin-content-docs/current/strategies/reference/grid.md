---
title: 'Grid'
---

`Grid` набирает направленную позицию после восстановления от отката в тренде EMA
или подтверждённого повторного теста пробоя. Добавления остаются в пределах
единого лимита риска всей позиции.

## Визуальная схема

![Логика Grid](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Grid/main/docs/strategy-logic.svg)

![Пример сигнала Grid](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Grid/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Определяет направление/силу тренда по fast/slow EMA и ATR geometry.
2. Ждет `pullback_recovery` или `breakout_retest` из `GRID_ENTRY_MODE`.
3. Проверяет volatility, candle size, optional range geometry и cooldown.
4. Создает initial order plan и optional scale-in levels.
5. Пересчитывает basket protection; выходит по hard stop, regime flip или volatility shock.

Entry codes: `GRID_DIRECTIONAL_PULLBACK_ENTRY`, `GRID_BREAKOUT_RETEST_ENTRY`;
добавления — `GRID_SCALE_IN_<level>`.

Ключевые группы: `GRID_FAST_EMA`/`GRID_SLOW_EMA`, trend-strength limits,
`GRID_ENTRY_MODE`, `GRID_BREAKOUT_*`, `GRID_STEP_ATR_MULT`,
`GRID_MAX_LEVELS`, `GRID_STOP_ATR_MULT`, lifecycle exits и optional
`GRID_RANGE_*`. Перед live проверьте поддержку position increase коннектором.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML и размера позиции
работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Комиссия | `FEE_PERCENT` | Учитывает заданную торговую комиссию при расчёте позиции и отношения доходности к риску. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста и фильтров сигнала. |
| Модель тренда | `GRID_FAST_EMA`, `GRID_SLOW_EMA`, `GRID_ATR_PERIOD`, `GRID_TREND_SLOPE_BARS`, `GRID_MIN_TREND_STRENGTH_ATR`, `GRID_MAX_TREND_STRENGTH_ATR`, `GRID_MIN_SLOW_SLOPE_ATR` | Задают EMA тренда, окно наклона и допустимую силу тренда. |
| Волатильность и откат | `GRID_MIN_ATR_PCT`, `GRID_MAX_ATR_PCT`, `GRID_MAX_PULLBACK_BEYOND_SLOW_ATR`, `GRID_MAX_CANDLE_RANGE_ATR` | Отсекают недопустимую волатильность, глубину отката и размер свечи. |
| Вход по пробою | `GRID_ENTRY_MODE`, `GRID_BREAKOUT_LOOKBACK_BARS`, `GRID_BREAKOUT_MIN_DISTANCE_ATR`, `GRID_BREAKOUT_ACCEPTANCE_BARS`, `GRID_BREAKOUT_RETEST_MAX_BARS`, `GRID_BREAKOUT_RETEST_TOLERANCE_ATR`, `GRID_BREAKOUT_RETEST_MAX_CLOSE_DISTANCE_ATR` | Выбирают модель входа и задают пределы пробоя, закрепления и повторного теста. |
| Риск продолжения | `GRID_CONTINUATION_ALLOW_SCALE_IN`, `GRID_CONTINUATION_RISK_MODE`, `GRID_CONTINUATION_STOP_BUFFER_ATR`, `GRID_CONTINUATION_MIN_STOP_DISTANCE_ATR`, `GRID_CONTINUATION_TARGET_R` | Управляют добавлениями и геометрией стопа и цели для продолжения пробоя. |
| Построение сетки | `GRID_STEP_ATR_MULT`, `GRID_MIN_STEP_PCT`, `GRID_MAX_LEVELS`, `GRID_STOP_ATR_MULT`, `GRID_TAKE_PROFIT_STEP_MULT`, `GRID_TAKE_PROFIT_STEP_MULT_LONG`, `GRID_TAKE_PROFIT_STEP_MULT_SHORT`, `GRID_MIN_NET_RISK_RATIO` | Задают шаг сетки, число уровней, стоп всей позиции, цели по направлениям и минимальное чистое отношение доходности к риску. |
| Жизненный цикл | `GRID_EXIT_ON_REGIME_FLIP`, `GRID_EXIT_ON_VOLATILITY_SHOCK`, `GRID_ENTRY_COOLDOWN_BARS`, `GRID_PROTECTION_REPRICE_ATR` | Включают выход при смене режима или скачке волатильности, паузу между входами и пересчёт защиты. |
| Фильтр диапазона | `GRID_RANGE_FILTER_MODE`, `GRID_RANGE_PIVOT_LEFT_BARS`, `GRID_RANGE_PIVOT_RIGHT_BARS`, `GRID_RANGE_LOOKBACK_BARS`, `GRID_RANGE_MIN_PIVOTS_PER_SIDE`, `GRID_RANGE_MIN_WIDTH_ATR`, `GRID_RANGE_MAX_WIDTH_ATR`, `GRID_RANGE_MAX_CENTER_SLOPE_ATR_PER_BAR`, `GRID_RANGE_MAX_BOUNDARY_DIVERGENCE_ATR`, `GRID_RANGE_MIN_CONTAINMENT_RATIO`, `GRID_RANGE_CONTAINMENT_TOLERANCE_ATR`, `GRID_RANGE_EDGE_FRACTION` | Настраивают необязательный поиск горизонтального диапазона, удержание цены и правила его краёв. |
| Графика и направления | `GRID_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Ограничивают объём графики, задают лимит убытка и настройки направлений. |
