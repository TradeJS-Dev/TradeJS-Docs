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
