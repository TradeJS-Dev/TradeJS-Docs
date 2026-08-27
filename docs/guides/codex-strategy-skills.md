---
title: Codex strategy workflow skills
---

`npx create-tradejs` installs the complete checksum-managed TradeJS skill set in
the generated project's `.codex/skills` directory. Each invocation has one
workflow owner. This keeps one core experiment separate from end-to-end
improvement research, gate analysis, reporting, and production mutations.

## Choose one workflow owner

- Use `$strategy-improvement-research` to choose hypothesis families, manage
  the bounded trial ledger, select the best candidate, and freeze the complete
  core + gate handoff.
- Use `$strategy-backtest-research` to implement or execute one already
  preregistered core experiment. It returns reconciled evidence and does not
  choose the next candidate.
- Use `$ai-train-local-research` only after the core/export is frozen. It owns
  deterministic-gate analysis and does not reopen core selection.

The improvement workflow composes the two specialist stages. Invoking a
specialist directly does not implicitly start the full improvement lineage.

## Supporting skills

| Skill | Purpose |
| --- | --- |
| `$strategy-backtest-research` | Execute one scoped implementation or preregistered core-backtest experiment |
| `$ai-train-local-research` | Analyze and tune the deterministic gate for one frozen core/export |
| `$backtest-config-redis` | Read a named research grid from local Redis without promoting it |
| `$save-strategy-config-from-backtest` | Explicitly promote a research grid into the Project's Git-owned declaration |
| `$runtime-parity-mismatch-analysis` | Diagnose an existing runtime-parity mismatch artifact before considering a rerun |

## Lifecycle skill map

| Skill | Purpose | May change production? |
| --- | --- | --- |
| `$strategy-candidate-report` | Show the latest explicitly selected candidate, its exact config, freshness, chart, and metrics | No |
| `$strategy-candidate-compare` | Compare that candidate with the exact deployed composition on a common scope | No |
| `$strategy-improvement-plan` | Analyze source and evidence and rank causal improvement hypotheses | No |
| `$strategy-improvement-research` | Start a new bounded core + deterministic-gate research lineage and freeze the best reproducible candidate | No |
| `$strategy-period-revalidate` | Recheck production and strong prior candidates on an extended common period without retuning | No |
| `$strategy-forward-start` | Publish and start the latest eligible candidate—or an explicitly named reproducible historical candidate—at `MAX_LOSS_VALUE=1` | Yes |
| `$strategy-forward-status` | Inspect identity, parity, orders, execution, and normalized live evidence | No |
| `$strategy-risk-scale` | Change only `MAX_LOSS_VALUE` for the same deployed composition | Yes |

`$strategy-release` is a deprecated compatibility router. It selects exactly
one focused lifecycle skill and must not recreate the former all-in-one
research, publication, deployment, and risk workflow.

Example prompts stay short:

```text
$strategy-candidate-report MarketFlushReversal
$strategy-improvement-research MarketFlushReversal
$strategy-forward-start MarketFlushReversal
```

## Installation and updates

The canonical skill source lives in the TradeJS framework repository. Every
official TradeJS skill is included in one SHA-256 manifest; generated Projects
must not maintain independent copies. Update the complete official snapshot
only through an explicitly selected `create-tradejs` version:

```bash
npx create-tradejs@<approved-version> --update-skills .
```

The updater preserves unrelated custom skills and rejects changes to an
already managed file. When a release first brings an existing official skill
under bundle management, the explicit update adopts that same-named official
snapshot.

## Research roots

Advanced source-aware research keeps three responsibilities separate:

- `PROJECT_CWD` owns `.env`, configuration, datasets, notes, and reports.
- `TRADEJS_SOURCE_REPOSITORY_ROOT` is the exact framework or standalone
  strategy Git checkout whose build and lineage are under study.
- `TRADEJS_FRAMEWORK_REPOSITORY_ROOT` supplies the built framework research
  runtime. It is required by the gate-ablation tool when the source root is a
  standalone strategy; when the source is the framework, both roots may be the
  same checkout.

The ablation tool imports `strategyEntries` from the standalone strategy build,
so accepting a strategy path never silently falls back to the Project's
published package.

## How candidates are ranked

The research skill does not optimize only full-period profit, win rate, or a
profitable 7-day tail. It first requires causal and data validity, trace
reconciliation, and positive out-of-sample expectancy per unit of risk after
costs. It then considers probabilistic or deflated Sharpe, drawdown and tail
loss, recovery, loss streaks, losing-month streaks, walk-forward/regime
stability, concentration, cost robustness, and executable trade cadence.

Full-period PnL and win rate remain important economic diagnostics, but neither
is sufficient alone. Short 7d/30d/180d windows describe the current regime.
Their weight depends on independent support: fewer than 20 events is
underpowered, 20–49 is diagnostic, and 50 or more is selection-grade. A sparse
tail does not impose a 7-, 30-, or 180-day waiting period before a risk-1
prospective test.

Every new improvement-research invocation starts a new lineage. Before testing
new hypotheses it revalidates the strongest old candidates on the new common
period. It continues past audits and failed first rounds until it freezes a
reproducible best candidate, exhausts its bounded fresh-candidate budget, or
records a hard causal blocker for every remaining family.

## What forward start does

`$strategy-forward-start <Strategy>` is the explicit authorization boundary
for a bounded live forward test. By default, it consumes the latest
checksum-verified, forward-eligible candidate and sets `MAX_LOSS_VALUE=1`.

- If the strategy is missing from the target deployment, the skill adds and
  enables its full reviewed declaration.
- If it is running with a different package, core config, deterministic gate,
  context, or direction policy, the skill performs one guarded replacement.
- If the exact risk-1 composition already runs, it makes no configuration
  change and verifies the rollout idempotently.

### Explicitly named historical candidate

The operator may instead name one different historically promising candidate
for prospective-only learning. This does not rewrite the earlier selection or
turn contrary recent evidence into a positive historical verdict. The exact
expression, direction policy, effective config, source/data lineage, evidence
hashes, full-period metrics, and chart must remain reproducible. The maximum
covered period must have positive net PnL and profit factor above 1.

Before rollout, Codex writes a new immutable operator-authorization artifact
that references the original selection and the contrary or underpowered
evidence. Missing hashes, non-positive maximum-period economics, or a candidate
that would require fresh tuning remain blockers. The mode changes only the
authority for a risk-1 prospective test. Historical eligibility is unchanged.

When the selected candidate includes unpublished strategy source, the skill
uses the repository's configured release workflow to commit and push the
complete release range, publish the immutable package, install its exact
version and lockfile in the Project, commit and push the full Git-owned
`tradejs.config.ts`, deploy the exact Project tip, and verify
`strategyRevision` and `deploymentCompositionId`.

The skill never invents a production target. You must already have an exact
runtime user, deployment, trading account, connector, and package/deployment
workflow. `create-tradejs` provides the skills and local project, but it does
not create registry credentials, exchange credentials, production hosting, or
an unmanaged background daemon. If authorization or a target binding is
missing, Codex stops at that boundary and gives the exact action you must
complete.

## Scaling is a separate decision

Use `$strategy-risk-scale <Strategy>` only after reviewing prospective
evidence. It preserves the exact package, core, gate, context, universe, and
direction policy and changes only `MAX_LOSS_VALUE`, by at most one approved
step. Scaling is event-driven rather than calendar-driven: execution parity,
after-cost expectancy, normalized drawdown/tail loss, slippage, concentration,
and independent trade support matter more than “30 days have passed.”

See [Run a Strategy in Production](../getting-started/run-strategy-in-production)
for account, immutable build, and runtime requirements.
