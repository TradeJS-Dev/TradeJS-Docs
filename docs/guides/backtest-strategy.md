---
title: Backtest a strategy
---

Backtesting runs strategy logic over historical candles and stores metrics/artifacts for inspection.

## Basic Command Shape

```bash
npx @tradejs/cli backtest --user root --config <StrategyName:configName> --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

The selected config must exist in Redis. The deterministic sandbox in [Run your first backtest](../getting-started/first-backtest) seeds one for you; for your own strategy, see [Create a backtest config](../getting-started/backtest-config).

## Useful Flags

- `--config`: backtest config key
- `--tickers`: comma-separated symbol list
- `--timeframe`: candle interval
- `--tests`: max tests
- `--parallel`: worker count
- `--cacheOnly`: do not refresh market cache
- `--updateOnly`: update market cache without running tests
- `--ml`: export ML rows
- `--ai`: export AI prompt rows
- `--runId`: continue a resumable run

## Practical Workflow

1. Start with one strategy, one symbol, and one config.
2. Confirm entries and exits are explainable.
3. Expand the symbol/time window.
4. Compare variants with the same assumptions.
5. Review [Backtesting caveats](../limitations/backtesting-caveats) before promoting anything to runtime.

## Deep Dives

- [Backtesting overview](../runtime/backtesting/overview)
- [Grid config](../runtime/backtesting/grid-config)
- [Results to runtime config](../runtime/backtesting/results-runtime-config)
- [Runtime parity](../runtime/backtesting/runtime-parity)
