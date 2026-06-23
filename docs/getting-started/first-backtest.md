---
title: Run your first backtest
---

This page shows the most practical first backtest path available today.

The package-level CLI can run backtests, but it expects a saved backtest config in Redis. The closest complete demo is the deterministic sandbox in the main TradeJS repository. It is intentionally built like an external user project and consumes published `@tradejs/*` packages instead of workspace packages.

## What You Will Run

The sandbox runs:

- a local `tradejs.config.ts`
- a custom strategy plugin: `SandboxDeterministicSignal`
- a custom indicator plugin
- a custom connector with deterministic candle data
- a seeded backtest config: `SandboxDeterministicSignal:base`
- one backtest and one signal scan

Source: [examples/sandbox](https://github.com/tradejs-dev/tradejs/tree/main/examples/sandbox)

## 1. Install

Clone the TradeJS repository only to use the standalone example:

```bash
git clone https://github.com/tradejs-dev/tradejs.git
cd tradejs/examples/sandbox
yarn install --immutable
```

The sandbox currently uses its committed Yarn lockfile for deterministic CI. A package-only `npm create` or `tradejs init demo-backtest` flow is still a good next issue for the project.

## 2. Start Local Infra

```bash
npx @tradejs/cli infra-up
```

This starts the local Redis/PostgreSQL services required by the CLI.

## 3. Run the Demo

```bash
yarn e2e
```

The script performs these steps:

1. Creates or updates user `sandbox`.
2. Seeds backtest config `SandboxDeterministicSignal:base`.
3. Runs a backtest for `SANDBOXUSDT` on timeframe `15`.
4. Checks the saved backtest statistics in Redis.
5. Runs a deterministic `signals` pass.
6. Checks the stored signal snapshot.

## Strategy Example

The demo strategy enters long every configured number of bars, creates a signal, places an order through the sandbox connector, and attaches TP/SL orders.

Key config:

```ts
export const SANDBOX_E2E_GRID_CONFIG = {
  INTERVAL: ['15'],
  SANDBOX_ENTRY_EVERY_BARS: [96],
  SANDBOX_QTY: [1],
  SANDBOX_TP_PCT: [0.4],
  SANDBOX_SL_PCT: [1],
} as const;
```

Minimal decision shape:

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

## Expected Output

The exact CLI logs include progress lines, but the important success lines are:

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

These numbers are not a trading claim. The strategy is deterministic test data for verifying the pipeline.

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

## For Your Own Project

After installation, the normal CLI shape is:

```bash
npx @tradejs/cli backtest --user root --config <StrategyName:configName> --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

Before that command can run, you need a backtest config saved under the selected user. The sandbox shows the current supported seeding path. A simpler public demo initializer should be added to TradeJS so new npm users do not need to copy a seed script.

For the exact Redis key format and a minimal manual config, see [Create a backtest config](./backtest-config).
