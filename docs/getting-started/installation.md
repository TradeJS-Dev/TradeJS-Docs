---
sidebar_label: Installation
title: Install TradeJS for TypeScript Algorithmic Trading
description: 'Install TradeJS with create-tradejs or add its public npm packages to an existing TypeScript project, including the required Node.js and Docker setup.'
---

Install TradeJS with `npx create-tradejs`, the same command shown on the
TradeJS website. It currently installs stable `3.1.28`. The production
server runs `3.1.29-beta.302`. To reproduce that version locally, use
the preview instructions below.

## Requirements

- Node.js 24 and npm 10 or later.
- Docker running, with the `docker compose` command available.

## Create a project {#create-project}

Run `npx create-tradejs` from the folder where you want
to create the project. The command installs TradeJS and opens the app. Continue
with [your first backtest](./first-backtest#2-finish-the-local-installation).

If the install fails while Puppeteer is downloading Chrome, use the
`tradejs-project` folder that was already created. The browser download is
optional for local backtests. Run `PUPPETEER_SKIP_DOWNLOAD=true npm install`
in Bash or Zsh, then follow [Start the app](#start-app).

## Install the preview {#install-packages}

Create the project without installing dependencies so you can pin the framework
packages to the preview. Run the commands in Bash or Zsh.

```bash
npx create-tradejs@3.1.29-beta.302 tradejs-project --no-install
cd tradejs-project

tradejs_version=3.1.29-beta.302
for package in app cli connectors core indicators infra node types; do
  npm pkg set "dependencies.@tradejs/$package=$tradejs_version" \
    "overrides.@tradejs/$package=\$@tradejs/$package"
done
npm install --save-exact @tradejs/base@3.1.8
```

The loop sets the same version in `package.json` for the eight framework
packages. The overrides make dependencies use those versions too.
`@tradejs/base` and strategy packages have their own versions. Keep the
`package-lock.json` file to install the same versions again.

## Start the app {#start-app}

If you installed only the packages, run these commands in the project folder:

```bash
npm exec -- tradejs infra-init
npm run infra-up
npm run dev
```

Open the address shown in the terminal. Create the local password on the setup
page, then [run your first backtest](./first-backtest).
If a Docker port is already in use, set an unused port in the project's
`.env` and run `npm run infra-up` again.

## Add TradeJS to an existing project

Install a matching set of framework packages. The commands in
[Install the preview](#install-packages) show which dependencies and overrides
to set. Apply them in your existing folder and skip the project creation commands.

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
