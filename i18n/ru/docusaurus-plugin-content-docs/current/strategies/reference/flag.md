---
title: 'Flag'
---

`Flag` — стратегия продолжения тренда из `@tradejs/strategy-flag`. Она ищет
сильный направленный импульс, компактный канал против тренда и пробой в сторону
исходного движения.

## Визуальная схема

![Логика Flag](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Flag/main/docs/strategy-logic.svg)

![Примеры бычьего и медвежьего флага](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Flag/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными. Точные
пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Находит достаточно крупный и направленный импульс.
2. Строит параллельные границы последующей консолидации.
3. Проверяет длительность, ширину, откат, касания, наклон и нарушения границ.
4. Ждёт вход по `breakout`, `close_acceptance` или `retest`.
5. Ставит стоп за противоположной границей и рассчитывает цель от длины импульса.

## Выходы

Позиция закрывается по рассчитанному стопу или цели. Если включён
`FLAG_EXIT_ON_OPPOSITE_PATTERN`, подтверждённый противоположный флаг тоже
закрывает позицию.

## Ключи конфигурации

Ключи сгруппированы по части стратегии, которой они управляют. Значение `0`
или `false` отключает соответствующий необязательный фильтр, если не указано иное.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Задают режим работы, интервал свечей, поведение ордеров и цену исполнения в бэктесте. |
| AI и ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Управляют необязательными решениями AI и ML и их порогами допуска. |
| Риск | `FEE_PERCENT`, `MAX_LOSS_VALUE`, `FLAG_TARGET_POLE_RATIO`, `FLAG_STOP_BUFFER_ATR`, `FLAG_EXIT_ON_OPPOSITE_PATTERN` | Учитывают комиссию, задают размер позиции, проекцию цели, запас стопа и выход по противоположной модели. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `FLAG_ATR_PERIOD` | Задают периоды рыночного контекста, фильтров сигнала и нормализации модели. |
| Размер импульса | `FLAG_POLE_LOOKBACK_BARS`, `FLAG_MIN_POLE_MOVE_PCT`, `FLAG_MIN_POLE_MOVE_ATR`, `FLAG_MIN_POLE_EFFICIENCY_RATIO` | Задают окно поиска и минимальные размер и направленность импульса. |
| Качество импульса | `FLAG_MIN_POLE_DIRECTIONAL_CONSISTENCY_RATIO`, `FLAG_MIN_POLE_DIRECTIONAL_CONSISTENCY_RATIO_LONG`, `FLAG_MIN_POLE_DIRECTIONAL_CONSISTENCY_RATIO_SHORT`, `FLAG_MAX_POLE_TERMINAL_EXPANSION_RATIO`, `FLAG_MAX_POLE_TERMINAL_EXPANSION_RATIO_LONG`, `FLAG_MAX_POLE_TERMINAL_EXPANSION_RATIO_SHORT`, `FLAG_POLE_TERMINAL_BARS` | Ограничивают шум и чрезмерное расширение в конце импульса, общее или по направлениям. |
| Длительность канала | `FLAG_MIN_BARS`, `FLAG_MAX_BARS`, `FLAG_MAX_FLAG_TO_POLE_BARS_RATIO`, `FLAG_MAX_FLAG_TO_POLE_BARS_RATIO_LONG`, `FLAG_MAX_FLAG_TO_POLE_BARS_RATIO_SHORT` | Задают абсолютную и относительную длительность консолидации. |
| Геометрия канала | `FLAG_PIVOT_RADIUS`, `FLAG_MIN_TOUCHES_PER_BOUNDARY`, `FLAG_MIN_COUNTER_TREND_SLOPE_PCT_PER_BAR`, `FLAG_MAX_SLOPE_DIVERGENCE_RATIO` | Задают поиск экстремумов, число касаний, наклон против тренда и параллельность границ. |
| Размер и объём канала | `FLAG_MAX_CHANNEL_WIDTH_PCT`, `FLAG_MAX_CHANNEL_WIDTH_ATR`, `FLAG_MAX_CHANNEL_WIDTH_ATR_LONG`, `FLAG_MAX_CHANNEL_WIDTH_ATR_SHORT`, `FLAG_MAX_CHANNEL_TO_POLE_RATIO`, `FLAG_MAX_FLAG_TO_POLE_VOLUME_RATIO`, `FLAG_MAX_RETRACEMENT_RATIO`, `FLAG_MAX_BOUNDARY_VIOLATION_ATR` | Ограничивают ширину, объём, глубину отката и временные нарушения границ. |
| Момент входа | `FLAG_BREAKOUT_BUFFER_ATR`, `FLAG_MAX_BREAKOUT_DISTANCE_ATR`, `FLAG_ENTRY_MODE`, `FLAG_CONFIRMATION_MAX_BARS`, `FLAG_RETEST_MAX_BARS`, `FLAG_RETEST_TOLERANCE_ATR` | Задают допустимый пробой и окно закрепления или повторного теста. |
| Направления | `LONG.*`, `SHORT.*` | Включают направления и задают тип ордера и минимальное отношение доходности к риску. |

## Содержимое сигнала

Сигнал содержит геометрию импульса и канала, границы, состояние пробоя,
рассчитанные стоп и цель и элементы графика модели.

## Запуск

```bash
npx @tradejs/cli backtest --user root --config Flag:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
