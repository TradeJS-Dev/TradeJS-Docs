---
title: Data quality guide
---

Backtest and runtime quality depends on the data path before the strategy sees a candle.

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
npx @tradejs/cli backtest --updateOnly --connector bybit --timeframe 15
```

Run from cache only after data is prepared:

```bash
npx @tradejs/cli backtest --cacheOnly --config TrendLine:base --tickers BTCUSDT --timeframe 15
```

Check continuity for a provider/timeframe:

```bash
npx @tradejs/cli continuity --user root --timeframe 15 --provider bybit
```

Run signals without refreshing data:

```bash
npx @tradejs/cli signals --cacheOnly --tickers BTCUSDT --timeframe 15
```

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
6. Compare replay/runtime parity before enabling automation.

Related:

- [Backtesting caveats](../limitations/backtesting-caveats)
- [Backtest a strategy](./backtest-strategy)
- [Runtime parity](../runtime/backtesting/runtime-parity)
