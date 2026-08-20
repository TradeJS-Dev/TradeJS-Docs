---
title: Use a Tested Configuration in Live Trading
---

Moving from a good backtest to live trading is a controlled change, not an
automatic export. The goal is to preserve the exact strategy, configuration,
and risk limits that were reviewed while avoiding selection based on a single
headline metric.

## Inspect Saved Results

`results` summarizes saved backtests and can show symbol coverage for one
strategy:

```bash
npx @tradejs/cli results \
  --strategy <StrategyName> \
  --coverage \
  --user root
```

The command can also maintain a local research record of the best result seen
for each symbol:

- `--merge` replaces a symbol only when the new recorded profit is higher;
- `--update` replaces the complete saved record;
- `--clear` removes that local record.

These modes organize research output. They do not change live strategy
settings, enable a strategy, or authorize order placement. The current
`--coverage` denominator uses the Bybit symbol universe.

## Review the Candidate

Before using a configuration with current market data, verify:

1. **Data integrity:** no unexplained gaps, duplicates, time shifts, or
   look-ahead leakage.
2. **Execution assumptions:** fees, slippage, fill rules, latency, funding, and
   borrow constraints are appropriate for the venue and turnover.
3. **Independent validation:** the candidate performs acceptably outside the
   data used for parameter selection.
4. **Robustness:** nearby parameter values and plausible cost changes do not
   destroy the result.
5. **Risk:** drawdown, exposure, concentration, loss per trade, and failure
   behavior fit the intended account.
6. **Capacity:** expected order size is reasonable for observed liquidity.

Preserve the complete report and selection rationale. A per-symbol winner list
is not, by itself, a portfolio or deployment configuration.

## Update the Live Configuration

Live settings are declared in `tradejs.config.ts`. To use a reviewed candidate:

1. Copy the complete strategy configuration into the intended deployment.
2. Pin the exact strategy package version used during validation.
3. Review symbol selection, account binding, risk limits, and whether the
   strategy is enabled.
4. Commit the configuration and lockfile together so the change is auditable
   and reversible.
5. Run project checks and verify the resolved setup. The strict parser rejects
   unknown config fields and the runtime computes `strategyRevision` and
   `deploymentCompositionId`; do not maintain a numeric version field.

```bash
npx @tradejs/cli runtime-control verify \
  --user root \
  --deployment <deployment>
```

The strategies page displays this configuration but does not rewrite it.
Pause/resume controls temporarily block new entries; they do not edit strategy
parameters.

## Validate Before Placing Orders

Run a historical replay of the exact deployment, then run one live evaluation
cycle without `--makeOrders`:

```bash
npx @tradejs/cli replay \
  --user root \
  --deployment <deployment> \
  --days 7 \
  --cacheOnly

npx @tradejs/cli signals \
  --user root \
  --deployment <deployment> \
  --cacheOnly
```

Only enable order placement after reviewing the replay, current market-data
health, account permissions, risk controls, monitoring, and rollback path. Use
a bounded initial allocation and define stop conditions in advance.

See [From backtest to live trading](./strategy-playbook) for the complete
sequence and [Validate live decisions with replay](./replay-evidence) for
diagnostics.
