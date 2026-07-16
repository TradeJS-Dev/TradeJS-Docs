---
sidebar_position: 2
title: Quickstart
---

Create and start a self-hosted TradeJS project from the public npm packages:

```bash
npx create-tradejs
```

This is the recommended starting point for external users. It creates
`tradejs-project`, installs aligned TradeJS packages, starts the local Docker
infrastructure, and opens the Web UI. On the install page, choose and confirm
the password for the local `root` account. TradeJS signs you in and opens the
dashboard.

The dashboard loads the default Coinbase BTCUSDT chart. Select **Create backtest** in
the top-right corner to open the backtest launcher. See
[Run your first backtest](./first-backtest) for the complete UI walkthrough.

## Generated Project

The project contains:

- `tradejs.config.ts` with `basePreset`;
- `.env` with local auth URLs and a generated auth secret;
- `docker-compose.dev.yml` for Redis and PostgreSQL/Timescale;
- npm scripts for the UI, CLI backtests, and infrastructure;
- `.tradejs/app` as generated UI output after the first app launch.

`tradejs-app` creates `.tradejs/app` as generated UI output. Configure TradeJS
from the project root; do not edit the generated app copy.

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
- `/routes/strategies` — runtime strategy configuration.

Stop local services with:

```bash
npm run infra-down
```

## Manual Package Installation

Use manual installation only when integrating TradeJS into an existing project.
Keep every `@tradejs/*` package on the same version:

```bash
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Then follow [Installation](./installation) for config, infra, and login setup.

## Common Errors

### Docker is unavailable

Start Docker Desktop or the Docker daemon and verify `docker compose version`,
then run `npx create-tradejs` again in a new empty directory.

### The default directory already exists

Pass another directory name:

```bash
npx create-tradejs my-trading-project
```

### Package or module versions do not match

Delete `node_modules` and the lockfile, then reinstall all TradeJS packages
together. Do not mix versions of `@tradejs/*` packages.
