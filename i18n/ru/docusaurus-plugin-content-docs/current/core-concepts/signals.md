---
title: Сигналы
---

Signal - это runtime-запись о возможности, найденной стратегией.

Обычно signal содержит:

- `strategy`;
- `symbol`;
- `interval`;
- `direction`;
- `timestamp`;
- цены входа, take-profit и stop-loss;
- `figures` для графика;
- `indicators` и дополнительный context.

Signal не равен order. Ордер может быть заблокирован конфигом, policy, AI/ML gate, connector error или risk control.

Примеры:

```bash
npx @tradejs/cli signals --tickers BTCUSDT --timeframe 15 --cacheOnly
npx @tradejs/cli signals --notify
npx @tradejs/cli signals --makeOrders
```

`--makeOrders` используйте только после проверки стратегии и рисков.
