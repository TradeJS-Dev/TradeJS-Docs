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

Strategies can also use historical global-market, derivatives, spread, and
on-chain context. Treat these as optional inputs and apply the same timestamp
discipline as candles: a decision may use only information available at its
decision time.

## Data Quality

Backtest quality depends on:

- exchange/provider coverage
- gaps and duplicate candles
- timestamp alignment
- volume correctness
- spread and derivatives context availability

See [Backtesting caveats](../limitations/backtesting-caveats).
