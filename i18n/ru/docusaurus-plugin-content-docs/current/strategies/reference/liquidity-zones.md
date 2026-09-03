---
title: 'LiquidityZones'
---

`LiquidityZones` строит зоны ликвидности по локальным максимумам и минимумам,
ждёт повторного теста и входит на реакции от зоны.

## Визуальная схема

![Логика LiquidityZones](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-LiquidityZones/main/docs/strategy-logic.svg)

![Пример сигнала LiquidityZones](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-LiquidityZones/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Строит активные liquidity zones из pivots.
2. Ждет zone retest signal.
3. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
4. Строит stop buffer из высоты зоны и `LIQUIDITY_ZONES_STOP_BUFFER_PCT`.
5. Ставит stop за пределами retested zone.
6. Считает target от `LIQUIDITY_ZONES_TARGET_R_MULT`.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
8. Возвращает `entry` с zone figures и `liquidityZonesContext`.

Entry codes:

- `LIQUIDITY_ZONES_BULLISH_RETEST`
- `LIQUIDITY_ZONES_BEARISH_RETEST`

## Выходы

Если позиция уже открыта:

- `LIQUIDITY_ZONES_OPPOSITE_RETEST_EXIT`, когда `LIQUIDITY_ZONES_EXIT_ON_OPPOSITE_RETEST=true` и появляется opposite retest.
- иначе `POSITION_EXISTS`.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML, индикаторов и
размера позиции работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста и фильтров сигнала. |
| Построение зон | `LIQUIDITY_ZONES_PIVOT_LOOKBACK`, `LIQUIDITY_ZONES_SWING_AREA_MODE`, `LIQUIDITY_ZONES_FILTER_MODE`, `LIQUIDITY_ZONES_MIN_FILTER_VALUE`, `LIQUIDITY_ZONES_SHOW_SWING_HIGH_ZONES`, `LIQUIDITY_ZONES_SHOW_SWING_LOW_ZONES` | Задают экстремумы и границы зон, фильтр по числу или объёму и включение верхних и нижних зон. |
| Возраст и повторный тест | `LIQUIDITY_ZONES_MIN_ZONE_AGE`, `LIQUIDITY_ZONES_MAX_AGE`, `LIQUIDITY_ZONES_REACTION_CLOSE_BEYOND_ZONE`, `LIQUIDITY_ZONES_REQUIRE_REACTION_BODY`, `LIQUIDITY_ZONES_MAX_RETEST_PENETRATION_PCT` | Задают допустимый возраст зоны, реакцию цены и максимальную глубину повторного теста. |
| Качество реакции | `LIQUIDITY_ZONES_MIN_REACTION_CLOSE_DISTANCE_PCT`, `LIQUIDITY_ZONES_MAX_REACTION_CLOSE_DISTANCE_PCT`, `LIQUIDITY_ZONES_MAX_REACTION_CLOSE_DISTANCE_PCT_LONG`, `LIQUIDITY_ZONES_MAX_REACTION_CLOSE_DISTANCE_PCT_SHORT`, `LIQUIDITY_ZONES_REQUIRE_RANGE_RECLAIM`, `LIQUIDITY_ZONES_REQUIRE_SWEEP_RECLAIM`, `LIQUIDITY_ZONES_MIN_REJECTION_WICK_SCORE`, `LIQUIDITY_ZONES_MIN_VOLUME_REL20` | Ограничивают расстояние реакции и требуют возврат в диапазон или за уровень, качество тени отбоя и относительный объём. |
| Цель, стоп и выход | `LIQUIDITY_ZONES_STOP_ZONE_BUFFER_MULT`, `LIQUIDITY_ZONES_STOP_BUFFER_PCT`, `LIQUIDITY_ZONES_TARGET_R_MULT`, `LIQUIDITY_ZONES_EXIT_ON_OPPOSITE_RETEST` | Задают стоп за зоной, цель и выход по противоположному тесту. |
| Графика и направления | `LIQUIDITY_ZONES_MAX_FIGURE_ZONES`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Ограничивают число зон на графике, задают лимит убытка и настройки направлений. |

Zone model:

- `LIQUIDITY_ZONES_PIVOT_LOOKBACK`
- `LIQUIDITY_ZONES_SWING_AREA_MODE` (`wick_extremity` или `full_range`)
- `LIQUIDITY_ZONES_FILTER_MODE` (`count` или `volume`)
- `LIQUIDITY_ZONES_MIN_FILTER_VALUE`
- `LIQUIDITY_ZONES_SHOW_SWING_HIGH_ZONES`
- `LIQUIDITY_ZONES_SHOW_SWING_LOW_ZONES`
- `LIQUIDITY_ZONES_MAX_AGE`
- `LIQUIDITY_ZONES_REACTION_CLOSE_BEYOND_ZONE`
- `LIQUIDITY_ZONES_REQUIRE_REACTION_BODY`
- `LIQUIDITY_ZONES_MAX_RETEST_PENETRATION_PCT`
- `LIQUIDITY_ZONES_STOP_ZONE_BUFFER_MULT`
- `LIQUIDITY_ZONES_STOP_BUFFER_PCT`
- `LIQUIDITY_ZONES_TARGET_R_MULT`
- `LIQUIDITY_ZONES_EXIT_ON_OPPOSITE_RETEST`
- `LIQUIDITY_ZONES_MAX_FIGURE_ZONES`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Содержимое сигнала

Стратегия сохраняет:

- `additionalIndicators.liquidityZonesContext`
- zone figures из `buildLiquidityZonesFigures(...)`
- stop за пределами retested zone
- один take-profit по рассчитанному target

## Частые skip reasons

- `NO_LIQUIDITY_ZONE_RETEST`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Сравнивайте `wick_extremity` и `full_range` отдельно. Ширина зоны, качество фитилей у provider и retest penetration settings могут сильно менять частоту сигналов.
