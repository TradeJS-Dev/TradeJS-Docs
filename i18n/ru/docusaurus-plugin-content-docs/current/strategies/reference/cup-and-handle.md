---
title: 'CupAndHandle'
---

`CupAndHandle` ищет обычную и перевёрнутую модель «чашка с ручкой» по
экстремумам закрытых свечей. Стратегия определяет край чашки, глубину, ручку,
пробой, стоп и измеряемую цель.

## Визуальная схема

![Логика CupAndHandle](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-CupAndHandle/main/docs/strategy-logic.svg)

![Пример сигнала CupAndHandle](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-CupAndHandle/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

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
