---
title: 'HeadAndShoulders'
---

`HeadAndShoulders` ищет обычную и перевёрнутую модель «голова и плечи» по
экстремумам закрытых свечей. Расчёт включает плечи, выраженность головы, линию
шеи, пробой, стоп и измеряемую цель.

## Визуальная схема

![Логика HeadAndShoulders](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HeadAndShoulders/main/docs/strategy-logic.svg)

![Пример сигнала HeadAndShoulders](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HeadAndShoulders/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Проверяет pattern symmetry, neckline slope, age и prior move.
2. Входит по `breakout`, `close_acceptance` или `retest`.
3. Применяет distance, confirmation candle, volume и side-specific filters.
4. Отбрасывает invalid stop, passed target и недостаточный `minRiskRatio`.
5. Считает size от `MAX_LOSS_VALUE`.

Основные настройки: `HEADSHOULDERS_PIVOT_LOOKBACK`,
`HEADSHOULDERS_SHOULDER_TOLERANCE_PCT`,
`HEADSHOULDERS_MIN_HEAD_PROMINENCE_RATIO`, pattern-bar/neckline limits,
`HEADSHOULDERS_ENTRY_MODE`, `HEADSHOULDERS_TARGET_HEIGHT_PCT*` и
`HEADSHOULDERS_STOP_BUFFER_HEIGHT_PCT`.

При deterministic `AI_MODE: "gate"` SHORT setups проверяются по контексту
candle wick и ширины alt-basket, а LONG setups — по расстоянию до
point-of-control и наклону adaptive channel. Отсутствующие обязательные gate
features дают отказ.

В текущем default включен short и выключен long; inverse-pattern longs нужно
включать явно после отдельной проверки.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML, индикаторов и
размера позиции работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Комиссия | `FEE_PERCENT` | Учитывает заданную торговую комиссию при расчёте позиции и отношения доходности к риску. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста и фильтров сигнала. |
| Геометрия модели | `HEADSHOULDERS_PIVOT_LOOKBACK`, `HEADSHOULDERS_SHOULDER_TOLERANCE_PCT`, `HEADSHOULDERS_MIN_HEAD_PROMINENCE_RATIO`, `HEADSHOULDERS_MIN_HEAD_HEIGHT_PCT`, `HEADSHOULDERS_MIN_HEAD_HEIGHT_ATR`, `HEADSHOULDERS_ATR_PERIOD` | Задают экстремумы, баланс плеч, выраженность и минимальный размер головы и шкалу ATR. |
| Допустимость модели | `HEADSHOULDERS_MIN_PATTERN_BARS`, `HEADSHOULDERS_MAX_PATTERN_BARS`, `HEADSHOULDERS_MIN_PATTERN_SYMMETRY_RATIO`, `HEADSHOULDERS_MAX_NECKLINE_SLOPE_RATIO`, `HEADSHOULDERS_MAX_PATTERN_AGE_BARS`, `HEADSHOULDERS_PRIOR_TREND_LOOKBACK`, `HEADSHOULDERS_MAX_PRIOR_MOVE_ATR` | Ограничивают длительность, симметрию, наклон линии шеи, возраст и предшествующее движение. |
| Качество пробоя | `HEADSHOULDERS_MIN_BREAKOUT_DISTANCE_ATR`, `HEADSHOULDERS_MAX_BREAKOUT_DISTANCE_HEIGHT_RATIO`, `HEADSHOULDERS_MAX_BREAKOUT_DISTANCE_PCT`, `HEADSHOULDERS_MAX_BREAKOUT_DELAY_BARS`, `HEADSHOULDERS_REQUIRE_BREAKOUT_CROSS` | Требуют своевременный свежий пробой линии шеи в допустимом диапазоне. |
| Момент и качество входа | `HEADSHOULDERS_ENTRY_MODE`, `HEADSHOULDERS_CONFIRMATION_MAX_BARS`, `HEADSHOULDERS_MIN_CONFIRMATION_BODY_ATR`, `HEADSHOULDERS_MAX_CONFIRMATION_CLOSE_LOCATION`, `HEADSHOULDERS_CONFIRMATION_VOLUME_PERIOD`, `HEADSHOULDERS_MIN_CONFIRMATION_VOLUME_REL`, `HEADSHOULDERS_RETEST_MAX_BARS`, `HEADSHOULDERS_RETEST_TOLERANCE_ATR` | Выбирают пробой, закрепление или повторный тест и проверяют свечу и объём подтверждения. |
| Фильтры направлений | `HEADSHOULDERS_MIN_SIGNAL_BODY_STRENGTH`, `HEADSHOULDERS_MIN_SIGNAL_BODY_STRENGTH_LONG`, `HEADSHOULDERS_MIN_SIGNAL_BODY_STRENGTH_SHORT`, `HEADSHOULDERS_MIN_ENTRY_HEAD_HEIGHT_ATR`, `HEADSHOULDERS_MIN_ENTRY_HEAD_HEIGHT_ATR_LONG`, `HEADSHOULDERS_MIN_ENTRY_HEAD_HEIGHT_ATR_SHORT` | Задают минимальную силу свечи и высоту модели с переопределениями по направлениям. |
| Цель, стоп и выход | `HEADSHOULDERS_TARGET_HEIGHT_PCT`, `HEADSHOULDERS_TARGET_HEIGHT_PCT_LONG`, `HEADSHOULDERS_TARGET_HEIGHT_PCT_SHORT`, `HEADSHOULDERS_STOP_BUFFER_HEIGHT_PCT`, `HEADSHOULDERS_EXIT_ON_OPPOSITE_PATTERN` | Задают цели по направлениям, запас стопа и выход по противоположной модели. |
| Риск и направления | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Задают лимит убытка и включают направления с минимальным отношением доходности к риску. |
