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

Evaluate sample size, returns after costs, drawdown, period stability, and
overfitting risk—not only the approval rate.

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
