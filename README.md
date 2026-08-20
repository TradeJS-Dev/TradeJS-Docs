# TradeJS-Docs

Standalone Docusaurus documentation site for the TradeJS framework.

Source of truth for `docs.tradejs.dev`. Core framework code stays in
[`TradeJS`](https://github.com/TradeJS-Dev/TradeJS); project composition,
deployment, Base, Strategy Kit, and strategy implementations live in their own
public repositories.

## Public Docs Entry Points

- Getting started: https://docs.tradejs.dev/getting-started/quickstart
- Installation: https://docs.tradejs.dev/getting-started/installation
- First backtest: https://docs.tradejs.dev/getting-started/first-backtest
- Examples: https://docs.tradejs.dev/examples
- Repository ownership: https://docs.tradejs.dev/advanced/repository-ownership
- Environment and secret ownership: https://docs.tradejs.dev/operations/env-reference
- GitHub: https://github.com/TradeJS-Dev/TradeJS
- Site: https://tradejs.dev

## Install

```bash
npm install
```

## Run

Build and serve both locales:

```bash
npm run dev
```

Site runs on `http://localhost:3001`.

## Hot Reload

Docusaurus dev server supports one locale per process.

```bash
npm run dev:hot:en
npm run dev:hot:ru
```

## Build

```bash
yarn checks
```

`yarn checks` runs TypeScript validation and builds both locales.

## Container Image

Pushes to `main` publish `ghcr.io/tradejs-dev/tradejs-docs`.

## Production Deploy

The repository can also deploy `docs` on the existing production server through `~/docker-compose.prod.yml`.

Required repository configuration:

- secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`

Optional registry bootstrap secrets when org-level `GITHUB_TOKEN` cannot publish packages:

- `GHCR_USERNAME`
- `GHCR_TOKEN`

Pushes to `main` publish the image and then run:

```bash
docker compose -f ~/docker-compose.prod.yml pull docs
docker compose -f ~/docker-compose.prod.yml up -d docs
```

GHCR package `tradejs-docs` must stay public so the production host can pull it without registry login.

Keywords: ai, claude, codex.
