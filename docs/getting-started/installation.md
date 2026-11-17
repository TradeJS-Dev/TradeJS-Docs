---
sidebar_label: Installation
title: Install TradeJS for TypeScript Algorithmic Trading
description: 'Install TradeJS with create-tradejs or add its public npm packages to an existing TypeScript project, including the required Node.js and Docker setup.'
---

The installer uses the current stable TradeJS release on npm, `3.1.28`.

## Requirements

- Node.js 24 and npm 10 or later.
- Docker running, with the `docker compose` command available.

## Create a project {#create-project}

Run this command from the folder where you want to create the project. It is
the same command shown on the TradeJS website.

```bash
npx create-tradejs
```

The command installs TradeJS and opens the app. Continue with
[your first backtest](./first-backtest#2-finish-the-local-installation).

If the install fails while Puppeteer is downloading Chrome, use the
`tradejs-project` folder that was already created. The browser download is
optional for local backtests. Run `PUPPETEER_SKIP_DOWNLOAD=true npm install`
in Bash or Zsh, then follow [Start the app](#start-app).

## Start the app {#start-app}

If you skipped app startup during setup, run these commands in the project folder:

```bash
npm exec -- tradejs infra-init
npm run infra-up
npm run dev
```

Open the address shown in the terminal. Create the local password on the setup
page, then [run your first backtest](./first-backtest).
If a Docker port is already in use, set an unused port in the project's
`.env` and run `npm run infra-up` again.

## Add TradeJS to an existing project {#install-packages}

Run this command in your existing TypeScript project to install the stable packages:

```bash
npm install --save-exact @tradejs/app @tradejs/cli @tradejs/core @tradejs/base
```

If you do not have `tradejs.config.ts`, add it:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

Then run these commands in that folder:

```bash
npm exec -- tradejs infra-init
npm exec -- tradejs infra-up
npm exec -- tradejs-app dev
```

## Import Rules

Use public package entry points such as `@tradejs/core/config` for project
configuration, `@tradejs/node/*` for server code, and `@tradejs/types` for types.
See the [framework reference](../api/framework) for the public entry points.
