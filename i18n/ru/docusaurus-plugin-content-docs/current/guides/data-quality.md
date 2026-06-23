---
title: Качество данных
---

Качество backtest/runtime зависит от data path до того, как стратегия увидит свечу.

Используйте этот checklist, когда результаты выглядят странно, при добавлении connector или перед сравнением стратегий.

## Что проверять

- Candle continuity: нет больших gaps на нужном interval.
- Duplicate candles: нет повторных timestamp для одного symbol/provider/interval.
- Timestamp alignment: context rows должны быть at or before strategy candle timestamp.
- Provider identity: не смешивайте разные sources без понимания происхождения candles.
- Symbol mapping: `BTCUSDT`, `BTC-USD` и provider-specific ids не всегда эквивалентны.
- Volume fields: base volume, quote turnover, taker volume и derived values могут различаться по provider.
- Derived context: CMC, derivatives, global market, spread и onchain rows могут отсутствовать или быть stale.

## Data flow

```text
exchange / provider
        |
        v
connector fetch
        |
        v
cache / Timescale
        |
        v
closed candle window
        |
        v
indicator + market context builders
        |
        v
strategy decision
```

Стратегия должна получать только данные, доступные на timestamp решения.

## Полезные команды

Обновить историю без запуска tests:

```bash
npx @tradejs/cli backtest --updateOnly --connector bybit --timeframe 15
```

Запуск из cache после подготовки данных:

```bash
npx @tradejs/cli backtest --cacheOnly --config TrendLine:base --tickers BTCUSDT --timeframe 15
```

Проверить continuity:

```bash
npx @tradejs/cli continuity --user root --timeframe 15 --provider bybit
```

Signals без refresh:

```bash
npx @tradejs/cli signals --cacheOnly --tickers BTCUSDT --timeframe 15
```

## Context data

TradeJS может добавлять:

- BTC reference candles;
- Binance/Coinbase spread context;
- CoinMarketCap global/index context;
- Coinalyze derivatives context;
- onchain context.

Эти sources optional и могут иметь другое coverage, чем candle history. Если strategy gate зависит от них, проверьте missing coverage перед выводами.

## Causality rules

Нужно:

- использовать closed candles;
- align context at or before evaluated candle;
- отделять signal-time features от outcome fields;
- не пропускать future labels в ML/AI features.

Нельзя:

- принимать решения по still-forming newest candle;
- align BTC/reference/context data на future row;
- использовать realized exit price, PnL или final trade status как input того же signal;
- сравнивать runtime/backtest без проверки fill timing assumptions.

## Cache modes

`--updateOnly` обновляет данные и не запускает tests.

`--cacheOnly` использует cache без network refresh. Это удобно для repeatable runs, но только после проверки полноты cache.

При сравнении стратегий держите одинаковыми provider, timeframe, date window, cache mode и context settings.

## Перед доверием к результату

1. Запустите narrow backtest на одном symbol.
2. Проверьте figures и trade timestamps.
3. Проверьте continuity и missing context coverage.
4. Повторите с `--cacheOnly`.
5. Расширьте symbols/date windows.
6. Сравните replay/runtime parity перед automation.

Связанные страницы:

- [Ограничения бэктестинга](../limitations/backtesting-caveats)
- [Бэктест стратегии](./backtest-strategy)
- [Runtime parity](../runtime/backtesting/runtime-parity)
