---
title: Create a backtest config
---

`backtest` does not invent strategy parameters at runtime. It loads a config grid from Redis.

The key format is:

```text
users:<user>:backtests:configs:<StrategyName:configName>
```

For example:

```text
users:root:backtests:configs:MaStrategy:base
users:root:backtests:configs:TrendLine:base
```

The CLI reads the strategy name from the part before the first `:` in the config name. `MaStrategy:base` runs `MaStrategy`; `TrendLine:base` runs `TrendLine`.

## Grid Shape

A backtest config is a JSON object where every value is an array:

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

TradeJS expands the arrays into a test grid. If you only want one value, still wrap it in an array.

## Directional Overrides

Many built-in strategies resolve a numeric or boolean field in this order:

1. `<KEY>_LONG` or `<KEY>_SHORT` for the current direction;
2. unsuffixed `<KEY>`;
3. the strategy fallback.

For example, `TARGET_R_MULT_SHORT` can tune short targets without changing
`TARGET_R_MULT_LONG`. Only fields used through this convention support the
suffix; consult the strategy reference/default config instead of assuming every
field is directional. In a grid, each suffixed value is still an array.

## Seed With `redis-cli`

After `npx @tradejs/cli infra-up`, Redis is normally available on `127.0.0.1:6379`.

```bash
redis-cli -h 127.0.0.1 -p 6379 SET \
  'users:root:backtests:configs:MaStrategy:base' \
  '{"INTERVAL":["15"],"MAX_LOSS_VALUE":[10],"MA_FAST":[21],"MA_SLOW":[55],"LONG":[{"enable":true,"direction":"LONG","TP":2,"SL":1,"minRiskRatio":1.2}],"SHORT":[{"enable":true,"direction":"SHORT","TP":2,"SL":1,"minRiskRatio":1.2}]}'
```

Then run:

```bash
npx @tradejs/cli backtest --user root --config MaStrategy:base --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

## Seed With a Script

Use a script when the config is longer or when your Redis requires auth.

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

Keep a seed script like this in your own project when the config should be reproducible or reviewed in version control.

## Project Config To Backtest Grid

Production runtime strategy configs live in `tradejs.config.ts`. To reproduce
one in a backtest, copy its values into a one-value Redis backtest grid. Remove
invocation-only fields such as:

- `ENV`
- `INTERVAL`
- `MAKE_ORDERS`
- `CLOSE_OPPOSITE_POSITIONS`
- `BACKTEST_PRICE_MODE`
- `BACKTEST_ENTRY_DELAY_BARS`

The production runtime never reads this backtest key or merges per-symbol
research results into the committed config.

## Common Errors

### `Backtest config "<name>" not found`

The Redis key is missing for the selected user. Check both the user and config name:

```bash
redis-cli -h 127.0.0.1 -p 6379 GET 'users:root:backtests:configs:MaStrategy:base'
```

### `must include strategyName and strategyConfig grid`

The payload is not a grid object. Every top-level value must be an array.

### Backtest runs a different strategy than expected

The strategy name is parsed from the config name. Use `StrategyName:label`, for example `TrendLine:base`.

## Next

- [Run your first backtest](./first-backtest)
- [Backtest a strategy](../guides/backtest-strategy)
- [CLI API](../api/cli)
