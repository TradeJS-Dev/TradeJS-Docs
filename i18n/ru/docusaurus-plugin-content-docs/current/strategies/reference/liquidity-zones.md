---
title: 'LiquidityZones'
---

`LiquidityZones` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она строит liquidity zones от swing highs/lows, ждет retest и торгует реакцию от этих зон.

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

## Параметры

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

## Payload сигнала

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
