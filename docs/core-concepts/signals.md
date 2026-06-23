---
title: Signals
---

A signal is the runtime record of a strategy opportunity.

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

`npx @tradejs/cli signals` evaluates configured runtime strategies against the selected ticker universe. Useful flags include:

```bash
npx @tradejs/cli signals --tickers BTCUSDT --timeframe 15 --cacheOnly
npx @tradejs/cli signals --notify
npx @tradejs/cli signals --makeOrders
```

Use `--makeOrders` only after validating strategy behavior and risk controls.
