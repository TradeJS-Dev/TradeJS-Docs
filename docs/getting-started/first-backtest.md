---
title: Run your first backtest
---

This page runs a first backtest from a normal npm project. No TradeJS monorepo
checkout is required.

## What You Will Run

You will create:

- a local `tradejs.config.ts`
- the default plugin preset
- a Redis backtest config named `MaStrategy:base`
- one `MaStrategy` backtest over `BTCUSDT`

## 1. Install

Create a project and install the public packages:

```bash
mkdir tradejs-first-backtest
cd tradejs-first-backtest
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Add `tradejs.config.ts` in the project root:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

## 2. Start Local Infra

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

This creates and starts the local Redis/PostgreSQL services required by the CLI.

## 3. Save a Backtest Config

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli SET \
  'users:root:backtests:configs:MaStrategy:base' \
  '{"INTERVAL":["15"],"MAX_LOSS_VALUE":[10],"MA_FAST":[21],"MA_SLOW":[55],"LONG":[{"enable":true,"direction":"LONG","TP":2,"SL":1,"minRiskRatio":1.2}],"SHORT":[{"enable":true,"direction":"SHORT","TP":2,"SL":1,"minRiskRatio":1.2}]}'
```

TradeJS reads backtest grids from
`users:<user>:backtests:configs:<StrategyName:configName>`. Every top-level grid
value is an array, even when it contains only one candidate.

## 4. Run the Backtest

```bash
npx @tradejs/cli backtest --user root --config MaStrategy:base --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

Without `--cacheOnly`, the command refreshes the required public candle history
before running the test. A successful run prints the resolved strategy/config,
progress, and a result table.

## Expected Output

Exact metrics vary because the command uses current market history. Treat the
output as a pipeline check, not as a performance promise.

## Metrics Explained

- `orders`: closed orders counted in the backtest.
- `wins`: closed orders with positive result.
- `losses`: closed orders with negative result.
- `amount`: gross result before all displayed adjustments used by the stat snapshot.
- `netProfit`: net historical result in the snapshot.
- `winRate`: share of winning closed orders.
- `maxDrawdown`: largest peak-to-trough decline in the run.

Use these metrics to inspect and compare behavior. They do not predict future results.

## Stop Infra

```bash
npx @tradejs/cli infra-down
```

For the exact Redis key format, script-based seeding, and troubleshooting, see
[Create a backtest config](./backtest-config).
