---
title: 'Gartley'
---

`Gartley` — стратегия гармонического разворота из
`@tradejs/strategy-gartley`. Она ищет бычьи и медвежьи модели XABCD из пяти
экстремумов и проверяет их пропорции Фибоначчи перед входом.

## Визуальная схема

![Логика Gartley](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Gartley/main/docs/strategy-logic.svg)

![Пример бычьего сигнала Gartley](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Gartley/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными. Точные
отношения, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Находит чередующиеся экстремумы XABCD с достаточной высотой XA и длиной ног.
2. Проверяет диапазоны отношений AB, BC, CD, AD и равенство AB≈CD.
3. Подтверждает D и ждёт пробоя B в сторону разворота.
4. Применяет фильтры тренда для каждого направления.
5. Ставит цель и стоп по настроенным проекциям XA.

## Выходы

Позиция закрывается по рассчитанному стопу или цели. Если включён
`GARTLEY_EXIT_ON_OPPOSITE_PATTERN`, подтверждённая противоположная модель тоже
закрывает позицию.

## Ключи конфигурации

Ключи сгруппированы по части стратегии, которой они управляют. Значение `0`
или `false` отключает соответствующий необязательный фильтр, если не указано иное.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Задают режим работы, интервал свечей, поведение ордеров и цену исполнения в бэктесте. |
| AI и ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Управляют необязательными решениями AI и ML и их порогами допуска. |
| Риск | `FEE_PERCENT`, `MAX_LOSS_VALUE`, `GARTLEY_TARGET_XA_FIB_PCT`, `GARTLEY_STOP_XA_FIB_PCT`, `GARTLEY_EXIT_ON_OPPOSITE_PATTERN` | Учитывают комиссию, задают размер позиции, проекции цели и стопа от XA и выход по противоположной модели. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `GARTLEY_ATR_PERIOD` | Задают периоды рыночного контекста, фильтров направления и нормализации модели. |
| Поиск экстремумов | `GARTLEY_PIVOT_LENGTH`, `GARTLEY_MIN_LEG_BARS`, `GARTLEY_MAX_PATTERN_AGE_BARS`, `GARTLEY_MAX_BREAKOUT_AFTER_D_BARS` | Задают подтверждение экстремумов, минимальную длину ноги, возраст модели и срок пробоя B после D. |
| Отношения AB и BC | `GARTLEY_MIN_AB_RETRACEMENT_RATIO`, `GARTLEY_MAX_AB_RETRACEMENT_RATIO`, `GARTLEY_MIN_BC_RETRACEMENT_RATIO`, `GARTLEY_MAX_BC_RETRACEMENT_RATIO` | Задают допустимые диапазоны откатов AB/XA и BC/AB. |
| Отношения CD и AD | `GARTLEY_MIN_CD_EXTENSION_RATIO`, `GARTLEY_MAX_CD_EXTENSION_RATIO`, `GARTLEY_MIN_AD_RETRACEMENT_RATIO`, `GARTLEY_MAX_AD_RETRACEMENT_RATIO`, `GARTLEY_MAX_AB_CD_DEVIATION_PCT` | Задают допустимые диапазоны CD/BC и AD/XA и максимальную разницу длин AB и CD. |
| Размер модели | `GARTLEY_MIN_XA_HEIGHT_PCT`, `GARTLEY_MIN_XA_HEIGHT_ATR` | Требуют минимальную высоту XA в процентах цены и единицах ATR. |
| Момент входа | `GARTLEY_MIN_BREAKOUT_DISTANCE_ATR`, `GARTLEY_MAX_BREAKOUT_DISTANCE_XA_RATIO`, `GARTLEY_ENTRY_MODE`, `GARTLEY_CONFIRMATION_MAX_BARS`, `GARTLEY_RETEST_MAX_BARS`, `GARTLEY_RETEST_TOLERANCE_ATR` | Задают допустимый пробой B и окно закрепления или повторного теста. |
| Фильтры направлений | `GARTLEY_LONG_REQUIRE_POSITIVE_MACD_HISTOGRAM`, `GARTLEY_SHORT_REQUIRE_PRICE_BELOW_MA_SLOW` | Требуют положительную гистограмму MACD для long или цену ниже медленной средней для short. |
| Направления | `LONG.*`, `SHORT.*` | Включают направления и задают тип ордера и минимальное отношение доходности к риску. |

## Содержимое сигнала

Сигнал содержит экстремумы XABCD, гармонические отношения, состояние
подтверждения, рассчитанные стоп и цель и элементы графика модели.

## Запуск

```bash
npx @tradejs/cli backtest --user root --config Gartley:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
