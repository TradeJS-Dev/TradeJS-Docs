---
sidebar_label: Установка
title: Установка TradeJS в TypeScript-проект
description: 'Установите TradeJS через create-tradejs или добавьте публичные npm-пакеты в существующий TypeScript-проект с необходимыми настройками Node.js и Docker.'
---

Установите TradeJS командой `npx create-tradejs`, как на сайте TradeJS.
На момент выпуска документации она устанавливает стабильный `3.1.28`.
Рабочий сервер использует `3.1.29-beta.302`. Для точного воспроизведения
этой версии воспользуйтесь инструкцией ниже.

## Требования

- Node.js 24 и npm 10 или новее.
- Запущенный Docker с командой `docker compose`.

## Создайте проект {#create-project}

В папке, где хотите создать проект, выполните
`npx create-tradejs`. Команда установит TradeJS и
откроет приложение. Дальше следуйте [инструкции по первому бэктесту](./first-backtest).

Если установка сорвалась при скачивании Chrome через Puppeteer, перейдите в
уже созданную папку `tradejs-project`. Для локального бэктеста эта загрузка
не нужна. Выполните `PUPPETEER_SKIP_DOWNLOAD=true npm install` в Bash или Zsh
и переходите к [запуску приложения](#start-app).

## Установите бета-версию {#install-packages}

Сначала создайте проект без установки зависимостей. Так можно указать
одинаковую бета-версию для всех пакетов движка. Выполните в Bash или Zsh:

```bash
npx create-tradejs@3.1.29-beta.302 tradejs-project --no-install
cd tradejs-project

tradejs_version=3.1.29-beta.302
for package in app cli connectors core indicators infra node types; do
  npm pkg set "dependencies.@tradejs/$package=$tradejs_version" \
    "overrides.@tradejs/$package=\$@tradejs/$package"
done
npm install --save-exact @tradejs/base@3.1.8
```

Цикл записывает версию восьми пакетов в `package.json`. Поле `overrides`
выравнивает версии вложенных зависимостей. У `@tradejs/base` и пакетов
стратегий свои версии. Сохраните `package-lock.json`, чтобы повторить установку
с теми же версиями.

## Запустите приложение {#start-app}

Если вы только установили пакеты, выполните в папке проекта:

```bash
npm exec -- tradejs infra-init
npm run infra-up
npm run dev
```

Откройте адрес из терминала. Задайте пароль на странице установки и переходите
к [первому бэктесту](./first-backtest). Если Docker сообщает, что порт занят,
укажите свободный порт в `.env` проекта и повторите `npm run infra-up`.

## Добавьте TradeJS в существующий проект

Установите пакеты движка одной версии. В разделе
[«Установите бета-версию»](#install-packages) перечислены зависимости и
переопределения. Выполните эти шаги в папке существующего проекта и пропустите
создание новой папки.

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
