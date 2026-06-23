---
title: Стратегия
---

Стратегия - это блок принятия решений в TradeJS.

На каждой свече стратегия возвращает:

- `skip` - ничего не делать;
- `entry` - создать сигнал и order plan;
- `exit` - закрыть или сопровождать позицию.

Общий runtime отвечает за market data flow, signal enrichment, AI/ML gates, исполнение ордеров, hooks и сохранение artifacts.

## Built-in стратегии

Актуальный каталог включает `Breakout`, `TrendLine`, `ReverseTrendLine`, `TrendShift`, `TrendFollow`, `DoubleTap`, `LiquidityTails`, `LiquidityZones`, `StructureZones`, `AdaptiveTrendChannel`, `AdaptiveMomentumRibbon`, `MaStrategy` и `VolumeDivergence`.

Это полезные примеры и research-модули, но каждый конфиг нужно проверять самостоятельно.

Дальше:

- [Создать простую стратегию](../guides/create-simple-strategy)
- [Примеры](../examples)
- [Подробно о strategy authoring](../strategies/authoring/write-strategies)
