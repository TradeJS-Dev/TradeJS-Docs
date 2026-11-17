---
title: Use AI and ML
---

TradeJS can use AI or a trained model to check a strategy's entry. Compare
results with and without the extra check before enabling it for a running
strategy.

## Evaluate an AI Gate

First [save a backtest configuration](../getting-started/backtest-config) as `TrendLine:base`.

```bash
npm exec -- tradejs backtest --config TrendLine:base --ai \
  --connector binance --tickers BTCUSDT --timeframe 15 --days 90 --tests 1 --parallel 1
npm exec -- tradejs ai-export --strategy TrendLine
npm exec -- tradejs ai-train --strategy TrendLine -n 50 --minQuality 4
```

You can also evaluate a deterministic local gate without provider calls and
search feature subsets:

```bash
npm exec -- tradejs ai-train --strategy TrendLine --localOnly
npm exec -- tradejs ai-pocket-search --strategy TrendLine
```

Pocket search reserves the last 40% of timestamp groups by default and seals
them from discovery. Search uses the first 60%; three blocks inside that period
check development stability. Freeze rules before opening the test once.

For comparisons across exports, freeze one calendar boundary with
`--testSince 2026-09-01T00:00:00Z --validationSplit 0 --sealTest`. The date is an
example; choose it before searching. Decisions at or after the boundary belong
to test. Earlier decisions whose exits cross the boundary, or whose exit time
is unknown, are excluded from development to prevent outcome leakage.

The approval rate alone is not enough. Evaluate sample size, returns after
costs, drawdown, period stability, and overfitting risk.

## Prepare an ML Model

Use the same saved `TrendLine:base` configuration. Training needs a `docker-compose.ml.yml` file with an `ml` service. The standard installer sets up the regular backtest environment.

```bash
npm exec -- tradejs backtest --config TrendLine:base --ml \
  --connector binance --tickers BTCUSDT --timeframe 15 --days 90 --tests 1 --parallel 1
npm exec -- tradejs ml-export --strategy TrendLine
npm exec -- tradejs ml-inspect --strategy TrendLine
npm exec -- tradejs ml-train:latest --strategy TrendLine
```

Split training and validation chronologically, exclude future information,
version the feature definition, and monitor degradation after release.

## Read Next

- [AI configuration](../ai-ml/ai/configuration)
- [AI filter validation](../ai-ml/ai/prompt-replay)
- [ML pipeline and configuration](../ai-ml/ml/configuration)
- [Backtesting caveats](../limitations/backtesting-caveats)
