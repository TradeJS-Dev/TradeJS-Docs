---
title: Installation
---

Use `create-tradejs` for a new project. Install packages manually only when
adding TradeJS to an existing TypeScript project. Neither path depends on the
TradeJS monorepo workspace.

## Requirements

- Node.js 20.19 or newer
- npm `10+`
- Docker Desktop or Docker Engine
- Docker Compose plugin (`docker compose`)

## Recommended: Create a Complete Project

```bash
npx create-tradejs
```

This installs the packages, starts local infrastructure, creates the initial
user and backtest config, and opens the Web UI. Continue with
[Run your first backtest](./first-backtest).

## Manual Installation

```bash
mkdir tradejs-project
cd tradejs-project
npm init -y
npm install @tradejs/app @tradejs/core @tradejs/node @tradejs/types @tradejs/base @tradejs/cli
```

Keep engine packages such as `@tradejs/core`, `@tradejs/node`, `@tradejs/cli`,
and `@tradejs/app` on a compatible major release. `@tradejs/base`,
`@tradejs/strategy-kit`, and `@tradejs/strategy-*` are independently versioned;
commit the generated lockfile instead of forcing them to the engine's exact
patch version.

## Add `tradejs.config.ts`

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset);
```

This loads independently published public strategy packages, indicators,
connectors, and base runtime hooks.

For ownership and private-package composition, see
[Repository and package ownership](../advanced/repository-ownership).

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

## Anonymous Onboarding Telemetry

The Web UI reports only the anonymous Yandex Metrica goal names
`scaffold_success` and `first_backtest`. Strategy configuration, symbols,
credentials, and backtest results are not included. To disable these events,
add the following value to your project `.env` before starting or building the
app:

```bash
NEXT_PUBLIC_TRADEJS_TELEMETRY_DISABLED=1
```

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
