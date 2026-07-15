---
title: Первый бэктест
---

На этой странице первый бэктест запускается из обычного npm-проекта. Клонировать
TradeJS monorepo не нужно.

## 1. Создайте проект

```bash
mkdir tradejs-first-backtest
cd tradejs-first-backtest
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Добавьте `tradejs.config.ts` в корень проекта:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

## 2. Запустите infra

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

## 3. Сохраните backtest config

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli SET \
  'users:root:backtests:configs:MaStrategy:base' \
  '{"INTERVAL":["15"],"MAX_LOSS_VALUE":[10],"MA_FAST":[21],"MA_SLOW":[55],"LONG":[{"enable":true,"direction":"LONG","TP":2,"SL":1,"minRiskRatio":1.2}],"SHORT":[{"enable":true,"direction":"SHORT","TP":2,"SL":1,"minRiskRatio":1.2}]}'
```

Grid хранится под ключом
`users:<user>:backtests:configs:<StrategyName:configName>`. Каждое top-level
значение должно быть массивом, даже если в нем один кандидат.

## 4. Запустите бэктест

```bash
npx @tradejs/cli backtest --user root --config MaStrategy:base --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

Без `--cacheOnly` команда сначала обновляет публичную историю свечей. Успешный
запуск выводит выбранную стратегию/config, прогресс и таблицу результатов.

## Ожидаемый вывод

Точные метрики меняются вместе с историей рынка. Это проверка pipeline, а не
обещание доходности.

## Метрики

- `orders` - закрытые ордера;
- `wins` / `losses` - положительные и отрицательные исходы;
- `amount` - gross result в snapshot;
- `netProfit` - net historical result;
- `winRate` - доля winning orders;
- `maxDrawdown` - максимальное историческое снижение.

## Остановите infra

```bash
npx @tradejs/cli infra-down
```

Точный формат Redis key, script-based seeding и troubleshooting описаны в
[Создать backtest config](./backtest-config).
