---
title: Metrics
---

Metrics help you compare historical behavior. They do not predict future performance.

Common metrics:

- `orders`: closed historical orders
- `wins` and `losses`: positive and negative closed outcomes
- `winRate`: win share among closed orders
- `netProfit`: net result in the run output
- `maxDrawdown`: largest historical decline from a previous peak
- `riskRewardRatio`: average reward/risk relationship when available

## How To Use Metrics

Use metrics to compare:

- strategy versions
- config variants
- symbols
- time windows
- runtime vs backtest behavior
- AI/ML gate changes

Do not optimize only one number. A high net result on one short window can be overfit, data-dependent, or caused by unrealistic execution assumptions.

## Recent Runtime Metrics

The current app and runtime have more strategy-card and order-drawer metrics than early versions, including runtime strategy analytics, loss streak display, and replay/parity reports. Use those views as diagnostics, not as proof that a strategy is ready for live automation.
