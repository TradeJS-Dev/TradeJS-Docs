---
title: 'Dragon'
---

`Dragon` представляет собой разворотную стратегию из пакета
`@tradejs/strategy-dragon`. Она
строит модель по четырём экстремумам и подтверждает её на проекции линии от
головы к горбу.

## Визуальная схема

![Логика стратегии Dragon](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Dragon/main/docs/strategy-logic.svg)

![Бычий сигнал Dragon на схематичном графике](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Dragon/main/docs/signal-example.svg)

Иллюстрации показывают логику и не являются рыночными данными. Точные пороги
геометрии, подтверждения и риска задаёт активная конфигурация стратегии.

## Логика решения

1. Подтверждает четыре чередующихся экстремума теней свечей с помощью
   `DRAGON_PIVOT_LENGTH`.
2. Ищет бычью последовательность из максимума, минимума, более низкого
   максимума и более высокого минимума либо её медвежье отражение.
3. Проверяет откат горба, смещение задней ноги, размер и возраст модели, длину
   участков и наклон проекции трендовой линии.
4. Требует закрытие за трендовой линией и применяет выбранный
   `DRAGON_ENTRY_MODE`: немедленный пробой, подтверждение следующим закрытием
   или повторный тест.
5. Строит цель и стоп от высоты модели, затем отклоняет неверный стоп,
   пройденную цель или недостаточное соотношение прибыли к риску.
6. Рассчитывает размер заявки по `MAX_LOSS_VALUE` и убытку на единицу позиции.

Коды входа начинаются с `DRAGON_BULLISH_` или `DRAGON_BEARISH_` и содержат этап
входа. При `DRAGON_EXIT_ON_OPPOSITE_PATTERN=true` подтверждённая встречная
модель может закрыть позицию с кодом `DRAGON_OPPOSITE_PATTERN_EXIT`.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML, индикаторов и
размера позиции работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Комиссия | `FEE_PERCENT` | Учитывает заданную торговую комиссию при расчёте позиции и отношения доходности к риску. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста. |
| Форма экстремумов | `DRAGON_PIVOT_LENGTH`, `DRAGON_MIN_REAR_FOOT_OFFSET_PCT`, `DRAGON_MAX_REAR_FOOT_OFFSET_PCT`, `DRAGON_MIN_HUMP_RETRACEMENT_PCT`, `DRAGON_MAX_HUMP_RETRACEMENT_PCT` | Задают подтверждение экстремумов и допустимую геометрию задней лапы и горба. |
| Размер и возраст | `DRAGON_MIN_PATTERN_HEIGHT_PCT`, `DRAGON_MIN_PATTERN_HEIGHT_ATR`, `DRAGON_ATR_PERIOD`, `DRAGON_MIN_LEG_BARS`, `DRAGON_MAX_PATTERN_AGE_BARS`, `DRAGON_MAX_BREAKOUT_AFTER_REAR_FOOT_BARS` | Задают минимальный размер модели и отсекают короткие ноги, старые модели и поздние пробои. |
| Качество пробоя | `DRAGON_MIN_TRENDLINE_SLOPE_PCT_PER_BAR`, `DRAGON_MIN_BREAKOUT_DISTANCE_ATR`, `DRAGON_MAX_BREAKOUT_DISTANCE_HEIGHT_RATIO` | Ограничивают наклон линии и минимальное и максимальное расстояние пробоя. |
| Момент входа | `DRAGON_ENTRY_MODE`, `DRAGON_CONFIRMATION_MAX_BARS`, `DRAGON_RETEST_MAX_BARS`, `DRAGON_RETEST_TOLERANCE_ATR` | Выбирают вход по пробою, закреплению или повторному тесту и ограничивают окно подтверждения. |
| Цель, стоп и выход | `DRAGON_TARGET_FIB_PCT`, `DRAGON_STOP_FIB_PCT`, `DRAGON_EXIT_ON_OPPOSITE_PATTERN` | Задают цель и стоп от высоты модели и выход по противоположной модели. |
| Риск и направления | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Задают лимит убытка и включают направления с минимальным отношением доходности к риску. |

- экстремумы и форма: `DRAGON_PIVOT_LENGTH`,
  `DRAGON_MIN_REAR_FOOT_OFFSET_PCT`, `DRAGON_MAX_REAR_FOOT_OFFSET_PCT`,
  `DRAGON_MIN_HUMP_RETRACEMENT_PCT`, `DRAGON_MAX_HUMP_RETRACEMENT_PCT`
- размер и возраст: `DRAGON_MIN_PATTERN_HEIGHT_PCT`,
  `DRAGON_MIN_PATTERN_HEIGHT_ATR`, `DRAGON_MIN_LEG_BARS`,
  `DRAGON_MAX_PATTERN_AGE_BARS`, `DRAGON_MAX_BREAKOUT_AFTER_REAR_FOOT_BARS`
- пробой и подтверждение: `DRAGON_MIN_TRENDLINE_SLOPE_PCT_PER_BAR`,
  `DRAGON_MIN_BREAKOUT_DISTANCE_ATR`,
  `DRAGON_MAX_BREAKOUT_DISTANCE_HEIGHT_RATIO`, `DRAGON_ENTRY_MODE`,
  `DRAGON_CONFIRMATION_MAX_BARS`, `DRAGON_RETEST_MAX_BARS`,
  `DRAGON_RETEST_TOLERANCE_ATR`
- цель и стоп: `DRAGON_TARGET_FIB_PCT`, `DRAGON_STOP_FIB_PCT`
- направление и риск: `LONG.*`, `SHORT.*`, `FEE_PERCENT`, `MAX_LOSS_VALUE`
- необязательные фильтры решения: `AI_ENABLED`, `AI_MODE`,
  `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`

## Содержимое сигнала

Вход содержит `additionalIndicators.dragonContext`, графические элементы
модели и заявки, а также один take profit. Контекст хранит четыре экстремума,
трендовую линию, этап входа, размеры модели, цель, стоп и расчёт экономики
сделки.

## Частые причины пропуска

- `NO_PATTERN`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `TARGET_ALREADY_PASSED`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Проверяйте оба направления отдельно и просматривайте графические элементы
модели. Небольшие изменения подтверждения экстремумов, возраста модели или
дистанции пробоя могут менять время сигнала и количество сделок. Каждый режим
входа нужно проверять на данных, которые не использовались для выбора его
параметров.
