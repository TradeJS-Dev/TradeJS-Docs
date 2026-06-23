---
title: Use AI/ML workflows
---

AI and ML in TradeJS are optional research and gating layers.

Use them to analyze and compare strategy decisions. Do not treat them as proof that a strategy will work live.

## AI Flow

```bash
npx @tradejs/cli backtest --config TrendLine:base --ai
npx @tradejs/cli ai-export
npx @tradejs/cli ai-train -n 50 --minQuality 4
```

Recent source changes added deterministic local gate research and AI pocket search workflows:

```bash
npx @tradejs/cli ai-train --localOnly
npx @tradejs/cli ai-pocket-search --strategy TrendLine
```

## ML Flow

```bash
npx @tradejs/cli backtest --config TrendLine:base --ml
npx @tradejs/cli ml-export
npx @tradejs/cli ml-inspect
npx @tradejs/cli ml-train:latest
```

## Read Next

- [AI runtime and configuration](../ai-ml/ai/configuration)
- [AI filter validation](../ai-ml/ai/prompt-replay)
- [ML pipeline and configuration](../ai-ml/ml/configuration)
- [Backtesting caveats](../limitations/backtesting-caveats)
