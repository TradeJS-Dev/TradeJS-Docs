---
title: Promote Backtest Results Into Project Config
---

This page explains how to inspect positive backtest candidates and promote one
reviewed config into the Git-owned production declaration.

## 1. What `npx @tradejs/cli results` Does

`npx @tradejs/cli results` scans saved test configs/stats and builds per-symbol winners for one strategy.

Main command:

```bash
npx @tradejs/cli results --strategy TrendLine --coverage --user root
```

Useful modes:

- `--update`: overwrite saved strategy results with current winners
- `--merge`: update only symbols where new profit is better than saved one
- `--clear`: remove saved promoted results

Examples:

```bash
npx @tradejs/cli results --strategy TrendLine --merge --user root
npx @tradejs/cli results --strategy TrendLine --update --user root
npx @tradejs/cli results --strategy TrendLine --clear --user root
```

## 2. Where Research Results Are Stored

The `results` command may store per-symbol research winners in local Redis:

- `users:<user>:strategies:<strategy>:results`

Each symbol entry contains:

- `config` (strategy config for that symbol)
- `stats` (backtest metrics)

These records are research inputs only. Production never merges them into a
strategy config.

## 3. Promote One Config

1. Select one complete, deterministic config from the reviewed evidence.
2. Update that strategy's `config` in `tradejs.config.ts`.
3. Update its exact strategy package dependency when code changed.
4. Increment that strategy's positive integer `version`.
5. Commit package, lockfile, config, and version together.
6. Run project checks and a production-like image smoke before deployment.

The runtime UI renders this committed config read-only. The only mutable server
operation is a manual pause/resume override; there is no Redis config write or
release-pointer switch.

## 4. Recommended Workflow

1. Run backtests for a strategy config grid.
2. Run `npx @tradejs/cli results --strategy <Strategy> --coverage` to inspect winners.
3. Review the candidate against the full release criteria; do not select by PnL alone.
4. Copy the selected complete config into the Project declaration and bump its version.
5. Deploy the immutable Project image, run `runtime-control verify`, and observe a bounded forward test.

## 5. Notes

- `--coverage` currently uses ByBit ticker universe for coverage denominator.
- `--merge` affects only the local research results record.
