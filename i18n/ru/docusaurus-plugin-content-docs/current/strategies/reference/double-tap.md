---
title: 'DoubleTap'
---

`DoubleTap` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она ищет double-bottom и double-top structures, затем торгует breakout/breakdown с stop и target, которые возвращает pattern engine.

## Логика входа

1. Прогоняет свечи через `createDoubleTapEngine(...)`.
2. Читает `runtimeState.pattern`.
3. Ждет появления pattern.
4. Использует `LONG` config для long pattern и `SHORT` config для short pattern.
5. Считает `riskDistance` от текущей цены до `pattern.stopLossPrice`.
6. Считает `riskRatio` как target distance / risk distance.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
8. Возвращает `entry` с double-tap figures и `doubleTapContext`.

Entry codes:

- `DOUBLETAP_DOUBLE_BOTTOM_BREAKOUT`
- `DOUBLETAP_DOUBLE_TOP_BREAKDOWN`

## Выходы

Если позиция уже открыта:

- `DOUBLETAP_OPPOSITE_PATTERN_EXIT`, когда `DOUBLETAP_EXIT_ON_OPPOSITE_PATTERN=true` и engine видит opposite pattern.
- иначе `POSITION_EXISTS`.

## Параметры

Pattern model:

- `DOUBLETAP_PIVOT_LENGTH`
- `DOUBLETAP_PIVOT_TOLERANCE_PCT`
- `DOUBLETAP_TARGET_FIB_PCT`
- `DOUBLETAP_STOP_FIB_PCT`
- `DOUBLETAP_MIN_PATTERN_HEIGHT_PCT`
- `DOUBLETAP_MAX_BREAKOUT_DISTANCE_PCT`
- `DOUBLETAP_EXIT_ON_OPPOSITE_PATTERN`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Payload сигнала

Стратегия сохраняет:

- `additionalIndicators.doubleTapContext`
- figures из `buildDoubleTapFigures(...)`
- stop по `pattern.stopLossPrice`
- один take-profit по `pattern.targetPrice`

## Частые skip reasons

- `NO_PATTERN`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Сверяйте chart figures с ожидаемым double top/bottom. Pattern engine чувствителен к pivot length, tolerance и качеству свечных экстремумов.
