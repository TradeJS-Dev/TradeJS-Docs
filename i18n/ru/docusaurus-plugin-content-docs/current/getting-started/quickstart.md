---
sidebar_position: 2
title: Быстрый старт
---

Этот гайд создаёт self-hosted TypeScript-проект из публичных npm-пакетов. Он рассчитан на внешнего пользователя без клонирования TradeJS monorepo.

Если нужны только команды установки, начните с [Установки](./installation). Пошаговый package-only запуск описан в [Первом бэктесте](./first-backtest).

## 1. Установите пакеты

```bash
mkdir tradejs-project
cd tradejs-project
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Используйте одинаковую версию для всех `@tradejs/*` пакетов. В актуальном source project публичные пакеты имеют версию `1.0.10`.

`tradejs-app` при запуске из `node_modules` создает внутреннюю рабочую копию `.tradejs/app`. Считайте эту папку generated output; настраивайте проект из корневого `tradejs.config.ts`.

## 2. Настройте TradeJS

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

`basePreset` подключает built-in strategy, indicator и connector catalogs.

## 3. Запустите локальную инфраструктуру

`infra-init` создает `docker-compose.dev.yml` в корне проекта один раз. Если файл уже существует, он не перезаписывается.

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
```

Примечания:

- `docker-compose.dev.yml` - локальная dev-инфраструктура.
- `docker-compose.prod.yml` - production compose, `infra-up` его не использует.

## 4. Создайте root-пользователя

```bash
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

Подробнее: [Root User Setup](./root-user).

## 5. Запустите бэктест

`backtest` не является initializer: команде нужен сохраненный backtest config в
Redis. Не запускайте bare-команду `npx @tradejs/cli backtest` в новом проекте.

[Первый бэктест](./first-backtest) показывает, как сохранить `MaStrategy:base`.
После этого выполните:

```bash
npx @tradejs/cli backtest --user root --config MaStrategy:base --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

Команды `results`, `signals` и другие сценарии с обязательными аргументами и
prerequisites описаны в [CLI API](../api/cli).

## 6. Запустите Web UI

```bash
npx tradejs-app dev
```

Откройте:

- `http://localhost:3000/routes/backtest` для сохраненных бэктестов;
- `http://localhost:3000/routes/dashboard` для графиков и сигналов;
- `http://localhost:3000/routes/strategies` для runtime strategy config.

Если порт `3000` занят, `tradejs-app dev` выберет следующий свободный порт и выведет фактический URL.

Production mode:

```bash
npx tradejs-app build
npx tradejs-app start
```

## 7. Остановите dev infra

```bash
npx @tradejs/cli infra-down
```
