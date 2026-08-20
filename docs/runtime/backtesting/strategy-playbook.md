---
title: From Backtest to Live Trading
---

This playbook connects research, validation, and live operation without tying
the process to a particular strategy, exchange, or account. Replace angle-
bracketed values with settings from your project.

## 1. State the Experiment

Before running commands, record the hypothesis, strategy version, parameter
range, symbols, timeframe, data window, fees, slippage, fill model, and
acceptance criteria. Define the out-of-sample window before selecting a result.

## 2. Run a Small Reproducibility Check

Start with a few symbols and a limited parameter set:

```bash
npx @tradejs/cli backtest \
  --user <user> \
  --config <StrategyName:configName> \
  --connector <connector> \
  --timeframe <minutes> \
  --tickers <SYMBOL1,SYMBOL2> \
  --tests <small-limit> \
  --parallel <workers> \
  --cacheOnly
```

Confirm that candles, timestamps, trade direction, sizing, fees, entries, and
exits match the intended rules before scaling the run.

## 3. Run the Planned Search

Expand only to the predefined symbols, time window, and parameter grid. Keep
the command, configuration, package versions, and output together. Avoid adding
parameters after seeing results unless you start a new experiment.

Inspect the result set and symbol coverage:

```bash
npx @tradejs/cli results \
  --strategy <StrategyName> \
  --coverage \
  --user <user>
```

## 4. Validate the Candidate

Evaluate the selected configuration on untouched data and across relevant
market regimes. Stress fees, slippage, entry delay, spread, and nearby parameter
values. Review drawdown, recovery time, exposure, turnover, concentration, and
the full trade distribution—not only aggregate profit.

Reject the candidate if its result depends on a narrow parameter point,
unrealistic fills, a few symbols, or a small number of trades.

## 5. Freeze the Live Settings

Copy one complete reviewed configuration into the target deployment in
`tradejs.config.ts`. Pin the exact strategy package and lockfile, then review
the account, connector, symbol selection, and risk limits. Do not add a manual
version; Project checks parse the complete config and compute both runtime
identifiers.

Verify the resolved settings:

```bash
npx @tradejs/cli runtime-control verify \
  --user <user> \
  --deployment <deployment>
```

Record the returned `strategyRevision` and `deploymentCompositionId` with the
candidate evidence.

## 6. Replay the Exact Deployment

```bash
npx @tradejs/cli replay \
  --user <user> \
  --deployment <deployment> \
  --days <days> \
  --cacheOnly
```

Investigate missing entries, extra entries, timestamp drift, price drift, and
differences in gates or market context. Do not edit historical records to make
them agree.

## 7. Observe Current-Market Evaluation

Run without order placement first:

```bash
npx @tradejs/cli signals \
  --user <user> \
  --deployment <deployment> \
  --cacheOnly
```

Check candle freshness, resolved symbols, strategy decisions, notifications,
and monitoring. Confirm that pausing new entries does not prevent management of
existing positions.

## 8. Start a Bounded Live Rollout

Enable order placement only with explicit authorization and venue credentials.
Use a small fixed risk allocation, define maximum loss and operational stop
conditions, and retain a tested pause/rollback procedure. Compare decisions,
orders, and fills with replay regularly.

Related reading:

- [How backtests work](./overview)
- [Use a tested configuration in live trading](./results-runtime-config)
- [Validate live decisions with replay](./replay-evidence)
- [Pre-live checklist](../../strategies/operations/pre-live-checklist)
