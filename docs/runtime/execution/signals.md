---
sidebar_position: 9
title: How Live Signals Work
---

TradeJS evaluates strategies only after a candle closes. You can run one
evaluation cycle for inspection or keep a daemon aligned with candle boundaries:

```bash
# Evaluate every active setup once
npx @tradejs/cli signals

# Continue evaluating newly closed candles
npx @tradejs/cli signals-daemon
# Equivalent: npx @tradejs/cli signals --watch
```

Neither command places orders unless `--makeOrders` is explicitly present.

## Configure a Live Setup

Live settings are declared in the project's `tradejs.config.ts`. A
**deployment** binds a connector and account to one or more complete strategy
configurations:

```ts
export default defineConfig(basePreset, {
  runtime: {
    deployments: {
      production: {
        connectorName: 'bybit',
        accountId: 'bybit-main',
        tickers: ['BTCUSDT', 'ETHUSDT'],
        strategies: {
          DoubleTap: {
            enabled: true,
            selection: { tickers: ['BTCUSDT'] },
            config: { INTERVAL: '15', UNIVERSE: 'crypto', MAX_LOSS_VALUE: 1 },
          },
        },
      },
    },
  },
});
```

Each strategy entry contains its enabled state and complete configuration.
TradeJS derives `strategyRevision` from the verified package and parsed
configuration; there is no manual version field. `selection.tickers` narrows
that strategy to a subset of the deployment's symbols. If neither symbol list
is present, the connector and `UNIVERSE` determine the available set.

`--tickers` is a temporary override for one command and does not edit
`tradejs.config.ts`. When a symbol with an open position is removed from the
selection, TradeJS retains it for exit and position-management decisions.

The web app displays deployed settings but does not rewrite them. Account
credentials remain server-side.

## Choose What to Evaluate

Without filters, `signals` evaluates every enabled setup. These options narrow
the current command:

- `--deployment <name>`
- `--account <id>`
- `--connector <name>`
- `--timeframe <minutes>`
- `--universe crypto|tradfi`
- `--tickers`, `--exclude`, `--tickersLimit`, and `--chunk`

Two enabled declarations of the same strategy may share a process only when
they use different accounts. The same strategy and account combination is
rejected as ambiguous.

## What Happens on Each Closed Candle

1. Load the project configuration, accounts, plugins, and pause state.
2. Resolve the connector and symbols for each active setup.
3. Load the candles and required market context.
4. Run the project-level `beforeSignals` hook.
5. Evaluate every applicable strategy on the latest closed candle.
6. Record decisions before producing optional charts.
7. Apply risk, policy, AI, and ML filters.
8. Place an order only when all checks pass and `--makeOrders` is enabled.
9. Run `afterSignals`, notifications, and cycle monitoring.

A signal is a strategy decision, not an order or fill. Rejections, skips,
cancellations, and fills are recorded separately so the order lifecycle can be
diagnosed.

## Restarts and Configuration Changes

The daemon retains only recent deterministic calculation state. It reconstructs
a strategy from warm-up candles after a restart, a candle gap, a relevant
configuration change, or the configured live-bar limit. This avoids depending
on unbounded in-memory state.

The project configuration and pause state are read on every cycle. A changed
computed strategy revision, deployment composition, account, or selection
rebuilds only the affected calculation. Catch-up processing does not place
historical orders or send historical trade notifications.

For Bybit crypto markets, the daemon uses a public kline WebSocket by default
and falls back to REST for startup, gaps, and reconnection. Set
`SIGNALS_KLINE_WS_ENABLED=0` for REST-only operation.

## Pause, Resume, and Verify

```bash
npx @tradejs/cli runtime-control verify \
  --user root --deployment production

npx @tradejs/cli runtime-control pause \
  --user root --deployment production --strategy DoubleTap

npx @tradejs/cli runtime-control resume \
  --user root --deployment production --strategy DoubleTap
```

Pause blocks new entries but continues managing open positions. Resume removes
the temporary pause; it cannot enable a deployment or strategy configured with
`enabled: false`. If the pause state cannot be validated, TradeJS blocks new
entries.

## Order Placement and Monitoring

- `--makeOrders` permits order placement; account, strategy, risk, AI, or ML
  rules can still reject it.
- `--notify` sends accepted-signal notifications and optional AI commentary.
- `signals-summary` creates a recent operational summary.

Run the daemon under a process supervisor, set a memory limit with
`SIGNALS_DAEMON_HEAP_MB`, and alert on failed cycles and stale candles. See
[Running multiple strategies](./multi-strategy-signals),
[Telegram notifications](./telegram-notifications), and
[Compare live and replayed entries](../backtesting/runtime-parity).
