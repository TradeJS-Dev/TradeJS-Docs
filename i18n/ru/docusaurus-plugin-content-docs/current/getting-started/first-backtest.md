---
title: Первый бэктест
---

Эта страница показывает самый практичный первый backtest flow, который есть сейчас.

CLI умеет запускать бэктесты, но ожидает сохраненный backtest config в Redis. Ближайший полный demo-path - deterministic sandbox в основном репозитории TradeJS. Он сделан как внешний пользовательский проект и потребляет опубликованные `@tradejs/*` пакеты.

Источник: [examples/sandbox](https://github.com/tradejs-dev/tradejs/tree/main/examples/sandbox)

## 1. Установите пример

```bash
git clone https://github.com/tradejs-dev/tradejs.git
cd tradejs/examples/sandbox
yarn install --immutable
```

Sandbox сейчас использует зафиксированный Yarn lockfile для deterministic CI. Хороший следующий issue для проекта - добавить package-only `npm create` или `tradejs init demo-backtest`.

## 2. Запустите infra

```bash
npx @tradejs/cli infra-up
```

## 3. Запустите demo

```bash
yarn e2e
```

Скрипт:

1. создает/обновляет пользователя `sandbox`;
2. создает config `SandboxDeterministicSignal:base`;
3. запускает backtest для `SANDBOXUSDT` на timeframe `15`;
4. проверяет backtest stats в Redis;
5. запускает deterministic `signals`;
6. проверяет snapshot сигналов.

## Пример стратегии

Ключевой config:

```ts
export const SANDBOX_E2E_GRID_CONFIG = {
  INTERVAL: ['15'],
  SANDBOX_ENTRY_EVERY_BARS: [96],
  SANDBOX_QTY: [1],
  SANDBOX_TP_PCT: [0.4],
  SANDBOX_SL_PCT: [1],
} as const;
```

Минимальная форма решения:

```ts
const signal = {
  strategy: 'SandboxDeterministicSignal',
  symbol,
  interval: '15',
  direction: 'LONG',
  timestamp: candle.timestamp,
  prices: {
    currentPrice,
    takeProfitPrice,
    stopLossPrice,
    riskRatio,
  },
};
```

## Ожидаемый вывод

```text
Sandbox backtest snapshot check passed
{
  "orders": 159,
  "wins": 0,
  "losses": 159,
  "amount": -44.12,
  "netProfit": -144.12,
  "winRate": 0,
  "maxDrawdown": 144.12
}
Sandbox signals snapshot check passed
```

Эти числа не являются trading claim. Это детерминированные тестовые данные для проверки pipeline.

## Метрики

- `orders` - закрытые ордера;
- `wins` / `losses` - положительные и отрицательные исходы;
- `amount` - gross result в snapshot;
- `netProfit` - net historical result;
- `winRate` - доля winning orders;
- `maxDrawdown` - максимальное историческое снижение.

Для своего проекта базовая форма команды такая:

```bash
npx @tradejs/cli backtest --user root --config <StrategyName:configName> --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

Перед запуском нужен backtest config у выбранного пользователя. Sandbox показывает текущий supported seeding path.

Точный формат Redis key и минимальный manual config описаны в [Создать backtest config](./backtest-config).
