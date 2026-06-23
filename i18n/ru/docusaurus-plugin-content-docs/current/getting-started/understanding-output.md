---
title: Как читать вывод
---

Вывод TradeJS нужен для анализа и сравнения, а не для гарантий.

## Backtest output

Бэктест обычно создает:

- progress/summary строки в консоли;
- статистику тестов в Redis;
- artifacts для orders/positions, если они доступны;
- optional AI/ML dataset chunks;
- индексы результатов для app.

## Частые метрики

- `orders` - число закрытых simulated orders.
- `wins` - положительные сделки.
- `losses` - отрицательные сделки.
- `winRate` - доля wins.
- `netProfit` - historical net result.
- `maxDrawdown` - максимальное снижение от локального пика.
- `riskRewardRatio` - отношение reward/risk, если доступно.

## Signal output

Signal обычно содержит:

- `strategy`;
- `symbol`;
- `interval`;
- `direction`;
- `timestamp`;
- `prices.currentPrice`;
- `prices.takeProfitPrice`;
- `prices.stopLossPrice`;
- `figures`;
- `indicators` и `additionalIndicators`.

## Как читать результат

Смотрите на вопросы:

- стратегия вошла там, где ожидалось?
- вход и выход объяснимы по свечам?
- метрики стабильны на разных периодах?
- комиссии, slippage и fill assumptions реалистичны?
- backtest и runtime ведут себя согласованно?

Дальше: [Ограничения бэктестинга](../limitations/backtesting-caveats).
