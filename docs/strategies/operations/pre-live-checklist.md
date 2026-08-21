---
title: Pre-Live Checklist
---

Complete this checklist before adding `--makeOrders`. A successful backtest or
signal-only run is not sufficient authorization for live execution.

## Research

- The hypothesis, parameter search, and selection rule are documented.
- Data used for selection is separated from out-of-sample validation.
- Results are acceptable across relevant regimes, symbols, and subperiods.
- Performance is not concentrated in a few trades or symbols without a clear
  reason.
- Nearby parameter values and higher costs do not destroy the result.
- Fees, slippage, latency, funding, borrow, and fill assumptions match the venue.

## Data and Causality

- Candle continuity, duplicates, timestamps, and symbol mapping are checked.
- Every feature is available at the decision timestamp.
- Warm-up length is sufficient for all indicators and stateful rules.
- The live connector provides the same required fields and intervals as the
  research data.

## Strategy and Risk

- Entries, exits, stops, targets, sizing, and rounding are verified trade by trade.
- Maximum loss per trade, strategy, day, and account is configured.
- Gross, net, correlated, and per-symbol exposure limits are defined.
- Partial fills, rejected orders, duplicate submissions, and opposite signals
  have explicit handling.
- Open positions continue to be managed when new entries are paused.

## Exact Live Setup

- The reviewed strategy package and lockfile versions are pinned.
- `tradejs.config.ts` contains the complete reviewed configuration.
- The computed strategy revision, deployment composition, account, connector,
  timeframe, universe, symbols, and `enabled` state are correct.
- `runtime-control verify` passes for the target deployment.
- Historical replay of the exact deployment matches the expected decisions.
- A current-market `signals` run without `--makeOrders` is clean.

## Account and Venue

- Credentials belong to the intended account and have only required permissions.
- Testnet and production endpoints cannot be confused.
- Position mode, margin mode, leverage, contract multiplier, lot size, minimum
  notional, and rate limits are verified.
- Existing positions and open orders are reconciled before startup.

## Operations

- `doctor` passes and required services are healthy.
- The daemon runs under supervision with restart and memory limits.
- Alerts cover stale candles, failed cycles, order rejection, position mismatch,
  and loss-limit breaches.
- Pause, rollback, backup, and credential-revocation procedures are tested.
- Logs and runtime records are retained without exposing secrets.
- An operator and escalation path are defined for the rollout window.

## Go/No-Go

Start with a bounded allocation and explicit stop conditions. Record the exact
configuration, time, account, and person authorizing order placement. If any
required check is unresolved, keep the system in signal-only mode.

See [From backtest to live trading](../../runtime/backtesting/strategy-playbook)
and [Risk management](./risk-management).
