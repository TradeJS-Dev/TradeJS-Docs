---
title: 'RelativeRotation'
---

`RelativeRotation` оценивает ротацию инструмента относительно BTC по суточной
альфе и доходности отношения цен, часовой относительной силе, тренду отношения,
участию объёма, корреляции и необязательному режиму BTC/альткоинов.

## Визуальная схема

![Логика RelativeRotation](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-RelativeRotation/main/docs/strategy-logic.svg)

![Пример сигнала RelativeRotation](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-RelativeRotation/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Требует полный текущий `baseContext`.
2. Определяет long/short rotation по target-vs-BTC features.
3. Применяет side policy и filters по relative strength, volume, ADX,
   correlation, volatility rank и regime.
4. Строит ATR stop, directional R-multiple target и sizing от `MAX_LOSS_VALUE`.

Entry codes: `RR_LONG_RELATIVE_ROTATION`, `RR_SHORT_RELATIVE_ROTATION`.
`RR_EXIT_ON_OPPOSITE_ROTATION` включает `RR_OPPOSITE_ROTATION_EXIT`.

Ключевые настройки: `RR_MIN_ALPHA_24H`, `RR_MIN_RATIO_RETURN_24H`,
`RR_MIN_RELATIVE_STRENGTH_1H*`, `RR_REQUIRE_RATIO_TREND`,
`RR_MIN_TARGET_BTC_CORRELATION*`, `RR_MAX_ATR_PCT_RANK100*` и
`RR_STOP_*`/`RR_TARGET_R_MULT*`. BTC reference разрешается не позже
оцениваемой свечи.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML и размера позиции
работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Оценка издержек | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Задаёт оценки комиссии, проскальзывания и влияния на рынок для расчёта позиции и отношения доходности к риску. Издержки исполнения бэктеста настраиваются отдельно. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы и уровни | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Задают периоды индикаторов, локальных уровней и фильтров сигнала. |
| Сигнал ротации | `RR_MIN_ALPHA_24H`, `RR_MIN_RATIO_RETURN_24H`, `RR_REQUIRE_ALPHA_AND_RATIO_RETURN`, `RR_MIN_RELATIVE_STRENGTH_1H`, `RR_MIN_RELATIVE_STRENGTH_1H_LONG`, `RR_MIN_RELATIVE_STRENGTH_1H_SHORT` | Задают пороги альфы, доходности отношения цен и относительной силы и определяют, должны ли пройти оба суточных условия. |
| Участие и согласование | `RR_MIN_VOLUME_REL20`, `RR_MAX_VOLUME_REL20`, `RR_MAX_VOLUME_REL20_LONG`, `RR_MAX_VOLUME_REL20_SHORT`, `RR_REQUIRE_RATIO_TREND`, `RR_REQUIRE_BTC_ALT_REGIME_ALIGNMENT` | Ограничивают относительный объём и требуют согласия тренда отношения цен или режимов BTC и альткоинов. |
| Качество направления | `RR_MIN_ADX_DI_MINUS`, `RR_MIN_ADX_DI_MINUS_LONG`, `RR_MIN_ADX_DI_MINUS_SHORT`, `RR_MIN_TARGET_BTC_CORRELATION`, `RR_MIN_TARGET_BTC_CORRELATION_LONG`, `RR_MIN_TARGET_BTC_CORRELATION_SHORT`, `RR_MAX_ATR_PCT_RANK100`, `RR_MAX_ATR_PCT_RANK100_LONG`, `RR_MAX_ATR_PCT_RANK100_SHORT` | Задают границы силы тренда, корреляции с BTC и ранга волатильности по направлениям. |
| Цель, стоп и выход | `RR_STOP_ATR_MULT`, `RR_STOP_BUFFER_PCT`, `RR_TARGET_R_MULT`, `RR_TARGET_R_MULT_LONG`, `RR_TARGET_R_MULT_SHORT`, `RR_EXIT_ON_OPPOSITE_ROTATION` | Задают стоп, цели по направлениям и выход по противоположной ротации. |
| Риск и направления | `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Задают лимит убытка и настройки направлений с минимальным отношением доходности к риску. |
