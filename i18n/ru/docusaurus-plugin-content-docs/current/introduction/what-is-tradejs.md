---
title: Что такое TradeJS?
---

TradeJS — TypeScript-фреймворк для создания, бэктестинга и запуска программируемых торговых стратегий. Self-hosted runtime оставляет инфраструктуру и исполнение под вашим контролем.

В базовом виде TradeJS-проект состоит из:

- рыночных свечей;
- одной или нескольких стратегий;
- сигналов для потенциальных входов и выходов;
- runtime для бэктестов, сканирования и опционального исполнения;
- метрик и артефактов для сравнения поведения.

TradeJS — это developer framework и runtime stack, а не black-box trading product. Вы пишете или настраиваете стратегию, прогоняете её на исторических данных, анализируете результат и сами решаете, подходит ли она для runtime-сигналов или контролируемой автоматизации на вашей инфраструктуре.

## Основной процесс

1. Напишите типизированную логику стратегии и индикаторы на TypeScript.
2. Проведите бэктесты и сравните конфигурации на исторических данных.
3. Перенесите выбранный результат в runtime-конфигурацию.
4. Генерируйте сигналы и при необходимости автоматизируйте исполнение на своей инфраструктуре.

## Что можно делать

- Исследовать стратегии на TypeScript.
- Запускать бэктесты и сравнивать конфиги.
- Генерировать runtime-сигналы.
- Запускать фреймворк локально или на своей инфраструктуре.
- Подключать свои strategy, indicator и connector plugins.
- Добавлять совместимость с Pine-backed стратегиями и AI/ML workflows как опциональные расширения.
- Смотреть результаты в installable app.

## Публичная поверхность

- `@tradejs/core` - config, helpers, indicators, math, time, figures.
- `@tradejs/node` - Node runtime, backtests, Pine strategy loading, registries.
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
- [Лицензирование](./licensing)
