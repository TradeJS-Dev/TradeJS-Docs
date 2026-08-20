---
title: 'HeadAndShoulders'
---

`HeadAndShoulders` ищет обычную и перевёрнутую модель «голова и плечи» по
экстремумам закрытых свечей. Расчёт включает плечи, выраженность головы, линию
шеи, пробой, стоп и измеряемую цель.

## Визуальная схема

![Логика HeadAndShoulders](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HeadAndShoulders/main/docs/strategy-logic.svg)

![Пример сигнала HeadAndShoulders](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HeadAndShoulders/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Проверяет pattern symmetry, neckline slope, age и prior move.
2. Входит по `breakout`, `close_acceptance` или `retest`.
3. Применяет distance, confirmation candle, volume и side-specific filters.
4. Отбрасывает invalid stop, passed target и недостаточный `minRiskRatio`.
5. Считает size от `MAX_LOSS_VALUE`.

Основные настройки: `HEADSHOULDERS_PIVOT_LOOKBACK`,
`HEADSHOULDERS_SHOULDER_TOLERANCE_PCT`,
`HEADSHOULDERS_MIN_HEAD_PROMINENCE_RATIO`, pattern-bar/neckline limits,
`HEADSHOULDERS_ENTRY_MODE`, `HEADSHOULDERS_TARGET_HEIGHT_PCT*` и
`HEADSHOULDERS_STOP_BUFFER_HEIGHT_PCT`.

В текущем default включен short и выключен long; inverse-pattern longs нужно
включать явно после отдельной проверки.
