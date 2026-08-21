---
title: Environment Variables Reference
---

This page groups the most important environment variables by area.

## Application

- `APP_URL` - public app URL.
- `HOST` / `PORT` - HTTP binding for app process.
- `NODE_ENV` - `development` or `production`.
- `NEXTAUTH_SECRET` - required for session/token security.
- `NEXTAUTH_URL` - public URL used by auth callbacks.

## Per-User Settings in Redis

TradeJS also stores account-specific settings in the Redis user record (`users:index:<user>`):

- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`
- `AI_API_KEY`
- `AI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

The web app manages these values from the account settings drawer opened by the gear icon in the left sidebar.

## Data Services

- `REDIS_HOST`, `REDIS_PORT`
- `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
- `ML_GRPC_ADDRESS` (for runtime inference)

## Signals daemon and streaming

- `SIGNALS_PARALLEL` - concurrent symbol evaluations, default `4`.
- `SIGNALS_DAEMON_SETTLE_DELAY_MS` - delay after a candle boundary, default `5000`.
- `SIGNALS_DAEMON_MAX_LIVE_BARS` - bounded sequential bars before detector-state rebuild.
- `SIGNALS_DAEMON_HEAP_MB` - production daemon heap cap used by the supplied container entrypoint.
- `SIGNALS_KLINE_WS_ENABLED` - Bybit daemon kline stream; set `0` for REST-only.
- `SIGNALS_KLINE_WS_WAIT_MS` - wait for confirmed WebSocket closes before REST recovery.
- `MARKET_WS_HOST`, `MARKET_WS_PORT` - dashboard candle gateway binding.
- `MARKET_WS_HEAP_MB` - gateway heap cap used by the supplied container entrypoint.

## Hyperliquid whale context

- `HYPERLIQUID_WHALE_CONTEXT_ENABLED` - allow whale context for the current runtime mode.
- `HYPERLIQUID_WHALE_BACKFILL_ENABLED` - permit automatic network backfill; off by default.
- `HYPERLIQUID_WHALE_MIN_COVERAGE_PCT` - minimum accepted signal-time coverage.
- `HYPERLIQUID_WHALE_CONCURRENCY` - historical recovery concurrency.
- `HYPERLIQUID_WHALE_RATE_LIMIT_WEIGHT` - request-rate budget weight.
- `HYPERLIQUID_WHALE_CONTEXT_STAGE_TIMEOUT_MS` - market-context stage timeout.
- `HYPERLIQUID_WS_URL` - optional public stream endpoint override.

## ML Training

- `ML_TRAIN_RECENT_DAYS`
- `ML_TRAIN_TEST_DAYS`
- `ML_TRAIN_WALK_FORWARD_FOLDS`
- `ML_TRAIN_FEATURE_PROFILE` (`all` or `robust`)
- `ML_TRAIN_FEATURE_SET` (`legacy` or `enriched`)
- `ML_TRAIN_ENSEMBLE`
- `ML_TRAIN_ENSEMBLE_MEMBERS`

## Practical Recommendations

- Keep `.env.example` safe and generic; never commit secrets.
- In production, inject secrets from a secret manager.
- For local setup, run `npx @tradejs/cli infra-init` once, then `npx @tradejs/cli infra-up`.
- Validate environment with `npx @tradejs/cli doctor` before enabling live orders.
- Prefer the account settings drawer for user-scoped API keys and tokens instead of sharing one global `.env` secret across operators.
- `AI_API_*` and `TG_*` are user-record fields, not app environment variables; store them on the user record in Redis.

## Repository ownership

In the official self-hosted split, commit secret-free application defaults to
`TradeJS-Project/deploy/runtime.env`. GitHub Actions configuration has one
canonical owner per capability:

| Name | Canonical owner | Migration rule |
| --- | --- | --- |
| `NPM_TOKEN` | each npm-publishing source repository, or one organization secret restricted to that exact set | Keep it out of Project and Deploy. |
| `DEPLOY_REPOSITORY_TOKEN` | `TradeJS-Project` repository secret | It authorizes only the immutable dispatch to `TradeJS-Deploy`. |
| `SSH_HOST`, `SSH_USER`, `SSH_KEY` | `TradeJS-Deploy` repository secrets, or organization secrets restricted to Deploy | Keep all server access out of TradeJS, Project, Site, and Docs. |
| `GIT_SSH_PRIVATE_KEY`, `AGENT_GITHUB_TOKEN` | `TradeJS-Deploy` repository secrets | These belong to the server-side research agent. |
| `NEXTAUTH_SECRET`, `PG_PASSWORD`, `REDISINSIGHT_HTPASSWD`, `COINALYZE_API_KEY` | `TradeJS-Deploy` repository secrets | Deploy injects them; `PG_PASSWORD` has no existing-server fallback. |
| `RELEASE_DEPLOY_KEY` | none | Delete it; TradeJS stable release commits use workflow-scoped `GITHUB_TOKEN`. |

GitHub creates `GITHUB_TOKEN` for each workflow run; never copy it between
repositories. Current workflows do not use `${{ vars.* }}`. Local research
secrets stay in `TradeJS-Project/.env`, and a project that installs private
strategies uses a separate read-only registry token.
