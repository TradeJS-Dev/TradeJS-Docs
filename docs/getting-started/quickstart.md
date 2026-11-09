---
sidebar_position: 2
sidebar_label: Quickstart
title: TypeScript Trading Quickstart
description: 'Create a self-hosted TypeScript trading project, start its Docker infrastructure, open the TradeJS UI, and prepare your first strategy backtest.'
---

[Install and start TradeJS](./installation). On the install page, set the
password for the local `root` user. TradeJS signs you in and opens the dashboard.

The dashboard loads the default Coinbase BTCUSDT chart. Select **Create backtest** in
the top-right corner to open the backtest launcher. See
[Run your first backtest](./first-backtest) for the complete UI walkthrough.

After validating a strategy, continue with
[Run a Strategy in Production](./run-strategy-in-production). Production uses
an exact Git-owned configuration and a separately deployed runtime; a backtest
does not enable live execution.

## Generated Project

The project contains:

- `tradejs.config.ts` with `basePreset`;
- `.env` with local auth URLs and a generated auth secret;
- `docker-compose.dev.yml` for Redis and PostgreSQL/Timescale;
- npm scripts for the UI, CLI backtests, and infrastructure;
- `.tradejs/app` as generated UI output after the first app launch.

`tradejs-app` creates `.tradejs/app` as generated UI output. Configure TradeJS
from the project root; do not edit the generated app copy.

The generated `basePreset` registers the built-in strategy catalog. It does not
start strategies by itself. A running strategy must be selected explicitly in
a named `runtime.deployments` entry; see
[Run a Strategy in Production](./run-strategy-in-production) for the config and
launch sequence.

## Daily Commands

Run these from `tradejs-project`:

```bash
npm run infra-up
npm run doctor
npm run dev
```

Useful routes:

- `/routes/dashboard` — market charts, signals, and **Create backtest**;
- `/routes/backtest` — launch jobs and inspect progress;
- `/routes/strategies` — deployed strategy settings, status, and pause controls.

Stop local services with:

```bash
npm run infra-down
```

## Common Errors

### Docker is unavailable

Start Docker and check `docker compose version`. Then run `npm run infra-up`
again from your project folder.

### Package or module versions do not match

Delete `node_modules`, restore the committed lockfile, and reinstall. When
upgrading, update engine packages together and regenerate the lockfile; do not
force every `@tradejs/strategy-*` package to the engine's exact patch version.
