---
sidebar_position: 2
title: Быстрый старт
---

Создайте и запустите self-hosted TradeJS-проект из публичных npm-пакетов:

```bash
npx create-tradejs
```

Это рекомендуемый старт для внешнего пользователя. Команда создаёт
`tradejs-project`, устанавливает согласованные версии TradeJS-пакетов, запускает
локальную Docker-инфраструктуру и открывает Web UI. На install-странице задайте
и подтвердите пароль локального пользователя `root`. TradeJS автоматически
авторизует пользователя и откроет dashboard.

На dashboard загрузится график Coinbase BTCUSDT. Кнопка **Create backtest** в правом
верхнем углу открывает форму запуска бэктеста. Полный сценарий описан в статье
[Первый бэктест](./first-backtest).

## Что создаётся в проекте

- `tradejs.config.ts` с `basePreset`;
- `.env` с локальными auth URL и сгенерированным auth secret;
- `docker-compose.dev.yml` для Redis и PostgreSQL/Timescale;
- npm scripts для UI, CLI-бэктестов и инфраструктуры;
- `.tradejs/app` как generated UI output после первого запуска приложения.

`tradejs-app` создаёт `.tradejs/app` как generated UI output. Настраивайте
TradeJS из корня проекта и не редактируйте сгенерированную копию приложения.

## Ежедневные команды

Запускайте их из `tradejs-project`:

```bash
npm run infra-up
npm run doctor
npm run dev
```

Полезные routes:

- `/routes/dashboard` — графики, сигналы и кнопка **Create backtest**;
- `/routes/backtest` — запуск jobs и просмотр прогресса;
- `/routes/strategies` — runtime strategy config.

Остановка локальных services:

```bash
npm run infra-down
```

## Ручная установка пакетов

Она нужна только для интеграции TradeJS в существующий проект. Используйте одну
версию для всех `@tradejs/*` пакетов:

```bash
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

После этого выполните ручную настройку из статьи [Установка](./installation).

## Частые ошибки

### Docker недоступен

Запустите Docker Desktop или Docker daemon, проверьте `docker compose version` и
повторите `npx create-tradejs` в новой пустой папке.

### Папка по умолчанию уже существует

Передайте другое имя:

```bash
npx create-tradejs my-trading-project
```

### Версии пакетов не совпадают

Удалите `node_modules` и lockfile, затем установите все TradeJS-пакеты вместе.
Не смешивайте разные версии `@tradejs/*`.
