---
title: Data quality guide
---

If a run looks wrong, check the candles before changing the strategy. Use these
checks when you compare runs or add a data source.

Use this checklist when results look suspicious, when adding a connector, or before comparing strategies.

## What To Validate

- Candle continuity: no large gaps in the tested interval.
- Duplicate candles: no repeated timestamp for the same symbol/provider/interval.
- Timestamp alignment: context rows must be at or before the strategy candle timestamp.
- Provider identity: do not mix exchange/provider data without knowing which source produced the candles.
- Symbol mapping: `BTCUSDT`, `BTC-USD`, and provider-specific ids are not automatically equivalent.
- Volume fields: base volume, quote turnover, taker volume, and derived values can mean different things by provider.
- Derived context: CMC, derivatives, global market, spread, and onchain rows can be missing or stale.

## Data Flow

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

The strategy should only receive data available at the decision timestamp.

## Useful Commands

Update history without running tests:

```bash
npm exec -- tradejs backtest --updateOnly --config MaStrategy:base --connector bybit \
  --tickers BTCUSDT --timeframe 15
```

Run from cache only after data is prepared:

```bash
npm exec -- tradejs backtest --cacheOnly --config MaStrategy:base --connector bybit \
  --tickers BTCUSDT --timeframe 15 --days 7 --tests 1 --parallel 1
```

To reload a series with a gap, see [data sync](../getting-started/data-sync).


## Context Data

TradeJS can enrich strategies with:

- BTC reference candles
- Binance/Coinbase spread context
- CoinMarketCap global/index context
- Coinalyze derivatives context
- onchain context

These data sources are optional and may have different coverage than candle history. If a strategy gate depends on one of them, inspect missing coverage before interpreting skips or trades.

## Causality Rules

Do:

- use closed candles
- align context at or before the evaluated candle
- separate signal-time features from outcome fields
- keep ML/AI feature extraction free of future labels

Do not:

- use the still-forming newest candle for decisions
- align BTC/reference/context data to a future row
- use realized exit price, PnL, or final trade status as an input to the same signal
- compare runtime and backtest without checking fill timing assumptions

## Provider And Cache Modes

`--updateOnly` refreshes data and stops before tests.

`--cacheOnly` uses cached data and avoids network refresh. It is useful for repeatable runs, but only after you know the cache is complete enough for the target period.

If you compare two strategies, keep provider, timeframe, date window, cache mode, and context settings the same.

## Before Trusting A Result

1. Run a narrow backtest for one symbol.
2. Inspect chart figures and trade timestamps.
3. Check continuity and missing context coverage.
4. Repeat with `--cacheOnly` to confirm determinism.
5. Expand symbols and date windows.
6. Compare replayed and live decisions before enabling automation.

Related:

- [Backtesting caveats](../limitations/backtesting-caveats)
- [Backtest a strategy](../runtime/backtesting/overview)
- [Compare live and replayed entries](../runtime/backtesting/runtime-parity)
