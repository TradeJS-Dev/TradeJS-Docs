---
title: Владение репозиториями и пакетами
---

TradeJS — мультирепозиторная система. Поведение тестируется, версионируется и
публикуется из того репозитория, которому оно принадлежит.

## От генератора до рабочего сервера

1. `npx create-tradejs` создаёт отдельный npm-проект.
2. `@tradejs/base` предоставляет стандартный набор компонентов.
3. Он устанавливает публичные стратегии, индикаторы и коннекторы.
4. Проект хранит `tradejs.config.ts`, lock-файл, локальные данные, результаты
   бэктестов и зависимости от закрытых стратегий.
5. При самостоятельном размещении `TradeJS-Project` собирает версионированный
   образ приложения и передаёт его тег и ревизию проекта в `TradeJS-Deploy`.
6. `TradeJS-Deploy` хранит Compose, TLS, постоянные тома, SSH, ограничения
   ресурсов и секреты рабочего окружения.

Репозиторий фреймворка не владеет пользовательским production-конфигом или
артефактами бэктестов. Deploy-репозиторий не собирает исходники стратегий или
приложения.

## Границы пакетов

- `TradeJS` публикует движок и общие runtime-пакеты.
- `TradeJS-Base` публикует `@tradejs/base` — базовую композицию пакетов.
- `TradeJS-Strategy-Kit` публикует нейтральные helper'ы через явные
  `@tradejs/strategy-kit/*` subpaths.
- Каждый репозиторий `TradeJS-Strategy-*` публикует собственный пакет
  `@tradejs/strategy-*`.
- `TradeJS-Strategy-Template` и `TradeJS-Workflows` стандартизируют новые
  strategy repositories, CI и публикацию.

TrendLine и ReverseTrendLine — единственное групповое исключение. Обе стратегии
живут в `TradeJS-Strategy-TrendLine` и публикуются вместе как
`@tradejs/strategy-trend-line`, потому что используют общую family-механику.
Отдельного trendline-kit пакета нет.

Base, Kit и пакеты стратегий объявляют зависимости от runtime-пакетов TradeJS
через `peerDependencies`; совпадающие `devDependencies` нужны только для
независимой сборки и тестов исходного репозитория. Сгенерированный проект
устанавливает одну точную композицию. Пакет не должен приносить вторую копию
движка через `dependencies`.

## Публичные и private стратегии

Базовый preset зависит от полного публичного каталога. Проект может использовать
preset, перечислить только выбранные публичные пакеты или добавить private
пакет:

```ts
import { basePreset } from '@tradejs/base';
import { defineConfig } from '@tradejs/core/config';

export default defineConfig(basePreset, {
  strategies: ['@your-scope/private-strategy'],
});
```

Доступ к private registry принадлежит сгенерированному проекту или его build
environment. Publishing token публичных пакетов TradeJS нельзя копировать в
runtime или deploy repository.

## Обновление пакетов в рабочем проекте

Для реальной торговли используйте стабильные версии пакетов. Обновите точную
зависимость, lock-файл и полную декларацию стратегии, затем запустите проверки
проекта. Parser каждой стратегии отклоняет неизвестные поля и материализует
defaults. Проверка вычисляет `strategyRevision` из точного пакета стратегии, её
прямых TradeJS-зависимостей, runtime-пакета и разобранной эффективной
конфигурации. `deploymentCompositionId` связывает target развёртывания,
состояние включения, selections и все ревизии стратегий. Ручного runtime-поля
`version` больше нет.

Push в Project обновляет только исходники. Публикация неизменяемого образа и
передача точного SHA в Deploy выполняются отдельным явным workflow. Публикация
пакета стратегии сама по себе не меняет работающую установку TradeJS.

## Где вносить изменение

- Решения, figures, adapters и family helpers стратегии меняются в её
  репозитории.
- Helper для нескольких несвязанных стратегий меняется в
  `TradeJS-Strategy-Kit`.
- Состав публичного preset меняется в `TradeJS-Base`.
- Личная композиция, runtime defaults и app image меняются в `TradeJS-Project`.
- Server topology, credentials, TLS, volumes и rollout policy меняются в
  `TradeJS-Deploy`.
- Общие runtime semantics и public framework contracts меняются в `TradeJS`.
