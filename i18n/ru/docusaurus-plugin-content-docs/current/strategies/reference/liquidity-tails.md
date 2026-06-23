---
title: 'LiquidityTails'
---

`LiquidityTails` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она ищет wick/tail liquidity zones, ждет retest и торгует реакцию со stop за пределами retested zone.

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
9. Возвращает `entry` с liquidity-tail figures и `liquidityTailsContext`.

Entry codes:

- `LIQUIDITY_TAILS_BUY_PRESSURE_RETEST`
- `LIQUIDITY_TAILS_SELL_PRESSURE_RETEST`

## Выходы

Если позиция уже открыта:

- `LIQUIDITY_TAILS_OPPOSITE_RETEST_EXIT`, когда `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST=true` и появляется opposite retest.
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
- `LIQUIDITY_TAILS_STOP_ATR_BUFFER_MULT`
- `LIQUIDITY_TAILS_STOP_BUFFER_PCT`
- `LIQUIDITY_TAILS_TARGET_R_MULT`
- `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST`
- `LIQUIDITY_TAILS_MAX_FIGURE_ZONES`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Payload сигнала

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
