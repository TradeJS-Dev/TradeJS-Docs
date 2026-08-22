---
sidebar_position: 6
title: CLI API
---

TradeJS command-line interface is exposed as the `@tradejs/cli` package.
Use it after package install via:

```bash
npx @tradejs/cli <command> [flags]
```

Run command-level help whenever you need the exact current syntax:

```bash
npx @tradejs/cli backtest --help
```

## Command Map

Setup and diagnostics:

- `doctor` - validate required services and optional ML connectivity.
- `infra-init` - initialize local infrastructure state.
- `infra-up` / `infra-down` - start or stop local infrastructure.
- `server-health` - check service health.
- `user-add` - create a user config.

Research and backtesting:

- `backtest` - run strategy backtests or refresh market cache.
- `results` - inspect, merge, update, or clear selected strategy results in Redis.
- `runtime-parity` - compare recorded live entries with reconstructed entries.
- `replay` - evaluate a deployed configuration over historical closed candles.
- `runtime-evidence` - collect a timestamped current-contract deployment v2 / lineage v3 record.
- `runtime-evidence-sync` - verify the current contract and import a runtime record from another host.
- `runtime-scorecard` - summarize live/replay differences and execution quality.
- `replay-runtime-evidence` - combine a replay result with a runtime record.
- `execution-calibration` - compare signal, arrival, and fill behavior.

Runtime and signals:

- `signals` - evaluate runtime strategies on the latest closed candle.
- `signals-daemon` - evaluate configured strategies whenever a candle closes.
- `signals-summary` - summarize recent runtime signal/order state.
- `runtime-control` - inspect, verify, pause, or resume configured live strategies.
- `market-ws` - expose the dashboard candle WebSocket gateway.
- `bot` - run the Telegram bot.

Market data and maintenance:

- `continuity` - check or repair candle continuity.
- `binance:market-ingest` - ingest Binance market data.
- `derivatives:ingest` - ingest derivatives context.
- `derivatives:ingest:coinalyze:all` - ingest Coinalyze derivatives context for all configured targets.
- `spread:ingest` - ingest Binance/Coinbase spread context.
- `hyperliquid:whale-ingest` - stream position-aware whale execution context.
- `hyperliquid:whale-backfill` - fill an explicit historical whale-context window.
- `maintenance:cleanup-market-context` - clean old market-context records.
- `clean-dir`, `clean-redis`, `clean-tests` - maintenance cleanup helpers.

ML and AI:

- `ml-export` - export ML dataset rows.
- `ml-inspect` - inspect ML datasets.
- `ml-train:latest` - train/select the latest ML dataset.
- `ai-export` - export AI prompt/evaluation datasets.
- `ai-train` - replay AI datasets and measure gate behavior.
- `ai-pocket-search` - search deterministic AI-gate feature pockets.
- `test-ml`, `test-script` - diagnostic test commands.

## Common Examples

```bash
# Check local dependencies
npx @tradejs/cli doctor

# Refresh candles without running tests
npx @tradejs/cli backtest --updateOnly --tickers BTCUSDT,ETHUSDT

# Run a cache-only backtest over one symbol
npx @tradejs/cli backtest --config MaStrategy:base --tickers BTCUSDT --cacheOnly

# Evaluate runtime signals without placing orders
npx @tradejs/cli signals --tickers BTCUSDT --cacheOnly --skipScreenshots

# Inspect selected backtest results for one strategy
npx @tradejs/cli results --strategy TrendLine --coverage
```

## Backtest

`backtest` is the main research command.

Ticker and execution scope:

- `-t, --tickers` - comma-separated symbols.
- `-e, --exclude` - comma-separated symbols to skip.
- `-l, --tickersLimit` - cap the number of symbols.
- `-n, --tests` - cap the number of config tests.
- `-s, --skip` - skip the first N tests.
- `-p, --parallel` - worker count.
- `-f, --timeframe` - interval in minutes.
- `-d, --days` - run only the recent N-day window.
- `--startTime`, `--endTime` - explicit backtest window, epoch seconds or milliseconds.

Data and cache:

- `-u, --updateOnly` - refresh market cache only.
- `-C, --cacheOnly` - use cached market data only.
- `-L, --showTickersList` - print resolved ticker list and exit.
- `-o, --connector` - connector provider/name, for example `bybit`, `binance`, `coinbase`, or `custom`.

