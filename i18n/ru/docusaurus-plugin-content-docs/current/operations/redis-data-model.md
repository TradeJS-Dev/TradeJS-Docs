---
title: Модель данных Redis
---

Redis в TradeJS — оперативное хранилище server state и временных артефактов.
Production deployment и config стратегий находятся в `tradejs.config.ts`.

## Основные группы ключей

- Пользователи: `users:index:<user>`
- Trading accounts: `users:<user>:trading-accounts:<accountId>`
- Optional manual pause: `users:<user>:runtime:controls`
- Deployment heartbeat: `users:<user>:runtime:deployments:<deployment>:heartbeat`
- Audit control events: `users:<user>:runtime:strategy-control-events:*`
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

Отсутствующий `runtime:controls` валиден и означает «следовать Git enabled».
Pause создаёт override, resume удаляет его и пустой документ. Runtime не читает
`users:<user>:strategies:*`, Redis deployment/release документы или per-symbol
results как production config.

## Правила эксплуатации

- Не делайте глобальный flush Redis в проде.
- Используйте scoped cleanup (`npx @tradejs/cli clean-redis`).
- Относитесь к Redis как к критической runtime-зависимости.

## Как дебажить

- Начинайте с нужного namespace (`user`, `symbol`, `strategy`).
- Сверяйте ожидаемые ключи с реально существующими.
- При пропавших сигналах проверяйте declaration и package manifest образа,
  account binding, optional controls, heartbeat и signal/evaluation keys.
