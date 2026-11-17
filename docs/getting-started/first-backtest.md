---
sidebar_label: Run your first backtest
title: Run Your First TypeScript Trading Strategy Backtest
description: 'Create a local TradeJS project and run a reproducible TypeScript trading strategy backtest from the web interface without cloning the monorepo.'
---

A backtest shows what a strategy would have done with past market data. In this
example, you will test [MaStrategy](../strategies/reference/ma-strategy) on Bitcoin
from the TradeJS web app. You do not need an exchange account or API key.

[Ask an agent to help prepare a backtest](../guides/develop-with-an-agent).

## 1. Create and Start TradeJS

Install Node.js 24 and npm 10 or later. Start Docker and check that
`docker compose version` returns a version. From the folder where you want to
create the project, run:

```bash
npx create-tradejs
```

The command creates `tradejs-project`, installs the packages, starts the local
services, and opens the app. If the browser does not open, use the address shown
in the terminal. See [installation help](./installation) if a step fails.
If TradeJS is already open, go straight to the next step.

## 2. Finish the Local Installation

On the setup page, create a password for the local `root` account. TradeJS signs
you in and opens the dashboard. Select **Create backtest**. In the preview
release, look for **Run backtest**.

## 3. Start the Backtest

Choose **MaStrategy** and **MaStrategy:base**. Select Binance and only
**BTCUSDT**, set the interval to 15 minutes and the period to 30 days,
and click **Start**.

Open the run to see its progress. When it finishes, check the number of closed
trades, net profit, and drawdown. The run can finish with zero trades. The figures
depend on the dates, data, and settings used. See [how to read the result](./understanding-output).

To try something else, [choose a strategy](../strategies/reference) and
[save its backtest settings](./backtest-config).

## Stop and Restart

Press `Ctrl+C` in the terminal running TradeJS to stop the app. To stop the
local services too, run `npm run infra-down` from `tradejs-project`.

To start again, open `tradejs-project` and run:

```bash
npm run infra-up
npm run dev
```
