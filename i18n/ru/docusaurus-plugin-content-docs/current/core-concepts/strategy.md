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

Непустой preset `@tradejs/base` устанавливает независимые пакеты для 21
стратегии: `Breakout`, `TrendLine`,
`ReverseTrendLine`, `TrendShift`, `TrendFollow`, `DoubleTap`, `LiquidityTails`,
`LiquidityZones`, `StructureZones`, `AdaptiveTrendChannel`,
`AdaptiveMomentumRibbon`, `MaStrategy`, `VolumeDivergence`,
`MarketFlushReversal`, `VolatilityCompressionBreakout`, `RelativeRotation`,
`CupAndHandle`, `HeadAndShoulders`, `Grid`, `GridClassic` и
`HyperliquidConsensus`.

TrendLine и ReverseTrendLine используют общий
`@tradejs/strategy-trend-line`; у каждой другой стратегии свой пакет и
репозиторий. Это полезные примеры и research-модули, но каждый конфиг нужно
проверять самостоятельно.

Сгруппированный список и требования к данным приведены в
[каталоге встроенных стратегий](../strategies/reference).

Дальше:

- [Создать простую стратегию](../guides/create-simple-strategy)
- [Примеры](../examples)
- [Подробно о strategy authoring](../strategies/authoring/write-strategies)
