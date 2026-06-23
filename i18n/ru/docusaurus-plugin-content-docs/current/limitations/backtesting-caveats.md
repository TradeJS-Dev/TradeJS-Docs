---
title: Ограничения бэктестинга
---

Backtests полезны, но не доказывают будущий результат.

Используйте их для research, test, compare и analyze поведения стратегии при явных assumptions.

## Комиссии

Каждая сделка может платить exchange fees. Частая стратегия с маленькими движениями может выглядеть нормально до fees и плохо после fees.

## Проскальзывание

Backtest price - приближение. Live orders могут исполняться хуже из-за spread, latency, order book depth, volatility и order type.

В TradeJS есть slippage telemetry и execution calibration, но assumptions все равно нужно сравнивать с реальными fills.

## Качество данных

Проблемы:

- missing candles;
- duplicate candles;
- wrong volume;
- provider-specific symbol mapping;
- timestamp alignment issues;
- неполное покрытие derivatives/global/onchain context.

## Look-ahead bias

Look-ahead bias возникает, когда решение использует данные, которых не было на момент свечи.

Источники:

- still-forming candle;
- future-aligned context;
- outcome fields как signal-time features;
- ML leakage.

## Overfitting

Признаки overfitting:

- слишком много параметров;
- один symbol или короткий период;
- выбор лучшего окна после факта;
- отсутствие out-of-sample/walk-forward checks;
- изменение risk settings после просмотра результатов.

## Checklist

- проверьте chart figures и trade logs;
- проверьте data continuity;
- учтите fees;
- смоделируйте или измерьте slippage;
- тестируйте разные окна и symbols;
- сравните runtime/replay behavior;
- держите risk limits консервативными.

Хороший backtest result - input для исследования, а не обещание live results.
