---
title: Multi-Strategy Runtime
---

One `signals` process can evaluate multiple strategies, accounts, intervals,
universes, and deployments declared in `tradejs.config.ts`. Git is the source
of truth; production Redis has no strategy-config namespace.

## Scope resolution

For each enabled strategy declaration TradeJS resolves:

- strategy and its positive integer version
- `INTERVAL` and `UNIVERSE`
- trading account id and connector/provider from the deployment
- the complete strategy config, including policy and risk
- optional deployment ticker and asset-class filters

When `signals` runs without explicit `--timeframe`, `--universe`, `--account`,
or `--deployment`, it discovers active declarations and executes every unique scope.
Explicit flags narrow the run.

## Per-symbol evaluation

Every compatible strategy is evaluated for the symbol on the same latest
closed candle. TradeJS persists each non-empty signal with its
runtime version and lineage; the runtime does not use a “first signal wins”
rule. Skip evaluations are also persisted or aggregated for diagnostics.

Two declarations for the same strategy and account are ambiguous and rejected.
Use a different account or disable one declaration. Separate strategies can still
emit conflicting directions, so account-level risk hooks and connector rules
remain responsible for portfolio policy.

## Examples

Evaluate every configured scope once:

```bash
npx @tradejs/cli signals --user root
```

Run one deployment continuously:

```bash
npx @tradejs/cli signals-daemon --user root --deployment production --notify --makeOrders
```

Narrow a diagnostic pass:

```bash
npx @tradejs/cli signals --user root --universe crypto --timeframe 15 --account bybit-main --tickers BTCUSDT,ETHUSDT --cacheOnly
```

See [How signals work](./signals) and
[Promote backtest results](../backtesting/results-runtime-config).
