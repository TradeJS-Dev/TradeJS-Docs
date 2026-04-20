---
title: Хуки жизненного цикла стратегий
---

В этом разделе описан контракт lifecycle-хуков, который использует shared runtime стратегии.

Хуки можно объявлять в двух местах:

- локально для стратегии в `manifest.ts` через `manifest.hooks`
- на уровне проекта в `tradejs.config.ts` через `hooks`

Project-level hooks применяются ко всем стратегиям, которые загружены текущим config. Strategy hooks из manifest при этом не исчезают: они merge’ятся дополнительно. Для одного и того же stage сначала выполняются project hooks, потом hooks из manifest стратегии.

## Порядок вызова

1. [onInit](./on-init) — один раз при создании runtime
2. [onBar](./on-bar) — на каждой свече до `core.ts`
3. [afterCoreDecision](./after-core-decision) — после `core.ts`, только если `core.ts` вообще выполнялся
4. [afterBarDecision](./after-bar-decision) — после финального решения по свече, независимо от того, пришло оно из `onBar` или из `core.ts`
5. [onSkip](./on-skip) — только для `skip`
6. [beforeClosePosition](./before-close-position) — gate, может заблокировать закрытие
7. [afterEnrichMl](./after-enrich-ml) — только когда есть `decision.signal`
8. [afterEnrichAi](./after-enrich-ai) — только когда есть `decision.signal`
9. [beforeEntryGate](./before-entry-gate) — gate, может заблокировать вход
10. [beforePlaceOrder](./before-place-order) — прямо перед вызовом коннектора
11. [afterPlaceOrder](./after-place-order) — после успешной постановки ордера
12. [onRuntimeError](./on-runtime-error) — на любой runtime/hook error

## Канонический shape params

Теперь каждый хук получает stage-specific подмножество одного и того же вложенного объекта:

```ts
{
  ctx?: StrategyHookCtx;
  market?: StrategyHookMarketContext;
  decision?: StrategyDecision;
  entry?: StrategyHookEntryContext;
  ml?: StrategyHookMlContext;
  ai?: StrategyHookAiContext;
  policy?: StrategyHookPolicyContext;
  order?: StrategyHookOrderContext;
  error?: StrategyHookErrorPayload;
}
```

## Общие вложенные объекты

`ctx`:

```ts
{
  connector: Connector;
  strategyName: string;
  userName: string;
  symbol: string;
  strategyConfig: StrategyConfig;
  env: string;
  isConfigFromBacktest: boolean;
}
```

`market`:

```ts
{
  candle?: KlineChartItem;
  btcCandle?: KlineChartItem;
  data?: KlineChartItem[];
  btcData?: KlineChartItem[];
}
```

`entry`:

```ts
{
  context: StrategyEntrySignalContext;
  orderPlan: StrategyEntryOrderPlan;
  signal?: Signal;
  runtime: {
    raw?: StrategyEntryRuntimeOptions;
    resolved: StrategyEntryRuntimeOptions;
  };
}
```

`ml`:

```ts
{
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
}
```

`ai`:

```ts
{
  config?: StrategyRuntimeAiOptions;
  attempted: boolean;
  applied: boolean;
  quality?: number;
  skippedReason?: 'BACKTEST' | 'DISABLED' | 'NO_RUNTIME' | 'NO_QUALITY';
}
```

`policy`:

```ts
{
  aiQuality?: number;
  makeOrdersEnabled: boolean;
  minAiQuality: number;
}
```

`order`:

```ts
{
  result: Signal | string;
}
```

`error`:

```ts
{
  stage: StrategyHookStage;
  cause: unknown;
}
```

Gate-хуки возвращают такой shape, если хотят заблокировать исполнение:

```ts
{
  allow?: boolean;
  reason?: string;
}
```

## Важные замечания

- Используйте `tradejs.config.ts -> hooks`, когда логика должна применяться сразу ко всем стратегиям проекта: например, для общих risk rules, cross-strategy управления позициями или общих фильтров на постановку ордеров.
- `beforeSignals` и `afterSignals` тоже являются project-level hooks в `tradejs.config.ts`, но относятся к lifecycle команды `signals`, а не к per-strategy runtime, который описан на этой странице.
- Логику, которая нужна только одной стратегии, оставляйте в `manifest.hooks`.
- `entry.runtime.raw` — это raw runtime, который вернул `core.ts` через `strategyApi.entry(...)`.
- `entry.runtime.resolved` — это runtime, который реально использует shared runtime после merge manifest defaults, adapter config и raw decision runtime.
- `afterEnrichMl` описывает именно ML stage, а не только успешный ML. Смотри `ml.attempted`, `ml.applied` и `ml.skippedReason`.
- `afterEnrichAi` использует тот же паттерн через объект `ai`.
- `afterCoreDecision` теперь строго post-`core.ts`. Если свеча была short-circuit’нута в `onBar`, а тебе все равно нужно увидеть итоговое решение по свече, используй `afterBarDecision`.
- Ошибки non-blocking хуков проглатываются: runtime логирует их, вызывает `onRuntimeError` и продолжает выполнение.
- Ошибки в gate-хуках (`beforeClosePosition`, `beforeEntryGate`) тоже проглатываются; runtime ведет себя так, будто хук вернул `undefined`.
