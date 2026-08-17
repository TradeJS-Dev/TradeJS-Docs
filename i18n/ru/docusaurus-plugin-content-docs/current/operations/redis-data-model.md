---
title: Модель данных Redis
---

Redis в TradeJS — это оперативное хранилище для конфигов, runtime-состояния и временных артефактов.

## Основные группы ключей

- Пользователи: `users:index:<user>`
- Named strategy configs: `users:<user>:strategies:<strategy>:<configId>`
- Promoted per-symbol results: `users:<user>:strategies:<strategy>:results`
- Конфиги бэктестов: `users:<user>:backtests:configs:<config>`
- Артефакты бэктестов:
  `users:<user>:tests:<strategy>:<testName>:(config|stat|orders)`
- Ключи сигналов и индексы по символам
- AI-анализ: `analysis:<symbol>:<signalId>`
- Временные backtest-ключи (чанки/статистика)

## TTL-политика

Используется смешанный подход:

- часть ключей краткоживущая (кэш, временные результаты),
- часть среднесрочная (сигналы, история),
- конфиги обычно долговечные.

`config` — conventional runtime config id; `results` зарезервирован для
promoted per-symbol backtest results и не загружается как named runtime config.

## Правила эксплуатации

- Не делайте глобальный flush Redis в проде.
- Используйте scoped cleanup (`npx @tradejs/cli clean-redis`).
- Относитесь к Redis как к критической runtime-зависимости.

## Как дебажить

- Начинайте с нужного namespace (`user`, `symbol`, `strategy`).
- Сверяйте ожидаемые ключи с реально существующими.
- При пропавших сигналах проверяйте и ключи сигналов, и ключи конфигов.
