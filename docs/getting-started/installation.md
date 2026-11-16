---
sidebar_label: Installation
title: Install TradeJS for TypeScript Algorithmic Trading
description: 'Install TradeJS with create-tradejs or add its public npm packages to an existing TypeScript project, including the required Node.js and Docker setup.'
---

This documentation covers TradeJS `3.1.29-beta.301`. Follow these steps
to install the same release.

## Requirements

- Node.js 24
- npm 10 or newer
- Docker with the `docker compose` command

## Create a project {#create-project}

Run these commands in your terminal. You can replace `tradejs-project` with
another folder name.

```bash
tradejs_version=3.1.29-beta.301
npx "create-tradejs@$tradejs_version" tradejs-project --no-install
cd tradejs-project
```

## Install packages {#install-packages}

If you already have a project, open its folder and set the same
`tradejs_version` variable from the previous step.

```bash
for package in app cli connectors core indicators infra node types; do
  npm pkg set "dependencies.@tradejs/$package=$tradejs_version" \
    "overrides.@tradejs/$package=\$@tradejs/$package"
done
npm install --save-exact @tradejs/base
```

These commands install the same version of the main TradeJS packages.
`@tradejs/base` and strategy packages have their own versions. Keep
`package-lock.json` so later installs use the same versions.

## Start the app {#start-app}

In the project created by `create-tradejs`, run:

```bash
npm run infra-up
npm run dev
```

Open the address printed in your terminal, usually `http://localhost:3000`.
Set the password for the local `root` user on the install page. Then
[run your first backtest](./first-backtest).

## Add TradeJS to an existing project

After installing the packages, add `tradejs.config.ts` if you do not already
have one:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

Then start the services and app:

```bash
npm exec -- tradejs infra-init
npm exec -- tradejs infra-up
npm exec -- tradejs-app dev
```

`basePreset` registers the default strategies, indicators, and connectors.
To use a strategy on live markets, first
[configure its deployment](./run-strategy-in-production).

Useful routes:

- `/routes/backtest`
- `/routes/dashboard`
- `/routes/strategies`

## Import Rules

- Import plugin/config helpers from `@tradejs/core/config`.
- Import browser-safe helpers from public `@tradejs/core/*` subpaths.
- Import Node runtime helpers from public `@tradejs/node/*` subpaths.
- Import shared contracts from `@tradejs/types`.
- Import server storage adapters from explicit `@tradejs/infra/*` subpaths.
- Do not import from `@tradejs/*/src/*`.

Next: [Quickstart](./quickstart) or [Run your first backtest](./first-backtest).
