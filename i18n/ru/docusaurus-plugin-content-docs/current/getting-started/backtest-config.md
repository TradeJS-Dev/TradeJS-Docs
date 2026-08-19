---
title: Создать backtest config
---

`backtest` не придумывает параметры стратегии сам. Он читает grid-конфиг из Redis.

Формат ключа:

```text
users:<user>:backtests:configs:<StrategyName:configName>
```

Примеры:

```text
users:root:backtests:configs:MaStrategy:base
users:root:backtests:configs:TrendLine:base
```

CLI берет имя стратегии из части до первого `:`. `MaStrategy:base` запускает `MaStrategy`; `TrendLine:base` запускает `TrendLine`.

## Форма grid

Backtest config - JSON object, где каждое значение является массивом:

```json
{
  "INTERVAL": ["15"],
  "MAX_LOSS_VALUE": [10],
  "MA_FAST": [21, 34],
  "MA_SLOW": [55, 89],
  "LONG": [
    {
      "enable": true,
      "direction": "LONG",
      "TP": 2,
      "SL": 1,
      "minRiskRatio": 1.2
    }
  ],
  "SHORT": [
    {
      "enable": true,
      "direction": "SHORT",
      "TP": 2,
      "SL": 1,
      "minRiskRatio": 1.2
    }
  ]
}
```

TradeJS разворачивает массивы в grid тестов. Даже одно значение нужно заворачивать в массив.

## Directional overrides

Многие built-in стратегии разрешают numeric/boolean field в таком порядке:

1. `<KEY>_LONG` или `<KEY>_SHORT` для текущего направления;
2. unsuffixed `<KEY>`;
3. strategy fallback.

Например, `TARGET_R_MULT_SHORT` может настраивать short target независимо от
`TARGET_R_MULT_LONG`. Суффикс поддерживают только поля, которые используют эту
конвенцию; сверяйтесь с reference/default config стратегии. В grid каждое
suffixed value по-прежнему является массивом.

## Seed через `redis-cli`

После `npx @tradejs/cli infra-up` Redis обычно доступен на `127.0.0.1:6379`.

```bash
redis-cli -h 127.0.0.1 -p 6379 SET \
  'users:root:backtests:configs:MaStrategy:base' \
  '{"INTERVAL":["15"],"MAX_LOSS_VALUE":[10],"MA_FAST":[21],"MA_SLOW":[55],"LONG":[{"enable":true,"direction":"LONG","TP":2,"SL":1,"minRiskRatio":1.2}],"SHORT":[{"enable":true,"direction":"SHORT","TP":2,"SL":1,"minRiskRatio":1.2}]}'
```

Запуск:

```bash
npx @tradejs/cli backtest --user root --config MaStrategy:base --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

## Seed через script

```ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
});

const key = 'users:root:backtests:configs:MaStrategy:base';
const grid = {
  INTERVAL: ['15'],
  MAX_LOSS_VALUE: [10],
  MA_FAST: [21],
  MA_SLOW: [55],
  LONG: [{ enable: true, direction: 'LONG', TP: 2, SL: 1, minRiskRatio: 1.2 }],
  SHORT: [{ enable: true, direction: 'SHORT', TP: 2, SL: 1, minRiskRatio: 1.2 }],
};

await redis.set(key, JSON.stringify(grid));
await redis.quit();
```

Храните такой seed script в своем проекте, если config должен воспроизводиться или проходить review в version control.

## Project config и backtest grid

Production runtime configs находятся в `tradejs.config.ts`. Для
воспроизведения config в бэктесте скопируйте его значения в one-value Redis
backtest grid и удалите invocation-only keys:

- `ENV`
- `INTERVAL`
- `MAKE_ORDERS`
- `CLOSE_OPPOSITE_POSITIONS`
- `BACKTEST_PRICE_MODE`
- `BACKTEST_ENTRY_DELAY_BARS`

Production runtime не читает этот backtest key и не объединяет per-symbol
research results с committed config.

## Частые ошибки

### `Backtest config "<name>" not found`

Ключ отсутствует у выбранного user. Проверьте user и config name:

```bash
redis-cli -h 127.0.0.1 -p 6379 GET 'users:root:backtests:configs:MaStrategy:base'
```

### `must include strategyName and strategyConfig grid`

Payload не является grid object. Каждое top-level значение должно быть массивом.

### Запустилась не та стратегия

Имя стратегии берется из config name. Используйте `StrategyName:label`, например `TrendLine:base`.

## Дальше

- [Первый бэктест](./first-backtest)
- [Бэктест стратегии](../guides/backtest-strategy)
- [CLI API](../api/cli)
