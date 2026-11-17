---
title: 'Triangle'
---

Triangle looks for price breaks from ascending, descending, and symmetric triangles.

Install this package separately. [Keep the standard strategies when adding the package](../../getting-started/add-strategy).

## Install

Run the command in your TradeJS project.

```bash
npm install --save-exact @tradejs/strategy-triangle
```

Add `"@tradejs/strategy-triangle"` to the `strategies` list in
`tradejs.config.ts`. The package registers the `Triangle` strategy.

## Signal and exit

The default interval is 15 minutes. The strategy requires repeated touches
of converging boundaries before it considers a break. Both breakout directions
are enabled by default. Set `TRIANGLE_ALLOW_REVERSE_BREAKOUTS` to `false` to
allow only upward breaks for ascending triangles and downward breaks for
descending triangles. Symmetric triangles still use the actual breakout direction.

The stop sits beyond the opposite boundary. The target projects part of the
triangle's starting height from the broken boundary.

![Example of a triangle breakout](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Triangle/main/docs/signal-example.svg)

See the [package README](https://github.com/TradeJS-Dev/TradeJS-Strategy-Triangle#readme) for the full setup.

## Backtest {#backtest}

Run these commands from the standard project folder with Docker running.
The first command saves `Triangle:example` in the project's local Redis.
It sets the candle interval and uses the strategy defaults for the other fields.
The second command tests 30 days of 15-minute Binance BTCUSDT candles.

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli SET \
  'users:root:backtests:configs:Triangle:example' '{"INTERVAL":["15"]}' NX

npm run backtest -- --user root --connector binance --tickers BTCUSDT \
  --config Triangle:example --timeframe 15 --days 30 --tests 1 --parallel 1
```

If the first command returns an empty response, a configuration with that
name already exists. Replace `example` in both commands to start with a new one.
