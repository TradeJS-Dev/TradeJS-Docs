---
title: Limitations
---

TradeJS is a research, backtesting, signal, and automation framework. It does not remove market, execution, or operational risk.

## Recommended Timeframes

Use candle-based workflows on `5m+` timeframes. Many examples use `15m`.

TradeJS is not designed for high-frequency trading.

## Not For HFT

TradeJS does not optimize for microsecond latency, colocated order routing, order book event simulation, or exchange-specific HFT execution.

## Backtesting Caveats

Backtests are historical simulations. They depend on data quality, assumptions, and implementation details.

Read [Backtesting caveats](./backtesting-caveats) before interpreting results.

## Data Quality

Bad data can make a strategy look better or worse than it is. Check gaps, duplicates, symbol mapping, timestamp alignment, provider differences, and derived context coverage.

## Fees and Slippage

Fees and slippage can materially change results. Model them explicitly where possible, and compare backtest assumptions with observed runtime fills.

## No Guarantees

Do not describe strategies as certain to produce future returns. Use TradeJS to research, test, compare, automate, and analyze.
