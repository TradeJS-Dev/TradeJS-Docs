---
sidebar_position: 7
title: Как создавать стратегии
---

В TradeJS решение стратегии описывается небольшим типизированным
контрактом. Его можно реализовать на TypeScript или связать с отдельным
файлом Pine.

TradeJS поддерживает два пути создания стратегий:

- [TypeScript-стратегия через `StrategyAPI`](./typescript-strategy-step-by-step)
- [Pine-стратегия с отдельным `.pine` исходником](./pine-strategy-step-by-step)

## Типовая структура стратегии

В публичном пакете `@tradejs/strategy-*` или в вашем npm-пакете обычно есть:

- `config.ts`
- `core.ts`
- `figures.ts` (если стратегия рисует свои линии/точки/зоны)
- `strategy.ts`
- `manifest.ts`
- `adapters/ai.ts` (опционально)
- `adapters/ml.ts` (опционально)
- `hooks.ts` (опционально)

## Контракт среды исполнения

`core.ts` возвращает один из трех вариантов:

- `skip`
- `entry`
- `exit`

Общая среда исполнения отвечает за:

- дополнение сигнала данными ИИ и модели машинного обучения
- проверки правил
- исполнение ордера
- хуки жизненного цикла

Файлы:

- `@tradejs/node/strategies`
- `@tradejs/core/strategies`
- [Хуки жизненного цикла стратегий](./strategy-hooks)

Правило импортов:

- импортируйте код среды исполнения Node.js из `@tradejs/node/strategies`
- импортируйте чистые вспомогательные функции стратегии из `@tradejs/core/strategies`
- импортируйте общие контракты из `@tradejs/types`
- не импортируйте непубличные внутренние модули напрямую

## Пример минимального `core.ts`

```ts
export const createMyStrategyCore: CreateStrategyCore<
  MyStrategyConfig
> = async ({ strategyApi }) => {
  return async () => {
    const position = await strategyApi.getCurrentPosition();
    if (position && position.qty > 0) {
      return strategyApi.skip('POSITION_EXISTS');
    }

    const { currentPrice } = await strategyApi.getDecisionPriceContext();

    const { stopLossPrice, takeProfitPrice } =
      strategyApi.getDirectionalTpSlPrices({
        price: currentPrice,
        direction: 'LONG',
        takeProfitDelta: 2,
        stopLossDelta: 1,
        unit: 'percent',
      });

    return strategyApi.entry({
      direction: 'LONG',
      orderPlan: {
        qty: 1,
        stopLossPrice,
        takeProfits: [{ rate: 1, price: takeProfitPrice }],
      },
    });
  };
};
```

## Правила доступа к данным через StrategyAPI

- Используйте `getDecisionPriceContext()` для текущей закрытой свечи, времени и цены в момент сигнала.
- Используйте `getCurrentIndicatorsContext()` для типизированного снимка индикаторов и `baseContext`. Тип снимка наследуется из `CreateStrategyCore`; не передавайте параметр типа самому методу.
- Вызывайте `getCurrentPosition()` один раз и определяйте наличие позиции по `qty`.
- Полная история рынка недоступна через `StrategyAPI`. Детектор с внутренним состоянием должен восстановиться из начальных данных и хранить только необходимое скользящее окно ограниченного размера.
- Возвращайте выход через `strategyApi.exit({ code, direction })`. Цена и время выхода определяются по текущей закрытой свече и не могут быть переопределены стратегией.

## Где настраивается среда исполнения

- `manifest.ts`:

  - `entryRuntimeDefaults`
  - `hooks`
  - `aiAdapter`
  - `mlAdapter`

- `tradejs.config.ts`:

  - `hooks` для общей логики сразу на все стратегии текущего проекта
  - подходит для общих правил риска, управления позициями нескольких стратегий и общих фильтров ордеров

- `adapters/*`:

  - преобразование правил из конфигурации (`mapEntryRuntimeFromConfig`)
  - подготовка данных для ИИ и модели машинного обучения

## Пошаговые руководства

- [Стратегия на TypeScript: пошаговое руководство](./typescript-strategy-step-by-step)
- [Стратегия на Pine: пошаговое руководство](./pine-strategy-step-by-step)

## Внешняя стратегия как npm-плагин

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  strategies: ['@scope/tradejs-strategy-pack'],
});
```

Пример плагина:

- публикуйте стратегию как npm-пакет и подключайте через `strategies`
