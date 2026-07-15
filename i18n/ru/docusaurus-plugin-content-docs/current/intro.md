---
sidebar_position: 1
title: Добро пожаловать
slug: /
---

TradeJS — open-source self-hosted фреймворк для создания, бэктестинга и запуска программируемых торговых стратегий на TypeScript.

Если вы открыли проект впервые, начните так:

1. Прочитайте [Что такое TradeJS?](./introduction/what-is-tradejs).
2. Установите публичные пакеты через [Установку](./getting-started/installation).
3. Запустите детерминированный пример в [Первом бэктесте](./getting-started/first-backtest).
4. Разберитесь с объектами в [Базовых понятиях](./core-concepts/strategy).
5. Возьмите стартовые шаблоны из [Примеров](./examples).

Основной процесс — **write → backtest → run**: храните логику стратегии в TypeScript, сравнивайте её на исторических данных и переносите выбранные конфигурации в runtime под своим управлением.

TradeJS предназначен для research, backtesting, генерации сигналов и контролируемой автоматизации на вашей инфраструктуре. Это не финансовая рекомендация, не HFT-движок и не система, которая обещает будущий доход.

## Фокус продукта

- **TypeScript-native:** стратегии, индикаторы, плагины и runtime-контракты программируются и типизируются.
- **Единый цикл стратегии:** одна реализация используется для бэктестов и runtime-оценки.
- **Self-hosted:** код стратегий, рыночные данные, credentials и инфраструктура исполнения остаются под вашим контролем.

Совместимость с Pine, AI/ML enrichment, grid search, Telegram-уведомления и опциональное приложение расширяют этот основной процесс.

## Публичные пакеты

- `@tradejs/core` - browser-safe API для разработки, config helpers, общие indicator/math/time helpers
- `@tradejs/node` - Node runtime для стратегий, бэктестов, Pine loading, connector/plugin registries
- `@tradejs/cli` - команды для backtests, signals, bots, doctor checks, ML workflows
- `@tradejs/app` - опциональный installable Next.js UI для бэктестов, dashboards и runtime data
- `@tradejs/base` - preset со встроенными стратегиями, индикаторами и коннекторами
- `@tradejs/types` - общие TypeScript-контракты
- `@tradejs/strategies`, `@tradejs/indicators`, `@tradejs/connectors` - встроенные plugin-каталоги

Используйте публичные subpath-импорты вроде `@tradejs/core/config`, `@tradejs/core/indicators`, `@tradejs/node/strategies` и `@tradejs/types`. Не импортируйте из внутренних `src`-папок пакетов.

## Ссылки

- Сайт: [tradejs.dev](https://tradejs.dev)
- GitHub: [TradeJS-Dev/tradejs](https://github.com/TradeJS-Dev/tradejs)
- npm organization: [npmjs.com/org/tradejs](https://www.npmjs.com/org/tradejs)
- Примеры: [Examples](./examples)

## Что читать дальше

- [Что такое TradeJS?](./introduction/what-is-tradejs)
- [Быстрый старт](./getting-started/quickstart)
- [Первый бэктест](./getting-started/first-backtest)
- [Чем TradeJS не является](./introduction/what-tradejs-is-not)
- [Ограничения бэктестинга](./limitations/backtesting-caveats)
