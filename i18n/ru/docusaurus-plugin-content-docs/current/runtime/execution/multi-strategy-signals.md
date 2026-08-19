---
title: Multi-Strategy Runtime
---

Один процесс `signals` может оценивать несколько стратегий, accounts,
intervals, universes и deployments из `tradejs.config.ts`. Источник истины —
Git; в production Redis нет namespace с конфигами стратегий.

## Разрешение scope

Для каждой enabled strategy declaration TradeJS определяет strategy/version,
`INTERVAL`, `UNIVERSE`, account и connector/provider из deployment, полный
config с policy/risk и optional ticker/asset-class filters.

Без явных `--timeframe`, `--universe`, `--account` или `--deployment` команда
находит активные declarations и запускает каждый unique scope. Явные flags сужают
запуск.

## Оценка symbol

Каждая совместимая стратегия оценивается на одной и той же последней закрытой
свече. Каждый non-empty signal сохраняется со своей runtime version и
lineage; правила «first signal wins» больше нет. Skip evaluations тоже
сохраняются или агрегируются для diagnostics.

Две declarations одной стратегии для одного account неоднозначны и отклоняются.
Используйте другой account или отключите одну declaration. Разные стратегии могут
выдать противоположные направления, поэтому portfolio policy остается задачей
account-level hooks и connector rules.

```bash
# Все configured scopes один раз
npx @tradejs/cli signals --user root

# Один deployment постоянно
npx @tradejs/cli signals-daemon --user root --deployment production --notify --makeOrders

# Узкий diagnostic pass
npx @tradejs/cli signals --user root --universe crypto --timeframe 15 --account bybit-main --tickers BTCUSDT,ETHUSDT --cacheOnly
```
