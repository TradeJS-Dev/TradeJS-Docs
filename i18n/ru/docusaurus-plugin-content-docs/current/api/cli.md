---
sidebar_position: 6
title: CLI API
---

CLI в TradeJS предоставляется пакетом `@tradejs/cli`.
После установки пакета запускайте команды так:

```bash
npx @tradejs/cli <command> [flags]
```

Для точного синтаксиса текущей версии используйте command-level help:

```bash
npx @tradejs/cli backtest --help
```

## Карта команд

Setup и диагностика:

- `doctor` - проверяет обязательные сервисы и опциональную ML-связность.
- `infra-init` - инициализирует локальное infrastructure state.
- `infra-up` / `infra-down` - запускает или останавливает локальную инфраструктуру.
- `server-health` - проверяет health сервисов.
- `user-add` - создает user config.
- `migration` - запускает migration tasks.

Research и backtesting:

- `backtest` - запускает strategy backtests или обновляет market cache.
- `results` - смотрит, merge/update/clear selected strategy results в Redis.
- `runtime-parity` - сверяет runtime entries с deterministic backtest replay.
- `replay` - replay сохраненных runtime данных.
- `runtime-evidence` - собирает runtime evidence.
- `replay-runtime-evidence` - replay собранного runtime evidence.
- `execution-calibration` - проверяет runtime execution assumptions.

Runtime и signals:

- `signals` - оценивает runtime strategies на последней закрытой свече.
- `signals-summary` - собирает summary по recent runtime signal/order state.
- `bot` - запускает Telegram bot.

`research:auto` и `agent-run` — maintainer workflows основного source repo, а
не поддерживаемые команды для внешнего package-flow. Поэтому они намеренно не
включены в этот публичный command map, хотя их launchers пока входят в пакет.

Market data и maintenance:

- `continuity` - проверяет или чинит candle continuity.
- `binance:market-ingest` - ingest Binance market data.
- `candles:migrate-provider` - мигрирует candle provider naming.
- `derivatives:ingest` - ingest derivatives context.
- `derivatives:ingest:coinalyze:all` - ingest Coinalyze derivatives context для всех configured targets.
- `spread:ingest` - ingest Binance/Coinbase spread context.
- `maintenance:cleanup-market-context` - чистит старые market-context records.
- `clean-dir`, `clean-redis`, `clean-tests` - maintenance cleanup helpers.

ML и AI:

- `ml-export` - export ML dataset rows.
- `ml-inspect` - inspect ML datasets.
- `ml-train:latest` - train/select latest ML dataset.
- `ai-export` - export AI prompt/evaluation datasets.
- `ai-train` - replay AI datasets и summary gate behavior.
- `ai-pocket-search` - search deterministic AI-gate feature pockets.
- `test-ml`, `test-script` - diagnostic test commands.

## Частые примеры

```bash
# Проверить локальные зависимости
npx @tradejs/cli doctor

# Обновить свечи без запуска тестов
npx @tradejs/cli backtest --updateOnly --tickers BTCUSDT,ETHUSDT

# Запустить cache-only backtest по одному символу
npx @tradejs/cli backtest --config MaStrategy:base --tickers BTCUSDT --cacheOnly

# Проверить runtime signals без выставления ордеров
npx @tradejs/cli signals --tickers BTCUSDT --cacheOnly --skipScreenshots

# Посмотреть selected backtest results для одной стратегии
npx @tradejs/cli results --strategy TrendLine --coverage
```

## Backtest

`backtest` - основная research-команда.

Ticker и execution scope:

- `-t, --tickers` - comma-separated symbols.
- `-e, --exclude` - symbols, которые нужно пропустить.
- `-l, --tickersLimit` - ограничить число symbols.
- `-n, --tests` - ограничить число config tests.
- `-s, --skip` - пропустить первые N tests.
- `-p, --parallel` - число workers.
- `-f, --timeframe` - interval в минутах.
- `-d, --days` - запуск только за последние N days.
- `--startTime`, `--endTime` - явное окно backtest, epoch seconds или milliseconds.

Данные и cache:

- `-u, --updateOnly` - только обновить market cache.
- `-C, --cacheOnly` - использовать только cached market data.
- `-L, --showTickersList` - вывести resolved ticker list и выйти.
- `-o, --connector` - connector provider/name, например `bybit`, `binance`, `coinbase`, `custom`.

Config и output:

- `-c, --config` - backtest config key, например `MaStrategy:base`.
- `-T, --top` - сколько best result/config buckets печатать для grid runs.
- `-g, --progressStep` - interval progress logging.
- `-U, --user` - Redis user config, default `root`.
- `--fast` - не сохранять per-test artifacts, оставить summary/dataset output.
- `-K, --continue` - продолжить latest compatible interrupted run.
- `-R, --runId` - explicit backtest run id для продолжения.

Execution assumptions:

- `--backtestPriceMode` - delayed entry execution price mode: `open`, `close`, `mid`.
- `--backtestEntryDelayBars` - delay entry execution на N закрытых баров после сигнала.

Dataset output:

- `-m, --ml` - писать ML dataset rows в per-worker JSONL chunks.
- `-A, --ai` - писать AI prompt rows в per-worker JSONL chunks.

Backtest config keys лежат в Redis по ключу `users:<user>:backtests:configs:<StrategyName:configName>`.
См. [Create a backtest config](../getting-started/backtest-config).

## Signals

`signals` оценивает configured runtime strategies на последней закрытой свече.

