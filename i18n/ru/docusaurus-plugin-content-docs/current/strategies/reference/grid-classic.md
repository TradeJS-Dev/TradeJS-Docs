---
title: 'GridClassic'
---

`GridClassic` строит grid из обнаруженного горизонтального range. В
`mean_reversion` он входит по подтвержденным краям, в
`breakout_continuation` — после acceptance и optional retest. Отдельно можно
включить failed-breakout reversal.

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

