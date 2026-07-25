---
title: Установка
---

Используйте `create-tradejs` для нового проекта. Ручная установка пакетов нужна
только при добавлении TradeJS в существующий TypeScript-проект. Оба пути не
зависят от workspace-команд монорепозитория.

## Требования

- Node.js 20.19 или новее
- npm `10+`
- Docker Desktop или Docker Engine
- Docker Compose plugin (`docker compose`)

## Рекомендуемый путь: готовый проект

```bash
npx create-tradejs
```

Команда установит пакеты, запустит локальную инфраструктуру, создаст начального
пользователя и backtest config и откроет Web UI. Продолжение — в статье
[Первый бэктест](./first-backtest).

## Ручная установка

```bash
mkdir tradejs-project
cd tradejs-project
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Держите все пакеты `@tradejs/*` на одной версии. Если фиксируете версии
вручную, указывайте один и тот же номер релиза для каждого пакета TradeJS.

## Добавьте `tradejs.config.ts`

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

`basePreset` подключает built-in стратегии, индикаторы, коннекторы и базовые hooks.

## Запустите локальную инфраструктуру

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
```

## Создайте пользователя root

```bash
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

Подробнее: [Настройка root](./root-user).

## Запустите UI

```bash
npx tradejs-app dev
```

Откройте URL, который команда напечатает в консоль. Обычно это `http://localhost:3000`.

## Анонимная onboarding-телеметрия

Web UI отправляет в Яндекс Метрику только названия анонимных целей
`scaffold_success` и `first_backtest`. Конфигурация стратегии, символы,
учётные данные и результаты бэктеста не передаются. Чтобы отключить эти
события, добавьте в `.env` проекта перед запуском или сборкой приложения:

```bash
NEXT_PUBLIC_TRADEJS_TELEMETRY_DISABLED=1
```

## Правила импортов

- config/plugin helpers: `@tradejs/core/config`;
- browser-safe helpers: публичные `@tradejs/core/*` subpaths;
- Node runtime helpers: публичные `@tradejs/node/*` subpaths;
- shared contracts: `@tradejs/types`;
- не используйте `@tradejs/*/src/*`.
