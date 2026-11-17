---
title: Define a Backtest Parameter Grid
---

The [first backtest](./first-backtest) already has settings for MaStrategy.
To try different settings or another strategy, save a configuration in your
local project. The example below tests two values for the fast moving average.

## Grid Shape

A grid lists the values you want to try. Use an array even for settings you
want to keep fixed. Fields you leave out use the strategy's defaults.

```json
{
  "INTERVAL": ["15"],
  "MA_FAST": [21, 34],
  "MA_SLOW": [55]
}
```

TradeJS runs one test with a fast period of 21 and another with a fast period
of 34. Both use a slow period of 55. If each period had two values, TradeJS
would test four combinations.

## Save a Grid Manually

Open your TradeJS project folder. With the local services running, save the
grid in the project's Redis. Use a new name each time you want to keep the
old settings.

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli SET \
  'users:root:backtests:configs:MaStrategy:compare' \
  '{"INTERVAL":["15"],"MA_FAST":[21,34],"MA_SLOW":[55]}' NX
```

`OK` means the settings were saved. An empty response means the name is
already in use. `MaStrategy` selects the strategy and `compare` names these settings.

In the app, open **Backtest**, select **MaStrategy** and configuration
**MaStrategy:compare**, then choose the market and time range. If you prefer
the terminal, run the project's `backtest` command:

```bash
npm run backtest -- --user root --config MaStrategy:compare \
  --connector binance --tickers BTCUSDT --timeframe 15 --days 30 --tests 2 --parallel 1
```

## Direction-Specific Parameters

Some strategies let you set a different value for long and short trades.
For instance, `TARGET_R_MULT_SHORT` may set the short target independently.
Check the strategy page for fields that accept `_LONG` and `_SHORT`.

## Reproduce a Live Configuration

Put each tested strategy setting in an array with one item. Use the same
strategy package version, candle interval, instruments, and dates. Set price,
fees, slippage, and delay through the backtest options. Leave live controls such
as `ENV` and `MAKE_ORDERS` out of the grid. A saved grid only affects backtests.

## Common Errors

### `Backtest config "<name>" not found`

Check the user name and the part after `backtests:configs:` in the Redis key.
For the example above they are `root` and `MaStrategy:compare`.

### `must include strategyName and strategyConfig grid`

Save a JSON object. Each field must contain an array with at least one value.

### The wrong strategy runs

The name before the first colon selects the strategy.

## Next

[Learn how TradeJS tests parameter combinations](../runtime/backtesting/grid-config)
or [compare the results](../guides/compare-strategies).
