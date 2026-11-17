---
title: Strategy Runtime Hooks
---

A hook is a function that TradeJS calls at a specific step, such as after a
strategy decision or before submitting an order.

Hooks can be declared in two places:

- strategy-local hooks in `manifest.ts` under `manifest.hooks`
- project-level shared hooks in `tradejs.config.ts` under `hooks`

Project-level hooks apply to every strategy loaded by the current project config. Strategy manifest hooks still work and are merged additively. For the same stage, project hooks run before strategy manifest hooks.

## Runtime Order

1. [onInit](./strategy-hooks/on-init) — once, at strategy creation
2. [onBar](./strategy-hooks/on-bar) — every candle before `core.ts`
3. [afterCoreDecision](./strategy-hooks/after-core-decision) — after `core.ts`, only if `core.ts` actually ran
4. [afterBarDecision](./strategy-hooks/after-bar-decision) — after the final candle decision, whether it came from `onBar` or `core.ts`
5. [onSkip](./strategy-hooks/on-skip) — only for `skip` decisions
6. [beforeClosePosition](./strategy-hooks/before-close-position) — gate, can block close
7. [afterEnrichMl](./strategy-hooks/after-enrich-ml) — only when `decision.signal` exists
8. [afterEnrichAi](./strategy-hooks/after-enrich-ai) — only when `decision.signal` exists
9. [beforeEntryGate](./strategy-hooks/before-entry-gate) — gate, can block entry
10. [beforePlaceOrder](./strategy-hooks/before-place-order) — right before connector order placement
11. [afterPlaceOrder](./strategy-hooks/after-place-order) — after successful order placement
12. [onRuntimeError](./strategy-hooks/on-runtime-error) — on any runtime or hook error

## Canonical Params Shape

The types come from `StrategyManifest['hooks']` in `@tradejs/types`. Each hook page shows how to read its parameter type from the installed package. Gate hooks return `StrategyHookGateResult` when they need to block an action.

## Important Notes

- Use `tradejs.config.ts -> hooks` for behavior shared across all strategies in the project, such as shared risk controls, cross-strategy position management, or common order filters.
- `beforeSignals` and `afterSignals` are also project-level hooks in `tradejs.config.ts`, but they belong to the `signals` command lifecycle, not to the per-strategy runtime documented on this page.
- Keep strategy-only behavior in `manifest.hooks` when it should apply to one strategy only.
- `entry.runtime.raw` is the raw runtime returned by `core.ts` through `strategyApi.entry(...)`.
- `entry.runtime.resolved` is the runtime actually used by the shared runtime after merging manifest defaults, adapter config, and the raw decision runtime.
- `afterEnrichMl` reports the whole ML stage, including attempts that did not
  apply a model. Use `ml.attempted`, `ml.applied`, and `ml.skippedReason` to
  tell whether ML actually ran.
- `afterEnrichAi` uses the same pattern for AI with the `ai` object.
- `afterCoreDecision` is strict post-`core.ts`. If the candle was short-circuited in `onBar`, use `afterBarDecision` for logic that still must observe the final result of that candle.
- Non-blocking hooks swallow errors: the runtime logs the failure, calls `onRuntimeError`, and continues.
- An exception in `beforeEntryGate` blocks the entry.
  If `beforeClosePosition` throws, TradeJS logs the error and continues
  processing the close request.
