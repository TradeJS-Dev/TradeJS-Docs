---
sidebar_label: Установка
title: Установка TradeJS в TypeScript-проект
description: 'Установите TradeJS через create-tradejs или добавьте публичные npm-пакеты в существующий TypeScript-проект с необходимыми настройками Node.js и Docker.'
---

Установщик использует актуальную стабильную версию TradeJS из npm. Сейчас это `3.1.28`.

## Требования

- Node.js 24 и npm 10 или новее.
- Запущенный Docker с командой `docker compose`.

## Создайте проект {#create-project}

В папке, где хотите создать проект, выполните ту же команду, что и на сайте TradeJS.

```bash
npx create-tradejs
```

Команда установит TradeJS и откроет приложение. Дальше следуйте
[инструкции по первому бэктесту](./first-backtest).

Если установка сорвалась при скачивании Chrome через Puppeteer, перейдите в
уже созданную папку `tradejs-project`. Для локального бэктеста эта загрузка
не нужна. Выполните `PUPPETEER_SKIP_DOWNLOAD=true npm install` в Bash или Zsh
и переходите к [запуску приложения](#start-app).

## Запустите приложение {#start-app}

Если пропустили запуск приложения при установке, выполните в папке проекта:

```bash
npm exec -- tradejs infra-init
npm run infra-up
npm run dev
```

Откройте адрес из терминала. Задайте пароль на странице установки и переходите
к [первому бэктесту](./first-backtest). Если Docker сообщает, что порт занят,
укажите свободный порт в `.env` проекта и повторите `npm run infra-up`.

## Добавьте TradeJS в существующий проект {#install-packages}

Чтобы установить стабильные пакеты, выполните в папке своего TypeScript-проекта:

```bash
npm install --save-exact @tradejs/app @tradejs/cli @tradejs/core @tradejs/base
```

Если в проекте ещё нет `tradejs.config.ts`, создайте этот файл:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

Затем выполните в той же папке:

```bash
npm exec -- tradejs infra-init
npm exec -- tradejs infra-up
npm exec -- tradejs-app dev
```

## Правила импортов

Используйте публичные пути. Например, `@tradejs/core/config` для настройки
проекта, `@tradejs/node/*` для серверного кода и `@tradejs/types` для типов.
Другие публичные пути перечислены в [справочнике](../api/framework).
