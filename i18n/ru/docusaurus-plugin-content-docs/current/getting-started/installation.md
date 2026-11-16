---
sidebar_label: Установка
title: Установка TradeJS в TypeScript-проект
description: 'Установите TradeJS через create-tradejs или добавьте публичные npm-пакеты в существующий TypeScript-проект с необходимыми настройками Node.js и Docker.'
---

Эта база знаний описывает TradeJS `3.1.29-beta.301`. Выполните команды
ниже, чтобы установить ту же версию.

## Требования

- Node.js 24;
- npm 10 или новее;
- Docker с командой `docker compose`.

## Создайте проект {#create-project}

Выполните команды в терминале. Вместо `tradejs-project` можно указать другое
имя папки.

```bash
tradejs_version=3.1.29-beta.301
npx "create-tradejs@$tradejs_version" tradejs-project --no-install
cd tradejs-project
```

## Установите пакеты {#install-packages}

Если у вас уже есть проект, откройте его папку и задайте ту же переменную
`tradejs_version` из предыдущего шага.

```bash
for package in app cli connectors core indicators infra node types; do
  npm pkg set "dependencies.@tradejs/$package=$tradejs_version" \
    "overrides.@tradejs/$package=\$@tradejs/$package"
done
npm install --save-exact @tradejs/base
```

Команды устанавливают основные пакеты TradeJS одной версии. Пакет
`@tradejs/base` и пакеты стратегий выпускаются отдельно. Сохраните
`package-lock.json`, чтобы повторная установка использовала те же версии.

## Запустите приложение {#start-app}

В проекте, созданном через `create-tradejs`, выполните:

```bash
npm run infra-up
npm run dev
```

Откройте адрес из терминала, обычно `http://localhost:3000`. На странице
установки задайте пароль локального пользователя `root`. Дальше можно
[запустить первый бэктест](./first-backtest).

## Добавьте TradeJS в существующий проект

После установки пакетов добавьте `tradejs.config.ts`, если его ещё нет:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

Затем запустите сервисы и приложение:

```bash
npm exec -- tradejs infra-init
npm exec -- tradejs infra-up
npm exec -- tradejs-app dev
```

`basePreset` подключает стандартные стратегии, индикаторы и коннекторы.
Если хотите запустить стратегию на рынке, сначала
[настройте её запуск](./run-strategy-in-production).

## Правила импортов

- настройка и регистрация плагинов: `@tradejs/core/config`;
- функции для браузера: документированные `@tradejs/core/*`;
- функции Node.js: документированные `@tradejs/node/*`;
- общие контракты: `@tradejs/types`;
- серверные хранилища: конкретные точки входа `@tradejs/infra/*`.

Не импортируйте внутренние файлы `@tradejs/*/src/*`.
