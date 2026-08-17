---
title: Multi-Strategy Runtime
---

Один процесс `signals` может оценивать несколько named configs, accounts,
intervals, universes и deployments. Канонический ключ:

```text
users:<user>:strategies:<StrategyName>:<configId>
```

`configId` разделяет независимо управляемые конфиги. `ENABLE=false` отключает
запись без удаления.

## Разрешение scope

Для каждого enabled config TradeJS определяет strategy/config id, `INTERVAL`,
`UNIVERSE`, trading account из `ACCOUNT_ID` или deployment binding,
connector/provider, optional deployment overrides/policy profile и
symbol-specific results config.

Без явных `--timeframe`, `--universe`, `--account` или `--deployment` команда
находит активные configs и запускает каждый unique scope. Явные flags сужают
запуск.

## Оценка symbol

Каждая совместимая стратегия оценивается на одной и той же последней закрытой
свече. Каждый non-empty signal сохраняется со своим `runtimeConfigId` и
lineage; правила «first signal wins» больше нет. Skip evaluations тоже
сохраняются или агрегируются для diagnostics.

Два конфига одной стратегии для одного account неоднозначны и отклоняются.
Используйте другой account или отключите один config. Разные стратегии могут
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
