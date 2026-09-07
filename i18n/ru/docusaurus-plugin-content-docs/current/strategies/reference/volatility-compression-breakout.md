---
title: 'VolatilityCompressionBreakout'
---

`VolatilityCompressionBreakout` входит на расширении диапазона после сжатия
волатильности. Стратегия сочетает ранги ATR и ширины полос Боллинджера с пробоем
локального диапазона, поддержки или сопротивления и фильтрами участия.

## Визуальная схема

![Логика VolatilityCompressionBreakout](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolatilityCompressionBreakout/main/docs/strategy-logic.svg)

![Пример сигнала VolatilityCompressionBreakout](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolatilityCompressionBreakout/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Требует `baseContext` и находит compression по ATR/BB ranks.
2. Определяет long/short breakout по local range или S/R state.
3. Проверяет expansion, volume, candle body, distance и optional MTF/trade-flow alignment.
4. Ставит stop за структурой с ATR/percent fallback.
5. Использует `VCB_TARGET_R_MULT` и risk sizing от `MAX_LOSS_VALUE`.

Entry codes: `VCB_LONG_COMPRESSION_BREAKOUT`,
`VCB_SHORT_COMPRESSION_BREAKOUT`. `VCB_EXIT_ON_OPPOSITE_BREAKOUT` включает
`VCB_OPPOSITE_BREAKOUT_EXIT`.

Основные настройки: `VCB_MAX_ATR_PCT_RANK`, `VCB_MAX_BB_WIDTH_RANK`,
`VCB_MIN_RANGE_EXPANSION_RANK`, `VCB_MIN_VOLUME_REL20`,
`VCB_MIN_BREAKOUT_DISTANCE_ATR*`, `VCB_REQUIRE_MTF_ALIGNMENT`,
`VCB_REQUIRE_TRADE_FLOW_ALIGNMENT` и `VCB_STOP_*`/`VCB_TARGET_R_MULT`.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML и размера позиции
работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Оценка издержек | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Задаёт оценки комиссии, проскальзывания и влияния на рынок для расчёта позиции и отношения доходности к риску. Издержки исполнения бэктеста настраиваются отдельно. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы и уровни | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Задают периоды индикаторов, локальных уровней и фильтров сигнала. |
| Сжатие | `VCB_MAX_ATR_PCT_RANK`, `VCB_MAX_BB_WIDTH_RANK`, `VCB_REQUIRE_BOTH_COMPRESSION_FILTERS` | Задают максимальные ранги ATR и ширины полос Боллинджера и определяют, должны ли пройти оба фильтра сжатия. |
| Расширение | `VCB_MIN_RANGE_EXPANSION_RANK`, `VCB_MIN_VOLUME_REL20`, `VCB_MIN_BREAKOUT_BODY_ATR`, `VCB_REQUIRE_BOTH_EXPANSION_FILTERS` | Требуют достаточное расширение диапазона, относительный объём и размер свечи пробоя. |
| Геометрия пробоя | `VCB_MIN_BREAKOUT_DISTANCE_ATR`, `VCB_MIN_BREAKOUT_DISTANCE_ATR_LONG`, `VCB_MIN_BREAKOUT_DISTANCE_ATR_SHORT`, `VCB_MAX_BREAKOUT_DISTANCE_ATR`, `VCB_ENTRY_MAX_ATR_PCT_RANK`, `VCB_ENTRY_MAX_ATR_PCT_RANK_LONG`, `VCB_ENTRY_MAX_ATR_PCT_RANK_SHORT`, `VCB_MIN_ACCEPTANCE_CLOSES`, `VCB_REQUIRE_DIRECTIONAL_BODY` | Ограничивают расстояние пробоя и волатильность входа и требуют достаточно закрытий за уровнем и направленную свечу. |
| Согласование контекста | `VCB_REQUIRE_MTF_ALIGNMENT`, `VCB_REQUIRE_TRADE_FLOW_ALIGNMENT` | Требуют согласия старшего интервала или потока сделок с пробоем. |
| Цель, стоп и выход | `VCB_STOP_ATR_BUFFER_MULT`, `VCB_STOP_BUFFER_PCT`, `VCB_FALLBACK_STOP_ATR_MULT`, `VCB_TARGET_R_MULT`, `VCB_EXIT_ON_OPPOSITE_BREAKOUT` | Задают структурный и запасной стопы, цель и выход по противоположному пробою. |
| Риск и направления | `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Задают лимит убытка и настройки направлений с минимальным отношением доходности к риску. |
