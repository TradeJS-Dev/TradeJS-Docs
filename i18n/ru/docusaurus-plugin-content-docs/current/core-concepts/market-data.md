---
title: Свечи / market data
---

Стратегии TradeJS обычно работают со свечами: open, high, low, close, volume и timestamp для symbol/interval.

Типичный поток:

1. Connector загружает или обновляет историю.
2. Индикаторы и context считаются по свечам.
3. Runtime передает стратегии текущую закрытую свечу.
4. Стратегия возвращает `skip`, `entry` или `exit`.

## Закрытые свечи

Runtime signal scans ориентированы на закрытые свечи. Работа по еще формирующейся свече может давать нестабильные решения.

## Context data

В актуальном source project есть исторический CMC context, derivatives context и onchain context. Это enrichment inputs, которые должны оставаться causal: решение стратегии использует только данные, доступные на момент свечи.

См. [Ограничения бэктестинга](../limitations/backtesting-caveats).
