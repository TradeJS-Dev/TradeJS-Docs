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

## Параметры

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
