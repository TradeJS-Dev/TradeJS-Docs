---
title: Шпаргалка по рантайму
---

Эта шпаргалка содержит copy-paste команды для текущей конфигурации:

- user: `root`
- connector: `bybit`
- timeframe: `15`
- стратегии: `TrendLine`, `AdaptiveMomentumRibbon`

## 1. Проверка доступных backtest-конфигов

```bash
redis-cli --scan --pattern 'users:root:backtests:configs:TrendLine:*'
redis-cli --scan --pattern 'users:root:backtests:configs:AdaptiveMomentumRibbon:*'
```

Берите ключи из вывода как значения `--config` в командах ниже.

## 2. TrendLine: Backtest -> Review -> Project

Бэктест:

```bash
npx @tradejs/cli backtest --user root --config TrendLine:base --connector bybit --timeframe 15 --tests 500 --parallel 4
```

Посмотреть лучших кандидатов:

```bash
npx @tradejs/cli results --strategy TrendLine --coverage --user root
```

Сохранить research winners локально:

```bash
npx @tradejs/cli results --strategy TrendLine --merge --user root
```

Перенесите один reviewed полный config в Project declaration, увеличьте
strategy version, задеплойте образ и выполните:

```bash
npx @tradejs/cli runtime-control verify --user root --deployment production
npx @tradejs/cli signals --user root --deployment production --cacheOnly
```

## 3. AdaptiveMomentumRibbon: Backtest -> Review -> Project

Бэктест:

```bash
npx @tradejs/cli backtest --user root --config AdaptiveMomentumRibbon:amr-default --connector bybit --timeframe 15 --tests 200 --parallel 4
```

Посмотреть лучших кандидатов:

```bash
npx @tradejs/cli results --strategy AdaptiveMomentumRibbon --coverage --user root
```

Сохранить research winners локально:

```bash
npx @tradejs/cli results --strategy AdaptiveMomentumRibbon --merge --user root
```

После commit reviewed config и bumped strategy version задеплойте образ:

```bash
npx @tradejs/cli runtime-control verify --user root --deployment production
npx @tradejs/cli signals --user root --deployment production --cacheOnly
```

Опциональная проверка полезной нагрузки AMR в сигнале:

```bash
KEY=$(redis-cli --scan --pattern 'store:signals:BTCUSDT:*' | tail -n 1)
redis-cli JSON.GET "$KEY" '$.additionalIndicators.amr'
```

## 4. Команды прокачки данных (ByBit)

Регулярное обновление истории:

```bash
npx @tradejs/cli backtest --updateOnly --user root --config TrendLine:base --connector bybit --timeframe 15
```

Проверка целостности и ремонт разрывов:

```bash
npx @tradejs/cli continuity --user root --timeframe 15 --provider bybit
npx @tradejs/cli continuity --user root --timeframe 15 --provider bybit --tickers BTCUSDT,ETHUSDT
```

## 5. Откат promoted results

```bash
npx @tradejs/cli results --strategy TrendLine --clear --user root
npx @tradejs/cli results --strategy AdaptiveMomentumRibbon --clear --user root
```

## 6. Связанные статьи

- [Результаты бэктеста -> Project config](./results-runtime-config)
- [Data Sync](../../getting-started/data-sync)
- [Пошаговое создание стратегии на Pine Script](../../strategies/authoring/pine-strategy-step-by-step)
