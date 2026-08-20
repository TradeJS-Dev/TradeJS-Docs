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

## Live Diagnostics

The app shows strategy analytics, loss streaks, order details, and replay
comparisons. Use these views to explain behavior and monitor risk, not as proof
that a strategy is ready for automated execution.
