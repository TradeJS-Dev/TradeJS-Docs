---
title: 'StructureZones'
---

`StructureZones` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она исследует market-structure zones от swing points и торгует reactions или transition breakouts от этих зон.

## Логика входа

1. Прогоняет свечи через `createStructureZonesEngine(...)`.
2. Читает `runtimeState.signal` и `runtimeState.snapshot`.
3. Ждет structure-zone signal.
4. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
5. Ставит stop за пределами signal zone с ATR и percent buffers.
6. Считает target от `STRUCTURE_ZONES_TARGET_R_MULT`.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
8. Возвращает `entry` с structure-zone figures и `structureZonesContext`.

Entry codes зависят от kind и direction:

- `STRUCTURE_ZONES_<KIND>_LONG`
- `STRUCTURE_ZONES_<KIND>_SHORT`

## Выходы

Если позиция уже открыта:

- `STRUCTURE_ZONES_OPPOSITE_SIGNAL_EXIT`, когда `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL=true` и engine дает opposite signal.
- иначе `POSITION_EXISTS`.

## Параметры

Zone model:

- `STRUCTURE_ZONES_PIVOT_LENGTH`
- `STRUCTURE_ZONES_ATR_LENGTH`
- `STRUCTURE_ZONES_MIN_SWING_ATR`
- `STRUCTURE_ZONES_ZONE_WIDTH_ATR`
- `STRUCTURE_ZONES_ACCEPT_BARS`
- `STRUCTURE_ZONES_REACTION_CLOSE_BEYOND_ZONE`
- `STRUCTURE_ZONES_REQUIRE_REACTION_BODY`
- `STRUCTURE_ZONES_TRADE_TRANSITION_BREAKOUTS`
- `STRUCTURE_ZONES_STOP_ZONE_BUFFER_MULT`
- `STRUCTURE_ZONES_STOP_BUFFER_PCT`
- `STRUCTURE_ZONES_TARGET_R_MULT`
- `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL`
- `STRUCTURE_ZONES_MAX_FIGURE_POINTS`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Payload сигнала

Стратегия сохраняет:

- `additionalIndicators.structureZonesContext`
- zone, signal, stop и target figures из `buildStructureZonesFigures(...)`
- `orderPlan.stopLossPrice`
- один take-profit по рассчитанному target

## Частые skip reasons

- `NO_STRUCTURE_ZONE_SIGNAL`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Держите zone detection causal и проверяйте chart artifacts перед выводами по метрикам. `STRUCTURE_ZONES_TRADE_TRANSITION_BREAKOUTS` меняет поверхность стратегии, поэтому сравнивайте этот режим как отдельный experiment.

Related:

- [Signals](../../core-concepts/signals)
- [Backtesting caveats](../../limitations/backtesting-caveats)
