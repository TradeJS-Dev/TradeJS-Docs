---
sidebar_position: 10
title: Как работает и настраивается машинное обучение
description: 'Настройте ML-конвейер TradeJS от экспорта датасета из бэктестов и обучения модели до версионированных артефактов и runtime-инференса через gRPC.'
---

## Общая схема

1. Запустите бэктест с `--ml`. TradeJS запишет данные для обучения в несколько файлов.
2. Выполните `npm exec -- tradejs ml-export`, чтобы собрать их в один файл JSONL.
3. Перед обучением команда выделит контрольный период и окна для проверки на следующих датах.
4. Модель обучится в контейнере Python, который сохранит результаты проверки.
5. При расчёте сигнала TradeJS запрашивает оценку у сервиса по адресу `ML_GRPC_ADDRESS`.

## Команды

Сначала [сохраните настройки бэктеста](../../getting-started/backtest-config) под именем `TrendLine:base`.

Для обучения нужен `docker-compose.ml.yml` с сервисом `ml`. Установщик TradeJS создаёт только окружение для обычных бэктестов.

```bash
npm exec -- tradejs backtest --config TrendLine:base --ml \
  --connector binance --tickers BTCUSDT --timeframe 15 --days 90 --tests 1 --parallel 1
npm exec -- tradejs ml-export --strategy TrendLine
npm exec -- tradejs ml-inspect --strategy TrendLine
npm exec -- tradejs ml-train:latest --strategy TrendLine --model xgboost
```

## Пример `.env` для ML

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

## Форматы файлов датасета

Исходные chunk-файлы:

```text
ml-dataset-<strategy>-<chunkId>.jsonl
```

Производные split-файлы:

```text
*.holdout-train.<key>.jsonl
*.holdout-test.<key>.jsonl
*.prod.<key>.jsonl
*.walk-forward-fold-<N>.train.<key>.jsonl
*.walk-forward-fold-<N>.test.<key>.jsonl
```

## Локальная цепочка артефактов (export -> train -> signals)

1. `npm exec -- tradejs backtest --ml` пишет chunk-файлы в локальную папку проекта:
   `data/ml/export/ml-dataset-<strategy>-chunk-<chunkId>.jsonl`
2. `npm exec -- tradejs ml-export` объединяет их в:
   `data/ml/export/ml-dataset-<strategy>-merged-<timestamp>.jsonl`
3. `npm exec -- tradejs ml-train:latest` читает export-файлы из `data/ml/export` и пишет model aliases в:
   `data/ml/models/<Strategy>.joblib`
   или ensemble aliases `data/ml/models/<Strategy>.modelN.joblib`
4. ML infer сервис должен читать ту же директорию моделей (`MODEL_DIR`).
5. `npm exec -- tradejs signals` (если в конфиге стратегии `ML_ENABLED=true`) отправляет `signal.strategy` в gRPC `Predict`.
   Inference-сервис загружает `<Strategy>.joblib` / `<Strategy>.modelN.joblib` для этой стратегии.

Если имя стратегии и префикс model alias совпадают, runtime автоматически использует обученную локальную модель.

## Качество и causality

- На train есть проверка lookahead leakage.

- В runtime используется та же trim-логика фич, что и в train.

## Что есть в отчетах

Каждый train-run сохраняет markdown и HTML с:

- holdout-метриками,
- walk-forward-метриками,
- таблицами порогов,
- TOP признаков на holdout.
