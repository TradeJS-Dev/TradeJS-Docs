---
sidebar_position: 10
title: ML Pipeline and Configuration
description: 'Configure the TradeJS machine-learning pipeline from backtest dataset export and model training to versioned artifacts and runtime inference over gRPC.'
---

## Main Flow

1. Run a backtest with `--ml` to save training data in several files.
2. Run `npm exec -- tradejs ml-export` to combine the files into one JSONL file.
3. The training command separates a holdout period and later evaluation windows.
4. A Python container trains the model and saves the evaluation reports.
5. When evaluating a signal, TradeJS can ask the service at `ML_GRPC_ADDRESS` for a score.

## Commands

First [save a backtest configuration](../../getting-started/backtest-config) as `TrendLine:base`.

Training needs a `docker-compose.ml.yml` file with an `ml` service. The standard installer sets up the regular backtest environment.

```bash
npm exec -- tradejs backtest --config TrendLine:base --ml \
  --connector binance --tickers BTCUSDT --timeframe 15 --days 90 --tests 1 --parallel 1
npm exec -- tradejs ml-export --strategy TrendLine
npm exec -- tradejs ml-inspect --strategy TrendLine
npm exec -- tradejs ml-train:latest --strategy TrendLine --model xgboost
```

## Useful `.env` Example

```env
ML_GRPC_ADDRESS=127.0.0.1:50051
ML_TRAIN_RECENT_DAYS=60
ML_TRAIN_TEST_DAYS=30
ML_TRAIN_WALK_FORWARD_FOLDS=2
ML_TRAIN_FEATURE_PROFILE=all
ML_TRAIN_FEATURE_SET=enriched
ML_TRAIN_ENSEMBLE=1
ML_TRAIN_ENSEMBLE_MEMBERS=3
```

## Dataset File Patterns

Source chunk files:

```text
ml-dataset-<strategy>-<chunkId>.jsonl
```

Derived split files (generated automatically):

```text
*.holdout-train.<key>.jsonl
*.holdout-test.<key>.jsonl
*.prod.<key>.jsonl
*.walk-forward-fold-<N>.train.<key>.jsonl
*.walk-forward-fold-<N>.test.<key>.jsonl
```

## Local Artifact Chain (Export -> Train -> Signals)

1. `npm exec -- tradejs backtest --ml` writes chunk files to local project folder:
   `data/ml/export/ml-dataset-<strategy>-chunk-<chunkId>.jsonl`
2. `npm exec -- tradejs ml-export` merges chunks into:
   `data/ml/export/ml-dataset-<strategy>-merged-<timestamp>.jsonl`
3. `npm exec -- tradejs ml-train:latest` reads export files from `data/ml/export` and writes model aliases to:
   `data/ml/models/<Strategy>.joblib`
   or ensemble aliases `data/ml/models/<Strategy>.modelN.joblib`
4. ML infer service must read the same model directory (`MODEL_DIR`).
5. `npm exec -- tradejs signals` (with strategy config `ML_ENABLED=true`) sends `signal.strategy` to gRPC `Predict`.
   Inference service loads `<Strategy>.joblib` / `<Strategy>.modelN.joblib` for that strategy.

If strategy name and model alias prefix match, runtime automatically uses the trained local model.

## Quality and Causality

- Train validates lookahead leakage on timestamp-like fields.

- Runtime inference uses the same feature trimming policy as train.

## Reports

Each train run saves markdown and HTML reports with:

- holdout metrics,
- walk-forward metrics,
- threshold tables,
- holdout TOP feature table.
