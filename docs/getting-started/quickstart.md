---
sidebar_position: 2
title: Quickstart
---

This guide is for external package users who want a normal npm project, not a TradeJS monorepo checkout.

If you only need the install commands, start with [Installation](./installation). For a guided package-only run, use [Run your first backtest](./first-backtest).

## 1. Install

Create a project and install the public packages:

```bash
mkdir tradejs-project
cd tradejs-project
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Use the same version for all `@tradejs/*` packages. Current public packages in the source project are `1.0.10`.

`tradejs-app` generates an internal `.tradejs/app` working copy when it runs
from `node_modules`. Treat that directory as generated output; configure your
project from the root `tradejs.config.ts` instead.

## 2. Configure TradeJS

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

This default preset wires the built-in strategy, indicator, and connector plugin catalogs.

## 3. Start Local Infrastructure

`infra-init` creates `docker-compose.dev.yml` in project root once.
If the file already exists, it is preserved and not overwritten.

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
```

Note:

- `docker-compose.dev.yml` is for local development infra.
- `docker-compose.prod.yml` is production deployment compose and is not used by `infra-up`.

## 4. Create Root User

```bash
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

For details, see [Root User Setup](./root-user).

## 5. Useful CLI Commands

```bash
npx @tradejs/cli backtest
npx @tradejs/cli results
npx @tradejs/cli signals
npx @tradejs/cli bot
```

Backtests require a saved backtest config in Redis. [Run your first backtest](./first-backtest) shows how to seed one from the package-only project.

## 6. Run Web UI

```bash
npx tradejs-app dev
```

Open:

- `http://localhost:3000/routes/backtest` for saved backtest runs
- `http://localhost:3000/routes/dashboard` for market charts and signals

After sign-in:

- open the gear icon in the left sidebar to manage account settings
- configure Bybit API access for this user before working with live exchange data
- store AI-provider and Telegram settings in the user profile in Redis

If port `3000` is already busy, `tradejs-app dev` automatically picks the next free port and prints the actual URL in the console.

For production mode:

```bash
npx tradejs-app build
npx tradejs-app start
```

## 7. Stop Dev Infra

```bash
npx @tradejs/cli infra-down
```

## Common Errors

### `ECONNREFUSED 127.0.0.1:6379`

Redis is not reachable from your environment.

### `ECONNREFUSED 127.0.0.1:5432`

PostgreSQL/Timescale is not reachable from your environment.

### `npx tradejs-app` tries to install packages or fails with React/TypeScript errors

You are likely using an old `@tradejs/app` package or a non-npm install flow.
Install all `@tradejs/*` packages at `1.0.10` or newer with `npm install`.

### `Cannot find module` for `@tradejs/core/*`, `@tradejs/infra/*`, or app aliases

TradeJS package versions are mismatched. Reinstall all `@tradejs/*` packages
together so they resolve to the same version.