Config and output:

- `-c, --config` - backtest config key, for example `MaStrategy:base`.
- `-T, --top` - number of best result/config buckets to print for grid runs.
- `-g, --progressStep` - progress logging interval.
- `-U, --user` - Redis user config, default `root`.
- `--fast` - skip per-test artifact persistence and keep summary/dataset output.
- `-K, --continue` - continue the latest compatible interrupted run.
- `-R, --runId` - explicit backtest run id to continue.

Execution assumptions:

- `--backtestPriceMode` - delayed entry execution price mode: `open`, `close`, or `mid`.
- `--backtestEntryDelayBars` - delay entry execution by N closed bars after the signal.

Dataset output:

- `-m, --ml` - write ML dataset rows to per-worker JSONL chunks.
- `-A, --ai` - write AI prompt rows to per-worker JSONL chunks.

Backtest config keys are stored in Redis under `users:<user>:backtests:configs:<StrategyName:configName>`.
See [Create a backtest config](../getting-started/backtest-config).

## Signals

`signals` evaluates configured runtime strategies on the latest closed candle.

- `-t, --tickers` - comma-separated symbols.
- `-e, --exclude` - symbols to skip.
- `-l, --tickersLimit` - cap the number of symbols.
- `-f, --timeframe` - interval in minutes.
- `-m, --makeOrders` - allow order placement when strategies and connector config permit it.
- `-N, --notify` - send Telegram notifications.
- `-S, --skipScreenshots` - skip screenshot generation.
- `-u, --updateOnly` - refresh market cache only.
- `-C, --cacheOnly` - use cached market data only.
- `-L, --showTickersList` - print resolved ticker list and exit.
- `-p, --parallel` - signal evaluation worker count.
- `-R, --showSkipStats` - show aggregated skip stats by strategy.
- `-c, --chunk` - split the universe, for example `1/3`.
- `-U, --user` - Redis user config.
- `-o, --connector` - connector provider/name.
- `-V, --universe` - `crypto` or `tradfi`.
- `-A, --account` - trading account id.
- `-D, --deployment` - runtime deployment id.
- `-w, --watch` - keep running on candle boundaries; `signals-daemon` enables this mode directly.
- `-d, --settleDelayMs` - delay after candle close before a daemon cycle.

Without filters, `signals` evaluates every enabled setup in
`tradejs.config.ts`. See [How live signals work](../runtime/execution/signals).

## Runtime Control

`runtime-control` reads deployed settings from `tradejs.config.ts`. Pause and
resume add or remove only a temporary new-entry block; they do not edit the
strategy configuration.

```bash
npx @tradejs/cli runtime-control inspect --user root --deployment production
npx @tradejs/cli runtime-control verify --user root --deployment production
npx @tradejs/cli runtime-control pause --user root --deployment production --strategy TrendFollow
npx @tradejs/cli runtime-control resume --user root --deployment production --strategy TrendFollow
```

- `inspect` prints resolved deployments and may be filtered by `--deployment`
  and `--strategy`.
- `verify` checks that declared strategies, packages, accounts, intervals, and
  runtime bindings resolve; `--deployment` is optional.
- `pause` and `resume` require both `--deployment` and `--strategy`.
- pausing blocks new entries but keeps open-position management active.
- resuming removes the override; it cannot enable a strategy disabled in
  `tradejs.config.ts`.

## Replay

`replay` runs the enabled strategies from one deployment over a historical
window. Pass `--runtimeEvidence` to reproduce the strategy, package, and
configuration versions stored in a collected runtime record.

- `--deployment` - deployment id from `tradejs.config.ts`, default `production`.
- `--runtimeEvidence` - runtime record whose stored setup should be replayed.
- `--days` or `--startTime` / `--endTime` - replay window.
- `--tickers`, `--exclude`, `--tickersLimit` - temporary symbol selection for this run.
- `--timeframe` - must match every selected strategy declaration.
- `--cacheOnly` - use only cached history.
- `--chart` - save compact chart data for the strategies UI.
- `--showTickersList` - print the resolved symbol list and exit.

See [Validate live decisions with replay](../runtime/backtesting/replay-evidence).

## Signals Summary

`signals-summary` summarizes recent runtime signal/order state.

