---
title: Runtime
---

Runtime исполняет strategy decisions на market data.

Где возможно, backtests, replay, signals и automation используют общий runtime path. Это важно для parity: стратегия не должна иметь разные decision paths без явной причины.

Runtime:

- загружает config и plugins;
- готовит market data/context;
- вызывает strategy logic на closed candles;
- enrichment signals через indicators/AI/ML;
- применяет gates;
- размещает или пропускает orders;
- сохраняет signals, evaluations, orders и diagnostics.

Недавние изменения улучшили strategy config drawer, runtime analytics, replay/runtime comparison, slippage telemetry и AI/ML diagnostics.

Связанные страницы:

- [Signals](../runtime/execution/signals)
- [Runtime parity](../runtime/backtesting/runtime-parity)
- [Debug live](../strategies/operations/debug-live)
