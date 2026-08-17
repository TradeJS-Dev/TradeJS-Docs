---
title: Владение репозиториями и пакетами
---

TradeJS — мультирепозиторная система. Поведение тестируется, версионируется и
публикуется из того репозитория, которому оно принадлежит.

## От генератора до production

1. `npx create-tradejs` создаёт отдельный npm-проект.
2. `@tradejs/base` предоставляет непустой базовый preset.
3. Preset устанавливает публичные пакеты стратегий, индикаторы и коннекторы.
4. Проект владеет `tradejs.config.ts`, lockfile, локальными данными и
   артефактами бэктестов, а также private strategy dependencies.
5. Для self-hosting `TradeJS-Project` собирает image приложения и передаёт в
   `TradeJS-Deploy` immutable image tag и revision проекта.
6. `TradeJS-Deploy` владеет Compose, TLS, persistent volumes, SSH, server
   resource limits и production secrets.

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

