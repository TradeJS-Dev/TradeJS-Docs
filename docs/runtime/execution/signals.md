---
sidebar_position: 9
title: How Signals Work
---

TradeJS has a one-shot signal command and a persistent production daemon. Both
evaluate only closed candles through the same strategy runtime used by replay
and backtests where practical.

```bash
# One pass over every configured scope
npx @tradejs/cli signals

# Long-running process aligned to candle boundaries
npx @tradejs/cli signals-daemon
# Equivalent: npx @tradejs/cli signals --watch
```

## Runtime configuration and scopes

Production runtime configuration is declared in the project's
`tradejs.config.ts`. A deployment owns its connector/account/scope and every
strategy owns one complete `{ version, enabled, config }` entry:

```ts
export default defineConfig(basePreset, {
  runtime: {
    deployments: {
      production: {
        connectorName: 'bybit',
        accountId: 'bybit-main',
        strategies: {
          DoubleTap: {
            version: 4,
            enabled: true,
            config: { INTERVAL: '15', UNIVERSE: 'crypto', MAX_LOSS_VALUE: 1 },
          },
        },
      },
    },
  },
});
```

The runtime does not merge Redis strategy configs, result overlays, or
deployment overrides. Account credentials remain server-owned. Without
explicit scope flags, `signals` evaluates all declared active scopes once.

Useful scope flags:

- `--user`, `--connector`, `--timeframe`
- `--universe crypto|tradfi`
- `--account <id>`
- `--deployment <id>`
- `--tickers`, `--exclude`, `--tickersLimit`, `--chunk`

Two declarations for the same strategy may share a runtime only when they
resolve to different accounts. A same-strategy/same-account conflict fails
clearly instead of selecting one silently.

## One cycle

1. Load project plugins, Git-owned deployments, trading accounts, and optional pause overrides.
2. Resolve each scope's connector and ticker universe.
3. Prepare candles and required signal-time market context.
4. Run the project `beforeSignals` hook.
5. Evaluate strategies on the latest closed candle.
6. Persist signal/evaluation state before optional screenshots.
7. Apply AI/ML/policy gates and place orders only when `--makeOrders` permits it.
8. Run `afterSignals`, notifications, skip stats, and cycle telemetry.

`beforeSignals` and `afterSignals` are project-level batch hooks. Strategy
cores read the decision candle through `StrategyAPI`; full connector history is
not exposed to strategy code.

## Persistent daemon state

The daemon keeps only bounded replayable detector state between sequential
closed candles. Heavy runtimes and indicator controllers are disposable. A
strategy is rebuilt from rolling warmup history after restart, a candle gap,
an effective config change, or `SIGNALS_DAEMON_MAX_LIVE_BARS`.

The lifecycle identity includes connector, universe, account/deployment,
symbol, interval, strategy, and the strategy version/config. Removed scopes are evicted.
Catch-up rebuilding does not place historical orders or send historical
notifications.

Redis `users:<user>:runtime:controls` is optional. An absent key means no
manual overrides. Pause stores only `entriesPaused: true`; resume removes the
override. Invalid controls or an unavailable Redis fail closed. Pausing blocks
new entries but does not stop management of existing positions.

For Bybit crypto scopes, the daemon uses one public kline WebSocket by default.
Confirmed candles are batch-written to Timescale; REST remains the startup,
gap, and reconnect fallback. Set `SIGNALS_KLINE_WS_ENABLED=0` for REST-only
operation or tune `SIGNALS_KLINE_WS_WAIT_MS`.

## Orders and notifications

- `--makeOrders` permits order placement; strategy, account, AI/ML, and policy checks can still block it.
- `--notify` sends accepted signal notifications and optional AI commentary.
- skipped or canceled orders are retained for diagnostics but not forwarded as trade notifications.
- `signals-summary` creates a recent runtime digest.

Production should supervise the daemon, cap heap with
`SIGNALS_DAEMON_HEAP_MB`, and alert on cycle failures and stale candles. See
[Multi-strategy runtime](./multi-strategy-signals),
[Telegram notifications](./telegram-notifications), and
[Runtime parity](../backtesting/runtime-parity).
