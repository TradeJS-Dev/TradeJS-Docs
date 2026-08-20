---
title: Схема Postgres и Timescale
---

TimescaleDB хранит исторические ряды и обслуживает запросы для runtime и бэктестов.

TradeJS 3 экспортирует storage через узкие server-only subpath'ы:

- `@tradejs/infra/timescale/client`
- `@tradejs/infra/timescale/candles`
- `@tradejs/infra/timescale/derivatives`
- `@tradejs/infra/timescale/spread`
- `@tradejs/infra/timescale/marketContext`
- `@tradejs/infra/timescale/hyperliquidWhales`

Агрегирующего `@tradejs/infra/timescale` больше нет.

## Компоненты развертывания

- сервис PostgreSQL/Timescale в вашем окружении
- bootstrap SQL для первичной инициализации схемы

Быстрый запуск локальной инфраструктуры:

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
```

## Что важно в схеме

- Для свечей и других рядов используйте hypertables.
- Индексируйте по времени и по измерениям (`symbol`, `interval`, provider).
- По возможности делайте ingestion идемпотентным.

Текущий storage включает candles, derivatives, venue spread,
trade-flow/order-book/breadth market context и Hyperliquid whale event, flow и
coverage tables. В Hyperliquid rows сохраняются universe и whale-registry
fingerprints, чтобы context разных tracked sets не смешивался.

## Производительность

- Избегайте широких range-запросов без фильтров.
- Проверяйте индексные пути `symbol + interval + time`.
- Следите за медленными запросами в API бэктестов/сигналов.
