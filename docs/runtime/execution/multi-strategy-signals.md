---
title: Multi-Strategy Runtime
---

One `signals` process can evaluate multiple named configs, accounts, intervals,
universes, and deployments. The canonical key is:

```text
users:<user>:strategies:<StrategyName>:<configId>
```

`configId` distinguishes independently managed configs. `ENABLE=false`
disables a record without deleting it.

## Scope resolution

For each enabled config TradeJS resolves:

- strategy and named config id
- `INTERVAL` and `UNIVERSE`
- trading account from `ACCOUNT_ID` or deployment binding
- connector/provider
- optional deployment strategy overrides and policy profile
- symbol-specific results config

When `signals` runs without explicit `--timeframe`, `--universe`, `--account`,
or `--deployment`, it discovers active configs and executes every unique scope.
Explicit flags narrow the run.

## Per-symbol evaluation

Every compatible strategy is evaluated for the symbol on the same latest
closed candle. TradeJS persists each non-empty signal with its
`runtimeConfigId` and lineage; the runtime no longer uses a “first signal wins”
rule. Skip evaluations are also persisted or aggregated for diagnostics.

Two configs for the same strategy and account are ambiguous and rejected.
Use a different account or disable one config. Separate strategies can still
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
[Results to runtime config](../backtesting/results-runtime-config).
