---
title: Run your first backtest
---

Create a complete local TradeJS project and run the first backtest from the Web
UI. You do not need to clone the TradeJS monorepo or seed Redis manually.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer
- Docker Desktop or Docker Engine
- Docker Compose plugin (`docker compose`)

## 1. Create and Start TradeJS

```bash
npx create-tradejs
```

The command creates `tradejs-project` and then:

1. installs the public TradeJS packages;
2. creates `tradejs.config.ts` and local environment files;
3. starts Redis and PostgreSQL/Timescale and waits for their healthchecks;
4. starts the Web UI and opens the install page in your browser.

To choose another project directory:

```bash
npx create-tradejs my-trading-project
```

## 2. Finish the Local Installation

Enter and confirm the password you want to use for the local `root` account.
TradeJS stores only its hash in your local Redis, creates the
`MaStrategy:base` starter config, signs you in, and opens the dashboard.

The default Coinbase BTCUSDT market chart should appear on the dashboard. Select
**Create backtest** in the top-right corner.

## 3. Start the Backtest

The `First backtest preset` is already filled with:

- strategy/config: `MaStrategy:base`;
- connector: Binance;
- ticker: `BTCUSDT`;
- interval: 15 minutes;
- window: 45 days;
- tests/parallel workers: 1/1.

Click **Start**. TradeJS downloads the required public candle history, runs the
backtest, and streams progress and logs into the page. Exact metrics vary with
the current market window; this first run validates the pipeline and is not a
performance promise.

## Stop and Restart

Press `Ctrl+C` in the `create-tradejs` terminal to stop the Web UI. The Docker
services keep running. Later, restart with:

```bash
cd tradejs-project
npm run infra-up
npm run dev
```

Stop the local services with:

```bash
cd tradejs-project
npm run infra-down
```

For manual config grids and strategy research, continue with
[Create a backtest config](./backtest-config).
