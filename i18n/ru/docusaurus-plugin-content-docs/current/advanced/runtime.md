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

Текущая runtime-модель:

- `signals` один раз выполняет все discovered named config scopes, если explicit flags не сужают scope;
- `signals-daemon` сохраняет bounded detector state между последовательными closed candles и безопасно rebuild-ит его после gaps/config changes;
- runtime identity включает connector, universe, account/deployment, symbol, interval, strategy и config id;
- Bybit closed candles могут приходить через persistent WebSocket с REST recovery, а dashboard использует отдельный market WebSocket gateway;
- signal/evaluation сохраняется до optional screenshots;
- runtime lineage/evidence отделяет logic/config identity от account binding и risk amount.

App показывает named runtime scopes, strategy analytics, drawdown/orders, chart
annotations и immutable evidence markers, когда соответствующие artifacts
доступны.

Связанные страницы:

- [Signals](../runtime/execution/signals)
- [Runtime parity](../runtime/backtesting/runtime-parity)
- [Debug live](../strategies/operations/debug-live)
