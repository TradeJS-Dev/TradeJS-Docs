---
title: Signals
---

A signal records a trading opportunity that a strategy found. Check the order
separately to see whether TradeJS sent it and the exchange filled it.

Signals usually contain:

- strategy name
- symbol
- interval
- direction (`LONG` or `SHORT`)
- timestamp
- current, take-profit, and stop-loss prices
- figures for chart inspection
- indicators and additional context

Signals are created by strategy `entry` decisions. Runtime can enrich them with AI/ML analysis, persist them, notify operators, and optionally place orders.

## Signals Are Not Orders

A signal describes a decision. An order is a later execution action that may be blocked by config, policy, AI/ML gates, connector failures, or risk controls.

## Runtime Scans

The server evaluates signals after candles close. Use **Strategies** to check
status and open a chart to inspect recorded signals.
[How the server evaluates signals](../runtime/execution/signals).
