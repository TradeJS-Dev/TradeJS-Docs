---
title: 'MarketFlushReversal'
---

`MarketFlushReversal` ищет широкую рыночную ликвидацию или давление и
последующую свечу направленного отбоя. Решение использует только закрытую свечу
и рыночный контекст, доступный на тот момент.

## Визуальная схема

![Логика MarketFlushReversal](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MarketFlushReversal/main/docs/strategy-logic.svg)

![Пример сигнала MarketFlushReversal](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MarketFlushReversal/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Требует актуальный shared market context.
2. Определяет long/short flush по liquidation/imbalance и candle-reversal evidence.
3. Применяет side-specific range, turnover, body и confirmation filters.
4. Входит сразу или хранит bounded pending setup по `MFR_ENTRY_MODE`.
5. Строит ATR/percent stop, R-multiple target и sizing от `MAX_LOSS_VALUE`.

Entry codes: `MFR_LONG_FLUSH_REVERSAL`, `MFR_SHORT_FLUSH_REVERSAL`.
`MFR_EXIT_ON_OPPOSITE_SIGNAL` включает `MFR_OPPOSITE_FLUSH_EXIT`.

Ключевые группы: evidence (`MFR_MIN_VOLUME_REL20`,
`MFR_MIN_MARKET_LIQ_SPIKE_RATIO`), rejection (`MFR_MIN_REJECTION_*`),
confirmation (`MFR_ENTRY_MODE`, `MFR_CONFIRMATION_BARS*`,
`MFR_PENDING_MAX_BARS`), deterministic gate
(`MFR_REQUIRE_CALIBRATED_LONG_REBOUND_POCKET`,
`MFR_ENABLE_PROTECTED_V1_H1_RANGE50_SHORT_POCKET`) и risk (`MFR_STOP_*`,
`MFR_TARGET_R_MULT`). Суффиксы `_LONG`/`_SHORT` переопределяют общее значение
для направления.

При deterministic `AI_MODE: "gate"` LONG и SHORT сигналы должны попасть в
проверенные causal context pockets. Protected SHORT flag добавляет более узкий
путь одобрения с требованиями к breadth, rejection wick, derivatives и позиции
в 1h range. Отсутствующие обязательные features дают отказ.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Суффиксы `_LONG` и `_SHORT` переопределяют
общее значение для соответствующего направления.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Комиссия | `FEE_PERCENT` | Учитывает заданную торговую комиссию при расчёте позиции и отношения доходности к риску. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы и уровни | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Задают периоды индикаторов, локальных уровней и фильтров сигнала. |
| Рыночные признаки | `MFR_MIN_VOLUME_REL20`, `MFR_MIN_MARKET_LIQ_SPIKE_RATIO`, `MFR_REQUIRE_MARKET_FLUSH_CONFIRMATION` | Задают требуемый объём инструмента и признаки широкой рыночной ликвидации. |
| Детерминированный фильтр | `MFR_REQUIRE_CALIBRATED_LONG_REBOUND_POCKET`, `MFR_ENABLE_PROTECTED_V1_H1_RANGE50_SHORT_POCKET` | Включают проверенное правило long-отбоя и защищённый путь допуска short. |
| Свеча отбоя | `MFR_MIN_SWEEP_WICK_PCT`, `MFR_MIN_REJECTION_CLOSE_POSITION`, `MFR_MIN_REJECTION_CLOSE_POSITION_LONG`, `MFR_MIN_REJECTION_CLOSE_POSITION_SHORT`, `MFR_MIN_REJECTION_BODY_ATR`, `MFR_MIN_REJECTION_BODY_ATR_LONG`, `MFR_MIN_REJECTION_BODY_ATR_SHORT`, `MFR_MIN_ENTRY_BODY_STRENGTH`, `MFR_MIN_ENTRY_BODY_STRENGTH_LONG`, `MFR_MIN_ENTRY_BODY_STRENGTH_SHORT` | Задают минимальные тень, положение закрытия, размер и силу тела свечи с переопределениями по направлениям. |
| Качество подтверждения | `MFR_MIN_CONFIRMATION_DISPLACEMENT_ATR`, `MFR_MIN_CONFIRMATION_DISPLACEMENT_ATR_LONG`, `MFR_MIN_CONFIRMATION_DISPLACEMENT_ATR_SHORT`, `MFR_MIN_AVG_TURNOVER_20`, `MFR_MIN_AVG_TURNOVER_20_LONG`, `MFR_MIN_AVG_TURNOVER_20_SHORT`, `MFR_MAX_LONG_RANGE_POSITION`, `MFR_MIN_SHORT_RANGE_POSITION` | Требуют достаточное движение подтверждения, оборот и допустимое положение в диапазоне для каждого направления. |
| Момент входа | `MFR_ENTRY_MODE`, `MFR_CONFIRMATION_BARS`, `MFR_CONFIRMATION_BARS_LONG`, `MFR_CONFIRMATION_BARS_SHORT`, `MFR_PENDING_MAX_BARS`, `MFR_REQUIRE_DIRECTIONAL_CONFIRMATION_BODY`, `MFR_USE_FROZEN_PENDING_STOP` | Выбирают немедленный или отложенный вход и управляют сроком ожидания, свечой подтверждения и стопом. |
| Цель, стоп и выход | `MFR_STOP_ATR_BUFFER_MULT`, `MFR_STOP_BUFFER_PCT`, `MFR_FALLBACK_STOP_ATR_MULT`, `MFR_TARGET_R_MULT`, `MFR_EXIT_ON_OPPOSITE_SIGNAL` | Задают структурный и запасной стопы, цель и выход по противоположному сигналу. |
| Риск и направления | `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Задают лимит убытка и настройки направлений с минимальным отношением доходности к риску. |
