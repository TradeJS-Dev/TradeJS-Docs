---
title: ML Dataset Inspection
---

Run `npm exec -- tradejs ml-inspect` to check your training data before fitting a
model.

Source:

- `@tradejs/cli`

## Quick Start

```bash
npm exec -- tradejs ml-inspect
npm exec -- tradejs ml-inspect --strategy TrendLine --rows 20000 --mode sample
npm exec -- tradejs ml-inspect --file '<path-to-export.jsonl>' --mode tail
```

## Modes

- `head`: first N rows
- `tail`: last N rows
- `sample`: reservoir random sample

## Inspect Tools

- `quick` (default): built-in numeric diagnostics
- `ydata`: HTML profile report via ydata profiling runtime

Examples:

```bash
npm exec -- tradejs ml-inspect --tool quick --rows 15000
npm exec -- tradejs ml-inspect --tool ydata --rows 20000 --mode sample
```

## What Quick Inspect Checks

For numeric fields it computes and flags:

- missing/non-finite rates
- near-constant features
- mostly-zero features
- outlier rate
- scale spread (`p99/median` and global scale mismatch)

It prints top problematic fields by score and recommended fixes.

## YData Output

`ydata` mode generates:

- `<dataset-name>.profile.html` next to source dataset

Requirements:

- `docker-compose.ml.yml` with the `ml-profile` service
- enough disk space for generated `.profile.html` report

## Useful Flags

- `--dir data/ml/export`
- `--strategy <Strategy>`
- `--file <explicit path>`
- `--rows <N>`
- `--mode head|tail|sample`
- `--limitIssues <N>`
- `--minFieldValues <N>`
- `--tool quick|ydata`
