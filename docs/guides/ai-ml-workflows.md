---
title: Use AI and ML
---

AI and ML are optional analysis and order-filtering layers. They do not replace
strategy rules, data validation, or risk management.

## Evaluate an AI Gate

```bash
npx @tradejs/cli backtest --config TrendLine:base --ai
npx @tradejs/cli ai-export
npx @tradejs/cli ai-train -n 50 --minQuality 4
```

You can also evaluate a deterministic local gate without provider calls and
search feature subsets:

```bash
npx @tradejs/cli ai-train --localOnly
npx @tradejs/cli ai-pocket-search --strategy TrendLine
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

```bash
npx @tradejs/cli backtest --config TrendLine:base --ml
npx @tradejs/cli ml-export
npx @tradejs/cli ml-inspect
npx @tradejs/cli ml-train:latest
```

Split training and validation chronologically, exclude future information,
version the feature definition, and monitor degradation after release.

## Read Next

- [AI configuration](../ai-ml/ai/configuration)
- [AI filter validation](../ai-ml/ai/prompt-replay)
- [ML pipeline and configuration](../ai-ml/ml/configuration)
- [Backtesting caveats](../limitations/backtesting-caveats)
