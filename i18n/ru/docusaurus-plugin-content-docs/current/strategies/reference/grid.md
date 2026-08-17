---
title: 'Grid'
---

`Grid` — directional position-building стратегия. Она входит на EMA-trend
pullback recovery или подтвержденном breakout retest и добавляет уровни, не
выходя за единый risk budget позиции.

## Логика

1. Определяет направление/силу тренда по fast/slow EMA и ATR geometry.
2. Ждет `pullback_recovery` или `breakout_retest` из `GRID_ENTRY_MODE`.
3. Проверяет volatility, candle size, optional range geometry и cooldown.
4. Создает initial order plan и optional scale-in levels.
5. Пересчитывает basket protection; выходит по hard stop, regime flip или volatility shock.

Entry codes: `GRID_DIRECTIONAL_PULLBACK_ENTRY`, `GRID_BREAKOUT_RETEST_ENTRY`;
добавления — `GRID_SCALE_IN_<level>`.

Ключевые группы: `GRID_FAST_EMA`/`GRID_SLOW_EMA`, trend-strength limits,
`GRID_ENTRY_MODE`, `GRID_BREAKOUT_*`, `GRID_STEP_ATR_MULT`,
`GRID_MAX_LEVELS`, `GRID_STOP_ATR_MULT`, lifecycle exits и optional
`GRID_RANGE_*`. Перед live проверьте поддержку position increase коннектором.

