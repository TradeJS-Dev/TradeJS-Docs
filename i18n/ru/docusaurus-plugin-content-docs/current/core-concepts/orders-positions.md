---
title: Ордера / позиции
---

Orders и positions относятся к execution layer. Стратегия предлагает `orderPlan`, а runtime и connector решают, что реально можно исполнить.

Entry decision обычно задает:

- `direction`;
- `qty`;
- `stopLossPrice`;
- take-profit prices.

Позиция может закрываться через TP, SL, `exit`, runtime hook или exchange/connector status.

Backtest fills - это приближение. Live fills зависят от ликвидности, latency, типа ордера и поведения connector.

Перед automation проверьте size, fees, slippage, connector errors и rollback path.
