---
title: Установка
---

Для нового проекта используйте `create-tradejs`. Ручная установка нужна только
при добавлении TradeJS в существующий TypeScript-проект.

## Требования

- Node.js 20.19 или новее;
- npm 10 или новее;
- Docker Desktop либо Docker Engine;
- плагин Docker Compose (`docker compose`).

## Рекомендуемый вариант

```bash
npx create-tradejs
```

Команда устанавливает пакеты, запускает локальные сервисы, создаёт начального
пользователя и конфигурацию бэктеста, затем открывает веб-приложение.
Продолжение: [Первый бэктест](./first-backtest).

## Ручная установка

```bash
mkdir tradejs-project
cd tradejs-project
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Основные пакеты `@tradejs/core`, `@tradejs/node`, `@tradejs/cli` и
`@tradejs/app` должны иметь совместимую старшую версию. `@tradejs/base`,
`@tradejs/strategy-kit` и `@tradejs/strategy-*` выпускаются независимо. Вместо
принудительного выравнивания исправляющих версий сохраняйте lock-файл.

## Создайте `tradejs.config.ts`

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

`basePreset` подключает стандартный набор стратегий, индикаторов и коннекторов.
Подробности: [Владение репозиториями и пакетами](../advanced/repository-ownership).

## Запустите локальные сервисы

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
```

## Создайте пользователя `root`

```bash
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

Подробнее: [Настройка пользователя root](./root-user).

## Запустите веб-приложение

```bash
npx tradejs-app dev
```

Откройте адрес из консоли, обычно `http://localhost:3000`.

## Анонимная телеметрия первого запуска

Веб-приложение отправляет в Яндекс Метрику только названия анонимных событий
`scaffold_success` и `first_backtest`. Конфигурация стратегии, инструменты,
учётные данные и результаты не передаются.

Чтобы отключить события, добавьте в `.env` до запуска или сборки:

```bash
NEXT_PUBLIC_TRADEJS_TELEMETRY_DISABLED=1
```

## Правила импортов

- настройка и регистрация плагинов: `@tradejs/core/config`;
- функции для браузера: документированные `@tradejs/core/*`;
- функции Node.js: документированные `@tradejs/node/*`;
- общие контракты: `@tradejs/types`;
- серверные хранилища: конкретные точки входа `@tradejs/infra/*`.

Не импортируйте внутренние файлы `@tradejs/*/src/*`.
