---
title: Define a Backtest Parameter Grid
---

A backtest configuration defines the candidate values TradeJS should evaluate.
The first-run installer creates `MaStrategy:base` for the web app. For custom
research, save a named grid in the local project and select it with
`--config <StrategyName:label>`.

## Grid Shape

Every top-level value is an array, including fields with only one candidate:

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

TradeJS evaluates the Cartesian product of these arrays. This example contains
four moving-average combinations because `MA_FAST` and `MA_SLOW` each have two
values. Invalid relationships such as a fast period greater than a slow period
should be excluded before running a large search.

The prefix before the first colon selects the strategy: `MaStrategy:base`
selects `MaStrategy`, while `TrendLine:conservative` selects `TrendLine`.

## Direction-Specific Parameters

Some built-in strategies support `<KEY>_LONG` and `<KEY>_SHORT` in addition to
an unsuffixed `<KEY>`. For example, `TARGET_R_MULT_SHORT` can change the short
target independently of `TARGET_R_MULT_LONG`.

This convention applies only to fields documented by the strategy. Check its
reference and default configuration instead of assuming every parameter is
direction-specific.

## Save a Grid Manually

Backtest grids are local research data stored in Redis. After starting the
local services, the key is:

```text
users:<user>:backtests:configs:<StrategyName:label>
```

For example:

```bash
redis-cli -h 127.0.0.1 -p 6379 SET \
  'users:root:backtests:configs:MaStrategy:base' \
  '{"INTERVAL":["15"],"MAX_LOSS_VALUE":[10],"MA_FAST":[21],"MA_SLOW":[55],"LONG":[{"enable":true,"direction":"LONG","TP":2,"SL":1,"minRiskRatio":1.2}],"SHORT":[{"enable":true,"direction":"SHORT","TP":2,"SL":1,"minRiskRatio":1.2}]}'
```

Then run:

```bash
npx @tradejs/cli backtest \
  --user root \
  --config MaStrategy:base \
  --tickers BTCUSDT \
  --timeframe 15 \
  --tests 1 \
  --parallel 1
```

For a long grid or password-protected Redis, use a small seed script in your
own project. Keep that script in version control when the experiment should be
reviewable and reproducible.

## Reproduce a Live Configuration

To test a configuration from `tradejs.config.ts`, copy the strategy parameters
into one-value arrays and use the same strategy package version, timeframe,
symbols, and data window. Do not copy live-operation fields such as `ENV` or
`MAKE_ORDERS`; represent execution assumptions with the backtest's price, fee,
slippage, and delay settings.

Backtest grids and saved result lists do not change live strategy settings.

## Common Errors

### `Backtest config "<name>" not found`

The selected user has no grid with that name. Verify both parts:

```bash
redis-cli -h 127.0.0.1 -p 6379 GET \
  'users:root:backtests:configs:MaStrategy:base'
```

### `must include strategyName and strategyConfig grid`

The value is not a grid object. Every top-level field must be an array, and no
array may be empty.

### The wrong strategy runs

The strategy is selected from the prefix before the first colon. Use
`StrategyName:label`.

## Next

- [Run your first backtest](./first-backtest)
- [Search a parameter grid](../runtime/backtesting/grid-config)
- [How backtests work](../runtime/backtesting/overview)
