---
title: Installation
---

Use the public npm packages. Public docs should not depend on the TradeJS monorepo workspace.

## Requirements

- Node.js `20.19+`
- npm `10+`
- Docker Desktop or Docker Engine
- Docker Compose plugin (`docker compose`)

## Create a Project

```bash
mkdir tradejs-project
cd tradejs-project
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Keep all `@tradejs/*` packages on the same version. Current public packages in the source project are `1.0.10`.

## Add `tradejs.config.ts`

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

This loads the default built-in strategies, indicators, connectors, and base runtime hooks.

## Initialize Local Infrastructure

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
```

`infra-init` creates `docker-compose.dev.yml` in your project root. `infra-up` starts local Redis and PostgreSQL/Timescale.

## Create the Default User

The app and many CLI flows use `root` by default:

```bash
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

See [Root User Setup](./root-user) for details.

## Start the UI

```bash
npx tradejs-app dev
```

Open the URL printed by the command. The default is usually `http://localhost:3000`.

Useful routes:

- `/routes/backtest`
- `/routes/dashboard`
- `/routes/strategies`

## Import Rules

- Import plugin/config helpers from `@tradejs/core/config`.
- Import browser-safe helpers from public `@tradejs/core/*` subpaths.
- Import Node runtime helpers from public `@tradejs/node/*` subpaths.
- Import shared contracts from `@tradejs/types`.
- Do not import from `@tradejs/*/src/*`.

Next: [Quickstart](./quickstart) or [Run your first backtest](./first-backtest).
