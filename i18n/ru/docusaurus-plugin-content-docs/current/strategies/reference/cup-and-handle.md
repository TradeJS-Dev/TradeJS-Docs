---
title: 'CupAndHandle'
---

`CupAndHandle` — replayable pivot-pattern стратегия для bullish cup-and-handle
и bearish inverted-cup. Detector определяет rim, cup depth, handle, breakout,
stop и measured target по закрытым свечам.

## Логика

1. Прогоняет pivots через `createCupAndHandleEngine(...)`.
2. Проверяет depth, symmetry, duration, handle depth и pattern age.
3. Входит по `breakout`, `close_acceptance` или `retest` из `CUPHANDLE_ENTRY_MODE`.
4. Опционально требует relative breakout volume.
5. Проверяет `minRiskRatio` стороны и size от `MAX_LOSS_VALUE`.

Ключевые настройки: `CUPHANDLE_PIVOT_LOOKBACK`,
`CUPHANDLE_RIM_TOLERANCE_PCT`, `CUPHANDLE_MIN_CUP_DEPTH_ATR`,
`CUPHANDLE_MIN/MAX_CUP_BARS`, `CUPHANDLE_MIN/MAX_HANDLE_BARS`,
`CUPHANDLE_ENTRY_MODE`, `CUPHANDLE_TARGET_DEPTH_PCT` и
`CUPHANDLE_STOP_BUFFER_DEPTH_PCT`.

