---
title: 'GridClassic'
---

`GridClassic` строит сетку по обнаруженному горизонтальному диапазону. В режиме
`mean_reversion` стратегия входит после подтверждения края диапазона, а в
`breakout_continuation` — после закрепления за границей и необязательного
повторного теста. Отдельно можно включить разворот ложного пробоя.

## Визуальная схема

![Логика GridClassic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-GridClassic/main/docs/strategy-logic.svg)

![Пример сигнала GridClassic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-GridClassic/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Находит range по pivots, containment, width, age, slope и boundary divergence.
2. Подтверждает edge rejection/close-inside или breakout continuation.
3. Строит несколько уровней, единый stop и center/opposite-edge target.
4. Добавляет позицию только в пределах basket risk budget.
5. Управляет breakeven, protection, range invalidation, max hold, volatility shock и target exits.

Ключевые настройки: `GRIDCLASSIC_MODE`,
`GRIDCLASSIC_FAILED_BREAKOUT_REVERSAL_ENABLED`, `GRIDCLASSIC_PIVOT_*`,
range quality limits, `GRIDCLASSIC_ENTRY_CONFIRMATION`,
`GRIDCLASSIC_LEVELS`, `GRIDCLASSIC_GRID_STEP_ATR`,
`GRIDCLASSIC_TP_MODE` и lifecycle limits.

Перед live сравните continuous execution с replay через
[runtime parity](../../runtime/backtesting/runtime-parity).
