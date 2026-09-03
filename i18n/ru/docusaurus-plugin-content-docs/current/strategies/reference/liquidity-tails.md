---
title: 'LiquidityTails'
---

`LiquidityTails` строит зоны ликвидности по крупным теням свечей, ждёт
повторного теста и входит на реакции со стопом за границей зоны.

## Визуальная схема

![Логика LiquidityTails](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-LiquidityTails/main/docs/strategy-logic.svg)

![Пример сигнала LiquidityTails](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-LiquidityTails/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Прогоняет свечи через `createLiquidityTailsEngine(...)`.
2. Читает `runtimeState.signal` и текущие `runtimeState.zones`.
3. Ждет liquidity-tail retest signal.
4. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
5. Строит stop buffer из:
   - `signal.atr * LIQUIDITY_TAILS_STOP_ATR_BUFFER_MULT`
   - процента текущей цены из `LIQUIDITY_TAILS_STOP_BUFFER_PCT`
6. Ставит stop за пределами zone:
   - long: ниже `signal.zone.bottom`
   - short: выше `signal.zone.top`
7. Считает target от `LIQUIDITY_TAILS_TARGET_R_MULT`.
8. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
9. Опционально резервирует часть risk budget для scale-ins на улучшенных retests.
10. Возвращает `entry` с liquidity-tail figures и `liquidityTailsContext`.

Entry codes:

- `LIQUIDITY_TAILS_BUY_PRESSURE_RETEST`
- `LIQUIDITY_TAILS_SELL_PRESSURE_RETEST`

## Выходы

Если позиция уже открыта:

- `LIQUIDITY_TAILS_INVALIDATION_EXIT`, когда включена directional invalidation policy.
- `LIQUIDITY_TAILS_OPPOSITE_RETEST_EXIT`, когда `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST=true` и появляется opposite retest.
- `LIQUIDITY_TAILS_SCALE_IN_RETEST_EXIT`, когда retest для добавления должен закрыть позицию.
- qualifying improved retest может создать `LIQUIDITY_TAILS_*_SCALE_IN`, пока не исчерпаны addition count или basket risk budget.
- иначе `POSITION_EXISTS`.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Суффиксы `_LONG` и `_SHORT` переопределяют
общее значение для соответствующего направления.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста и фильтров сигнала. |
| Источник зоны | `LIQUIDITY_TAILS_ATR_LENGTH`, `LIQUIDITY_TAILS_ATR_MULT`, `LIQUIDITY_TAILS_MIN_WICK_RATIO`, `LIQUIDITY_TAILS_MIN_WICK_RATIO_LONG`, `LIQUIDITY_TAILS_MIN_WICK_RATIO_SHORT`, `LIQUIDITY_TAILS_WICK_DOMINANCE`, `LIQUIDITY_TAILS_WICK_DOMINANCE_LONG`, `LIQUIDITY_TAILS_WICK_DOMINANCE_SHORT`, `LIQUIDITY_TAILS_MIN_GAP`, `LIQUIDITY_TAILS_MIN_ORIGIN_VOLUME_REL20`, `LIQUIDITY_TAILS_REQUIRE_ORIGIN_BODY_ALIGNED` | Задают подходящую тень, шкалу ATR, направленное превосходство тени, расстояние между зонами, объём и направление тела свечи. |
| Срок жизни зоны | `LIQUIDITY_TAILS_MAX_AGE`, `LIQUIDITY_TAILS_KEEP_BROKEN`, `LIQUIDITY_TAILS_MAX_ENTRY_ZONE_AGE_BARS`, `LIQUIDITY_TAILS_MAX_ENTRY_ZONE_AGE_BARS_LONG`, `LIQUIDITY_TAILS_MAX_ENTRY_ZONE_AGE_BARS_SHORT` | Управляют сроком действия зоны и сохранением пробитых зон. |
| Геометрия повторного теста | `LIQUIDITY_TAILS_REACTION_CLOSE_BEYOND_ZONE`, `LIQUIDITY_TAILS_REQUIRE_REACTION_BODY`, `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT`, `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT_LONG`, `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT_SHORT`, `LIQUIDITY_TAILS_MIN_RETEST_AGE_BARS`, `LIQUIDITY_TAILS_MIN_RETEST_AGE_BARS_LONG`, `LIQUIDITY_TAILS_MIN_RETEST_AGE_BARS_SHORT` | Задают место закрытия реакции, её тело и допустимые расстояние и задержку повторного теста. |
| Качество повторного теста | `LIQUIDITY_TAILS_MIN_ZONE_TOUCHES`, `LIQUIDITY_TAILS_MIN_ZONE_TOUCHES_LONG`, `LIQUIDITY_TAILS_MIN_ZONE_TOUCHES_SHORT`, `LIQUIDITY_TAILS_MAX_ENTRY_RETEST_ORDINAL`, `LIQUIDITY_TAILS_MAX_ENTRY_RETEST_ORDINAL_LONG`, `LIQUIDITY_TAILS_MAX_ENTRY_RETEST_ORDINAL_SHORT`, `LIQUIDITY_TAILS_MIN_REJECTION_EFFICIENCY_RATIO`, `LIQUIDITY_TAILS_MIN_REJECTION_EFFICIENCY_RATIO_LONG`, `LIQUIDITY_TAILS_MIN_REJECTION_EFFICIENCY_RATIO_SHORT`, `LIQUIDITY_TAILS_CLOSE_HOLD_BARS`, `LIQUIDITY_TAILS_CLOSE_HOLD_BARS_LONG`, `LIQUIDITY_TAILS_CLOSE_HOLD_BARS_SHORT` | Требуют достаточно касаний, ограничивают номер теста и проверяют эффективность отбоя и удержание закрытий. |
| Цель, стоп и выход | `LIQUIDITY_TAILS_STOP_ATR_BUFFER_MULT`, `LIQUIDITY_TAILS_STOP_BUFFER_PCT`, `LIQUIDITY_TAILS_TARGET_R_MULT`, `LIQUIDITY_TAILS_TARGET_R_MULT_LONG`, `LIQUIDITY_TAILS_TARGET_R_MULT_SHORT`, `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST`, `LIQUIDITY_TAILS_EXIT_ON_INVALIDATION`, `LIQUIDITY_TAILS_EXIT_ON_INVALIDATION_LONG`, `LIQUIDITY_TAILS_EXIT_ON_INVALIDATION_SHORT`, `LIQUIDITY_TAILS_EXIT_ON_SCALE_IN_RETEST` | Задают стоп, цели по направлениям и события повторного теста или отмены зоны, которые закрывают позицию. |
| Добавление позиции | `LIQUIDITY_TAILS_SCALE_IN_ENABLED`, `LIQUIDITY_TAILS_SCALE_IN_COUNT`, `LIQUIDITY_TAILS_INITIAL_RISK_FRACTION`, `LIQUIDITY_TAILS_SCALE_IN_MIN_IMPROVEMENT_ATR` | Включают добавления и задают их число, начальную долю риска и требуемое улучшение цены. |
| Графика и направления | `LIQUIDITY_TAILS_MAX_FIGURE_ZONES`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Ограничивают число зон на графике, задают лимит убытка и настройки направлений. |

Liquidity-tail model:

- `LIQUIDITY_TAILS_ATR_LENGTH`
- `LIQUIDITY_TAILS_ATR_MULT`
- `LIQUIDITY_TAILS_MIN_WICK_RATIO`
- `LIQUIDITY_TAILS_WICK_DOMINANCE`
- `LIQUIDITY_TAILS_MIN_GAP`
- `LIQUIDITY_TAILS_MAX_AGE`
- `LIQUIDITY_TAILS_KEEP_BROKEN`
- `LIQUIDITY_TAILS_REACTION_CLOSE_BEYOND_ZONE`
- `LIQUIDITY_TAILS_REQUIRE_REACTION_BODY`
- `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT`
- `LIQUIDITY_TAILS_MIN_RETEST_AGE_BARS`
- `LIQUIDITY_TAILS_MIN_ZONE_TOUCHES`
- `LIQUIDITY_TAILS_MAX_ENTRY_RETEST_ORDINAL`
- `LIQUIDITY_TAILS_MAX_ENTRY_ZONE_AGE_BARS`
- `LIQUIDITY_TAILS_MIN_REJECTION_EFFICIENCY_RATIO`
- `LIQUIDITY_TAILS_MIN_ORIGIN_VOLUME_REL20`
- `LIQUIDITY_TAILS_REQUIRE_ORIGIN_BODY_ALIGNED`
- `LIQUIDITY_TAILS_CLOSE_HOLD_BARS`
- `LIQUIDITY_TAILS_STOP_ATR_BUFFER_MULT`
- `LIQUIDITY_TAILS_STOP_BUFFER_PCT`
- `LIQUIDITY_TAILS_TARGET_R_MULT`
- `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST`
- `LIQUIDITY_TAILS_EXIT_ON_INVALIDATION`
- `LIQUIDITY_TAILS_SCALE_IN_ENABLED`
- `LIQUIDITY_TAILS_SCALE_IN_COUNT`
- `LIQUIDITY_TAILS_INITIAL_RISK_FRACTION`
- `LIQUIDITY_TAILS_SCALE_IN_MIN_IMPROVEMENT_ATR`
- `LIQUIDITY_TAILS_MAX_FIGURE_ZONES`

Для directional numeric/boolean fields `<KEY>_LONG` или `<KEY>_SHORT` имеет
приоритет над `<KEY>`. Это относится к wick ratio, dominance, retest
distance/age/touches, retest ordinal, zone age, rejection efficiency,
close-hold bars, target R и invalidation exit. Если directional value не задан,
используется unsuffixed field.

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

В режиме `AI_MODE: "gate"` текущий локальный фильтр требует широкого участия
пяти крупнейших рыночных активов и низкого значения отрицательного
индикатора направления. Если нужных данных нет, вход отклоняется.

## Содержимое сигнала

Стратегия сохраняет:

- `additionalIndicators.liquidityTailsContext`
- zone/entry/stop/target figures из `buildLiquidityTailsFigures(...)`
- один take-profit по рассчитанному target

## Частые skip reasons

- `NO_LIQUIDITY_TAIL_RETEST`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Проверяйте zone age, broken-zone behavior и retest distance перед сравнением результатов. Стратегия сильно зависит от качества свечных фитилей и различий между providers.
При включенных scale-ins оценивайте basket-level maximum loss и поддержку
увеличения позиции коннектором, а не только первый вход.