- `-t, --tickers` - comma-separated symbols.
- `-e, --exclude` - symbols, которые нужно пропустить.
- `-l, --tickersLimit` - ограничить число symbols.
- `-f, --timeframe` - interval в минутах.
- `-m, --makeOrders` - разрешить order placement, если strategy и connector config это допускают.
- `-N, --notify` - отправить Telegram notifications.
- `-S, --skipScreenshots` - пропустить screenshot generation.
- `-u, --updateOnly` - только обновить market cache.
- `-C, --cacheOnly` - использовать только cached market data.
- `-L, --showTickersList` - вывести resolved ticker list и выйти.
- `-p, --parallel` - signal evaluation worker count.
- `-R, --showSkipStats` - показать aggregated skip stats by strategy.
- `-c, --chunk` - разделить universe, например `1/3`.
- `-U, --user` - Redis user config.
- `-o, --connector` - connector provider/name.

## Signals Summary

`signals-summary` собирает recent runtime signal/order state.

- `-u, --user` - Redis user config.
- `--connector` - connector provider/name для reconciliation.
- `-H, --hours` - summary window в часах.
- `-P, --printOnly` - напечатать summary вместо отправки в Telegram.
- `--debugAttachment` - приложить runtime Redis debug JSON для replay diagnostics.

## Results

`results` смотрит и управляет selected strategy results в Redis.

- `-s, --strategy` - strategy name. Обязательный флаг.
- `-C, --coverage` - показать coverage table.
- `-u, --update` - update results config in Redis.
- `-m, --merge` - merge results config in Redis.
- `-c, --clear` - clear results config in Redis.
- `-V, --verbose` - verbose output.
- `-U, --user` - Redis user config.

Используйте эту команду, чтобы проверить candidate configs перед promotion в runtime settings.

## Runtime Parity

`runtime-parity` сравнивает runtime entry records с deterministic backtest replay.

- `-u, --user` - Redis user config и runtime journal.
- `-o, --connector` - connector provider/name.
- `-d, --days` - replay window в днях.
- `-b, --startTime`, `-e, --endTime` - explicit replay window, epoch seconds или milliseconds.
- `-s, --strategy` - сравнить только одну strategy.
- `-t, --tickers` - replay comma-separated symbols для configured strategies.
- `-C, --cacheOnly` - не обновлять market history перед replay.
- `-a, --toleranceBars` - допустимый entry timestamp drift в барах.
- `--fullUniverse` - replay every configured strategy across connector universe.
- `--runtimeGates` - force runtime AI/ML gates для всех replay targets.
- `-N, --notify` - отправить parity summary в Telegram.
- `-D, --details` - напечатать unmatched entry details.

## AI Train

`ai-train` replay exported AI rows и summary approval behavior.

- `-o, --outDir` - dataset directory, default `data/ai/export`.
- `-s, --strategy` - strategy filter для merged file.
- `-f, --file` - explicit merged dataset file path.
- `-n, --recent` - recent rows с конца, `0` значит все rows.
- `-k, --skip` - recent rows, которые нужно пропустить перед выборкой.
- `-p, --parallel` - concurrent AI requests.
- `-m, --model` - model id override для replay.
- `-M, --minQuality` - minimum quality required to approve entry.
- `-l, --localOnly` - replay deterministic adapter gate без provider calls.
- `-U, --user` - Redis user config.
- `-c, --chart` - сохранить compact chart data для strategies UI.
- `-j, --json` - печатать structured JSON summary.
- `-S, --since`, `-u, --until` - ограничить rows по timestamp.
- `-P, --period` - trailing selected-row period, например `last365d`, `last90d`, `last30d`.
- `-q, --qualityThresholds` - comma-separated `qN+` thresholds.
- `-d, --dumpEvaluations` - писать evaluated rows как JSONL.
- `-G, --dumpFeatures` - feature snapshot для dump rows: `none`, `gateFeatures`, `baseContext`.
- `-Q, --symbolQuarantine` - применить per-strategy/per-symbol quarantine overlay к approved rows.

## AI Pocket Search

`ai-pocket-search` ищет deterministic gate feature pockets по AI exports.

Dataset selection:

- `-o, --outDir`, `-s, --strategy`, `-f, --file`
- `-n, --recent`, `-k, --skip`
- `-S, --since`, `-u, --until`, `-P, --period`

Gate и search shape:

- `-M, --minQuality`
- `-q, --qualityThresholds`
- `-g, --scope` - `all`, `approved`, `rejected`, `candidates`.
- `-d, --maxDepth`
- `-m, --minSupport`
- `-F, --minProfitFactor`
- `-W, --minWinRate`
- `-R, --minTotalProfit`
- `-a, --maxAtomicPredicates`
- `-C, --maxCombinations`
- `-V, --validationSplit`
- `-N, --minValidationSupport`
- `-D, --dedupeEquivalentSelections`

Output и feature scope:

- `-t, --top`
- `-Y, --includeSymbol`
- `-E, --includeGateContext`
- `-p, --featureProfile` - `compact` или `all`.
- `-r, --reportDir`
- `-B, --reportFile`
- `-j, --json`
- `-O, --output`

## Doctor

`doctor` проверяет infrastructure assumptions перед workflows.

- `--require-ml` - считать ML gRPC connectivity обязательной.
- `--skip-ml` - пропустить ML gRPC checks.

## Подробные статьи

- [Run your first backtest](../getting-started/first-backtest)
- [Create a backtest config](../getting-started/backtest-config)
- [Grid-конфиги бэктестов](../runtime/backtesting/grid-config)
- [Results и promotion в runtime](../runtime/backtesting/results-runtime-config)
- [Runtime parity](../runtime/backtesting/runtime-parity)
- [Data Sync](../getting-started/data-sync)
- [Data quality guide](../guides/data-quality)
