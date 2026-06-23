---
title: AI/ML workflows
---

AI и ML в TradeJS - optional research/gating layers.

Используйте их для анализа и сравнения strategy decisions. Не воспринимайте их как доказательство будущего результата.

## AI flow

```bash
npx @tradejs/cli backtest --config TrendLine:base --ai
npx @tradejs/cli ai-export
npx @tradejs/cli ai-train -n 50 --minQuality 4
```

В актуальном source project есть deterministic local gate research и AI pocket search:

```bash
npx @tradejs/cli ai-train --localOnly
npx @tradejs/cli ai-pocket-search --strategy TrendLine
```

## ML flow

```bash
npx @tradejs/cli backtest --config TrendLine:base --ml
npx @tradejs/cli ml-export
npx @tradejs/cli ml-inspect
npx @tradejs/cli ml-train:latest
```

Подробнее:

- [AI configuration](../ai-ml/ai/configuration)
- [AI filter validation](../ai-ml/ai/prompt-replay)
- [ML configuration](../ai-ml/ml/configuration)
