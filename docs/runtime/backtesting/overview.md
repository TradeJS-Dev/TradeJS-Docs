---
sidebar_position: 8
sidebar_label: How Backtests Work
title: How TradeJS Backtests Trading Strategies
description: 'Learn how TradeJS replays a trading strategy over historical candles, models entries and exits, records assumptions, and produces reproducible backtest evidence.'
---

A TradeJS backtest applies one strategy configuration to historical candles and
simulates its entries, exits, and position management. Use it to test a stated
hypothesis and compare configurations under the same assumptions. A backtest
does not forecast future returns.

## Define the Test Before Running It

Record the following inputs so that another person can reproduce the result:

- strategy and package version;
- complete strategy configuration;
- connector, symbols, and timeframe;
- exact start and end timestamps;
- candle source and data-adjustment rules;
- fees, slippage, fill model, and entry delay;
- parameter combinations and selection rule.

Changing any of these inputs creates a different experiment.

## Run a Backtest

The quickest route is the web app described in
[Run your first backtest](../../getting-started/first-backtest). For a saved
configuration, use the CLI:

```bash
npx @tradejs/cli backtest \
  --user root \
  --config <StrategyName:configName> \
  --connector <connector> \
  --timeframe <minutes> \
  --tickers <SYMBOLS> \
  --tests <limit> \
  --parallel <workers>
```

Start local services first if they are not running:

```bash
npx @tradejs/cli infra-up
```

Use `--cacheOnly` when the required candles are already available and you want
to prevent a data refresh during a reproducibility check.

## Separate Execution Costs from Strategy Estimates

A reproducible comparison should pass its simulation costs separately from the
strategy configuration:

```bash
npx @tradejs/cli backtest \
  --config <StrategyName:configName> \
  --executionCosts '{"fees":{"makerRate":0.001,"takerRate":0.001},"slippage":{"baseBps":10,"spreadMultiplier":1,"marketImpactBps":0,"delayRiskMultiplier":0},"funding":{"enabled":false}}'
```

Fee values are decimal one-way rates, so `0.001` means 0.1%. Slippage is
adverse on each fill, and fees use the resulting fill value. Setting
`funding.enabled` to `false` excludes funding costs. Enabling funding requires
usable historical funding data, including for a cached run.

TradeJS freezes the object for the run and includes it in checkpoint and result
evidence. A continued run reuses the frozen costs. Start a new run if you need
different cost assumptions.

Strategy fields `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, and
`RISK_MARKET_IMPACT_BPS` are separate estimates used for entry checks and
position sizing. Changing `--executionCosts` does not change those strategy
estimates, and changing the strategy estimates does not change simulated fees,
slippage, or funding.

## What TradeJS Does

1. Loads the selected parameter grid.
2. Resolves the symbol set and historical window.
3. Loads or refreshes candles.
4. Builds the requested parameter combinations.
5. Runs the combinations in parallel workers.
6. Stores trade-level output and aggregates performance statistics.

The same strategy implementation is used by backtests and live evaluation, but
the surrounding execution environment is different. A backtest cannot fully
reproduce queue position, market impact, exchange outages, network latency, or
future liquidity.

## Parameter Search

Each field in a backtest grid contains one or more candidate values. TradeJS
evaluates their Cartesian product, subject to `--tests`. Keep the search space
economically justified and record how the final candidate was selected.

A large search can produce an attractive result by chance. After selecting a
candidate, validate it on data not used for selection and test sensitivity to
nearby parameter values, fees, slippage, and market regimes.

See [Backtest grid configuration](./grid-config) for the file shape and commands.

## Read the Output

Do not rank configurations by net profit alone. At minimum, inspect:

- trade count and exposure;
- returns after fees and modeled slippage;
- maximum drawdown and recovery time;
- profit factor, expectancy, and payoff distribution;
- long/short and per-symbol concentration;
- stability across subperiods and market regimes;
- sensitivity to small parameter and cost changes.

The result is useful only if the data window, assumptions, and sample size are
appropriate for the strategy's holding period and turnover.

## Optional AI/ML Datasets

`--ml` writes rows for the ML dataset and `--ai` writes rows for offline prompt
evaluation. These flags add research output; they do not enable an AI or ML gate
during the backtest. Merge the generated chunks with `ml-export` or `ai-export`.

## Next Steps

- [Understand backtest output](../../getting-started/understanding-output)
- [Use a tested configuration in live trading](./results-runtime-config)
- [Validate live decisions with replay](./replay-evidence)
- [Backtesting caveats](../../limitations/backtesting-caveats)
