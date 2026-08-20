---
title: Стратегия
---

Стратегия — это правила принятия решений в TradeJS.

На каждой свече стратегия выбирает одно из действий:

- `skip` — ничего не делать и при необходимости записать причину;
- `entry` — создать сигнал и план ордера;
- `exit` — закрыть позицию или изменить управление ею.

Среда исполнения загружает рыночные данные, добавляет индикаторы и необязательные
AI/ML-оценки, применяет риск-контроли, взаимодействует с коннектором и сохраняет
результаты.

## Стратегии на TypeScript

Обычно стратегия использует `StrategyAPI` и возвращает решения через
`strategyApi.skip(...)`, `strategyApi.entry(...)` и `strategyApi.exit(...)`.

TypeScript подходит для типизированных параметров, собственных конечных
автоматов, графических элементов и глубокой интеграции со средой исполнения.

## Стратегии на основе Pine Script

TradeJS также может выполнять модули, в которых исходный код Pine хранится в
отдельном файле `.pine`, а TypeScript управляет его работой и интеграцией.

Этот вариант подходит для переноса или сравнения существующих идей из Pine
Script.

## Встроенные стратегии

Стандартный набор `@tradejs/base` устанавливает 21 стратегию:

- `Breakout`, `TrendLine`, `ReverseTrendLine`, `TrendShift`, `TrendFollow`;
- `DoubleTap`, `LiquidityTails`, `LiquidityZones`, `StructureZones`;
- `AdaptiveTrendChannel`, `AdaptiveMomentumRibbon`, `MaStrategy`;
- `VolumeDivergence`, `MarketFlushReversal`, `VolatilityCompressionBreakout`;
- `RelativeRotation`, `CupAndHandle`, `HeadAndShoulders`;
- `Grid`, `GridClassic`, `HyperliquidConsensus`.

TrendLine и ReverseTrendLine входят в общий пакет
`@tradejs/strategy-trend-line`; остальные стратегии поставляются отдельными
пакетами. Встроенные стратегии служат рабочими примерами, но их параметры всё
равно требуют вашей независимой проверки.

См. [каталог встроенных стратегий](../strategies/reference) с требованиями к
данным и подробным описанием.

## Дальше

- [Создание простой стратегии](../guides/create-simple-strategy)
- [Примеры](../examples)
- [Подробная разработка стратегий](../strategies/authoring/write-strategies)
