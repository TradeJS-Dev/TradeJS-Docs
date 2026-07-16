---
title: Первый бэктест
---

Создайте полноценный локальный TradeJS-проект и запустите первый бэктест из
Web UI. Клонировать TradeJS monorepo и вручную заполнять Redis не нужно.

## Требования

- Node.js 20.19 или новее
- npm 10 или новее
- Docker Desktop или Docker Engine
- Docker Compose plugin (`docker compose`)

## 1. Создайте и запустите TradeJS

```bash
npx create-tradejs
```

Команда создаёт папку `tradejs-project`, после чего:

1. устанавливает публичные пакеты TradeJS;
2. создаёт `tradejs.config.ts` и локальные environment-файлы;
3. запускает Redis и PostgreSQL/Timescale и ждёт прохождения healthchecks;
4. запускает Web UI и открывает install-страницу в браузере.

Чтобы выбрать другое имя проекта:

```bash
npx create-tradejs my-trading-project
```

## 2. Завершите локальную установку

Введите и подтвердите пароль локального пользователя `root`. TradeJS сохранит в
локальном Redis только hash пароля, создаст стартовый config `MaStrategy:base`,
авторизует пользователя и откроет dashboard.

На dashboard должен появиться стандартный график Coinbase BTCUSDT. Нажмите
**Create backtest** в правом верхнем углу.

## 3. Запустите бэктест

Preset `First backtest preset` уже содержит:

- strategy/config: `MaStrategy:base`;
- connector: Binance;
- ticker: `BTCUSDT`;
- interval: 15 минут;
- окно: 45 дней;
- tests/parallel workers: 1/1.

Нажмите **Start**. TradeJS загрузит необходимую публичную историю свечей,
запустит бэктест и покажет прогресс и логи на странице. Точные метрики зависят
от текущего рыночного окна: первый запуск проверяет pipeline и не обещает
доходность.

## Остановка и повторный запуск

Нажмите `Ctrl+C` в терминале `create-tradejs`, чтобы остановить Web UI. Docker
services продолжат работать. Для повторного запуска:

```bash
cd tradejs-project
npm run infra-up
npm run dev
```

Остановить локальную инфраструктуру:

```bash
cd tradejs-project
npm run infra-down
```

Ручная настройка grid-конфигов описана в статье
[Создать backtest config](./backtest-config).
