---
title: Codex strategy workflow skills
---

`npx create-tradejs` installs focused Codex skills in the generated project's
`.codex/skills` directory. Each invocation takes one strategy name and performs
one kind of work. This keeps a request to inspect metrics separate from a
request that can publish or deploy code.

## Skill map

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

Example prompts stay short:

```text
$strategy-candidate-report MarketFlushReversal
$strategy-improvement-research MarketFlushReversal
$strategy-forward-start MarketFlushReversal
```

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
hashes, full-period metrics, and chart must remain reproducible; the maximum
covered period must have positive net PnL and profit factor above 1.

Before rollout, Codex writes a new immutable operator-authorization artifact
that references the original selection and the contrary or underpowered
evidence. Missing hashes, non-positive maximum-period economics, or a candidate
that would require fresh tuning remain blockers. The mode changes only the
authority for a risk-1 prospective test—it does not manufacture historical
eligibility.

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
