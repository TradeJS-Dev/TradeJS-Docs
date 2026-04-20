---
title: AI Filter Validation on Backtest Data
---

TradeJS can turn AI-enabled backtests into reusable datasets for AI filter validation.

Instead of treating AI review as a live-only gate, you can capture replayable AI rows during backtests and run the same historical trades through updated prompts, models, and approval thresholds later.

This replay is historical, not provider-free. By default, `ai-train` sends prompt requests to the configured AI provider again; only `--localOnly` switches replay into a deterministic local mode without provider calls.

## Why It Matters

- Iterate on prompt behavior without rerunning the full market simulation every time.
- Compare models, providers, and quality thresholds on the same historical sample.
- Measure false accepts and false rejects before changing live AI gating.
- Keep AI evaluation attached to realized trade outcomes, not synthetic examples.

## What TradeJS Records During Backtests

When AI dataset export is enabled in backtests, TradeJS writes per-trade rows with:

- signal identity, symbol, direction, and timestamp
- strategy name
- structured AI payload used to rebuild strategy prompts later
- realized trade profit for historical scoring
- optional test metadata for backtest traceability

Rows are written into per-worker chunk files and later merged into one replay dataset.

## How It Works

1. Run a backtest with AI dataset export enabled.
2. Merge worker chunk files into one timestamped dataset.
3. Replay that dataset through the current AI prompt logic.
4. Compare approval decisions against realized outcomes before changing live gating.

During replay, TradeJS rebuilds the strategy prompt pair from the saved signal and payload context, so prompt and adapter changes can be evaluated on the same historical sample.

## Reproducible CLI Flow

```bash
npx @tradejs/cli backtest --config TrendLine:base --ai
npx @tradejs/cli ai-export
npx @tradejs/cli ai-train -n 50 --minQuality 4
```

Artifacts:

- `backtest --ai` writes `data/ai/export/ai-dataset-<strategy>-chunk-<chunkId>.jsonl`
- `ai-export` merges them into `data/ai/export/ai-dataset-<strategy>-merged-<timestamp>.jsonl`
- `ai-train` replays rows from the latest merged file by default

Important:

- default replay still calls your configured AI provider
- `--localOnly` is the provider-free deterministic gate mode

Useful `ai-train` flags:

- `-n, --recent` evaluate the latest N trades from the end (`0` = all rows)
- `--minQuality` minimum AI quality threshold required to approve entry
- `-s, --strategy` pick the latest merged file for one strategy
- `-f, --file` replay a specific merged dataset file

## What You Can Validate

- prompt changes in strategy `aiAdapter`
- provider or model changes
- `minQuality` threshold tuning
- agreement with the original strategy direction
- `tp / fp / tn / fn` behavior for approval vs realized profitability
- deterministic local gate experiments with `--localOnly`

## How `ai-train` Scores Approval

- a trade is approved only when AI returns the same direction as the original signal and `quality >= minQuality`
- historical correctness is measured against realized trade outcome (`profit > 0`)

## Core Metrics

- approval rate
- precision by quality bucket
- impact on net expectancy proxy
- disagreement rate with strategy direction
- `tp / fp / tn / fn` counts for approval vs realized profitability

## Cost-Saving Option

For cost-sensitive manual review loops, some teams run and inspect `ai-train` from coding agents such as OpenAI Codex or Claude Code instead of building every replay iteration around raw API calls in their own tooling.

This can make prompt-review cycles faster, and depending on your plan, included limits, and usage pattern, it can sometimes be cheaper than running the same workflow through direct per-request API usage. Treat that as an operational option, not a guaranteed pricing advantage, and verify current pricing for your Codex, Claude Code, and provider plans before standardizing the workflow.

## Recommended Evaluation Flow

1. Change prompt logic or adapter rules in code.
2. Replay the same historical rows.
3. Check whether approval coverage and realized quality improve.
4. Promote the new gate only after the tradeoff is defensible.

That makes AI gating auditable, repeatable, and easier to discuss with strategy authors than ad-hoc prompt testing.

## See Also

- [AI Runtime and Configuration](./configuration)
- [AI Prompt Governance](./prompt-governance)
