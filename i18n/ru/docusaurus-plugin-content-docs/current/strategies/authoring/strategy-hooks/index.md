---
title: Хуки жизненного цикла стратегий
---

Среда исполнения вызывает хуки, то есть обработчики жизненного цикла, до и
после решения стратегии, оценки с помощью ИИ и машинного обучения, а также
постановки ордера.

Хуки можно объявлять в двух местах:

- локально для стратегии в `manifest.ts` через `manifest.hooks`
- на уровне проекта в `tradejs.config.ts` через `hooks`

Обработчики из `tradejs.config.ts` применяются ко всем стратегиям проекта.
Обработчики из `manifest.ts` добавляются к ним. На каждом этапе сначала работают
обработчики проекта, а затем обработчики стратегии.

## Порядок вызова

1. [onInit](./strategy-hooks/on-init) — один раз при создании среды исполнения
2. [onBar](./strategy-hooks/on-bar) — на каждой свече до `core.ts`
3. [afterCoreDecision](./strategy-hooks/after-core-decision) — после `core.ts`, только если `core.ts` вообще выполнялся
4. [afterBarDecision](./strategy-hooks/after-bar-decision) — после финального решения по свече, независимо от того, пришло оно из `onBar` или из `core.ts`
5. [onSkip](./strategy-hooks/on-skip) — только для `skip`
6. [beforeClosePosition](./strategy-hooks/before-close-position) — проверка, которая может заблокировать закрытие
7. [afterEnrichMl](./strategy-hooks/after-enrich-ml) — только когда есть `decision.signal`
8. [afterEnrichAi](./strategy-hooks/after-enrich-ai) — только когда есть `decision.signal`
9. [beforeEntryGate](./strategy-hooks/before-entry-gate) — проверка, которая может заблокировать вход
10. [beforePlaceOrder](./strategy-hooks/before-place-order) — прямо перед вызовом коннектора
11. [afterPlaceOrder](./strategy-hooks/after-place-order) — после успешной постановки ордера
12. [onRuntimeError](./strategy-hooks/on-runtime-error) — при любой ошибке среды исполнения или хука

## Общая структура параметров

Каждый хук получает нужную для своего этапа часть одного и того же вложенного объекта:

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

Хуки-проверки возвращают такой объект, если хотят заблокировать исполнение:

```ts
{
  allow?: boolean;
  reason?: string;
}
```

## Важные замечания

- Используйте `tradejs.config.ts -> hooks`, когда логика должна применяться сразу ко всем стратегиям проекта: например, для общих правил риска, управления позициями нескольких стратегий или общих фильтров ордеров.
- `beforeSignals` и `afterSignals` тоже задаются на уровне проекта в `tradejs.config.ts`, но относятся к жизненному циклу команды `signals`, а не к среде исполнения отдельной стратегии, описанной на этой странице.
- Логику, которая нужна только одной стратегии, оставляйте в `manifest.hooks`.
- `entry.runtime.raw` содержит исходные настройки, которые `core.ts` вернул через `strategyApi.entry(...)`.
- `entry.runtime.resolved` содержит итоговые настройки после объединения значений из манифеста, конфигурации адаптера и решения стратегии.
- `afterEnrichMl` описывает весь этап машинного обучения, а не только успешный результат. Проверяйте `ml.attempted`, `ml.applied` и `ml.skippedReason`.
- `afterEnrichAi` работает так же через объект `ai`.
- `afterCoreDecision` вызывается строго после `core.ts`. Если `onBar` завершил обработку свечи раньше, а вам всё равно нужно итоговое решение, используйте `afterBarDecision`.
- Ошибки неблокирующих хуков не прерывают работу: среда исполнения записывает их в журнал, вызывает `onRuntimeError` и продолжает выполнение.
- Ошибки в хуках-проверках (`beforeClosePosition`, `beforeEntryGate`) тоже не прерывают работу. Среда исполнения ведёт себя так, будто хук вернул `undefined`.
