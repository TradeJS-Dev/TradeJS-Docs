---
title: Ограничения
---

TradeJS - framework для research, backtesting, signals и automation. Он не убирает market, execution и operational risk.

## Таймфреймы

Используйте candle-based workflows на `5m+`. Многие примеры используют `15m`.

TradeJS не предназначен для HFT.

## Backtesting caveats

Бэктесты зависят от data quality, assumptions и реализации.

Прочитайте [Ограничения бэктестинга](./backtesting-caveats) перед интерпретацией результатов.

## Fees и slippage

Комиссии и проскальзывание могут materially изменить результаты. Моделируйте их явно и сравнивайте assumptions с runtime fills.

## Без гарантий

Не описывайте стратегии как способ получить будущий доход. Используйте TradeJS для research, test, compare, automate и analyze.
