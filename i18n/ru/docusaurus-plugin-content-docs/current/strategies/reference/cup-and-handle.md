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
   `CUPHANDLE_REQUIRE_PATH_QUALITY` может дополнительно требовать, чтобы обе
   стороны чашки прогрессировали более чем на половине сравнимых закрытий.
3. Входит по `breakout`, `close_acceptance` или `retest` из `CUPHANDLE_ENTRY_MODE`.
4. Опционально требует relative breakout volume.
5. Проверяет `minRiskRatio` стороны и size от `MAX_LOSS_VALUE`.

Ключевые настройки: `CUPHANDLE_PIVOT_LOOKBACK`,
`CUPHANDLE_RIM_TOLERANCE_PCT`, `CUPHANDLE_MIN_CUP_DEPTH_ATR`,
`CUPHANDLE_MIN/MAX_CUP_BARS`, `CUPHANDLE_MIN/MAX_HANDLE_BARS`,
`CUPHANDLE_ENTRY_MODE`, `CUPHANDLE_TARGET_DEPTH_PCT` и
`CUPHANDLE_STOP_BUFFER_DEPTH_PCT`. Optional filters:
`CUPHANDLE_REQUIRE_PATH_QUALITY` и `CUPHANDLE_MIN_BREAKOUT_VOLUME_REL20`.

При deterministic `AI_MODE: "gate"` локальный gate одобряет сигнал, только
когда у ближайшего resistance не менее 19 касаний, а 20-периодная beta
инструмента к ETH неотрицательна. Отсутствующие gate features дают отказ.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML, индикаторов и
размера позиции работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Комиссия | `FEE_PERCENT` | Учитывает заданную торговую комиссию при расчёте позиции и отношения доходности к риску. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста. |
| Геометрия чашки | `CUPHANDLE_PIVOT_LOOKBACK`, `CUPHANDLE_RIM_TOLERANCE_PCT`, `CUPHANDLE_MIN_CUP_DEPTH_PCT`, `CUPHANDLE_MIN_CUP_DEPTH_ATR`, `CUPHANDLE_ATR_PERIOD` | Задают экстремумы, допуск краёв, минимальную глубину чашки и шкалу ATR. |
| Время и симметрия чашки | `CUPHANDLE_MIN_CUP_BARS`, `CUPHANDLE_MAX_CUP_BARS`, `CUPHANDLE_MIN_CUP_SYMMETRY_RATIO`, `CUPHANDLE_MAX_PATTERN_AGE_BARS` | Ограничивают длительность и возраст чашки и баланс её сторон. |
| Геометрия ручки | `CUPHANDLE_MIN_HANDLE_BARS`, `CUPHANDLE_MAX_HANDLE_BARS`, `CUPHANDLE_MIN_HANDLE_DEPTH_RATIO`, `CUPHANDLE_MAX_HANDLE_DEPTH_RATIO` | Ограничивают длительность ручки и её глубину относительно чашки. |
| Качество пробоя | `CUPHANDLE_MIN_BREAKOUT_DISTANCE_ATR`, `CUPHANDLE_MAX_BREAKOUT_DISTANCE_DEPTH_RATIO`, `CUPHANDLE_MAX_BREAKOUT_DISTANCE_PCT`, `CUPHANDLE_REQUIRE_BREAKOUT_CROSS`, `CUPHANDLE_REQUIRE_PATH_QUALITY`, `CUPHANDLE_MIN_BREAKOUT_VOLUME_REL20` | Ограничивают расстояние пробоя и при необходимости требуют свежий пробой, чистую форму чашки и относительный объём. |
| Момент входа | `CUPHANDLE_ENTRY_MODE`, `CUPHANDLE_CONFIRMATION_MAX_BARS`, `CUPHANDLE_RETEST_MAX_BARS`, `CUPHANDLE_RETEST_TOLERANCE_ATR` | Выбирают вход по пробою, закреплению или повторному тесту и ограничивают окно подтверждения. |
| Цель, стоп и выход | `CUPHANDLE_TARGET_DEPTH_PCT`, `CUPHANDLE_STOP_BUFFER_DEPTH_PCT`, `CUPHANDLE_EXIT_ON_OPPOSITE_PATTERN` | Задают цель и стоп от глубины чашки и выход по противоположной модели. |
| Риск и направления | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Задают лимит убытка и включают направления с минимальным отношением доходности к риску. |
