---
title: Strategy Runtime Hooks
---

This section documents the lifecycle hook contract used by the shared strategy runtime.

Hooks can be declared in two places:

- strategy-local hooks in `manifest.ts` under `manifest.hooks`
- project-level shared hooks in `tradejs.config.ts` under `hooks`

Project-level hooks apply to every strategy loaded by the current project config. Strategy manifest hooks still work and are merged additively. For the same stage, project hooks run before strategy manifest hooks.

## Runtime Order

1. [onInit](./on-init) — once, at strategy creation
2. [onBar](./on-bar) — every candle before `core.ts`
3. [afterCoreDecision](./after-core-decision) — after `core.ts`, only if `core.ts` actually ran
4. [afterBarDecision](./after-bar-decision) — after the final candle decision, whether it came from `onBar` or `core.ts`
5. [onSkip](./on-skip) — only for `skip` decisions
6. [beforeClosePosition](./before-close-position) — gate, can block close
7. [afterEnrichMl](./after-enrich-ml) — only when `decision.signal` exists
8. [afterEnrichAi](./after-enrich-ai) — only when `decision.signal` exists
9. [beforeEntryGate](./before-entry-gate) — gate, can block entry
10. [beforePlaceOrder](./before-place-order) — right before connector order placement
11. [afterPlaceOrder](./after-place-order) — after successful order placement
12. [onRuntimeError](./on-runtime-error) — on any runtime or hook error

## Canonical Params Shape

Every hook now receives a stage-specific subset of the same nested object:

```ts
type HookParams = {
  ctx?: StrategyHookCtx;
  market?: StrategyHookMarketContext;
  decision?: StrategyDecision;
  entry?: StrategyHookEntryContext;
  ml?: StrategyHookMlContext;
  ai?: StrategyHookAiContext;
  policy?: StrategyHookPolicyContext;
  order?: StrategyHookOrderContext;
  error?: StrategyHookErrorPayload;
};
```

## Common Nested Shapes

`ctx`:

```ts
type StrategyHookCtx = {
  connector: Connector;
  strategyName: string;
  userName: string;
  symbol: string;
  strategyConfig: StrategyConfig;
  env: string;
  isConfigFromBacktest: boolean;
};
```

`market`:

```ts
type StrategyHookMarketContext = {
  candle?: KlineChartItem;
  btcCandle?: KlineChartItem;
  data?: KlineChartItem[];
  btcData?: KlineChartItem[];
};
```

`entry`:

```ts
type StrategyHookEntryContext = {
  context: StrategyEntrySignalContext;
  orderPlan: StrategyEntryOrderPlan;
  signal?: Signal;
  runtime: {
    raw?: StrategyEntryRuntimeOptions;
    resolved: StrategyEntryRuntimeOptions;
  };
};
```

`ml`:

```ts
type StrategyHookMlContext = {
  config?: StrategyRuntimeMlOptions;
  attempted: boolean;
  applied: boolean;
  result?: Signal['ml'];
  skippedReason?:
    | 'BACKTEST'
    | 'DISABLED'
    | 'NO_RUNTIME'
    | 'NO_STRATEGY_CONFIG'
    | 'NO_THRESHOLD'
    | 'NO_RESULT';
};
```

`ai`:

```ts
type StrategyHookAiContext = {
  config?: StrategyRuntimeAiOptions;
  attempted: boolean;
  applied: boolean;
  quality?: number;
  skippedReason?: 'BACKTEST' | 'DISABLED' | 'NO_RUNTIME' | 'NO_QUALITY';
};
```

`policy`:

```ts
type StrategyHookPolicyContext = {
  aiQuality?: number;
  makeOrdersEnabled: boolean;
  minAiQuality: number;
};
```

`order`:

```ts
type StrategyHookOrderContext = {
  result: Signal | string;
};
```

`error`:

```ts
type StrategyHookErrorPayload = {
  stage: StrategyHookStage;
  cause: unknown;
};
```

Gate hooks return this shape when they want to block execution:

```ts
type GateOutput = {
  allow?: boolean;
  reason?: string;
};
```

## Important Notes

- Use `tradejs.config.ts -> hooks` for behavior shared across all strategies in the project, such as shared risk controls, cross-strategy position management, or common order filters.
- `beforeSignals` and `afterSignals` are also project-level hooks in `tradejs.config.ts`, but they belong to the `signals` command lifecycle, not to the per-strategy runtime documented on this page.
- Keep strategy-only behavior in `manifest.hooks` when it should apply to one strategy only.
- `entry.runtime.raw` is the raw runtime returned by `core.ts` through `strategyApi.entry(...)`.
- `entry.runtime.resolved` is the runtime actually used by the shared runtime after merging manifest defaults, adapter config, and the raw decision runtime.
- `afterEnrichMl` is about the ML stage, not only ML success. Use `ml.attempted`, `ml.applied`, and `ml.skippedReason` to tell whether ML actually ran.
- `afterEnrichAi` uses the same pattern for AI with the `ai` object.
- `afterCoreDecision` is strict post-`core.ts`. If the candle was short-circuited in `onBar`, use `afterBarDecision` for logic that still must observe the final result of that candle.
- Non-blocking hooks swallow errors: the runtime logs the failure, calls `onRuntimeError`, and continues.
- Gate hooks (`beforeClosePosition`, `beforeEntryGate`) also swallow their own errors; if they throw, runtime behaves as if the hook returned `undefined`.
