---
title: Что такое TradeJS?
---

TradeJS помогает разработчикам создавать, тестировать и автоматизировать торговые стратегии на TypeScript.

В базовом виде TradeJS-проект состоит из:

- рыночных свечей;
- одной или нескольких стратегий;
- сигналов для потенциальных входов и выходов;
- runtime для бэктестов, сканирования и опционального исполнения;
- метрик и артефактов для сравнения поведения.

TradeJS - это developer framework, а не black-box trading product. Вы пишете или настраиваете стратегию, прогоняете ее на исторических данных, анализируете вывод и сами решаете, подходит ли она для дальнейшего исследования или автоматизации.

## Что можно делать

- Исследовать стратегии на TypeScript.
- Использовать Pine Script-inspired workflows.
- Запускать бэктесты и сравнивать конфиги.
- Генерировать runtime-сигналы.
- Подключать свои strategy, indicator и connector plugins.
- Использовать AI/ML как дополнительные research/gating слои.
- Смотреть результаты в installable app.

## Публичная поверхность

- `@tradejs/core` - config, helpers, indicators, math, time, figures.
- `@tradejs/node` - Node runtime, backtests, Pine loading, registries.
- `@tradejs/cli` - setup, backtests, signals, results, AI/ML workflows.
- `@tradejs/app` - опциональный web UI.
- `@tradejs/base` - default preset.
- `@tradejs/types` - общие контракты.

Рекомендуемый стартовый конфиг:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

## Дальше

- [Установка](../getting-started/installation)
- [Первый бэктест](../getting-started/first-backtest)
- [Базовые понятия: стратегия](../core-concepts/strategy)
- [Примеры](../examples)