- `-u, --user` - Redis user config.
- `--connector` - connector provider/name for reconciliation.
- `-H, --hours` - summary window in hours.
- `-P, --printOnly` - print summary instead of sending it to Telegram.
- `--debugAttachment` - attach runtime Redis debug JSON for replay diagnostics.

## Results

`results` inspects and manages selected strategy results saved in Redis.

- `-s, --strategy` - strategy name. Required.
- `-C, --coverage` - show coverage table.
- `-u, --update` - update results config in Redis.
- `-m, --merge` - merge results config in Redis.
- `-c, --clear` - clear results config in Redis.
- `-V, --verbose` - verbose output.
- `-U, --user` - Redis user config.

Use this command to inspect candidate configurations before deciding whether
they warrant independent validation and live evaluation.

## Runtime Parity

`runtime-parity` compares runtime entry records with deterministic backtest replay.

- `-u, --user` - Redis user config and runtime journal.
- `-o, --connector` - connector provider/name.
- `-d, --days` - replay window in days.
- `-b, --startTime`, `-e, --endTime` - explicit replay window, epoch seconds or milliseconds.
- `-s, --strategy` - compare one strategy only.
- `-t, --tickers` - replay comma-separated symbols for configured strategies.
- `-C, --cacheOnly` - do not refresh market history before replay.
- `-a, --toleranceBars` - allowed entry timestamp drift in bars.
- `--fullUniverse` - replay every configured strategy across the connector universe.
- `--runtimeGates` - force runtime AI/ML gates for all replay targets.
- `-N, --notify` - send parity summary to Telegram.
- `-D, --details` - print unmatched entry details.

## AI Train

`ai-train` replays exported AI rows and summarizes approval behavior.

- `-o, --outDir` - dataset directory, default `data/ai/export`.
- `-s, --strategy` - strategy filter for the merged file.
- `-f, --file` - explicit merged dataset file path.
- `-n, --recent` - recent rows to evaluate from the end, `0` means all rows.
- `-k, --skip` - recent rows to skip before selecting replay rows.
- `-p, --parallel` - concurrent AI requests.
- `-m, --model` - model id override for replay.
- `-M, --minQuality` - minimum quality required to approve entry.
- `-l, --localOnly` - replay deterministic adapter gate without provider calls.
- `-U, --user` - Redis user config.
- `-c, --chart` - save compact chart data for the strategies UI.
- `-j, --json` - print structured JSON summary.
- `-S, --since`, `-u, --until` - restrict evaluated rows by timestamp.
- `-P, --period` - trailing selected-row period such as `last365d`, `last90d`, or `last30d`.
- `-q, --qualityThresholds` - comma-separated `qN+` thresholds.
- `-d, --dumpEvaluations` - write evaluated rows as JSONL.
- `-G, --dumpFeatures` - feature snapshot for dumped rows: `none`, `gateFeatures`, or `baseContext`.
- `-Q, --symbolQuarantine` - apply per-strategy/per-symbol quarantine overlay to approved rows.

## AI Pocket Search

`ai-pocket-search` searches deterministic gate feature pockets over AI exports.

Dataset selection:

- `-o, --outDir`, `-s, --strategy`, `-f, --file`
- `-n, --recent`, `-k, --skip`
- `-S, --since`, `-u, --until`, `-P, --period`

Gate and search shape:

- `-M, --minQuality`
- `-q, --qualityThresholds`
- `-g, --scope` - `all`, `approved`, `rejected`, or `candidates`.
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

Output and feature scope:

- `-t, --top`
- `-Y, --includeSymbol`
- `-E, --includeGateContext`
- `-p, --featureProfile` - `compact` or `all`.
- `-r, --reportDir`
- `-B, --reportFile`
- `-j, --json`
- `-O, --output`

## Doctor

`doctor` validates infrastructure assumptions before running workflows.

- `--require-ml` - treat ML gRPC connectivity as required.
- `--skip-ml` - skip ML gRPC checks.

## Deep Dives

- [Run your first backtest](../getting-started/first-backtest)
- [Create a backtest config](../getting-started/backtest-config)
- [Grid config for backtests](../runtime/backtesting/grid-config)
- [Use a tested configuration in live trading](../runtime/backtesting/results-runtime-config)
- [Compare live and replayed entries](../runtime/backtesting/runtime-parity)
- [Data Sync](../getting-started/data-sync)
- [Data quality guide](../guides/data-quality)
