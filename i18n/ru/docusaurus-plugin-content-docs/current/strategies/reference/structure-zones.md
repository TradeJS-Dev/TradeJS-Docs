---
title: 'StructureZones'
---

`StructureZones` строит зоны рыночной структуры по экстремумам и входит на
реакции от зоны либо на переходном пробое.

## Визуальная схема

![Логика StructureZones](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-StructureZones/main/docs/strategy-logic.svg)

![Пример сигнала StructureZones](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-StructureZones/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Прогоняет свечи через `createStructureZonesEngine(...)`.
2. Читает `runtimeState.signal` и `runtimeState.snapshot`.
3. Ждет structure-zone signal.
4. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
5. Ставит stop за пределами signal zone с ATR и percent buffers.
6. Считает target от `STRUCTURE_ZONES_TARGET_R_MULT`.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учётом оценок `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS` и `RISK_MARKET_IMPACT_BPS`.
8. Возвращает `entry` с structure-zone figures и `structureZonesContext`.

Entry codes зависят от kind и direction:

- `STRUCTURE_ZONES_<KIND>_LONG`
- `STRUCTURE_ZONES_<KIND>_SHORT`

## Выходы

Если позиция уже открыта:

- `STRUCTURE_ZONES_OPPOSITE_SIGNAL_EXIT`, когда `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL=true` и engine дает opposite signal.
- иначе `POSITION_EXISTS`.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Суффиксы `_LONG` и `_SHORT` переопределяют
общее значение для соответствующего направления.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста и фильтров сигнала. |
| Построение зон | `STRUCTURE_ZONES_PIVOT_LENGTH`, `STRUCTURE_ZONES_ATR_LENGTH`, `STRUCTURE_ZONES_MIN_SWING_ATR`, `STRUCTURE_ZONES_ZONE_WIDTH_ATR`, `STRUCTURE_ZONES_ACCEPT_BARS` | Задают подтверждённые экстремумы, шкалу ATR, минимальный размах, ширину зоны и время закрепления. |
| Качество реакции | `STRUCTURE_ZONES_REACTION_CLOSE_BEYOND_ZONE`, `STRUCTURE_ZONES_REQUIRE_REACTION_BODY`, `STRUCTURE_ZONES_REQUIRE_BIAS_ALIGNMENT`, `STRUCTURE_ZONES_MIN_REACTION_DISTANCE_ATR`, `STRUCTURE_ZONES_MIN_REACTION_DISTANCE_ATR_LONG`, `STRUCTURE_ZONES_MIN_REACTION_DISTANCE_ATR_SHORT`, `STRUCTURE_ZONES_MIN_REACTION_CLOSE_DISTANCE_PCT`, `STRUCTURE_ZONES_MIN_REACTION_CLOSE_DISTANCE_PCT_LONG`, `STRUCTURE_ZONES_MIN_REACTION_CLOSE_DISTANCE_PCT_SHORT` | Требуют допустимые закрытие, тело, направление и расстояние реакции от зоны. |
| Возраст и касания | `STRUCTURE_ZONES_MIN_ZONE_AGE_BARS`, `STRUCTURE_ZONES_MAX_ZONE_AGE_BARS`, `STRUCTURE_ZONES_MIN_TOUCH_ORDINAL`, `STRUCTURE_ZONES_MAX_TOUCH_ORDINAL`, `STRUCTURE_ZONES_PENDING_CONFIRMATION_MAX_BARS` | Ограничивают возраст зоны, допустимый номер касания и время ожидания подтверждения. |
| Рыночные фильтры | `STRUCTURE_ZONES_MAX_ATR_PCT_RANK100`, `STRUCTURE_ZONES_MIN_TREND_PERSISTENCE`, `STRUCTURE_ZONES_MIN_TREND_PERSISTENCE_LONG`, `STRUCTURE_ZONES_MIN_TREND_PERSISTENCE_SHORT` | Ограничивают ранг волатильности и требуют устойчивость тренда по направлениям. |
| Режим сигнала | `STRUCTURE_ZONES_TRADE_TRANSITION_BREAKOUTS`, `STRUCTURE_ZONES_TRANSITION_BREAKOUT_ONLY`, `STRUCTURE_ZONES_COOLDOWN_HOURS` | Включают переходные пробои, при необходимости отключают входы по реакции и задают паузу между сигналами. |
| Цель, стоп и выход | `STRUCTURE_ZONES_STOP_ZONE_BUFFER_MULT`, `STRUCTURE_ZONES_STOP_BUFFER_PCT`, `STRUCTURE_ZONES_TARGET_R_MULT`, `STRUCTURE_ZONES_TARGET_R_MULT_LONG`, `STRUCTURE_ZONES_TARGET_R_MULT_SHORT`, `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL` | Задают стоп за зоной, цели по направлениям и выход по противоположному сигналу. |
| Графика и направления | `STRUCTURE_ZONES_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Ограничивают объём графики, задают лимит убытка и настройки направлений. |

Zone model:

- `STRUCTURE_ZONES_PIVOT_LENGTH`
- `STRUCTURE_ZONES_ATR_LENGTH`
- `STRUCTURE_ZONES_MIN_SWING_ATR`
- `STRUCTURE_ZONES_ZONE_WIDTH_ATR`
- `STRUCTURE_ZONES_ACCEPT_BARS`
- `STRUCTURE_ZONES_REACTION_CLOSE_BEYOND_ZONE`
- `STRUCTURE_ZONES_REQUIRE_REACTION_BODY`
- `STRUCTURE_ZONES_TRADE_TRANSITION_BREAKOUTS`
- `STRUCTURE_ZONES_TRANSITION_BREAKOUT_ONLY`
- `STRUCTURE_ZONES_STOP_ZONE_BUFFER_MULT`
- `STRUCTURE_ZONES_STOP_BUFFER_PCT`
- `STRUCTURE_ZONES_TARGET_R_MULT`
- `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL`
- `STRUCTURE_ZONES_MAX_FIGURE_POINTS`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Содержимое сигнала

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

`STRUCTURE_ZONES_TRANSITION_BREAKOUT_ONLY=true` отключает реакции от support и
resistance и оставляет только принятые structural breakouts в состоянии рынка
`Transition`. При deterministic `AI_MODE: "gate"` локальный gate сейчас
допускает только SHORT transition-breakout setups, которые проходят
зафиксированные causal thresholds по benchmark-relative strength и расстоянию
до trailing stop; отсутствующие features дают отказ.

Related:

- [Signals](../../core-concepts/signals)
- [Backtesting caveats](../../limitations/backtesting-caveats)
