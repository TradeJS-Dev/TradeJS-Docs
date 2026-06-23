---
title: Candles / market data
---

TradeJS strategies normally operate on candles: open, high, low, close, volume, and timestamp for a symbol and interval.

The common workflow is:

1. A connector loads or updates candle history.
2. Indicators and market context are computed from historical candles.
3. The runtime gives each strategy the current closed candle.
4. The strategy returns `skip`, `entry`, or `exit`.

## Closed Candles Matter

Runtime signal scans are designed around closed candles. Acting on still-forming candles can create unstable or misleading decisions.

## Context Data

Recent source changes added more context around runtime and backtests, including CoinMarketCap historical context, derivatives context, and onchain context support. Treat these as optional enrichment inputs. They should remain causality-safe: a strategy decision should only use data available at the decision timestamp.

## Data Quality

Backtest quality depends on:

- exchange/provider coverage
- gaps and duplicate candles
- timestamp alignment
- volume correctness
- spread and derivatives context availability

See [Backtesting caveats](../limitations/backtesting-caveats).
